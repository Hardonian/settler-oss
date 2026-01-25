# Determinism

Settler Engine is designed to produce deterministic outputs for identical inputs in local and CI contexts. This means repeated runs should emit identical normalized records, variance items, and evidence hashes.

## Determinism controls

The input schema requires a determinism block:

```json
{
  "determinism": {
    "sort_keys": ["key", "source"],
    "rounding": "bankers",
    "timezone": "UTC"
  }
}
```

These settings are used to:

- Apply stable sorting to normalized records and variance items.
- Control rounding behavior for amounts (no floating point usage).
- Normalize timestamps using the declared timezone.

## Stable ordering

- Normalized records are sorted by key, source, amount, and id.
- Variance items are sorted by key and type.
- Evidence manifest entries are sorted by path.

## Rounding rules

Amounts are parsed as decimal strings and converted to integer cents. Supported rounding modes are:

- `bankers` (round-half-to-even)
- `half_up` (round-half-away-from-zero)

## Bounds

Determinism is scoped to the declared configuration and input data. The engine surfaces discrepancies based on normalized inputs, and it does not assert compliance or correctness guarantees.
