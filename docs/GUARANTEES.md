# Settler OSS Guarantees & Non-Guarantees

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Status:** Engineering Specification

---

## Purpose

This document explicitly defines what Settler **does guarantee** and what it **does not guarantee**. This clarity protects users from incorrect assumptions and protects maintainers from implied liability.

**Target Audience:** Finance engineers, auditors, legal teams, operations staff

**Key Principle:** Engineering truth over marketing language. No hedging, no promises we cannot keep.

---

## ✅ Guaranteed Properties

These properties are **binding commitments**. Violations constitute critical bugs and will be addressed immediately.

---

### G1. Deterministic Rule Evaluation

**Guarantee:** Given identical inputs (transactions, rules, configuration), reconciliation produces identical outputs (matches, unmatched lists).

**Scope:**
- Applies to: Reconciliation matching logic
- Versions: All Settler versions (OSS and Cloud)
- Conditions: Same transaction order, same rules, same tolerance settings

**What This Means:**
- Running reconciliation twice produces same results
- No randomness in matching algorithm
- No dependence on execution time
- No dependence on external state

**What This Does NOT Mean:**
- Job metadata (jobId, timestamps) will be identical
- Execution time will be identical
- Network latency will be identical
- Log messages will be byte-for-byte identical

**Testing:**
```typescript
const result1 = reconcile(source, target, rules);
const result2 = reconcile(source, target, rules);
assert.deepEqual(result1.matched, result2.matched);
assert.deepEqual(result1.unmatched, result2.unmatched);
```

**Exceptions:** None. This is absolute.

---

### G2. Idempotent Reconciliation Operations

**Guarantee:** Running the same reconciliation operation multiple times has the same effect as running it once.

**Scope:**
- Applies to: Reconciliation API calls (Cloud), reconciliation function calls (OSS)
- Versions: All versions
- Conditions: Same input data, same job configuration

**What This Means:**
- Safe to retry on failure
- Safe to run in scheduled jobs
- No side effects accumulate

**What This Does NOT Mean:**
- API call count is not duplicated (you still consume quota)
- Job history shows multiple executions
- Performance cost is not multiplied (retries still cost compute)

**Testing:**
```typescript
const result = reconcile(source, target);
// Retry should produce identical result
const retryResult = reconcile(source, target);
assert.deepEqual(result, retryResult);
```

**Exceptions:** None. This is absolute.

---

### G3. Balance Preservation

**Guarantee:** Reconciliation does not create or destroy value. The sum of unmatched transactions equals the sum of input differences.

**Scope:**
- Applies to: All reconciliation operations
- Versions: All versions
- Conditions: Numeric amounts, same currency

**Formula:**
```
Sum(source) - Sum(target) = Sum(unmatchedSource) - Sum(unmatchedTarget)
```

**What This Means:**
- No transactions "disappear"
- No phantom transactions created
- Input totals preserved in output totals

**What This Does NOT Mean:**
- Input data is financially correct (we don't validate correctness)
- Matched pairs have identical amounts (tolerance may allow small differences)
- All transactions will be matched (discrepancies are expected)

**Testing:**
```typescript
const sourceSum = sum(source.map(t => t.amount));
const targetSum = sum(target.map(t => t.amount));
const unmatchedSourceSum = sum(result.unmatchedSource.map(t => t.amount));
const unmatchedTargetSum = sum(result.unmatchedTarget.map(t => t.amount));

assert.equal(
  sourceSum - targetSum,
  unmatchedSourceSum - unmatchedTargetSum
);
```

**Exceptions:** Rounding differences up to ±0.01 when using tolerance bands (documented).

---

### G4. Transaction Immutability

**Guarantee:** Input transaction data is never modified by Settler.

**Scope:**
- Applies to: All SDK and API operations
- Versions: All versions
- Conditions: Always

**What This Means:**
- Original transaction objects unchanged
- No in-place mutation
- Audit trail integrity maintained

**What This Does NOT Mean:**
- Settler creates no copies (internal copies may be created)
- Matched pairs are references to originals (may be copies)
- Memory usage is minimized (immutability has cost)

**Testing:**
```typescript
const originalSource = deepClone(source);
const result = reconcile(source, target);
assert.deepEqual(source, originalSource); // Unchanged
```

**Exceptions:** None. Input data is read-only.

---

### G5. Currency Precision (Cloud)

**Guarantee:** All currency calculations use exact decimal arithmetic (no floating point).

**Scope:**
- Applies to: Settler Cloud reconciliation engine
- Versions: Cloud platform (proprietary)
- Conditions: Always

**What This Means:**
- 0.1 + 0.2 = 0.3 (exactly)
- No floating point rounding errors
- Financial precision guaranteed

**What This Does NOT Mean:**
- **OSS demo code uses this** (OSS demo uses JavaScript `number` type)
- Exchange rates are exact (not applicable, Settler doesn't convert currencies)
- User-provided amounts are validated for precision (user responsibility)

**Testing:**
```typescript
// Cloud only
const result = new Decimal('0.1').plus('0.2');
assert.equal(result.toString(), '0.3'); // Exact
```

**Exceptions:**
- **OSS demo reconciliation uses JavaScript `number` type** (floating point)
- Users implementing own engine must use Decimal library
- Protocol type definition uses `number` (for compatibility)

**Action Required:**
- OSS users: Use Decimal.js or equivalent when implementing reconciliation
- Cloud users: Precision guaranteed by platform

---

### G6. Protocol Backward Compatibility (Minor Versions)

**Guarantee:** Minor and patch version updates do not break existing integrations.

**Scope:**
- Applies to: Protocol types (packages/protocol)
- Versions: Within same major version (e.g., 1.x.x)
- Conditions: Semantic versioning rules followed

**What This Means:**
- New optional fields may be added
- New methods may be added
- Existing fields remain unchanged
- Existing methods remain compatible

**What This Does NOT Mean:**
- Major version updates are backward compatible (breaking changes allowed)
- Cloud API versions are guaranteed forever (deprecation possible with notice)
- Third-party implementations are compatible (only official SDK guaranteed)

**Versioning Rules:**
- `1.2.3 → 1.2.4`: Patch (bug fixes only, no API changes)
- `1.2.3 → 1.3.0`: Minor (new features, backward compatible)
- `1.2.3 → 2.0.0`: Major (breaking changes allowed)

**Exceptions:** Security vulnerabilities may require breaking changes in patch versions (rare, documented).

---

### G7. Match Exclusivity

**Guarantee:** Each transaction appears in at most one match (one-to-one matching).

**Scope:**
- Applies to: Default reconciliation behavior
- Versions: All versions
- Conditions: Unless explicitly configured otherwise

**What This Means:**
- No transaction matched multiple times
- Unambiguous match results
- No double-counting

**What This Does NOT Mean:**
- Many-to-many matching is impossible (can be configured explicitly)
- Split transactions are automatically handled (user must split upstream)

**Testing:**
```typescript
const sourceIds = new Set(result.matched.map(m => m.source.id));
const targetIds = new Set(result.matched.map(m => m.target.id));
assert.equal(sourceIds.size, result.matched.length); // No duplicates
assert.equal(targetIds.size, result.matched.length); // No duplicates
```

**Exceptions:** Explicitly configured many-to-many matching (advanced, opt-in).

---

### G8. Completeness (No Lost Transactions)

**Guarantee:** Every input transaction appears exactly once in output (either matched or unmatched).

**Scope:**
- Applies to: All reconciliation operations
- Versions: All versions
- Conditions: Always

**What This Means:**
- No transactions silently dropped
- All inputs accounted for in outputs
- Audit trail complete

**What This Does NOT Mean:**
- All transactions will be matched (unmatched is valid outcome)
- Transaction counts match between source and target (expected to differ)

**Testing:**
```typescript
const inputCount = source.length + target.length;
const outputCount =
  result.matched.length * 2 + // Matched pairs count twice
  result.unmatchedSource.length +
  result.unmatchedTarget.length;
assert.equal(inputCount, outputCount);
```

**Exceptions:** None. This is absolute.

---

### G9. Type Safety (TypeScript SDK)

**Guarantee:** SDK provides accurate TypeScript type definitions.

**Scope:**
- Applies to: TypeScript/Node.js SDK (packages/sdk)
- Versions: All versions
- Conditions: TypeScript strict mode

**What This Means:**
- Compile-time type checking available
- IntelliSense/autocomplete works correctly
- Runtime type validation for protocol fields

**What This Does NOT Mean:**
- Runtime type safety guaranteed (users can bypass with `any`)
- Business logic correctness guaranteed (types don't validate business rules)
- Type safety in other languages (Python/Go/Ruby SDKs use their type systems)

**Testing:**
```typescript
// This should fail TypeScript compilation:
const request: ReconcileRequest = {
  source: "invalid", // Type error: expected Transaction[]
  target: [],
};
```

**Exceptions:** Optional fields may be `undefined` at runtime.

---

## ❌ Explicit Non-Guarantees

These properties are **explicitly NOT guaranteed**. Users must not rely on them.

---

### N1. Financial Correctness of Input Data

**Not Guaranteed:** Settler does not validate that input transaction amounts, dates, or IDs are financially correct.

**Why:** Settler is a matching tool, not an accounting validation system.

**User Responsibility:**
- Validate data quality upstream (ETL pipelines)
- Verify amounts match expected totals
- Check for duplicate IDs before reconciliation
- Ensure dates are accurate

**What Can Go Wrong:**
- Incorrect amounts in source systems propagate to reconciliation
- Duplicate IDs cause matching errors
- Invalid dates cause matching failures

**Mitigation:**
- Implement data quality checks before calling Settler
- Use Settler to **find** discrepancies, not to **validate** correctness
- Human review of reconciliation results

---

### N2. Regulatory Compliance

**Not Guaranteed:** Settler does not guarantee compliance with SOX, PCI-DSS, GDPR, HIPAA, or other regulations.

**Why:** Settler is a tool, not a compliance solution.

**User Responsibility:**
- Implement controls required by your regulatory framework
- Consult legal and compliance teams
- Conduct required audits
- Implement data retention policies
- Obtain necessary certifications

**What Can Go Wrong:**
- Assuming Settler use alone satisfies compliance requirements
- Failing to implement required controls (access logs, encryption, etc.)
- Storing PII without proper consent

**Mitigation:**
- Use Settler as one component of compliance strategy
- Implement required controls in your infrastructure
- Cloud users: Review Settler Cloud compliance certifications (SOC 2)

---

### N3. Fraud Detection

**Not Guaranteed:** Settler does not detect fraudulent transactions or anomalous patterns.

**Why:** Fraud detection requires specialized algorithms and risk models.

**User Responsibility:**
- Implement dedicated fraud detection systems
- Monitor for unusual patterns
- Review high-value or suspicious transactions manually

**What Can Go Wrong:**
- Fraudulent transactions matched as legitimate
- Anomalies not flagged
- Patterns of fraud not detected

**Mitigation:**
- Use fraud detection tools separately
- Review unmatched transactions for fraud indicators
- Implement transaction amount thresholds for manual review

---

### N4. Real-Time Processing

**Not Guaranteed:** Settler does not guarantee real-time or low-latency reconciliation.

**Why:** Reconciliation is a batch operation, not a streaming process.

**User Responsibility:**
- Design workflows for batch processing
- Set appropriate expectations with stakeholders
- Implement alerting for delayed reconciliations

**What Can Go Wrong:**
- Expecting sub-second reconciliation results
- Using reconciliation in real-time payment flows (incorrect use case)

**Mitigation:**
- Use reconciliation for end-of-day or periodic batch jobs
- For real-time needs, use event-driven architectures separately
- Cloud users: Check API SLA for typical response times

---

### N5. Data Quality Validation

**Not Guaranteed:** Settler does not validate data quality, completeness, or accuracy.

**Why:** Data quality is context-dependent and requires business logic.

**User Responsibility:**
- Validate required fields are present
- Check for expected data ranges
- Verify data completeness (all expected records present)
- Implement business rule validation

**What Can Go Wrong:**
- Missing transactions not detected
- Out-of-range amounts not flagged
- Data schema changes break reconciliation

**Mitigation:**
- Implement data quality checks in ETL
- Monitor transaction counts over time
- Alert on unexpected data patterns

---

### N6. Availability (OSS Self-Hosted)

**Not Guaranteed:** OSS does not include high availability, disaster recovery, or uptime guarantees.

**Why:** OSS provides code, not managed infrastructure.

**User Responsibility:**
- Implement HA architecture if required
- Set up backups and disaster recovery
- Monitor system health
- Plan for maintenance windows

**What Can Go Wrong:**
- Single point of failure causes downtime
- Data loss without backups
- No failover during outages

**Mitigation:**
- Use Cloud for managed availability (99.9% SLA)
- Self-hosted: Implement standard HA patterns (load balancing, replicas, backups)

---

### N7. Performance at Scale

**Not Guaranteed:** OSS demo reconciliation is not optimized for large datasets.

**Why:** Demo code is for education, not production use at scale.

**User Responsibility:**
- Test performance with expected data volumes
- Optimize reconciliation logic for your use case
- Use Cloud for production-scale workloads

**What Can Go Wrong:**
- O(n²) complexity causes slow performance
- Memory exhaustion with large datasets
- Timeout failures

**Mitigation:**
- Use Cloud for production (optimized engine)
- Self-hosted: Implement batching, indexing, and optimization
- Test with realistic data volumes before production

---

### N8. Currency Conversion

**Not Guaranteed:** Settler does not convert between currencies.

**Why:** Currency conversion requires exchange rates and business logic.

**User Responsibility:**
- Convert all amounts to single currency before reconciliation
- Document exchange rates and conversion timestamps
- Handle multi-currency scenarios upstream

**What Can Go Wrong:**
- Comparing USD to EUR amounts without conversion (invalid)
- Incorrect exchange rates used
- Stale exchange rates cause discrepancies

**Mitigation:**
- Validate currency consistency before reconciliation (F5 invariant)
- Use currency conversion service upstream
- Document conversion methodology

---

### N9. Auditability (OSS Self-Hosted)

**Not Guaranteed:** OSS does not include audit logging or compliance reporting.

**Why:** Audit requirements vary by organization and regulation.

**User Responsibility:**
- Implement audit logging in your infrastructure
- Store reconciliation results for required retention period
- Implement access controls and change tracking
- Generate compliance reports

**What Can Go Wrong:**
- No record of who ran reconciliations
- No change history for reconciliation rules
- Cannot prove compliance during audit

**Mitigation:**
- Use Cloud for built-in audit logging
- Self-hosted: Implement logging, access control, and retention policies

---

### N10. Support & SLA (OSS)

**Not Guaranteed:** OSS does not include support, bug fix timelines, or SLAs.

**Why:** OSS is provided "as is" under MIT license.

**User Responsibility:**
- Community support via GitHub Discussions
- Enterprise support requires Cloud subscription
- Self-support for self-hosted deployments

**What Can Go Wrong:**
- Critical bugs not fixed immediately
- Breaking changes in major versions
- No guaranteed response time

**Mitigation:**
- Use Cloud for SLA guarantees (Enterprise tier)
- Contribute fixes to OSS if you find bugs
- Fork and maintain your own version if needed

---

### N11. Transaction Validation (Business Rules)

**Not Guaranteed:** Settler does not validate business rules (e.g., "invoices must be paid within 30 days").

**Why:** Business rules are application-specific.

**User Responsibility:**
- Implement business rule validation separately
- Use reconciliation results as input to rule engine
- Flag violations for manual review

**What Can Go Wrong:**
- Policy violations not detected
- Late payments not flagged
- Business constraints not enforced

**Mitigation:**
- Implement business rule engine separately
- Use reconciliation to identify discrepancies, not validate policies

---

### N12. Data Sanitization (PII/PCI)

**Not Guaranteed:** Settler does not automatically redact or sanitize sensitive data.

**Why:** Sanitization requirements vary by regulation and data type.

**User Responsibility:**
- Sanitize PII before sending to Settler
- Redact payment card data if present
- Follow data minimization principles

**What Can Go Wrong:**
- PII sent to Cloud API unnecessarily
- PCI data logged or stored insecurely
- GDPR violations due to over-collection

**Mitigation:**
- Hash or tokenize sensitive fields
- Only send minimum necessary data
- Review what data you send to Settler Cloud

---

## Summary Table

| Property | Guaranteed? | Scope | User Responsibility |
|----------|-------------|-------|---------------------|
| **Deterministic matching** | ✅ Yes | All | Provide same inputs |
| **Idempotency** | ✅ Yes | All | None |
| **Balance preservation** | ✅ Yes | All | Same currency |
| **Immutability** | ✅ Yes | All | None |
| **Decimal precision** | ✅ Cloud only | Cloud | OSS: Use Decimal library |
| **Protocol stability** | ✅ Minor versions | Protocol | Update carefully |
| **Match exclusivity** | ✅ Default | All | Configure if needed |
| **Completeness** | ✅ Yes | All | None |
| **Type safety** | ✅ TypeScript SDK | SDK | Use TypeScript |
| **Financial correctness** | ❌ No | N/A | Validate upstream |
| **Regulatory compliance** | ❌ No | N/A | Implement controls |
| **Fraud detection** | ❌ No | N/A | Separate system |
| **Real-time processing** | ❌ No | N/A | Use batch workflows |
| **Data quality** | ❌ No | N/A | Validate in ETL |
| **Availability (OSS)** | ❌ No | OSS | Implement HA |
| **Performance at scale (OSS)** | ❌ No | OSS | Use Cloud or optimize |
| **Currency conversion** | ❌ No | N/A | Convert upstream |
| **Audit logging (OSS)** | ❌ No | OSS | Implement yourself |
| **Support SLA (OSS)** | ❌ No | OSS | Community or Cloud |
| **Business rule validation** | ❌ No | N/A | Separate rule engine |
| **PII sanitization** | ❌ No | N/A | Sanitize before sending |

---

## How to Use This Document

### For Finance Engineers
- **Do:** Rely on guaranteed properties for production workflows
- **Don't:** Assume non-guaranteed properties will be provided
- **Action:** Implement controls for non-guaranteed properties yourself

### For Auditors
- **Do:** Verify guaranteed properties are tested and enforced
- **Don't:** Expect Settler to provide compliance guarantees
- **Action:** Review user's implementation of non-guaranteed controls

### For Legal Teams
- **Do:** Use this document to understand Settler's scope and limitations
- **Don't:** Rely on Settler alone for regulatory compliance
- **Action:** Ensure user implements required legal and compliance controls

### For Operations Teams
- **Do:** Design workflows around guaranteed properties
- **Don't:** Deploy OSS demo code to production at scale
- **Action:** Use Cloud for production or implement optimization for self-hosted

---

## Document Maintenance

**Review Frequency:** Quarterly or when guarantees change
**Change Process:**
- Guaranteed properties: Requires engineering review and approval
- Non-guarantees: Can be updated as scope clarifies
- Breaking guarantee: Requires major version bump

**Ownership:** Settler Engineering Team
**Approval:** CTO (for material changes to guarantees)

---

## References

- [INVARIANTS.md](./INVARIANTS.md) - Technical invariants that enforce guarantees
- [THREAT_MODEL.md](./THREAT_MODEL.md) - Security guarantees and non-guarantees
- [DETERMINISM.md](./DETERMINISM.md) - Deterministic behavior specification
- [SECURITY.md](../SECURITY.md) - Security policy and responsibilities

---

**This document is binding.** Guaranteed properties are commitments. Non-guarantees are explicit scope boundaries.

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
