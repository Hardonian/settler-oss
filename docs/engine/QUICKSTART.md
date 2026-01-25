# Settler Engine Quickstart (10 Minutes)

This quickstart gets you from inputs to a variance report locally using the OSS `settler-engine` sidecar. The engine surfaces discrepancies deterministically and produces an audit-safe evidence bundle for inspection.

## Prerequisites

- Go 1.21+
- Node.js 18+
- `pnpm` or `npm`

## 1) Prepare inputs and ruleset

Use the included fixture to see the expected structure:

```bash
cat tools/settler-engine/fixtures/basic/source_a.csv
cat tools/settler-engine/fixtures/basic/source_b.json
cat tools/settler-engine/fixtures/basic/ruleset.json
```

The ruleset defines how to match records (key fields) and which amount field to reconcile.

## 2) Create an engine input file

```bash
cat > /tmp/engine_input.json <<'JSON'
{
  "input_files": [
    "tools/settler-engine/fixtures/basic/source_a.csv",
    "tools/settler-engine/fixtures/basic/source_b.json"
  ],
  "input_format": "auto",
  "ruleset_path": "tools/settler-engine/fixtures/basic/ruleset.json",
  "rounding_mode": "bankers",
  "timezone": "UTC",
  "output_dir": "/tmp/settler-output",
  "mode": "local",
  "determinism": {
    "sort_keys": ["key", "source"],
    "rounding": "bankers",
    "timezone": "UTC"
  }
}
JSON
```

## 3) Run the engine

```bash
pnpm settler:run --input /tmp/engine_input.json
```

## 4) Inspect outputs

```bash
cat /tmp/settler-output/engine_output.json
cat /tmp/settler-output/evidence/manifest.json
```

## 5) Import in the UI

Open the Console app and use **Import Results** to upload:

- `/tmp/settler-output/engine_output.json`
- `/tmp/settler-output/evidence/` as a zip (optional)

The UI works in manual import mode without any server execution.
