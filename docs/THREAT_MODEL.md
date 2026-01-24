# Settler OSS Threat Model

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Status:** Engineering Specification

---

## Purpose

This document defines the threat model for Settler OSS reconciliation software. It identifies assets, trust boundaries, threat actors, attack scenarios, and security controls. This model serves auditors, security engineers, and operators deploying Settler in production environments.

---

## Assets

### Primary Assets

**1. Transaction Data**
- **Description:** Financial transaction records (amounts, dates, IDs, metadata)
- **Confidentiality:** May contain sensitive business data
- **Integrity:** Critical for accurate reconciliation
- **Availability:** Required for reconciliation operations

**2. Matching Logic & Rules**
- **Description:** Configuration defining how transactions match
- **Confidentiality:** May reveal business logic
- **Integrity:** Incorrect rules produce incorrect matches
- **Availability:** Required for reconciliation operations

**3. Reconciliation Results**
- **Description:** Matched pairs and unmatched transaction lists
- **Confidentiality:** Reveals discrepancies and business patterns
- **Integrity:** Must accurately reflect matching outcomes
- **Availability:** Required for operational decisions

### Secondary Assets

**4. API Keys (Cloud Users)**
- **Description:** Authentication credentials for Settler Cloud API
- **Confidentiality:** Compromise allows unauthorized API access
- **Integrity:** Not applicable
- **Availability:** Required for Cloud API access

**5. System Configuration**
- **Description:** Tolerance settings, adapter configurations
- **Confidentiality:** Low
- **Integrity:** Incorrect configuration produces incorrect results
- **Availability:** Required for operations

---

## Trust Boundaries

### Boundary 1: User Application ↔ Settler SDK

**Description:** The interface between user code and Settler client libraries

**Trust Assumptions:**
- User application is responsible for input validation
- Settler SDK assumes inputs conform to protocol types
- User application is responsible for securing API keys
- Settler SDK does not validate business logic correctness

**Controls:**
- SDK validates protocol-level requirements (required fields, data types)
- SDK does not execute arbitrary code from inputs
- SDK uses HTTPS for Cloud API communication

### Boundary 2: Settler SDK ↔ Settler Cloud API

**Description:** The network boundary between client SDK and Cloud platform

**Trust Assumptions:**
- Cloud API authenticates requests via API keys
- Transport layer security (TLS) prevents eavesdropping
- Cloud API validates all inputs before processing
- SDK trusts Cloud API responses

**Controls:**
- TLS 1.3 encryption for all API traffic
- API key authentication
- Input validation at API gateway
- Rate limiting per API key

### Boundary 3: User Data ↔ Settler Processing

**Description:** The boundary where user-provided transaction data enters Settler logic

**Trust Assumptions:**
- Settler does NOT validate upstream data quality
- Settler does NOT verify financial correctness
- Settler processes data as-provided
- User remains responsible for data accuracy

**Controls:**
- Type validation (required fields present)
- Format validation (date format, numeric amounts)
- No execution of user-provided code
- No modification of transaction core fields

### Boundary 4: OSS Code ↔ Proprietary Code

**Description:** The separation between open-source and proprietary components

**Trust Assumptions:**
- OSS code is publicly auditable
- Proprietary reconciliation engine is closed-source
- OSS users can audit SDK behavior
- Cloud users trust proprietary engine correctness

**Controls:**
- Import boundary enforcement (OSS cannot import proprietary)
- Clear licensing and scope documentation
- Public audit trail for OSS changes

---

## Threat Actors

### Actor 1: Misconfigured User (Unintentional)

**Capability:** Low to Medium
**Motivation:** None (accidental)
**Access:** Legitimate API/SDK access

**Threat Scenarios:**
- Incorrect tolerance settings produce false matches
- Missing required fields cause reconciliation failure
- Mixed currencies compared without conversion
- Upstream data quality issues misinterpreted as Settler bugs

**Impact:**
- Incorrect reconciliation results
- Operational confusion
- Missed discrepancies

### Actor 2: Malicious Input Provider (Intentional)

**Capability:** Medium
**Motivation:** Data manipulation, fraud, disruption
**Access:** Control over input transaction data

**Threat Scenarios:**
- Inject malformed data to crash reconciliation
- Provide negative amounts to manipulate balance calculations
- Inject duplicate IDs to cause matching errors
- Provide NaN/null values to break processing
- Extremely large datasets to cause resource exhaustion

**Impact:**
- Denial of service (processing failure)
- Incorrect matching results
- Resource exhaustion

### Actor 3: Compromised API Key (Cloud)

**Capability:** Medium to High
**Motivation:** Unauthorized access, data theft
**Access:** Valid API key obtained through theft/leak

**Threat Scenarios:**
- Exfiltrate reconciliation results via API
- Exhaust API quota to cause denial of service
- Submit reconciliation jobs to probe business patterns
- Access historical reconciliation data

**Impact:**
- Data confidentiality breach
- Financial cost (API quota exhaustion)
- Business intelligence leak

### Actor 4: Supply Chain Attacker

**Capability:** High
**Motivation:** Code injection, data theft, disruption
**Access:** Compromise of npm packages or dependencies

**Threat Scenarios:**
- Malicious dependency exfiltrates API keys
- Compromised SDK sends transaction data to attacker
- Backdoor in SDK modifies reconciliation results
- Dependency vulnerability exploited at runtime

**Impact:**
- Credential theft
- Data exfiltration
- System compromise

### Actor 5: Internal Operator Error (Self-Hosted)

**Capability:** High
**Motivation:** None (operational error)
**Access:** Full system access (self-hosted deployment)

**Threat Scenarios:**
- Database misconfiguration loses reconciliation history
- Incorrect deployment exposes sensitive data
- Disabled TLS allows traffic interception
- Weak access controls allow unauthorized access

**Impact:**
- Data loss
- Confidentiality breach
- Service disruption

---

## Attack Scenarios

### Scenario 1: Data Injection Attack

**Attacker:** Malicious Input Provider
**Objective:** Cause reconciliation failure or incorrect results

**Attack Steps:**
1. Provide transactions with malformed amounts (e.g., `amount: "DROP TABLE"`)
2. SDK passes data to reconciliation logic
3. If unvalidated, could cause processing error

**Settler Protection:**
- SDK validates amount is numeric
- Type checking rejects non-numeric amounts
- No SQL/NoSQL injection vectors (no database queries with user input)

**User Responsibility:**
- Validate data before sending to Settler
- Sanitize upstream data sources

**Residual Risk:** LOW (SDK validates types, no code execution)

### Scenario 2: Balance Manipulation

**Attacker:** Malicious Input Provider
**Objective:** Create false matches or hide discrepancies

**Attack Steps:**
1. Provide duplicate transaction IDs
2. Provide negative amounts to offset positive amounts
3. Manipulate dates to force matches

**Settler Protection:**
- Balance preservation invariant (sum of inputs = sum of outputs)
- Duplicate ID detection and rejection
- No transaction modification (immutability)

**User Responsibility:**
- Validate transaction uniqueness upstream
- Review unmatched transactions for anomalies

**Residual Risk:** LOW (balance preservation enforced, duplicates rejected)

### Scenario 3: API Key Compromise (Cloud)

**Attacker:** Compromised API Key holder
**Objective:** Data theft or quota exhaustion

**Attack Steps:**
1. Obtain API key from leaked .env file or git history
2. Use key to call reconciliation API
3. Exfiltrate results or exhaust quota

**Settler Protection:**
- API key scoping (read-only vs read-write)
- Rate limiting per key
- Audit logging of API usage

**User Responsibility:**
- Store API keys in environment variables or secrets manager
- Never commit API keys to version control
- Rotate keys regularly
- Monitor API usage for anomalies

**Residual Risk:** MEDIUM (depends on user key management practices)

### Scenario 4: Floating Point Precision Attack

**Attacker:** Malicious Input Provider
**Objective:** Exploit floating point rounding to hide discrepancies

**Attack Steps:**
1. Provide amounts that exploit floating point rounding (e.g., 0.1 + 0.2 = 0.30000000000004)
2. Reconciliation matches amounts that should not match
3. Small discrepancies accumulate over thousands of transactions

**Settler Protection (Cloud):**
- Uses Decimal arithmetic (exact precision)
- No floating point math for currency

**Settler Risk (OSS Protocol):**
- Protocol type definition uses `number` (JavaScript floating point)
- Demo reconciliation uses JavaScript `Math.abs()` on numbers
- Users implementing own engine must use Decimal types

**User Responsibility:**
- Use Decimal types when implementing reconciliation logic
- Validate Cloud results if using production engine
- Test with edge cases (0.1 + 0.2 === 0.3)

**Residual Risk:** MEDIUM (OSS demo code uses floats, Cloud uses Decimal)

### Scenario 5: Dependency Vulnerability

**Attacker:** Supply Chain Attacker
**Objective:** Compromise SDK users via malicious dependency

**Attack Steps:**
1. Compromise an npm dependency used by Settler SDK
2. Inject code to exfiltrate API keys or transaction data
3. Publish malicious version to npm

**Settler Protection:**
- Minimal dependencies in SDK packages
- Automated dependency scanning (Dependabot)
- Lock files (package-lock.json) pin exact versions
- Regular security audits

**User Responsibility:**
- Run `npm audit` before deploying
- Review dependency updates
- Use lock files in production
- Monitor for security advisories

**Residual Risk:** MEDIUM (inherent to npm ecosystem)

### Scenario 6: Time-Based Manipulation

**Attacker:** Misconfigured User or Malicious Input
**Objective:** Force matches by manipulating date fields

**Attack Steps:**
1. Set all transaction dates to same value
2. Reconciliation matches on amount only (date is identical)
3. Incorrect matches occur

**Settler Protection:**
- Date format validation (ISO 8601 required)
- Date range tolerance is explicit configuration
- Deterministic behavior (same dates produce same results)

**User Responsibility:**
- Validate date accuracy upstream
- Review matched pairs for date discrepancies
- Configure appropriate date tolerance

**Residual Risk:** LOW (behavior is deterministic and documented)

---

## What Settler Protects Against

### ✅ Data Integrity During Processing
- **Threat:** Transaction data modified during reconciliation
- **Control:** Immutable transaction objects, no in-place mutation
- **Guarantee:** Input data is never modified by Settler

### ✅ Balance Preservation
- **Threat:** Reconciliation creates or destroys value
- **Control:** Balance preservation invariant (F3)
- **Guarantee:** Sum of unmatched = sum of input differences

### ✅ Deterministic Matching
- **Threat:** Non-reproducible results
- **Control:** No randomness, no timestamps in matching logic
- **Guarantee:** Same inputs produce same outputs

### ✅ Type Safety
- **Threat:** Invalid data types cause runtime errors
- **Control:** TypeScript types, protocol validation
- **Guarantee:** Required fields are present and correct type

### ✅ Transport Security (Cloud)
- **Threat:** Network eavesdropping
- **Control:** TLS 1.3 encryption
- **Guarantee:** API traffic is encrypted in transit

---

## What Settler Does NOT Protect Against

### ❌ Upstream Data Quality
- **Not Protected:** Incorrect amounts, wrong dates, duplicate IDs in source systems
- **User Responsibility:** Validate data quality before reconciliation
- **Why:** Settler is a matching tool, not a data validation service
- **Mitigation:** Implement data quality checks in ETL pipeline

### ❌ Financial Correctness
- **Not Protected:** Fraudulent transactions, accounting errors, regulatory violations
- **User Responsibility:** Human review of reconciliation results
- **Why:** Settler finds differences, does not determine correctness
- **Mitigation:** Use Settler as one input to financial review process

### ❌ Regulatory Compliance
- **Not Protected:** SOX, PCI-DSS, GDPR, HIPAA compliance
- **User Responsibility:** Implement controls to meet regulatory requirements
- **Why:** Settler is a tool, not a compliance solution
- **Mitigation:** Consult compliance officers, implement required controls

### ❌ Fraud Detection
- **Not Protected:** Fraudulent patterns, anomalous transactions
- **User Responsibility:** Implement fraud detection systems separately
- **Why:** Settler matches transactions, does not analyze for fraud
- **Mitigation:** Use dedicated fraud detection tools

### ❌ Data Confidentiality (Self-Hosted)
- **Not Protected:** Encryption at rest, access control, secrets management
- **User Responsibility:** Implement infrastructure security controls
- **Why:** OSS provides code, not infrastructure
- **Mitigation:** Follow security best practices for self-hosted deployments

### ❌ Availability (Self-Hosted)
- **Not Protected:** Uptime, disaster recovery, backups
- **User Responsibility:** Implement HA/DR architecture
- **Why:** OSS does not include managed infrastructure
- **Mitigation:** Use Cloud for managed availability, or implement HA yourself

### ❌ Currency Conversion
- **Not Protected:** Multi-currency reconciliation
- **User Responsibility:** Convert to single currency before reconciliation
- **Why:** Exchange rates require external data and business logic
- **Mitigation:** Use currency conversion service before calling Settler

### ❌ Authorization (Who Can Reconcile What)
- **Not Protected:** Role-based access control, tenant isolation
- **User Responsibility:** Implement access control in your application
- **Why:** SDK is stateless, no concept of users/roles
- **Mitigation:** Cloud provides RBAC, self-hosted users implement own

---

## Failure Modes

### Failure 1: Partial Data Loss (Input)

**Scenario:** Only subset of transactions provided to reconciliation
**Detection:** Summary counts (totalSource, totalTarget) lower than expected
**Impact:** Missed matches, false unmatched reports
**Mitigation:** Validate transaction counts before and after reconciliation

### Failure 2: Clock Skew (Date Misalignment)

**Scenario:** Source and target systems have different timezones or clock drift
**Detection:** High number of unmatched transactions with date discrepancies
**Impact:** Legitimate matches missed due to date mismatch
**Mitigation:** Normalize dates to UTC, configure date tolerance, document timezone assumptions

### Failure 3: Currency Mismatch

**Scenario:** Transactions in different currencies compared without conversion
**Detection:** Amount mismatches on otherwise identical transactions
**Impact:** Incorrect unmatched reports
**Mitigation:** Validate currency consistency (F5 invariant), convert before reconciliation

### Failure 4: Tolerance Misconfiguration

**Scenario:** Tolerance too loose (false matches) or too strict (missed matches)
**Detection:** Unexpected match/unmatch patterns
**Impact:** Incorrect reconciliation results
**Mitigation:** Test with known good dataset, review matched confidence scores

### Failure 5: API Key Leak (Cloud)

**Scenario:** API key committed to git, logged to console, or exposed via error
**Detection:** Unusual API activity, geographic anomalies, quota exhaustion
**Impact:** Unauthorized API access, data breach, financial cost
**Mitigation:** Rotate key immediately, audit API logs, implement key detection in CI/CD

---

## Security Controls Summary

| Control | OSS | Cloud | Effectiveness |
|---------|-----|-------|---------------|
| **Type validation** | ✅ SDK | ✅ API | High |
| **Balance preservation** | ✅ Invariant | ✅ Enforced | High |
| **Immutability** | ✅ Protocol | ✅ Enforced | High |
| **TLS encryption** | ✅ HTTPS | ✅ Required | High |
| **API authentication** | N/A | ✅ API Keys | Medium |
| **Rate limiting** | N/A | ✅ Per-key | Medium |
| **Input sanitization** | ⚠️ Partial | ✅ Full | Medium |
| **Dependency scanning** | ✅ Automated | ✅ Automated | Medium |
| **Audit logging** | ❌ No | ✅ Full | High (Cloud) |
| **Access control** | ❌ No | ✅ RBAC | Medium (Cloud) |
| **Encryption at rest** | ❌ User responsibility | ✅ AES-256 | High (Cloud) |

---

## Deployment Scenarios

### Self-Hosted (OSS)

**Trust Model:** User controls all components
**Threats:** Infrastructure misconfiguration, operational errors, supply chain
**Mitigations:** Follow security best practices, audit OSS code, minimal dependencies

**Recommended Controls:**
- Network segmentation and firewalls
- Encryption at rest for data stores
- Secrets management (Vault, AWS Secrets Manager)
- Regular security patching
- Monitoring and alerting

### Cloud (SaaS)

**Trust Model:** Settler controls infrastructure, user controls data and API keys
**Threats:** API key compromise, insider threat (Settler), cloud provider compromise
**Mitigations:** API key rotation, audit logs, compliance certifications (SOC 2)

**Recommended Controls:**
- API key environment variable storage
- Regular key rotation
- Monitor API usage patterns
- Review audit logs
- Use read-only keys where possible

---

## Threat Model Maintenance

**Review Frequency:** Quarterly or after significant changes
**Review Triggers:**
- New feature releases
- Security incidents
- Regulatory changes
- Architectural changes

**Ownership:** Settler Engineering + Security team
**Approval:** Security Lead, CTO (for material changes)

---

## References

- [SECURITY.md](../SECURITY.md) - Security policy and vulnerability reporting
- [INVARIANTS.md](./INVARIANTS.md) - Financial and data integrity invariants
- [GUARANTEES.md](./GUARANTEES.md) - System guarantees and non-guarantees
- [DETERMINISM.md](./DETERMINISM.md) - Deterministic behavior specification

---

**This is an engineering document.** It describes threats objectively without creating fear or overstating risks. Settler is a reconciliation tool that, when used appropriately, provides deterministic matching with strong data integrity guarantees.

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
