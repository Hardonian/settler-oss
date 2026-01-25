use settler_kernel::{
    compute_manifest, compute_variances, NormalizedRecord, RoundingMode, RoundingRule, Ruleset,
    SCHEMA_VERSION,
};
use std::collections::BTreeMap;

fn sample_records() -> (Vec<NormalizedRecord>, Vec<NormalizedRecord>) {
    let mut left_attrs = BTreeMap::new();
    left_attrs.insert("invoice".to_string(), "inv-100".to_string());

    let mut right_attrs = BTreeMap::new();
    right_attrs.insert("invoice".to_string(), "inv-100".to_string());

    let left = NormalizedRecord {
        record_id: "left-1".to_string(),
        source: "ledger".to_string(),
        timestamp: "2024-01-02T10:00:00Z".to_string(),
        amount_minor_units: 105,
        currency: "USD".to_string(),
        attributes: left_attrs,
        schema_version: SCHEMA_VERSION.to_string(),
    };

    let right = NormalizedRecord {
        record_id: "right-1".to_string(),
        source: "bank".to_string(),
        timestamp: "2024-01-02T10:00:00Z".to_string(),
        amount_minor_units: 100,
        currency: "USD".to_string(),
        attributes: right_attrs,
        schema_version: SCHEMA_VERSION.to_string(),
    };

    (vec![left], vec![right])
}

fn sample_ruleset() -> Ruleset {
    Ruleset {
        match_keys: vec!["timestamp".to_string(), "attributes.invoice".to_string()],
        compare_keys: vec!["amount_minor_units".to_string(), "currency".to_string()],
        tolerance_minor_units: 2,
        rounding: RoundingRule {
            mode: RoundingMode::Nearest,
            increment_minor_units: 10,
        },
        timezone: "UTC".to_string(),
        schema_version: SCHEMA_VERSION.to_string(),
    }
}

#[test]
fn deterministic_variance_and_manifest() {
    let (left, right) = sample_records();
    let ruleset = sample_ruleset();

    let report_a = compute_variances(&left, &right, &ruleset).expect("report a");
    let report_b = compute_variances(&left, &right, &ruleset).expect("report b");

    assert_eq!(report_a, report_b);

    let manifest_a = compute_manifest(
        &left,
        &right,
        &ruleset,
        &report_a,
        "left.json",
        "right.json",
        "ruleset.json",
        "variance.json",
    )
    .expect("manifest a");

    let manifest_b = compute_manifest(
        &left,
        &right,
        &ruleset,
        &report_b,
        "left.json",
        "right.json",
        "ruleset.json",
        "variance.json",
    )
    .expect("manifest b");

    assert_eq!(manifest_a, manifest_b);
}
