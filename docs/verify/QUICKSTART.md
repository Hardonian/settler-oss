# Verification Quickstart (WASM)

This guide explains how to run client-side verification using the Rust WASM verifier. Verification is local and optional. It surfaces discrepancies between evidence files and the manifest but does not certify compliance.

## Evidence bundle contents

An evidence bundle should include:

- `evidence-manifest.json`
- `left-records.json`
- `right-records.json`
- `ruleset.json`
- `variance-report.json`

The manifest must reference the exact filenames used above so the verifier can resolve and hash each file.

## Build the WASM verifier

From the repo root:

```bash
cargo install wasm-pack
wasm-pack build crates/settler-verify-wasm --target web --out-dir ../../apps/console/public/wasm
```

This places the WASM bundle at `apps/console/public/wasm`, which the verification UI loads on demand.

## Verify in the browser

1. Run the console app: `npm run dev --workspace @settler/console`
2. Visit `http://localhost:3001/verify`
3. Upload `evidence-manifest.json`
4. Upload the evidence files referenced in the manifest
5. Click **Verify bundle** to surface discrepancies

If the WASM module is not available, the UI will display instructions to use the offline verifier or build the WASM bundle.
