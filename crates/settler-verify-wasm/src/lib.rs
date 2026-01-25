use js_sys::{Object, Reflect, Uint8Array};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvidenceManifest {
    pub schema_version: String,
    pub kernel_version: String,
    pub inputs: ManifestInputs,
    pub ruleset: ManifestFileHash,
    pub outputs: ManifestOutputs,
    pub deterministic_statement: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestInputs {
    pub left_records: ManifestFileHash,
    pub right_records: ManifestFileHash,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestOutputs {
    pub variance_report: ManifestFileHash,
    pub variance_summary_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ManifestFileHash {
    pub file_name: String,
    pub sha256: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerificationResult {
    pub ok: bool,
    pub errors: Vec<String>,
}

#[wasm_bindgen]
pub fn verify_manifest(manifest_json: &str, files: JsValue) -> JsValue {
    let mut errors = Vec::new();
    let manifest: EvidenceManifest = match serde_json::from_str(manifest_json) {
        Ok(value) => value,
        Err(err) => {
            errors.push(format!("manifest json invalid: {err}"));
            return to_js_result(false, errors);
        }
    };

    if manifest.deterministic_statement.trim().is_empty() {
        errors.push("deterministic_statement must be present".to_string());
    }

    let files_obj = Object::from(files);

    verify_file_hash(&manifest.inputs.left_records, &files_obj, &mut errors);
    verify_file_hash(&manifest.inputs.right_records, &files_obj, &mut errors);
    verify_file_hash(&manifest.ruleset, &files_obj, &mut errors);
    verify_file_hash(&manifest.outputs.variance_report, &files_obj, &mut errors);

    let ok = errors.is_empty();
    to_js_result(ok, errors)
}

fn verify_file_hash(
    expected: &ManifestFileHash,
    files_obj: &Object,
    errors: &mut Vec<String>,
) {
    let file_name = expected.file_name.as_str();
    match Reflect::get(files_obj, &JsValue::from_str(file_name)) {
        Ok(value) => {
            if value.is_undefined() || value.is_null() {
                errors.push(format!("missing file: {file_name}"));
                return;
            }
            let bytes = Uint8Array::new(&value);
            let mut buffer = vec![0u8; bytes.length() as usize];
            bytes.copy_to(&mut buffer);
            let hash = hash_bytes(&buffer);
            if hash != expected.sha256 {
                errors.push(format!(
                    "hash mismatch for {file_name}: expected {}, got {hash}",
                    expected.sha256
                ));
            }
        }
        Err(_) => errors.push(format!("missing file: {file_name}")),
    }
}

fn to_js_result(ok: bool, errors: Vec<String>) -> JsValue {
    let result = VerificationResult { ok, errors };
    serde_wasm_bindgen::to_value(&result).unwrap_or_else(|_| JsValue::NULL)
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
        use std::fmt::Write;
        write!(&mut out, "{:02x}", byte).expect("hex write");
    }
    out
}
