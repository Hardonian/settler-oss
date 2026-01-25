# Evidence Bundles

Each Settler Engine run emits an evidence bundle under `output_dir/evidence/`. The bundle provides an audit-safe trail of the normalized data and variances the engine used to surface discrepancies.

## Structure

```
output_dir/
  engine_output.json
  evidence/
    manifest.json
    normalized.jsonl
    variances.jsonl
    logs/
      engine.log
```

## Manifest

`manifest.json` lists every evidence file and its SHA-256 hash. This enables integrity checks of the evidence bundle without any network access or telemetry.

## Normalized records

`normalized.jsonl` contains canonicalized records derived from the input files. Each line is a JSON object with the source, key, and normalized amounts in integer cents.

## Variances

`variances.jsonl` contains discrepancy items in stable order. Items include the key, variance type, and per-source amounts or missing sources.

## Logs

`logs/engine.log` provides a minimal run log to support traceability while staying deterministic.
