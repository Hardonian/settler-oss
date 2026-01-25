# Settler Kernel Determinism

This document describes how the Settler Rust kernel produces deterministic outputs when given the same normalized inputs and ruleset. The kernel surfaces discrepancies between inputs; it does not modify input data or claim compliance with any external standards.

## Determinism scope

Determinism means that the kernel returns identical variance reports and manifest hashes for identical inputs, ruleset, and schema versions.

The kernel enforces determinism by:

- Stable ordering of records and variances.
- Explicit rounding modes with integer minor units.
- Explicit timezone rules carried in the ruleset.
- Canonical JSON serialization for hashing.

## Deterministic behaviors

### Stable ordering

- Records are canonicalized and sorted by match key and `record_id`.
- Variances are sorted by deterministic `variance_id`.
- Evidence manifest hashes are computed from canonicalized arrays and structs.

### Rounding

- Rounding uses integer minor units and an explicit rounding mode.
- Rounding increment must be positive and is enforced before variance comparison.

### Timezone handling

- Normalized records provide RFC3339 timestamps.
- The ruleset includes a `timezone` field; the kernel does not infer timezones.

## Outputs and verification

The kernel produces a variance report and evidence manifest. The manifest includes file hashes and a variance summary hash so that the verifier can surface discrepancies between the manifest and provided evidence files.

## Non-goals

- The kernel does not guarantee compliance outcomes.
- The kernel does not fix data issues; it only surfaces discrepancies.
- The kernel does not perform IO, parsing, or schema validation.
