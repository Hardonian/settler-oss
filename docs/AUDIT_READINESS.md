# Audit Readiness: Using Settler in Financial Audits

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Status:** Auditor Reference Document

---

## Purpose

This document explains how Settler reconciliation software can be used **within** financial audit workflows. It clarifies what Settler provides, what it does not provide, and how auditors can verify its correctness.

**Target Audience:** External auditors, internal audit teams, compliance officers, SOX reviewers

**Key Principle:** Settler is a tool for evidence generation, not audit conclusion. Auditors exercise judgment; Settler provides reproducible data.

---

## What Settler Is (And Is Not)

### Settler IS:
- ✅ A reconciliation tool that compares two datasets
- ✅ A deterministic matching algorithm (same input → same output)
- ✅ A balance-preserving system (sum of inputs = sum of outputs)
- ✅ An evidence-generation tool (produces matched and unmatched lists)
- ✅ Auditable (OSS code is open-source, behavior is documented)

### Settler is NOT:
- ❌ An audit system (does not determine compliance or correctness)
- ❌ An accounting system (does not maintain general ledger)
- ❌ A fraud detection system (does not identify fraudulent transactions)
- ❌ A compliance certification tool (does not guarantee SOX, GAAP, etc.)
- ❌ A decision-making system (does not determine "correct" values)

**Conclusion:** Settler provides data. Auditors provide judgment.

---

## Settler's Role in Audit Workflows

### Typical Audit Use Case

**Scenario:** Auditor needs to verify that payment processor transactions reconcile with accounting system records.

**Without Settler:**
1. Export transactions from payment processor (e.g., Stripe)
2. Export transactions from accounting system (e.g., QuickBooks)
3. Manually compare in spreadsheet or custom script
4. Identify matches and discrepancies
5. Investigate unmatched items
6. Document findings

**With Settler:**
1. Export transactions from both systems
2. Run Settler reconciliation (CLI or API)
3. Settler produces:
   - Matched pairs (transactions that correspond)
   - Unmatched source (payment processor transactions with no match)
   - Unmatched target (accounting system transactions with no match)
   - Summary statistics (counts, totals, balance difference)
4. Auditor reviews reconciliation results
5. Auditor investigates unmatched items
6. Auditor documents findings

**Value added:**
- Reproducibility (can re-run and get same results)
- Speed (automated matching vs manual comparison)
- Transparency (matching logic is documented)
- Auditability (can verify Settler's behavior)

---

## What Settler Provides to Auditors

### 1. Deterministic Behavior

**Guarantee:** Same inputs produce same outputs.

**Why it matters:**
- Auditors can re-run reconciliation and verify results
- No randomness or unpredictability
- Results are reproducible across time and systems

**How to verify:**
```bash
# Run reconciliation twice with same data
settler reconcile --source payments.csv --target invoices.csv > result1.json
settler reconcile --source payments.csv --target invoices.csv > result2.json

# Compare results (should be identical)
diff result1.json result2.json
# Expected output: (no differences)
```

**See [DETERMINISM.md](./DETERMINISM.md) for technical specification.**

---

### 2. Balance Preservation

**Guarantee:** Reconciliation does not create or destroy value.

**Formula:**
```
Sum(source transactions) - Sum(target transactions) =
  Sum(unmatched source) - Sum(unmatched target)
```

**Why it matters:**
- Ensures all value is accounted for
- Detects if transactions were dropped or duplicated
- Financial integrity check

**How to verify:**
```typescript
// Auditor can verify this formula holds
const sourceTotal = sum(sourceTransactions.map(t => t.amount));
const targetTotal = sum(targetTransactions.map(t => t.amount));
const unmatchedSourceTotal = sum(result.unmatched.source.map(t => t.amount));
const unmatchedTargetTotal = sum(result.unmatched.target.map(t => t.amount));

const initialDiff = sourceTotal - targetTotal;
const finalDiff = unmatchedSourceTotal - unmatchedTargetTotal;

assert(initialDiff === finalDiff, "Balance not preserved!");
```

**See [GUARANTEES.md](./GUARANTEES.md#g3-balance-preservation) for details.**

---

### 3. Completeness

**Guarantee:** Every transaction appears exactly once in output (matched or unmatched).

**Why it matters:**
- No transactions are silently dropped
- Auditors can trace every input to an output
- Audit trail is complete

**How to verify:**
```
Input count = source.length + target.length
Output count = (matched.length × 2) + unmatched.source.length + unmatched.target.length

Input count MUST equal Output count
```

**Example:**
```
Source: 100 transactions
Target: 95 transactions
Total input: 195 transactions

Matched: 90 pairs (= 180 transactions)
Unmatched source: 10 transactions
Unmatched target: 5 transactions
Total output: 180 + 10 + 5 = 195 ✅
```

---

### 4. Transaction Immutability

**Guarantee:** Input transaction data is never modified.

**Why it matters:**
- Original data is preserved for audit trail
- No risk of data corruption during reconciliation
- Can trace back to source systems

**How to verify:**
```typescript
// Hash input data before reconciliation
const inputHash = hash(JSON.stringify(sourceTransactions));

// Run reconciliation
const result = reconcile(sourceTransactions, targetTransactions);

// Verify input data unchanged
const outputHash = hash(JSON.stringify(sourceTransactions));
assert(inputHash === outputHash, "Input data was modified!");
```

---

### 5. Traceability

**What Settler provides:**
- Matched pairs include **both** source and target transaction
- Unmatched lists include full transaction details
- Summary statistics include counts and totals

**What this enables:**
- Auditors can trace any match back to source data
- Unmatched items can be investigated in source systems
- No "black box" matching (logic is documented)

**Example matched pair:**
```json
{
  "source": {
    "id": "stripe_ch_abc123",
    "amount": 100.00,
    "date": "2026-01-15",
    "description": "Customer payment"
  },
  "target": {
    "id": "qb_inv_456",
    "amount": 100.00,
    "date": "2026-01-15",
    "description": "Invoice #456"
  },
  "confidence": 1.0
}
```

---

## What Auditors Must Verify Themselves

Settler provides data, but auditors must verify:

### 1. Input Data Quality

**Auditor responsibility:**
- ✅ Verify source data is complete (all transactions exported)
- ✅ Verify target data is complete
- ✅ Check for duplicate transaction IDs
- ✅ Validate amounts are accurate
- ✅ Ensure dates are correct
- ✅ Confirm currency consistency

**Settler does NOT:**
- Validate that input data is financially correct
- Detect missing transactions (if not in input, can't be matched)
- Verify amounts against external sources

---

### 2. Configuration Appropriateness

**Auditor responsibility:**
- ✅ Review tolerance settings (e.g., ±$0.01 for amount matching)
- ✅ Review date range settings (e.g., ±1 day for date matching)
- ✅ Verify matching rules align with business requirements
- ✅ Ensure configuration is documented

**Example questions:**
- Is ±$0.01 tolerance appropriate for this business?
- Should date tolerance be 0 days (exact) or allow ±1 day?
- Are custom matching fields correctly configured?

**Settler does NOT:**
- Determine "correct" tolerance settings (business decision)
- Validate that rules match company policy

---

### 3. Unmatched Transaction Investigation

**Auditor responsibility:**
- ✅ Review unmatched source transactions (payments with no invoice match)
- ✅ Review unmatched target transactions (invoices with no payment match)
- ✅ Investigate root causes (timing, errors, fraud, etc.)
- ✅ Determine if unmatched items are acceptable or require action

**Settler does NOT:**
- Determine why transactions are unmatched (requires business context)
- Classify unmatched items (legitimate vs error vs fraud)
- Recommend corrective actions

---

### 4. Match Validity

**Auditor responsibility:**
- ✅ Sample matched pairs and verify correctness
- ✅ Review low-confidence matches (confidence < 1.0)
- ✅ Investigate edge cases (equal amounts, same date, different descriptions)
- ✅ Determine if matches are financially correct

**Settler provides:**
- Confidence score (0.0 to 1.0) indicating match quality
- Matching logic (documented rules)

**Settler does NOT:**
- Guarantee matched pairs are "correct" (follows rules, not business logic)
- Exercise business judgment

---

## Audit Verification Procedures

### Procedure 1: Verify Determinism

**Objective:** Confirm reconciliation is reproducible.

**Steps:**
1. Obtain input data (source and target transaction exports)
2. Run reconciliation: `settler reconcile --source source.csv --target target.csv --output result1.json`
3. Re-run with same inputs: `settler reconcile --source source.csv --target target.csv --output result2.json`
4. Compare results: `diff result1.json result2.json`
5. **Expected outcome:** No differences (results are identical)

**If test fails:**
- Reconciliation is non-deterministic (violates guarantee)
- Report as critical finding
- Do not rely on Settler results until fixed

---

### Procedure 2: Verify Balance Preservation

**Objective:** Confirm no value is created or destroyed.

**Steps:**
1. Calculate sum of source transaction amounts: `SUM(source.amount)`
2. Calculate sum of target transaction amounts: `SUM(target.amount)`
3. Calculate initial difference: `initialDiff = sourceSum - targetSum`
4. Run reconciliation
5. Calculate sum of unmatched source: `SUM(result.unmatched.source.amount)`
6. Calculate sum of unmatched target: `SUM(result.unmatched.target.amount)`
7. Calculate final difference: `finalDiff = unmatchedSourceSum - unmatchedTargetSum`
8. **Expected outcome:** `initialDiff === finalDiff` (within rounding tolerance, e.g., ±$0.01)

**If test fails:**
- Balance preservation violated (critical bug)
- Results cannot be trusted
- Investigate root cause before proceeding

---

### Procedure 3: Verify Completeness

**Objective:** Confirm all transactions are accounted for.

**Steps:**
1. Count source transactions: `source.length`
2. Count target transactions: `target.length`
3. Count matched pairs: `result.matched.length` (each pair represents 2 transactions)
4. Count unmatched source: `result.unmatched.source.length`
5. Count unmatched target: `result.unmatched.target.length`
6. **Expected outcome:** `source.length + target.length === (matched.length × 2) + unmatched.source.length + unmatched.target.length`

**If test fails:**
- Transactions are missing or duplicated
- Results are incomplete
- Do not rely on results until resolved

---

### Procedure 4: Verify Configuration Documentation

**Objective:** Ensure reconciliation rules are documented and appropriate.

**Steps:**
1. Request reconciliation configuration file or settings
2. Review tolerance settings (amount, date)
3. Review custom matching rules (if any)
4. Verify configuration aligns with company policy
5. Document configuration in audit workpapers
6. **Expected outcome:** Configuration is documented, reasonable, and approved

**If test fails:**
- Configuration is undocumented or inappropriate
- Results may be unreliable
- Require management to document and approve configuration

---

### Procedure 5: Sample Testing of Matched Pairs

**Objective:** Verify matched transactions are correctly paired.

**Steps:**
1. Select sample of matched pairs (e.g., 25 matches)
2. For each match:
   - Verify source and target amounts match (within tolerance)
   - Verify dates match (within date range)
   - Verify descriptions are consistent (if used in matching)
   - Trace back to source systems to confirm correctness
3. **Expected outcome:** Sample matches are valid and correct

**If test fails:**
- Matching logic may be flawed
- Configuration may be inappropriate
- Investigate failed matches and root cause

---

## Evidence Retention

### What to Preserve for Audit Trail

**Required documentation:**
1. **Input data** (source and target transaction exports)
   - Format: CSV, JSON, or database export
   - Timestamp of export
   - Source system version

2. **Reconciliation configuration**
   - Tolerance settings
   - Date range settings
   - Custom matching rules
   - Settler version used

3. **Reconciliation results**
   - Matched pairs list
   - Unmatched source list
   - Unmatched target list
   - Summary statistics

4. **Verification evidence**
   - Determinism test results (diff output)
   - Balance preservation calculation
   - Completeness check
   - Sample testing workpapers

5. **Investigation notes**
   - Unmatched item root causes
   - Discrepancy resolutions
   - Approvals and sign-offs

**Retention period:**
- Follow company record retention policy
- Typical: 7 years for financial records
- SOX: Retain audit evidence per compliance requirements

---

## OSS vs Cloud Audit Considerations

### OSS (Self-Hosted) Audit Approach

**Advantages:**
- ✅ Full source code available for review
- ✅ Can audit matching logic directly
- ✅ No dependence on external service
- ✅ Complete control over data (never leaves infrastructure)

**Disadvantages:**
- ❌ No built-in audit logging (must implement yourself)
- ❌ No access controls (must implement yourself)
- ❌ No historical job retention (must implement yourself)
- ❌ Auditor must review code or trust implementation

**Audit steps:**
1. Review OSS source code (or engage third-party code review)
2. Verify guarantees hold (determinism, balance preservation, completeness)
3. Test with sample data
4. Request user's implementation of audit logging and access controls
5. Verify data retention and backup procedures

---

### Cloud (SaaS) Audit Approach

**Advantages:**
- ✅ Built-in audit logging (Enterprise tier)
- ✅ Access controls (RBAC)
- ✅ Historical job retention
- ✅ SOC 2 Type II report available (Enterprise)

**Disadvantages:**
- ❌ Reconciliation engine is proprietary (closed-source)
- ❌ Must trust Settler's attestations (cannot review engine code)
- ❌ Data sent to external service (privacy considerations)

**Audit steps:**
1. Obtain SOC 2 Type II report (Enterprise tier)
2. Review audit logs (who ran reconciliations, when, what data)
3. Verify access controls (segregation of duties)
4. Test API behavior with sample data (determinism, balance preservation)
5. Review data handling and security practices (TLS, encryption at rest)
6. Verify data retention and export capabilities

---

## Common Audit Findings

### Finding 1: Undocumented Configuration

**Issue:** Reconciliation tolerance and rules not documented.

**Risk:** Results cannot be reproduced or verified.

**Remediation:**
- Document tolerance settings (amount, date range)
- Document custom matching rules
- Store configuration in version control
- Require approval for configuration changes

---

### Finding 2: No Verification of Settler Guarantees

**Issue:** Auditor accepted reconciliation results without verifying Settler's behavior.

**Risk:** Non-deterministic or incorrect matching undetected.

**Remediation:**
- Perform determinism test (re-run with same data)
- Verify balance preservation formula
- Check completeness (all transactions accounted for)
- Document verification procedures in audit program

---

### Finding 3: Unmatched Items Not Investigated

**Issue:** Large number of unmatched transactions, no investigation documented.

**Risk:** Errors, fraud, or discrepancies undetected.

**Remediation:**
- Establish threshold for investigation (e.g., >5% unmatched or >$10,000 total)
- Investigate root causes (timing, data quality, fraud)
- Document findings and resolutions
- Implement corrective actions if needed

---

### Finding 4: Inappropriate Tolerance Settings

**Issue:** Tolerance too loose (e.g., ±$10), causing false matches.

**Risk:** Incorrect matches, undetected discrepancies.

**Remediation:**
- Review tolerance settings with finance team
- Justify tolerance based on business requirements
- Tighten tolerance if appropriate (e.g., ±$0.01 for payment processing)
- Sample test matches to verify appropriateness

---

### Finding 5: No Audit Trail

**Issue:** Reconciliation results not retained, cannot trace back to source data.

**Risk:** Audit trail incomplete, compliance violation (SOX).

**Remediation:**
- Implement retention policy (input data, configuration, results)
- Store reconciliation results with timestamp and user ID
- Cloud: Use built-in audit logging (Enterprise tier)
- OSS: Implement custom audit logging

---

## Auditor Checklist

Use this checklist when auditing reconciliations performed with Settler:

### Pre-Audit
- [ ] Obtain reconciliation configuration (tolerance, date range, rules)
- [ ] Obtain input data (source and target transaction exports)
- [ ] Obtain reconciliation results (matched, unmatched, summary)
- [ ] Verify Settler version used (OSS or Cloud, version number)

### Verification Tests
- [ ] Verify determinism (re-run produces same results)
- [ ] Verify balance preservation (sum of inputs = sum of outputs)
- [ ] Verify completeness (all transactions accounted for)
- [ ] Verify immutability (input data unchanged)

### Sample Testing
- [ ] Select sample of matched pairs (e.g., 25 items)
- [ ] Verify sample matches are correct (amount, date, description)
- [ ] Trace sample to source systems

### Unmatched Items
- [ ] Review unmatched source transactions
- [ ] Review unmatched target transactions
- [ ] Verify investigation of material unmatched items
- [ ] Review resolutions and approvals

### Documentation
- [ ] Verify configuration is documented
- [ ] Verify audit trail is complete (input, config, results)
- [ ] Verify retention policy is followed
- [ ] Document verification procedures in workpapers

### OSS-Specific (if applicable)
- [ ] Review OSS source code or third-party audit
- [ ] Verify user implementation of audit logging
- [ ] Verify user implementation of access controls
- [ ] Verify backup and disaster recovery procedures

### Cloud-Specific (if applicable)
- [ ] Obtain SOC 2 Type II report
- [ ] Review audit logs (access, usage, changes)
- [ ] Verify RBAC configuration (segregation of duties)
- [ ] Verify data retention and export capabilities

---

## Limitations of Settler in Audit Context

**Settler cannot:**
- ❌ Determine if transactions are "correct" (requires business judgment)
- ❌ Detect fraud (not a fraud detection system)
- ❌ Validate compliance with accounting standards (GAAP, IFRS)
- ❌ Replace human review (reconciliation is evidence, not conclusion)
- ❌ Guarantee data quality (garbage in, garbage out)

**Auditors must:**
- ✅ Verify input data quality
- ✅ Exercise professional judgment
- ✅ Investigate unmatched items
- ✅ Determine if results are acceptable
- ✅ Document findings and conclusions

---

## Regulatory Compliance Considerations

### SOX (Sarbanes-Oxley) Compliance

**Settler's role:**
- Provides deterministic, reproducible reconciliation
- Supports audit trail requirements (if configured properly)
- Does **not** guarantee SOX compliance on its own

**Additional requirements:**
- Internal controls over financial reporting (ICFR)
- Segregation of duties
- Management assertions
- External auditor attestation
- Documentation and retention

**See [ADVERSARIAL_FAQ.md](./ADVERSARIAL_FAQ.md#q11-does-using-settler-satisfy-sox-compliance) for details.**

---

### GAAP/IFRS Compliance

**Settler does not:**
- Perform accounting (no journal entries, no general ledger)
- Validate accounting treatment (revenue recognition, expense classification)
- Generate financial statements

**Settler provides:**
- Evidence for reconciliation procedures (required by GAAP/IFRS)
- Traceability for transaction matching
- Documentation for audit trail

---

## Conclusion

Settler is a **tool for auditors**, not a replacement for auditors.

**What Settler provides:**
- Deterministic, reproducible reconciliation
- Balance preservation guarantee
- Completeness guarantee
- Traceability and audit trail

**What auditors provide:**
- Professional judgment
- Investigation of unmatched items
- Verification of data quality
- Assessment of compliance

**Recommended approach:**
1. Use Settler to automate matching (saves time)
2. Verify Settler's guarantees hold (determinism, balance, completeness)
3. Review configuration for appropriateness
4. Investigate unmatched items
5. Document findings and conclusions

**Result:** Faster, more reproducible audit procedures with appropriate auditor oversight.

---

## References

- [GUARANTEES.md](./GUARANTEES.md) - Settler's binding guarantees
- [DETERMINISM.md](./DETERMINISM.md) - Reproducibility specification
- [INVARIANTS.md](./INVARIANTS.md) - Financial and data integrity invariants
- [THREAT_MODEL.md](./THREAT_MODEL.md) - Security boundaries
- [ADVERSARIAL_FAQ.md](./ADVERSARIAL_FAQ.md) - Hard questions about Settler
- [LONG_TERM_SUPPORT.md](./LONG_TERM_SUPPORT.md) - Compatibility policy

---

**This document is for auditors, not marketing.** Settler is a useful tool when used appropriately. Auditors must verify, not trust.

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
