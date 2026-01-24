# Settler Invariants

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Status:** Binding Specification

This document defines the **fundamental invariants** that Settler OSS and Enterprise **must always uphold**. These invariants ensure financial correctness, data integrity, predictable behavior, and trust.

Violations of these invariants constitute **critical bugs** and must be addressed immediately.

---

## 🎯 Core Philosophy

> **Reconciliation is a precision instrument for financial data.
> Settler must be deterministic, auditable, and trustworthy.**

---

## 💰 Financial Invariants

### F1. Currency Precision
**Invariant:** All currency amounts MUST use exact decimal arithmetic (never floating-point).

**Why it matters:**
- Floating-point errors compound over thousands of transactions
- Financial regulations require exact calculations
- $0.01 errors multiply to material discrepancies

**Implementation requirements:**
- ✅ Use `Decimal` types (JavaScript: decimal.js, Python: Decimal, Go: big.Float)
- ❌ Never use `number` or `float64` for currency
- ✅ Store currency as integers (cents) when possible
- ✅ Round explicitly (never implicitly)

**Example violation:**
```typescript
// ❌ WRONG - Floating point error
const total = 0.1 + 0.2; // 0.30000000000000004

// ✅ CORRECT - Exact decimal
import Decimal from 'decimal.js';
const total = new Decimal(0.1).plus(0.2); // 0.3
```

**Testing requirement:**
- All financial calculations must have unit tests with edge cases:
  - Very small amounts (0.01)
  - Very large amounts (999,999,999.99)
  - Precision edge cases (0.1 + 0.2 === 0.3)

---

### F2. Transaction Immutability
**Invariant:** Once a transaction is recorded, its financial attributes (amount, date, ID) MUST NOT be modified.

**Why it matters:**
- Audit trails require immutable history
- Reconciliation depends on stable transaction identities
- Regulatory compliance (SOX, GDPR) mandates auditability

**Permitted operations:**
- ✅ Add metadata (tags, notes, classifications)
- ✅ Create new transaction versions (event sourcing)
- ❌ Modify amount, date, or ID of existing transaction

**Implementation:**
- Use `readonly` or `const` for transaction core fields
- Event sourcing for state changes (store deltas, not mutations)

**Example:**
```typescript
// ✅ CORRECT - Immutable transaction
interface Transaction {
  readonly id: string;
  readonly amount: Decimal;
  readonly date: string;
  metadata: Record<string, unknown>; // ← mutable OK
}

// ❌ WRONG - Mutable amount
transaction.amount = new Decimal(200); // Violation!

// ✅ CORRECT - Create new version
const correctedTransaction = {
  ...transaction,
  id: generateNewId(),
  amount: new Decimal(200),
  metadata: {
    ...transaction.metadata,
    correctionOf: transaction.id,
  },
};
```

---

### F3. Balance Preservation
**Invariant:** Reconciliation MUST NOT create or destroy value.

**Formula:**
```
Sum(source transactions) - Sum(target transactions) =
  Sum(unmatched source) - Sum(unmatched target)
```

**Why it matters:**
- Reconciliation is a **matching** operation, not a **transformation**
- Financial systems must conserve value
- Discrepancies indicate data issues, not algorithmic errors

**Testing requirement:**
```typescript
// Every reconciliation must pass this assertion
function assertBalancePreserved(result: ReconcileResponse) {
  const sourceTotal = sum(result.source);
  const targetTotal = sum(result.target);
  const unmatchedSourceTotal = sum(result.unmatched.source);
  const unmatchedTargetTotal = sum(result.unmatched.target);

  const initialDiff = sourceTotal.minus(targetTotal);
  const finalDiff = unmatchedSourceTotal.minus(unmatchedTargetTotal);

  assert(initialDiff.equals(finalDiff), 'Balance not preserved!');
}
```

**Allowed discrepancies:**
- Different totals between source and target (pre-existing difference)
- Rounding differences if documented and bounded (e.g., ±0.01)

**Disallowed:**
- Dropping transactions without recording as unmatched
- Double-counting transactions in matches
- Creating phantom transactions

---

### F4. Idempotency
**Invariant:** Running the same reconciliation twice MUST produce identical results.

**Formula:**
```
reconcile(S, T, rules) === reconcile(S, T, rules)
```

**Why it matters:**
- Users may retry operations on failure
- Scheduled jobs may run concurrently
- Idempotency prevents duplicate matches

**Implementation requirements:**
- ✅ Deterministic matching algorithm (same input → same output)
- ✅ Stable sorting (transaction order doesn't affect results)
- ❌ No randomness, timestamps, or external state in matching logic

**Edge cases:**
```typescript
// ✅ CORRECT - Deterministic tiebreaker
function selectBestMatch(candidates: Match[]): Match {
  return candidates.sort((a, b) =>
    a.confidence !== b.confidence
      ? b.confidence - a.confidence
      : a.source.id.localeCompare(b.source.id) // ← deterministic tiebreaker
  )[0];
}

// ❌ WRONG - Non-deterministic
function selectBestMatch(candidates: Match[]): Match {
  return candidates[Math.floor(Math.random() * candidates.length)]; // ← random!
}
```

---

### F5. Currency Code Consistency
**Invariant:** All transactions in a single reconciliation MUST use the same currency.

**Why it matters:**
- Cannot compare amounts in different currencies without exchange rates
- Cross-currency reconciliation requires explicit conversion logic

**Enforcement:**
- ✅ Validate all transactions have same currency code before reconciliation
- ❌ Do not attempt to match transactions with different currencies

**Example:**
```typescript
function validateCurrencyConsistency(transactions: Transaction[]) {
  const currencies = new Set(transactions.map(t => t.currency));
  if (currencies.size > 1) {
    throw new Error(
      `Mixed currencies detected: ${Array.from(currencies).join(', ')}. ` +
      `Convert to single currency before reconciliation.`
    );
  }
}
```

**Multi-currency reconciliation:**
- User must convert to base currency first
- Document exchange rates and conversion timestamps
- Reconcile converted amounts (not original amounts)

---

## 📊 Data Integrity Invariants

### D1. Transaction Uniqueness
**Invariant:** Each transaction within a dataset MUST have a unique identifier.

**Why it matters:**
- Prevents duplicate matching
- Enables unambiguous references
- Required for audit trails

**Enforcement:**
```typescript
function validateUniqueIds(transactions: Transaction[], label: string) {
  const ids = transactions.map(t => t.id);
  const uniqueIds = new Set(ids);

  if (ids.length !== uniqueIds.size) {
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    throw new Error(
      `Duplicate transaction IDs in ${label}: ${duplicates.join(', ')}`
    );
  }
}
```

**Composite IDs:**
- If provider doesn't provide IDs, create deterministic composite keys
- Example: `${timestamp}_${amount}_${description}` (hash if needed)

---

### D2. Required Fields
**Invariant:** Every transaction MUST have `id`, `amount`, and `date` fields.

**Why it matters:**
- Matching algorithms depend on these fields
- Financial reporting requires amounts and dates
- Traceability requires IDs

**Validation:**
```typescript
interface Transaction {
  id: string;         // Required, non-empty
  amount: Decimal;    // Required, must be numeric
  date: string;       // Required, ISO 8601 format (YYYY-MM-DD)
  [key: string]: unknown;  // Additional fields allowed
}

function validateTransaction(t: Transaction) {
  if (!t.id || t.id.trim() === '') {
    throw new Error('Transaction ID is required');
  }
  if (t.amount === undefined || t.amount === null) {
    throw new Error('Transaction amount is required');
  }
  if (!isValidDate(t.date)) {
    throw new Error(`Invalid date format: ${t.date} (expected YYYY-MM-DD)`);
  }
}
```

**Optional fields:**
- `description`, `metadata`, `currency`, `status` are optional
- Custom fields allowed (e.g., `customerId`, `invoiceNumber`)

---

### D3. Date Format Consistency
**Invariant:** All dates MUST use ISO 8601 format (`YYYY-MM-DD`).

**Why it matters:**
- Prevents ambiguity (is `01/02/2026` Jan 2 or Feb 1?)
- Enables lexicographic sorting
- Timezone-agnostic (dates, not timestamps)

**Validation:**
```typescript
function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
}
```

**Timestamp conversion:**
- If source provides timestamps, extract date component
- Normalize to UTC before extracting date
- Document timezone assumptions

**Example:**
```typescript
// ✅ CORRECT
{ date: '2026-01-24' }

// ❌ WRONG
{ date: '01/24/2026' }  // Ambiguous format
{ date: '2026-01-24T10:30:00Z' }  // Timestamp (use date component only)
```

---

### D4. No Null/Undefined Amounts
**Invariant:** Transaction amounts MUST be explicit numbers, never `null`, `undefined`, `NaN`, or empty string.

**Why it matters:**
- Null amounts break balance preservation
- NaN propagates through calculations
- Financial systems require explicit values

**Validation:**
```typescript
function validateAmount(amount: unknown): Decimal {
  if (amount === null || amount === undefined || amount === '') {
    throw new Error('Transaction amount cannot be null or empty');
  }

  const decimal = new Decimal(amount);

  if (decimal.isNaN()) {
    throw new Error(`Invalid amount: ${amount} (not a number)`);
  }

  return decimal;
}
```

**Zero amounts:**
- ✅ Zero is valid (represents zero-dollar transactions)
- Document business meaning (refunds, adjustments, etc.)

---

## 🔄 Behavioral Invariants

### B1. Deterministic Matching
**Invariant:** Given identical inputs (transactions, rules, configuration), matching MUST produce identical results.

**Why it matters:**
- Users expect consistent behavior
- Enables testing and debugging
- Required for audit compliance

**Sources of non-determinism (forbidden):**
- ❌ Random number generators
- ❌ Current timestamp in matching logic
- ❌ External API calls during matching
- ❌ Concurrent execution order dependencies
- ❌ Hash map iteration order (use sorted data structures)

**Allowed non-determinism:**
- ✅ Job metadata (jobId, timestamps) can be unique
- ✅ Logs and telemetry can include timestamps
- ❌ Matching results themselves must be deterministic

---

### B2. Stable Sorting
**Invariant:** When multiple matches have equal confidence, tiebreaker MUST be deterministic.

**Implementation:**
```typescript
// ✅ CORRECT - Deterministic tiebreaker (lexicographic sort by ID)
matches.sort((a, b) => {
  if (a.confidence !== b.confidence) {
    return b.confidence - a.confidence;  // Higher confidence first
  }
  // Tiebreaker: source ID, then target ID
  const sourceCompare = a.source.id.localeCompare(b.source.id);
  if (sourceCompare !== 0) return sourceCompare;
  return a.target.id.localeCompare(b.target.id);
});

// ❌ WRONG - Unstable sort
matches.sort((a, b) => b.confidence - a.confidence); // Equal confidence → undefined order
```

---

### B3. Match Exclusivity
**Invariant:** Each transaction MUST appear in at most one match.

**Formula:**
```
∀ matches m1, m2: m1 ≠ m2 ⇒
  (m1.source ≠ m2.source) ∧ (m1.target ≠ m2.target)
```

**Why it matters:**
- One-to-one matching prevents double-counting
- Many-to-many matching requires explicit user configuration

**Implementation:**
```typescript
function validateMatchExclusivity(matches: MatchedPair[]) {
  const sourceIds = new Set<string>();
  const targetIds = new Set<string>();

  for (const match of matches) {
    if (sourceIds.has(match.source.id)) {
      throw new Error(`Source transaction ${match.source.id} matched multiple times`);
    }
    if (targetIds.has(match.target.id)) {
      throw new Error(`Target transaction ${match.target.id} matched multiple times`);
    }
    sourceIds.add(match.source.id);
    targetIds.add(match.target.id);
  }
}
```

**Many-to-many exception:**
- If user explicitly configures many-to-many matching
- Must document and validate business rules
- Ensure balance preservation still holds

---

### B4. Completeness
**Invariant:** Every transaction MUST appear in exactly one category: matched, unmatched source, or unmatched target.

**Formula:**
```
∀ transaction t:
  (t ∈ matched.sources) XOR (t ∈ unmatched.source) XOR
  (t ∈ matched.targets) XOR (t ∈ unmatched.target)
```

**Validation:**
```typescript
function validateCompleteness(
  sourceTransactions: Transaction[],
  targetTransactions: Transaction[],
  result: ReconcileResponse
) {
  const matchedSourceIds = new Set(result.matched.map(m => m.source.id));
  const unmatchedSourceIds = new Set(result.unmatched.source.map(t => t.id));

  for (const txn of sourceTransactions) {
    const inMatched = matchedSourceIds.has(txn.id);
    const inUnmatched = unmatchedSourceIds.has(txn.id);

    if (!inMatched && !inUnmatched) {
      throw new Error(`Transaction ${txn.id} not in results`);
    }
    if (inMatched && inUnmatched) {
      throw new Error(`Transaction ${txn.id} in both matched and unmatched`);
    }
  }

  // Repeat for target transactions
}
```

---

## 🏗️ Terminology Invariants

### T1. Consistent Naming
**Invariant:** Use consistent terminology across code, docs, and UI.

**Canonical terms:**

| Concept | Term | NOT |
|---------|------|-----|
| Input datasets | `source` and `target` | `left`/`right`, `A`/`B`, `from`/`to` |
| Paired transactions | `matched` or `match` | `reconciled`, `linked`, `paired` |
| Unpaired transactions | `unmatched` | `exceptions`, `discrepancies`, `outliers` |
| Matching algorithm | `reconciliation` | `comparison`, `matching`, `pairing` |
| Confidence score | `confidence` (0.0 to 1.0) | `score`, `probability`, `certainty` |
| Transaction record | `transaction` | `record`, `entry`, `item` |
| Reconciliation job | `job` or `reconciliation` | `task`, `process`, `run` |

**Why it matters:**
- Reduces cognitive load
- Improves discoverability
- Prevents misunderstandings

---

### T2. Source vs Target Semantics
**Invariant:** `source` and `target` are interchangeable labels, not directional.

**What this means:**
- ❌ Do NOT assume `source` is "correct" and `target` is "to be validated"
- ✅ Both datasets are equal peers in reconciliation
- ✅ User assigns semantic meaning (e.g., "payment processor" vs "accounting system")

**Example:**
```typescript
// ✅ CORRECT - Symmetric language
const result = reconcile({
  source: stripeTransactions,
  target: quickbooksTransactions,
});

// Also valid (reversed):
const result = reconcile({
  source: quickbooksTransactions,
  target: stripeTransactions,
});

// Results should be interpretable either way
```

---

### T3. Reconciliation vs Sync
**Invariant:** "Reconciliation" finds differences. "Sync" propagates changes.

**Definitions:**
- **Reconciliation:** Read-only comparison that identifies matches and discrepancies
- **Sync:** Write operation that updates one system to match another

**Settler scope:**
- ✅ Reconciliation (this is what Settler does)
- ❌ Sync (out of scope, user responsibility)

**Why the distinction matters:**
- Reconciliation is safe (read-only, no side effects)
- Sync is dangerous (modifies data, requires permissions)
- Users must explicitly implement sync logic (Settler doesn't auto-update systems)

---

## 🔒 Governance Invariants

### G1. Open Source Stability
**Invariant:** OSS protocol types MUST remain backward-compatible.

**Versioning:**
- Major version bump (v1 → v2) allows breaking changes
- Minor/patch versions (v1.0 → v1.1) must be backward-compatible

**Backward compatibility:**
- ✅ Add optional fields
- ✅ Add new methods
- ❌ Remove fields or methods
- ❌ Change required fields to optional (or vice versa)

---

### G2. Enterprise Guarantees
**Invariant:** Enterprise SLA commitments MUST be met or compensated.

**Guarantees:**
- 99.9% uptime (Enterprise tier) → downtime credits if violated
- P95 latency < 200ms → performance monitoring and alerts
- 24/7 support response → SLA violations trigger escalation

**Compensation:**
- Downtime credits calculated monthly
- Proactive notification if SLA at risk

---

## ✅ Testing Requirements

**Every invariant must have:**
1. **Unit tests** - Positive cases (invariant holds)
2. **Negative tests** - Violations are detected and rejected
3. **Edge case tests** - Boundary conditions (very large amounts, empty datasets, etc.)
4. **Integration tests** - End-to-end workflows preserve invariants

**Example test suite:**
```typescript
describe('Financial Invariants', () => {
  test('F1: Currency precision - no floating point errors', () => {
    const result = new Decimal(0.1).plus(0.2);
    expect(result.toString()).toBe('0.3');
  });

  test('F3: Balance preservation', () => {
    const result = reconcile(source, target);
    assertBalancePreserved(result);
  });

  test('F4: Idempotency', () => {
    const result1 = reconcile(source, target, rules);
    const result2 = reconcile(source, target, rules);
    expect(result1).toEqual(result2);
  });
});
```

---

## 🚨 Violation Response

**If an invariant is violated:**

1. **Severity: Critical** - All invariant violations are P0 bugs
2. **Response time:**
   - Financial invariants (F*): Fix within 24 hours
   - Data integrity (D*): Fix within 48 hours
   - Behavioral (B*): Fix within 1 week
   - Terminology (T*): Fix within 1 month
3. **Root cause analysis:** Required for all violations
4. **Prevention:** Add tests to prevent regression

---

## 🔗 Related Documentation

- **[OSS_VS_ENTERPRISE_BOUNDARY.md](./OSS_VS_ENTERPRISE_BOUNDARY.md)** - OSS/Enterprise boundaries
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[STACK_AGNOSTICITY.md](./STACK_AGNOSTICITY.md)** - Provider-agnostic design

---

**This document is binding.** All Settler implementations (OSS and Enterprise) must uphold these invariants.

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
