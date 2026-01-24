# Settler OSS Determinism Specification

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Status:** Engineering Specification

---

## Purpose

This document defines the **determinism boundaries** for Settler reconciliation operations. It specifies what inputs affect outputs, what does not affect outputs, and where determinism guarantees end.

**Target Audience:** Engineers implementing reconciliation logic, QA teams writing tests, auditors verifying reproducibility

**Key Principle:** Determinism enables testing, debugging, auditability, and trust. Where determinism ends, we document why and how users should reason about it.

---

## Core Determinism Guarantee

**Statement:** Given identical inputs, reconciliation produces identical outputs.

**Formal Definition:**
```
∀ (source, target, rules, config):
  reconcile(source, target, rules, config) = reconcile(source, target, rules, config)
```

**Scope:**
- Matching results (which transactions match)
- Unmatched transaction lists
- Summary statistics (counts, totals)

**Exclusions:**
- Job metadata (jobId, execution timestamps)
- Log messages (may include timestamps)
- Performance metrics (execution time)

---

## What Affects Output (Deterministic Inputs)

These inputs **directly affect** reconciliation results. Changing any of these produces different outputs.

### 1. Transaction Data

**Components:**
- Transaction IDs (`id`)
- Amounts (`amount`)
- Dates (`date`)
- Custom fields used in matching rules

**How It Affects Output:**
- Different IDs → different match candidates
- Different amounts → different matches (within tolerance)
- Different dates → different matches (within date range)
- Different custom fields → different rule evaluations

**Example:**
```typescript
const source = [{ id: '1', amount: 100, date: '2026-01-24' }];
const target = [{ id: '2', amount: 100, date: '2026-01-24' }];

// Same data → same result
const r1 = reconcile(source, target);
const r2 = reconcile(source, target);
assert.deepEqual(r1.matched, r2.matched); // ✅ Pass

// Different amount → different result
target[0].amount = 101;
const r3 = reconcile(source, target);
assert.notDeepEqual(r1.matched, r3.matched); // ✅ Pass (different)
```

---

### 2. Matching Rules

**Components:**
- Tolerance settings (`tolerance` for amounts)
- Date range settings (`dateRange` for date matching)
- Custom matching fields (`fields`)

**How It Affects Output:**
- Wider tolerance → more matches
- Wider date range → more matches
- Different fields → different matching logic

**Example:**
```typescript
const rules1 = { tolerance: 0.01 };
const rules2 = { tolerance: 0.10 };

const r1 = reconcile(source, target, rules1);
const r2 = reconcile(source, target, rules2);

// Different tolerance → different matches
assert.notDeepEqual(r1.matched, r2.matched);
```

---

### 3. Transaction Order (For Tiebreaking)

**Components:**
- Array order of source transactions
- Array order of target transactions

**How It Affects Output:**
- When multiple targets match a source equally, first target wins
- Tiebreaker uses lexicographic sort by ID (deterministic)

**Example:**
```typescript
const source = [{ id: 's1', amount: 100, date: '2026-01-24' }];
const target = [
  { id: 't1', amount: 100, date: '2026-01-24' },
  { id: 't2', amount: 100, date: '2026-01-24' },
];

// s1 matches t1 (first in array, or lowest ID if sorted)
const result = reconcile(source, target);
assert.equal(result.matched[0].target.id, 't1');
```

**Determinism Guarantee:**
- **Cloud:** Uses stable sort by ID (deterministic)
- **OSS Demo:** Uses array order (deterministic if input order preserved)

**Recommendation:** Do not rely on specific match selection when multiple candidates are equally valid. If order matters, add distinguishing fields.

---

### 4. Configuration Parameters

**Components:**
- Precision settings (decimal places for rounding)
- Matching mode (one-to-one vs many-to-many)
- Currency validation settings

**How It Affects Output:**
- Different precision → different rounding behavior
- Different mode → different match cardinality
- Currency validation on/off → validation errors or not

---

## What Does NOT Affect Output (Non-Deterministic Inputs)

These inputs **do not affect** reconciliation results. They may vary between runs without changing outputs.

### 1. Execution Time

**Not Affected:**
- Current timestamp when reconciliation runs
- Time of day
- Day of week

**Rationale:** Matching logic does not depend on wall clock time.

**Example:**
```typescript
// Run at different times → same result
const r1 = reconcile(source, target); // 2026-01-24 10:00
const r2 = reconcile(source, target); // 2026-01-24 14:00
assert.deepEqual(r1.matched, r2.matched); // ✅ Same
```

**Exceptions:**
- Job metadata (jobId, createdAt) includes timestamps (not part of matching result)
- Logs may include timestamps (not part of matching result)

---

### 2. Network Conditions (Cloud)

**Not Affected:**
- Network latency
- Packet loss and retries
- Geographic location of client

**Rationale:** Reconciliation is computed server-side, network only affects transmission.

**Example:**
```typescript
// Different network conditions → same result
const r1 = await client.reconcile({ source, target }); // Fast network
const r2 = await client.reconcile({ source, target }); // Slow network
assert.deepEqual(r1.matched, r2.matched); // ✅ Same
```

---

### 3. Job Execution Order (Parallel Jobs)

**Not Affected:**
- Order of parallel reconciliation jobs
- Concurrent job execution

**Rationale:** Jobs are independent, no shared state.

**Example:**
```typescript
// Run jobs in parallel → independent results
const [r1, r2] = await Promise.all([
  reconcile(sourceA, targetA),
  reconcile(sourceB, targetB),
]);
// r1 and r2 are independent, deterministic within themselves
```

---

### 4. System Load and Resources

**Not Affected:**
- CPU usage
- Memory availability
- Disk I/O speed

**Rationale:** Reconciliation algorithm is deterministic regardless of performance.

**Example:**
```typescript
// Different system load → same result (different performance)
const r1 = reconcile(source, target); // Idle system
const r2 = reconcile(source, target); // High load
assert.deepEqual(r1.matched, r2.matched); // ✅ Same
```

---

### 5. SDK Version (Minor/Patch Updates)

**Not Affected:**
- SDK version (within same major version)

**Rationale:** Backward compatibility guarantees preserve behavior.

**Example:**
```typescript
// SDK 1.2.0 vs 1.3.0 → same result (backward compatible)
const r1 = reconcile(source, target); // SDK 1.2.0
const r2 = reconcile(source, target); // SDK 1.3.0
assert.deepEqual(r1.matched, r2.matched); // ✅ Same
```

**Exceptions:**
- Major version updates (2.0.0) may have breaking changes
- Bug fixes may change incorrect behavior to correct behavior

---

## Sources of Non-Determinism (Where Guarantees End)

These are areas where determinism is **not guaranteed** by design.

### 1. Floating Point Arithmetic (OSS Demo Code)

**Issue:** JavaScript `number` type uses IEEE 754 floating point.

**Problem:**
```typescript
0.1 + 0.2 !== 0.3 // true in JavaScript!
```

**Impact on Reconciliation:**
- **Cloud:** Uses Decimal library (deterministic, exact)
- **OSS Demo:** Uses JavaScript `number` (non-deterministic across platforms/compilers)

**Mitigation:**
- **Cloud users:** No action needed (guaranteed)
- **OSS users implementing own engine:** Use Decimal.js or equivalent
- **OSS demo users:** Acceptable for demos, not production

**Example:**
```typescript
// ❌ OSS Demo (floating point)
const diff = Math.abs(100.1 - 100.0); // May have precision errors

// ✅ Cloud (exact decimal)
const diff = new Decimal('100.1').minus('100.0').abs(); // Exact
```

**Recommendation:**
```typescript
import Decimal from 'decimal.js';

function reconcile(source, target) {
  for (const s of source) {
    for (const t of target) {
      const diff = new Decimal(s.amount).minus(t.amount).abs();
      if (diff.lte(tolerance)) {
        // Match!
      }
    }
  }
}
```

---

### 2. Date Parsing Across Timezones

**Issue:** Date strings may be interpreted differently depending on system timezone.

**Problem:**
```javascript
// System timezone affects interpretation
new Date('2026-01-24').getTime(); // Different in UTC vs PST
```

**Impact:**
- Date-based matching may differ across systems
- Dates near midnight may shift to previous/next day

**Mitigation:**
- Use ISO 8601 date strings (YYYY-MM-DD)
- Normalize to UTC before reconciliation
- Document timezone assumptions

**Example:**
```typescript
// ✅ Deterministic: ISO 8601 date strings, UTC normalized
const date = '2026-01-24'; // Always interpreted as UTC date

// ❌ Non-deterministic: Local time
const date = new Date('2026-01-24').toLocaleDateString(); // Timezone-dependent
```

**Recommendation:**
- Always use ISO 8601 format: `YYYY-MM-DD`
- Extract date component only (discard time)
- Document: "All dates in UTC"

---

### 3. Hash Map Iteration Order (Implementation Detail)

**Issue:** JavaScript object key iteration order is not guaranteed (though modern engines follow insertion order).

**Problem:**
```javascript
const map = { b: 2, a: 1 };
Object.keys(map); // ['b', 'a'] in modern engines, but not guaranteed
```

**Impact:**
- If matching logic iterates over object keys, order may vary
- Non-deterministic tiebreaking

**Mitigation:**
- Use arrays instead of objects for deterministic iteration
- Sort keys before iteration
- Use explicit ordering

**Example:**
```typescript
// ❌ Non-deterministic
for (const key in transactionMap) {
  // Order not guaranteed
}

// ✅ Deterministic
const sortedKeys = Object.keys(transactionMap).sort();
for (const key of sortedKeys) {
  // Order guaranteed
}
```

---

### 4. External API Calls (Adapters)

**Issue:** External APIs may return different results over time.

**Problem:**
- Stripe API returns new transactions since last sync
- QuickBooks API may return data in different order
- Provider data changes between calls

**Impact:**
- Adapter fetch results are non-deterministic
- Reconciliation results differ if underlying data changes

**Mitigation:**
- Snapshot data before reconciliation
- Use same snapshot for reproducibility testing
- Document: "Results based on data at point in time"

**Example:**
```typescript
// ✅ Deterministic: Use same snapshot
const snapshot = fetchTransactions(); // Fetch once
const r1 = reconcile(snapshot.source, snapshot.target);
const r2 = reconcile(snapshot.source, snapshot.target); // Same snapshot

// ❌ Non-deterministic: Fetch each time
const r1 = reconcile(fetchSource(), fetchTarget()); // Data changes
const r2 = reconcile(fetchSource(), fetchTarget()); // Different data
```

---

### 5. Random Number Generation (Forbidden in Matching)

**Issue:** Random numbers break determinism.

**Problem:**
```javascript
Math.random(); // Different every call
```

**Impact:**
- If used in matching logic, results are non-reproducible
- Testing becomes impossible

**Mitigation:**
- **NEVER** use random numbers in matching logic
- Use deterministic tiebreakers (ID sort)

**Example:**
```typescript
// ❌ FORBIDDEN: Random tiebreaker
if (confidence1 === confidence2) {
  return Math.random() > 0.5 ? match1 : match2;
}

// ✅ Deterministic tiebreaker
if (confidence1 === confidence2) {
  return match1.source.id < match2.source.id ? match1 : match2;
}
```

---

## Testing Determinism

### Test 1: Identical Inputs Produce Identical Outputs

```typescript
test('determinism: same inputs → same outputs', () => {
  const source = [
    { id: '1', amount: 100, date: '2026-01-24' },
    { id: '2', amount: 200, date: '2026-01-25' },
  ];
  const target = [
    { id: 'a', amount: 100, date: '2026-01-24' },
    { id: 'b', amount: 200, date: '2026-01-25' },
  ];
  const rules = { tolerance: 0.01 };

  const r1 = reconcile(source, target, rules);
  const r2 = reconcile(source, target, rules);

  expect(r1.matched).toEqual(r2.matched);
  expect(r1.unmatched).toEqual(r2.unmatched);
  expect(r1.summary).toEqual(r2.summary);
});
```

### Test 2: Execution Time Does Not Affect Output

```typescript
test('determinism: time does not affect output', async () => {
  const source = [{ id: '1', amount: 100, date: '2026-01-24' }];
  const target = [{ id: 'a', amount: 100, date: '2026-01-24' }];

  const r1 = reconcile(source, target);
  await sleep(1000); // Wait 1 second
  const r2 = reconcile(source, target);

  expect(r1.matched).toEqual(r2.matched);
});
```

### Test 3: Parallel Execution Produces Same Results

```typescript
test('determinism: parallel execution', async () => {
  const source = [{ id: '1', amount: 100, date: '2026-01-24' }];
  const target = [{ id: 'a', amount: 100, date: '2026-01-24' }];

  const [r1, r2, r3] = await Promise.all([
    reconcile(source, target),
    reconcile(source, target),
    reconcile(source, target),
  ]);

  expect(r1.matched).toEqual(r2.matched);
  expect(r2.matched).toEqual(r3.matched);
});
```

### Test 4: Transaction Order (Tiebreaker Stability)

```typescript
test('determinism: stable tiebreaking', () => {
  const source = [{ id: 's1', amount: 100, date: '2026-01-24' }];
  const target = [
    { id: 't2', amount: 100, date: '2026-01-24' }, // Note: t2 before t1
    { id: 't1', amount: 100, date: '2026-01-24' },
  ];

  const r1 = reconcile(source, target);
  const r2 = reconcile(source, target);

  // Should always match the same target (deterministic tiebreaker)
  expect(r1.matched[0].target.id).toBe(r2.matched[0].target.id);
});
```

---

## Determinism Best Practices

### For Implementers

**DO:**
- ✅ Use stable sorting for tiebreakers
- ✅ Use Decimal arithmetic for currency
- ✅ Use ISO 8601 date format
- ✅ Document all inputs that affect output
- ✅ Test with identical inputs multiple times

**DON'T:**
- ❌ Use `Math.random()` in matching logic
- ❌ Use `Date.now()` or `new Date()` in matching logic
- ❌ Depend on hash map iteration order
- ❌ Use floating point for currency calculations
- ❌ Fetch external data during matching

### For Testers

**DO:**
- ✅ Test determinism with identical inputs
- ✅ Test edge cases (equal confidence, multiple matches)
- ✅ Verify tiebreaker stability
- ✅ Test across different environments

**DON'T:**
- ❌ Assume job metadata will be identical (it won't)
- ❌ Compare timestamps in assertions
- ❌ Compare execution times

### For Auditors

**DO:**
- ✅ Verify determinism tests exist
- ✅ Check for random number usage in matching
- ✅ Verify Decimal usage for currency
- ✅ Review tiebreaker logic

**DON'T:**
- ❌ Expect bit-for-bit identical logs
- ❌ Expect identical execution times
- ❌ Expect identical job IDs

---

## Currency and Rounding Determinism

### Decimal Precision

**Cloud:** Uses Decimal library with exact precision.

```typescript
import Decimal from 'decimal.js';

const a = new Decimal('0.1');
const b = new Decimal('0.2');
const sum = a.plus(b);

console.log(sum.toString()); // "0.3" (exact)
```

**OSS Demo:** Uses JavaScript `number` (floating point).

```typescript
const a = 0.1;
const b = 0.2;
const sum = a + b;

console.log(sum); // 0.30000000000000004 (floating point error)
```

**Recommendation for OSS Users:**
```typescript
import Decimal from 'decimal.js';

function reconcile(source, target, rules) {
  const tolerance = new Decimal(rules.tolerance ?? 0.01);

  for (const s of source) {
    for (const t of target) {
      const sAmount = new Decimal(s.amount);
      const tAmount = new Decimal(t.amount);
      const diff = sAmount.minus(tAmount).abs();

      if (diff.lte(tolerance)) {
        // Match!
      }
    }
  }
}
```

### Rounding Behavior

**Rule:** Always round explicitly, never implicitly.

```typescript
// ❌ Implicit rounding (non-deterministic)
const rounded = Math.round(value);

// ✅ Explicit rounding (deterministic)
const rounded = new Decimal(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
```

**Rounding Modes:**
- Use consistent rounding mode across all operations
- Document rounding mode in configuration
- Default: `ROUND_HALF_UP` (banker's rounding alternative: `ROUND_HALF_EVEN`)

---

## Date Handling Determinism

### ISO 8601 Format

**Rule:** Always use ISO 8601 date strings (`YYYY-MM-DD`).

```typescript
// ✅ Deterministic
const date = '2026-01-24';

// ❌ Non-deterministic (locale-dependent)
const date = new Date().toLocaleDateString();
```

### Date Comparison

**Rule:** Compare dates as strings or normalize to UTC timestamps.

```typescript
// ✅ Deterministic (string comparison)
if (sourceDate === targetDate) { /* match */ }

// ✅ Deterministic (UTC timestamp)
const sourceMs = Date.parse(sourceDate + 'T00:00:00Z');
const targetMs = Date.parse(targetDate + 'T00:00:00Z');
if (Math.abs(sourceMs - targetMs) <= dateToleranceMs) { /* match */ }

// ❌ Non-deterministic (local time)
const sourceDate = new Date(s.date);
const targetDate = new Date(t.date);
```

### Date Tolerance

**Rule:** Express date tolerance in days, not milliseconds.

```typescript
// ✅ Deterministic (days)
const dateTolerance = 1; // 1 day
const diffDays = Math.abs(Date.parse(s.date) - Date.parse(t.date)) / (1000 * 60 * 60 * 24);
if (diffDays <= dateTolerance) { /* match */ }

// ❌ Less clear (milliseconds)
const dateTolerance = 86400000; // What is this?
```

---

## Non-Deterministic Metadata (Acceptable)

These values are **allowed** to be non-deterministic because they are not part of matching results.

### Job Metadata

**Non-deterministic:**
- `jobId` (UUID or auto-increment)
- `createdAt` (timestamp when job started)
- `executionTime` (how long job took)

**Example:**
```typescript
{
  jobId: 'job_abc123', // Different every time
  createdAt: '2026-01-24T10:00:00Z', // Current time
  executionTime: 123, // Performance varies
  matched: [...], // DETERMINISTIC
  unmatched: { ... }, // DETERMINISTIC
}
```

### Log Messages

**Non-deterministic:**
- Timestamps in logs
- Performance metrics
- Debug messages

**Example:**
```
[2026-01-24 10:00:00] Starting reconciliation
[2026-01-24 10:00:01] Matched 100 transactions
[2026-01-24 10:00:01] Completed in 1.2s
```

---

## Summary: Determinism Checklist

**Inputs that affect output:**
- [ ] Transaction IDs
- [ ] Transaction amounts
- [ ] Transaction dates
- [ ] Matching rules (tolerance, date range)
- [ ] Custom fields used in rules
- [ ] Transaction order (for tiebreaking)

**Inputs that do NOT affect output:**
- [ ] Execution time
- [ ] Network conditions
- [ ] System load
- [ ] Parallel job order
- [ ] SDK version (minor/patch)

**Ensure determinism:**
- [ ] Use Decimal for currency (not floating point)
- [ ] Use ISO 8601 dates
- [ ] No random numbers in matching logic
- [ ] Stable sort for tiebreakers
- [ ] Document all inputs that affect output
- [ ] Test determinism with repeated runs

---

## References

- [INVARIANTS.md](./INVARIANTS.md) - Behavioral invariants (B1: Deterministic Matching)
- [GUARANTEES.md](./GUARANTEES.md) - G1: Deterministic Rule Evaluation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and data flow

---

**This document is engineering specification.** Determinism is testable, verifiable, and auditable.

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
