use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;
use std::fmt;

pub const SCHEMA_VERSION: &str = "v1";

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct NormalizedRecord {
    pub record_id: String,
    pub source: String,
    pub timestamp: String,
    pub amount_minor_units: i64,
    pub currency: String,
    #[serde(default)]
    pub attributes: BTreeMap<String, String>,
    pub schema_version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Ruleset {
    pub match_keys: Vec<String>,
    pub compare_keys: Vec<String>,
    pub tolerance_minor_units: i64,
    pub rounding: RoundingRule,
    pub timezone: String,
    pub schema_version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct RoundingRule {
    pub mode: RoundingMode,
    pub increment_minor_units: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum RoundingMode {
    Down,
    Up,
    Nearest,
    TowardZero,
    AwayFromZero,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Variance {
    pub variance_id: String,
    pub variance_type: String,
    pub severity: String,
    pub left_record_id: Option<String>,
    pub right_record_id: Option<String>,
    pub amount_delta_minor_units: i64,
    pub rationale: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct VarianceReport {
    pub schema_version: String,
    pub variances: Vec<Variance>,
    pub summary_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct EvidenceManifest {
    pub schema_version: String,
    pub kernel_version: String,
    pub inputs: ManifestInputs,
    pub ruleset: ManifestFileHash,
    pub outputs: ManifestOutputs,
    pub deterministic_statement: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ManifestInputs {
    pub left_records: ManifestFileHash,
    pub right_records: ManifestFileHash,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ManifestOutputs {
    pub variance_report: ManifestFileHash,
    pub variance_summary_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct ManifestFileHash {
    pub file_name: String,
    pub sha256: String,
}

#[derive(Debug, thiserror::Error)]
pub enum KernelError {
    #[error("missing match key: {0}")]
    MissingMatchKey(String),
    #[error("missing compare key: {0}")]
    MissingCompareKey(String),
    #[error("invalid rounding increment")]
    InvalidRoundingIncrement,
}

pub fn compute_variances(
    records_left: &[NormalizedRecord],
    records_right: &[NormalizedRecord],
    ruleset: &Ruleset,
) -> Result<VarianceReport, KernelError> {
    if ruleset.rounding.increment_minor_units <= 0 {
        return Err(KernelError::InvalidRoundingIncrement);
    }

    let left_sorted = canonicalize_and_sort(records_left, &ruleset.match_keys)?;
    let right_sorted = canonicalize_and_sort(records_right, &ruleset.match_keys)?;

    let mut right_map: BTreeMap<String, Vec<NormalizedRecord>> = BTreeMap::new();
    for (key, record) in right_sorted {
        right_map.entry(key).or_default().push(record);
    }

    let mut variances = Vec::new();

    for (key, left_record) in left_sorted {
        match right_map.get_mut(&key) {
            Some(bucket) if !bucket.is_empty() => {
                let right_record = bucket.remove(0);
                variances.extend(compare_records(&left_record, &right_record, ruleset)?);
            }
            _ => {
                variances.push(build_variance(
                    "missing_right",
                    "high",
                    Some(left_record.record_id.clone()),
                    None,
                    0,
                    "No matching record on right side for deterministic match key.",
                ));
            }
        }
    }

    for bucket in right_map.values_mut() {
        for record in bucket.drain(..) {
            variances.push(build_variance(
                "missing_left",
                "high",
                None,
                Some(record.record_id.clone()),
                0,
                "No matching record on left side for deterministic match key.",
            ));
        }
    }

    variances.sort_by(|a, b| a.variance_id.cmp(&b.variance_id));
    let summary_hash = hash_json(&variances);

    Ok(VarianceReport {
        schema_version: SCHEMA_VERSION.to_string(),
        variances,
        summary_hash,
    })
}

pub fn compute_manifest(
    records_left: &[NormalizedRecord],
    records_right: &[NormalizedRecord],
    ruleset: &Ruleset,
    report: &VarianceReport,
    left_file_name: &str,
    right_file_name: &str,
    ruleset_file_name: &str,
    report_file_name: &str,
) -> Result<EvidenceManifest, KernelError> {
    let left_sorted = canonicalize_for_hash(records_left, &ruleset.match_keys)?;
    let right_sorted = canonicalize_for_hash(records_right, &ruleset.match_keys)?;

    let inputs = ManifestInputs {
        left_records: ManifestFileHash {
            file_name: left_file_name.to_string(),
            sha256: hash_json(&left_sorted),
        },
        right_records: ManifestFileHash {
            file_name: right_file_name.to_string(),
            sha256: hash_json(&right_sorted),
        },
    };

    let ruleset_hash = ManifestFileHash {
        file_name: ruleset_file_name.to_string(),
        sha256: hash_json(ruleset),
    };

    let outputs = ManifestOutputs {
        variance_report: ManifestFileHash {
            file_name: report_file_name.to_string(),
            sha256: hash_json(report),
        },
        variance_summary_hash: report.summary_hash.clone(),
    };

    Ok(EvidenceManifest {
        schema_version: SCHEMA_VERSION.to_string(),
        kernel_version: env!("CARGO_PKG_VERSION").to_string(),
        inputs,
        ruleset: ruleset_hash,
        outputs,
        deterministic_statement: "Deterministic output is achieved by stable ordering, explicit rounding, and explicit timezone handling; the kernel surfaces discrepancies and does not modify input data.".to_string(),
    })
}

fn compare_records(
    left: &NormalizedRecord,
    right: &NormalizedRecord,
    ruleset: &Ruleset,
) -> Result<Vec<Variance>, KernelError> {
    let mut variances = Vec::new();

    for key in &ruleset.compare_keys {
        match key.as_str() {
            "record_id" => compare_simple(
                "record_id",
                &left.record_id,
                &right.record_id,
                left,
                right,
                &mut variances,
            ),
            "source" => compare_simple(
                "source",
                &left.source,
                &right.source,
                left,
                right,
                &mut variances,
            ),
            "timestamp" => compare_simple(
                "timestamp",
                &left.timestamp,
                &right.timestamp,
                left,
                right,
                &mut variances,
            ),
            "currency" => compare_simple(
                "currency",
                &left.currency,
                &right.currency,
                left,
                right,
                &mut variances,
            ),
            "amount_minor_units" => {
                let left_amount = round_amount(left.amount_minor_units, &ruleset.rounding)?;
                let right_amount = round_amount(right.amount_minor_units, &ruleset.rounding)?;
                let delta = left_amount - right_amount;
                let delta_abs = delta.checked_abs().unwrap_or(i64::MAX);
                if delta_abs > ruleset.tolerance_minor_units {
                    variances.push(build_variance(
                        "amount_mismatch",
                        "medium",
                        Some(left.record_id.clone()),
                        Some(right.record_id.clone()),
                        delta,
                        "Amount delta exceeds tolerance after deterministic rounding.",
                    ));
                }
            }
            key if key.starts_with("attributes.") => {
                let attr_key = key.trim_start_matches("attributes.");
                let left_value = left.attributes.get(attr_key).cloned().unwrap_or_default();
                let right_value = right.attributes.get(attr_key).cloned().unwrap_or_default();
                compare_simple(
                    key,
                    &left_value,
                    &right_value,
                    left,
                    right,
                    &mut variances,
                );
            }
            other => return Err(KernelError::MissingCompareKey(other.to_string())),
        }
    }

    Ok(variances)
}

fn compare_simple(
    key: &str,
    left_value: &str,
    right_value: &str,
    left: &NormalizedRecord,
    right: &NormalizedRecord,
    variances: &mut Vec<Variance>,
) {
    if left_value != right_value {
        variances.push(build_variance(
            "field_mismatch",
            "low",
            Some(left.record_id.clone()),
            Some(right.record_id.clone()),
            left.amount_minor_units - right.amount_minor_units,
            &format!("Field '{key}' differs after canonicalization."),
        ));
    }
}

fn build_variance(
    variance_type: &str,
    severity: &str,
    left_record_id: Option<String>,
    right_record_id: Option<String>,
    amount_delta_minor_units: i64,
    rationale: &str,
) -> Variance {
    let mut hash_input = String::new();
    hash_input.push_str(variance_type);
    hash_input.push('|');
    hash_input.push_str(left_record_id.as_deref().unwrap_or(""));
    hash_input.push('|');
    hash_input.push_str(right_record_id.as_deref().unwrap_or(""));
    hash_input.push('|');
    hash_input.push_str(&amount_delta_minor_units.to_string());
    hash_input.push('|');
    hash_input.push_str(rationale);

    Variance {
        variance_id: hash_string(&hash_input),
        variance_type: variance_type.to_string(),
        severity: severity.to_string(),
        left_record_id,
        right_record_id,
        amount_delta_minor_units,
        rationale: rationale.to_string(),
    }
}

fn canonicalize_and_sort(
    records: &[NormalizedRecord],
    match_keys: &[String],
) -> Result<Vec<(String, NormalizedRecord)>, KernelError> {
    let mut enriched = Vec::with_capacity(records.len());
    for record in records {
        let canonical = canonicalize_record(record);
        let key = build_match_key(&canonical, match_keys)?;
        enriched.push((key, canonical));
    }
    enriched.sort_by(|(key_a, rec_a), (key_b, rec_b)| {
        key_a
            .cmp(key_b)
            .then_with(|| rec_a.record_id.cmp(&rec_b.record_id))
    });
    Ok(enriched)
}

fn canonicalize_for_hash(
    records: &[NormalizedRecord],
    match_keys: &[String],
) -> Result<Vec<NormalizedRecord>, KernelError> {
    let mut enriched = canonicalize_and_sort(records, match_keys)?;
    Ok(enriched.into_iter().map(|(_, record)| record).collect())
}

fn canonicalize_record(record: &NormalizedRecord) -> NormalizedRecord {
    NormalizedRecord {
        record_id: record.record_id.clone(),
        source: record.source.clone(),
        timestamp: record.timestamp.clone(),
        amount_minor_units: record.amount_minor_units,
        currency: record.currency.clone(),
        attributes: record.attributes.iter().map(|(k, v)| (k.clone(), v.clone())).collect(),
        schema_version: record.schema_version.clone(),
    }
}

fn build_match_key(
    record: &NormalizedRecord,
    match_keys: &[String],
) -> Result<String, KernelError> {
    let mut parts = Vec::with_capacity(match_keys.len());
    for key in match_keys {
        let value = match key.as_str() {
            "record_id" => record.record_id.clone(),
            "source" => record.source.clone(),
            "timestamp" => record.timestamp.clone(),
            "amount_minor_units" => record.amount_minor_units.to_string(),
            "currency" => record.currency.clone(),
            key if key.starts_with("attributes.") => {
                let attr_key = key.trim_start_matches("attributes.");
                record
                    .attributes
                    .get(attr_key)
                    .cloned()
                    .unwrap_or_default()
            }
            other => return Err(KernelError::MissingMatchKey(other.to_string())),
        };
        parts.push(value);
    }
    Ok(parts.join("|"))
}

fn round_amount(value: i64, rule: &RoundingRule) -> Result<i64, KernelError> {
    let increment = rule.increment_minor_units;
    if increment <= 0 {
        return Err(KernelError::InvalidRoundingIncrement);
    }

    if increment == 1 {
        return Ok(value);
    }

    let quotient = value / increment;
    let remainder = value % increment;

    let rounded = match rule.mode {
        RoundingMode::Down => {
            if remainder == 0 {
                value
            } else if value >= 0 {
                (quotient) * increment
            } else {
                (quotient - 1) * increment
            }
        }
        RoundingMode::Up => {
            if remainder == 0 {
                value
            } else if value >= 0 {
                (quotient + 1) * increment
            } else {
                quotient * increment
            }
        }
        RoundingMode::Nearest => {
            let abs_remainder = remainder.unsigned_abs() as i64;
            let half = increment / 2;
            if abs_remainder >= half {
                if value >= 0 {
                    (quotient + 1) * increment
                } else {
                    (quotient - 1) * increment
                }
            } else {
                quotient * increment
            }
        }
        RoundingMode::TowardZero => quotient * increment,
        RoundingMode::AwayFromZero => {
            if remainder == 0 {
                value
            } else if value >= 0 {
                (quotient + 1) * increment
            } else {
                (quotient - 1) * increment
            }
        }
    };

    Ok(rounded)
}

fn hash_json<T: Serialize>(value: &T) -> String {
    let serialized = serde_json::to_vec(value).expect("serialize to json");
    hash_bytes(&serialized)
}

fn hash_string(value: &str) -> String {
    hash_bytes(value.as_bytes())
}

fn hash_bytes(value: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(value);
    let digest = hasher.finalize();
    hex_string(&digest)
}

fn hex_string(bytes: &[u8]) -> String {
    let mut out = String::with_capacity(bytes.len() * 2);
    for byte in bytes {
        fmt::Write::write_fmt(&mut out, format_args!("{:02x}", byte)).expect("hex write");
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rounding_is_deterministic() {
        let rule = RoundingRule {
            mode: RoundingMode::Nearest,
            increment_minor_units: 10,
        };

        assert_eq!(round_amount(105, &rule).unwrap(), 110);
        assert_eq!(round_amount(101, &rule).unwrap(), 100);
        assert_eq!(round_amount(-105, &rule).unwrap(), -110);
        assert_eq!(round_amount(-101, &rule).unwrap(), -100);
    }
}
