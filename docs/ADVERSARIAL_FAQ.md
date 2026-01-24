# Adversarial FAQ: Hard Questions About Settler OSS

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Status:** External Review Document

---

## Purpose

This document answers the hard questions that auditors, CFOs, risk officers, and external reviewers ask when evaluating Settler for institutional use.

**Target Audience:** External evaluators, procurement teams, compliance officers, auditors

**Tone:** Conservative, honest, technical. No marketing language. If the answer is "no," we say no.

---

## Financial & Accounting Questions

### Q1: Can I trust this for financial reporting?

**No.** Settler is a **matching tool**, not an accounting system.

**What Settler does:**
- Compares two datasets of transactions
- Identifies which transactions match based on configurable rules
- Reports unmatched transactions
- Preserves balance (sum of inputs = sum of outputs)

**What Settler does NOT do:**
- Validate that transactions are financially correct
- Perform accounting journal entries
- Generate GAAP/IFRS-compliant reports
- Replace your accounting system
- Guarantee regulatory compliance

**How to use Settler safely:**
- Use it as **input** to financial review, not the final authority
- Human review of reconciliation results is required
- Validate data quality before and after reconciliation
- Maintain audit trail of reconciliation decisions

**Conclusion:** Settler is one tool in your financial workflow. It finds differences. You decide what to do with them.

---

### Q2: Is this a replacement for QuickBooks/NetSuite/SAP?

**No.** Absolutely not.

**Settler is NOT:**
- An accounting system (no general ledger, no chart of accounts)
- An ERP system (no inventory, no procurement)
- A reporting system (no financial statements, no GAAP compliance)
- A payment processor (no money movement)

**Settler IS:**
- A reconciliation SDK (client libraries for building reconciliation workflows)
- A matching tool (compares datasets, identifies matches/discrepancies)
- Developer tooling (protocol types, CLI for local development)

**Where Settler fits:**
- Between your payment processor and your accounting system
- Between your e-commerce platform and your bank statements
- Between any two systems that need to be reconciled

**Example workflow:**
```
Payment Processor → Settler (reconcile) → Accounting System
     (Stripe)          (find discrepancies)    (QuickBooks)
```

**Conclusion:** Settler connects systems. It does not replace them.

---

### Q3: What happens when data is incomplete or wrong?

**Settler processes data as-provided.** It does not validate financial correctness.

**Garbage in, garbage out:**
- If input amounts are wrong, matches will be wrong
- If transaction IDs are duplicated, matching will fail
- If dates are malformed, date-based matching won't work
- If currencies are mixed (USD and EUR), results are invalid

**Your responsibility:**
- Validate data quality **before** sending to Settler
- Check for duplicate IDs
- Ensure amounts are accurate
- Verify dates are in ISO 8601 format (YYYY-MM-DD)
- Convert all amounts to a single currency

**What Settler detects:**
- Missing required fields (id, amount, date)
- Invalid data types (non-numeric amounts, malformed dates)
- Duplicate transaction IDs (rejected)

**What Settler does NOT detect:**
- Incorrect amounts (no way to know what's "correct")
- Fraudulent transactions (not a fraud detection system)
- Missing transactions (if not in input, can't be matched)
- Accounting errors (not an accounting validator)

**Conclusion:** Implement data quality checks upstream. Settler is a tool, not a safety net.

---

### Q4: Who is liable if reconciliation is incorrect?

**You are.** Settler provides software tools. You remain responsible for financial decisions.

**Legal clarity:**
- Settler OSS is MIT licensed: provided "as is," no warranty
- Settler Cloud terms include liability limitations (see SaaS agreement)
- **You** are responsible for:
  - Validating input data
  - Reviewing reconciliation results
  - Making financial decisions based on results
  - Regulatory compliance
  - Audit readiness

**What this means in practice:**
- If Settler matches transactions incorrectly due to bad data → **your responsibility**
- If Settler has a software bug that violates a guarantee (see GUARANTEES.md) → **our responsibility** (we fix it)
- If you use reconciliation results without human review and make a bad decision → **your responsibility**

**Enterprise customers:**
- Cloud Enterprise tier includes SLA guarantees
- Covered: uptime, performance, support response time
- Not covered: business decisions, data quality, regulatory compliance

**Conclusion:** Settler is a tool. You are the operator. Liability follows responsibility.

---

### Q5: How does this differ from vendor-specific reconciliation tools?

**Settler is a development toolkit, not a managed service** (unless you use Settler Cloud).

**Comparison to vendor tools:**

| Feature | Settler OSS | Vendor Tools (e.g., Stripe Dashboard) |
|---------|-------------|---------------------------------------|
| **Scope** | Multi-system reconciliation | Single vendor ecosystem |
| **Control** | Full control over matching logic | Vendor-defined logic only |
| **Data** | Bring your own data | Vendor data only |
| **Hosting** | Self-hosted or Cloud | Vendor-hosted only |
| **Cost** | Free (MIT) or Cloud tiers | Usually bundled with vendor fees |
| **Integration** | Build your own | Pre-built for vendor ecosystem |
| **Customization** | Full customization | Limited to vendor's options |

**When to use vendor tools:**
- Single vendor reconciliation (e.g., Stripe dashboard for Stripe-only)
- No custom logic needed
- Prefer managed solution

**When to use Settler:**
- Multi-system reconciliation (Stripe → QuickBooks, Shopify → Xero, etc.)
- Custom matching rules required
- Need programmatic access (API/SDK)
- Want to self-host or control infrastructure

**Conclusion:** Settler is for developers building reconciliation workflows. Vendor tools are for single-vendor use cases.

---

### Q6: Why should I trust this project long-term?

**You should verify, not trust.**

**Trust indicators:**
- ✅ Open-source (MIT license) - you can audit the code
- ✅ Clear guarantees (see GUARANTEES.md) - explicit commitments
- ✅ Transparent threat model (see THREAT_MODEL.md) - honest about risks
- ✅ Deterministic behavior (see DETERMINISM.md) - reproducible results
- ✅ Test coverage - guarantees are tested

**Trust risks:**
- ⚠️ Small team - maintainer availability may vary
- ⚠️ No legal entity backing OSS (MIT = no warranty)
- ⚠️ Community support only (OSS tier) - no SLA
- ⚠️ Backward compatibility not guaranteed across major versions

**Mitigation strategies:**
- **Fork it** - MIT license allows you to maintain your own version
- **Audit it** - review the code before deploying to production
- **Test it** - verify guarantees hold for your data
- **Use Cloud** - if you need SLA, support, and managed infrastructure
- **Contribute** - improve the project and reduce dependency risk

**Long-term support:**
- OSS: Community support, best effort
- Cloud: Commercial support with SLA (Enterprise tier)
- See [LONG_TERM_SUPPORT.md](./LONG_TERM_SUPPORT.md) for details

**Conclusion:** Settler is auditable and forkable. Trust is earned through transparency, not promises.

---

## Technical & Implementation Questions

### Q7: What happens if I have millions of transactions?

**OSS demo code will be too slow.** Use Settler Cloud or optimize your own implementation.

**Performance characteristics:**

| Dataset Size | OSS Demo | Settler Cloud |
|--------------|----------|---------------|
| < 1,000 txns | Works fine | Overkill |
| 1,000 - 10,000 | Slow (O(n²)) | Fast (optimized) |
| 10,000 - 100,000 | Very slow | Fast |
| > 100,000 | Not recommended | Designed for this |

**OSS demo limitations:**
- Naive O(n²) matching algorithm (every source vs every target)
- No indexing or optimization
- JavaScript single-threaded execution
- Intended for demos and local development only

**Production options:**
1. **Use Settler Cloud** - optimized engine, handles millions of transactions
2. **Optimize your own** - implement indexing, batching, parallel processing
3. **Batch processing** - split large datasets into smaller chunks

**Conclusion:** OSS demo is for learning. Production scale requires Cloud or custom optimization.

---

### Q8: Can I run this offline / air-gapped?

**Yes (OSS only).** Settler Cloud requires internet connectivity.

**OSS offline capabilities:**
- ✅ SDK packages can be installed locally (npm/pnpm cache)
- ✅ Protocol types are fully local
- ✅ CLI tool works offline (local reconciliation)
- ✅ No external API calls required for basic matching

**Air-gapped deployment:**
1. Download and cache npm packages
2. Run reconciliation logic locally
3. No telemetry or phone-home behavior (verify in code)

**Cloud requires internet:**
- ❌ Settler Cloud API requires HTTPS connectivity
- ❌ Managed adapters fetch data from providers (Stripe, Shopify, etc.)
- ❌ Cannot use Cloud in air-gapped environments

**Conclusion:** OSS works offline. Cloud requires internet. Choose based on your environment.

---

### Q9: How does Settler handle sensitive financial data?

**OSS:** You control data. It never leaves your infrastructure.
**Cloud:** Data is sent to Settler Cloud API (see security policy).

**OSS data handling:**
- Data stays on your servers
- No network calls to external services (unless you use adapters)
- You control encryption, access, retention
- Audit the code to verify (it's open-source)

**Cloud data handling:**
- Data sent to Settler API over TLS 1.3
- Encrypted at rest (AES-256)
- Encrypted in transit (TLS)
- SOC 2 Type II compliance (Enterprise tier)
- See [SECURITY.md](../SECURITY.md) for details

**PII considerations:**
- Settler does **not** automatically redact PII
- **Your responsibility:** Hash, tokenize, or exclude sensitive fields before sending
- Example: Send transaction amount and date, exclude customer names

**Regulatory compliance:**
- Settler does **not** guarantee GDPR, PCI-DSS, HIPAA compliance
- **Your responsibility:** Implement required controls
- Cloud: SOC 2 compliance available (not PCI-DSS)

**Conclusion:** OSS = full control. Cloud = trust Settler's security posture. Either way, you sanitize data before reconciliation.

---

### Q10: What if Settler Cloud shuts down?

**You can migrate to self-hosted OSS.**

**Exit strategy:**
- ✅ SDK is open-source (MIT) - you own the code
- ✅ Protocol types are open-source - data format is yours
- ✅ You can export reconciliation results and historical data
- ✅ You can implement reconciliation logic yourself using OSS protocol

**What you lose if Cloud shuts down:**
- Managed reconciliation engine (you'd need to build your own)
- Pre-built adapters (Stripe, Shopify, etc.)
- Developer console and monitoring
- Historical job data (export before shutdown)

**Migration path:**
1. Export data from Settler Cloud
2. Fork OSS SDK
3. Implement reconciliation logic or use demo code as starting point
4. Self-host on your infrastructure

**Advance notice:**
- Cloud will provide at least **90 days notice** before shutdown
- Data export tools will be provided
- Migration support available (Enterprise tier)

**Conclusion:** You are not locked in. OSS ensures portability.

---

## Compliance & Audit Questions

### Q11: Does using Settler satisfy SOX compliance?

**No.** Settler is a tool. SOX compliance requires organizational controls, not just software.

**What SOX requires:**
- Internal controls over financial reporting
- Audit trails and documentation
- Segregation of duties
- Management assertions
- External auditor review

**What Settler provides:**
- Deterministic reconciliation (reproducible results)
- Immutable transaction data (no modification)
- Balance preservation (no value created/destroyed)
- Type safety and validation

**What Settler does NOT provide:**
- Audit logging (OSS) - you must implement
- Access controls - you must implement
- Approval workflows - you must implement
- Management assertions - you must create
- Auditor reports - you must generate

**How to use Settler in SOX-compliant workflow:**
1. Implement audit logging (who ran reconciliation, when, what data)
2. Implement access controls (who can run reconciliations)
3. Store reconciliation results with retention policy
4. Document reconciliation procedures and thresholds
5. Have human review and approval of discrepancies
6. Provide reconciliation evidence to auditors

**Cloud advantage:**
- Settler Cloud includes audit logging (Enterprise tier)
- RBAC for access control
- Historical job retention
- Still requires organizational controls above

**Conclusion:** Settler is one component. SOX compliance requires comprehensive controls.

---

### Q12: Can auditors verify Settler's correctness?

**Yes (OSS).** Code is open-source and auditable.
**Partial (Cloud).** API behavior is documented, engine is proprietary.

**OSS auditability:**
- ✅ Full source code available
- ✅ Guarantees documented (GUARANTEES.md)
- ✅ Test suite verifies guarantees
- ✅ Deterministic behavior (same input → same output)
- ✅ Auditors can review code and tests

**Cloud auditability:**
- ✅ API behavior documented
- ✅ Guarantees apply (same as OSS)
- ✅ SOC 2 audit report available (Enterprise)
- ❌ Reconciliation engine is proprietary (closed-source)
- ⚠️ Auditors must trust attestation, cannot review engine code

**What auditors should verify:**
1. Guarantees hold for sample data (test with known-good dataset)
2. Determinism (same input produces same output)
3. Balance preservation (sum of inputs = sum of outputs)
4. Completeness (all transactions accounted for)
5. Immutability (input data unchanged)

**Audit approach:**
```
1. Select sample reconciliation job
2. Re-run with same inputs
3. Verify results are identical (determinism)
4. Verify balance preservation formula
5. Verify all transactions appear in output (completeness)
```

**Conclusion:** OSS is fully auditable. Cloud requires trust in attestations.

---

### Q13: What if reconciliation results are used in a financial dispute?

**Settler provides evidence, not proof.**

**Legal considerations:**
- Reconciliation results show **what Settler matched**, not what is **legally correct**
- Settler does not determine:
  - Which party is at fault for discrepancies
  - Legal liability for missing transactions
  - Binding resolution of disputes

**How to use Settler in disputes:**
- ✅ Document reconciliation methodology (rules, tolerance, configuration)
- ✅ Preserve input data (source and target transactions)
- ✅ Preserve reconciliation results (matched and unmatched)
- ✅ Show deterministic reproducibility (re-run produces same result)
- ✅ Provide clear audit trail

**What Settler results show:**
- "According to these rules, these transactions matched"
- "These transactions did not match based on configured criteria"
- "The balance difference is X"

**What Settler results do NOT show:**
- "Party A owes Party B this amount" (legal conclusion)
- "Transaction X is fraudulent" (fraud determination)
- "This reconciliation is legally binding" (requires agreement)

**Expert testimony:**
- Settler's methodology can be explained (deterministic, balance-preserving)
- Results are reproducible (same input → same output)
- Expert may need to testify about methodology

**Conclusion:** Settler is evidence-generation, not dispute-resolution. Legal interpretation is separate.

---

## Risk & Limitation Questions

### Q14: What are the biggest risks of using Settler?

**Data quality risk** is #1. Everything else follows.

**Top risks (in order):**

**1. Data Quality (CRITICAL)**
- Risk: Garbage in → garbage out
- Impact: Incorrect matches, missed discrepancies
- Mitigation: Validate data before reconciliation

**2. Misconfiguration**
- Risk: Wrong tolerance settings, wrong date range
- Impact: False matches or missed matches
- Mitigation: Test with known-good data, review matched results

**3. Human Error**
- Risk: Misinterpretation of reconciliation results
- Impact: Wrong financial decisions
- Mitigation: Training, review processes, documentation

**4. Performance (OSS)**
- Risk: Slow reconciliation with large datasets
- Impact: Timeouts, resource exhaustion
- Mitigation: Use Cloud or optimize implementation

**5. Dependency Vulnerabilities**
- Risk: Security vulnerability in npm dependencies
- Impact: Potential compromise
- Mitigation: `npm audit`, Dependabot, lock files

**6. API Key Compromise (Cloud)**
- Risk: Leaked API key
- Impact: Unauthorized access, data breach
- Mitigation: Environment variables, rotation, monitoring

**7. Breaking Changes (Major Versions)**
- Risk: Upgrading to v2.0 breaks existing code
- Impact: Development effort to migrate
- Mitigation: Pin to major version, test before upgrading

**See [THREAT_MODEL.md](./THREAT_MODEL.md) for comprehensive threat analysis.**

**Conclusion:** Data quality is your biggest risk. Technology risks are manageable with best practices.

---

### Q15: What does Settler NOT do that I might expect?

**Settler is narrow in scope.** Here's what's missing:

**NOT included:**
- ❌ Data validation (correctness, fraud detection)
- ❌ Currency conversion (multi-currency support)
- ❌ Approval workflows (manual review UI)
- ❌ Automated sync (updating systems after reconciliation)
- ❌ Business rule validation (policy enforcement)
- ❌ Reporting & dashboards (visualization)
- ❌ Scheduled jobs (OSS) - you implement scheduling
- ❌ Multi-tenant isolation (OSS) - you implement access control
- ❌ Audit logging (OSS) - you implement logging
- ❌ High availability (OSS) - you implement HA/DR

**Included:**
- ✅ Matching algorithm (compare datasets)
- ✅ Protocol types (data format definitions)
- ✅ SDK client libraries (TypeScript/Node.js)
- ✅ CLI tool (local development)
- ✅ Deterministic behavior (reproducible)
- ✅ Balance preservation (financial correctness)

**Cloud adds:**
- ✅ Managed reconciliation engine
- ✅ Pre-built adapters (Stripe, Shopify, etc.)
- ✅ Scheduled jobs
- ✅ Audit logging (Enterprise)
- ✅ Developer console

**Conclusion:** Settler is a matching tool. Everything else is your responsibility.

---

### Q16: How often do things break or change?

**OSS:** Minor/patch versions are backward-compatible. Major versions may have breaking changes.
**Cloud:** API versions are stable, deprecated with advance notice.

**Stability expectations:**

**OSS (Protocol types):**
- `1.0.0 → 1.1.0` (minor) - Backward-compatible (new features, no breaking changes)
- `1.0.0 → 1.0.1` (patch) - Backward-compatible (bug fixes only)
- `1.0.0 → 2.0.0` (major) - **May include breaking changes** (migration guide provided)

**Cloud API:**
- Versioned API endpoints (`/v1/reconcile`, `/v2/reconcile`)
- Old versions supported for **at least 12 months** after deprecation notice
- Advance notice (90 days minimum) for breaking changes
- Migration guides provided

**What might break:**
- Major version upgrades (1.x → 2.x) - planned, documented
- Security patches (rare, documented) - may have breaking changes if critical
- Dependency updates - use lock files to prevent unexpected updates

**What won't break:**
- Minor/patch updates within same major version
- Cloud API within supported version

**Conclusion:** Pin to major version. Test before upgrading. Breaking changes are rare and announced.

---

## Procurement & Operational Questions

### Q17: What happens if we need support and there's a critical bug?

**OSS:** Community support (best effort, no SLA).
**Cloud:** Tiered support with SLA (Enterprise tier).

**OSS support:**
- GitHub Issues - public bug reports
- GitHub Discussions - community Q&A
- Response time: **Best effort** (no guarantee)
- Fix timeline: **No SLA** (depends on severity and maintainer availability)
- Self-service: Fork and fix yourself (MIT license allows this)

**Cloud support tiers:**

| Tier | Response Time | Support Channels | SLA |
|------|---------------|------------------|-----|
| **Free** | Best effort | GitHub Issues | None |
| **Pro** | < 1 business day | Email | 99% uptime |
| **Enterprise** | < 4 hours (P0), < 1 day (P1) | Email, Slack, Phone | 99.9% uptime |

**Critical bug scenarios:**

**OSS:**
1. Report on GitHub Issues
2. Community investigates (best effort)
3. If urgent, fork and patch yourself
4. Consider upgrading to Cloud for support

**Cloud:**
1. Report via support channel (based on tier)
2. Support team investigates (SLA applies)
3. P0 bugs: 4-hour response (Enterprise)
4. Hotfix or workaround provided
5. Root cause analysis post-incident

**Conclusion:** OSS = self-reliance. Cloud = paid support with SLA.

---

### Q18: Can we white-label or rebrand Settler?

**Yes (OSS only).** MIT license allows modification and rebranding.

**OSS white-labeling:**
- ✅ Modify source code
- ✅ Rebrand UI/CLI (change names, logos)
- ✅ Distribute modified version
- ✅ Use in proprietary products
- ⚠️ Must include MIT license attribution (required by license)

**Cloud white-labeling:**
- ❌ Settler Cloud cannot be rebranded
- ❌ SaaS terms do not permit white-labeling
- ⚠️ Enterprise tier: Contact sales for custom branding options (rare, negotiated)

**Example use case:**
- Fork Settler OSS
- Rebrand as "Acme Reconciliation Engine"
- Sell to customers as part of your product
- Include MIT license attribution in docs

**Conclusion:** OSS is fully rebrandable. Cloud is not (except rare Enterprise exceptions).

---

### Q19: What's the total cost of ownership (TCO)?

**OSS:** Free software, but you pay for infrastructure, development, and operations.
**Cloud:** Subscription fees, but no infrastructure or ops burden.

**OSS TCO:**
- Software: **Free** (MIT license)
- Infrastructure: **Your cost** (servers, storage, networking)
- Development: **Your cost** (implementation, optimization, integration)
- Operations: **Your cost** (monitoring, backups, maintenance)
- Support: **Your cost** (in-house expertise or consultants)

**Cloud TCO:**
- Software: **Free tier** (100 transactions/month) or **Paid tiers**
- Infrastructure: **Included** (managed by Settler)
- Development: **Reduced** (SDK + API, no engine development)
- Operations: **Included** (monitoring, backups, HA)
- Support: **Included** (varies by tier)

**When OSS is cheaper:**
- High transaction volumes (Cloud pricing scales with usage)
- Existing infrastructure (already paying for servers)
- In-house expertise (can implement and maintain)

**When Cloud is cheaper:**
- Low transaction volumes (free tier or low-cost Pro)
- No infrastructure (avoid server costs)
- No in-house expertise (avoid hiring/training)
- Time-to-market matters (faster deployment)

**Conclusion:** TCO depends on volume, expertise, and infrastructure. Calculate both options.

---

### Q20: How do we know this isn't abandonware in 2 years?

**You don't.** That's the OSS risk. Mitigate with forking and vendor diversity.

**Abandonment risk factors:**
- ⚠️ Single maintainer or small team
- ⚠️ No commercial backing (OSS project)
- ⚠️ Niche use case (financial reconciliation)

**Mitigation strategies:**

**1. Fork early**
- Clone the repository
- Maintain your own version
- Apply patches and updates as needed
- MIT license allows indefinite forking

**2. Contribute**
- Submit bug fixes and features
- Become a maintainer
- Reduce dependency on original maintainer

**3. Use Cloud**
- Commercial incentive keeps project alive
- SLA guarantees (Enterprise)
- 90-day shutdown notice minimum

**4. Vendor diversity**
- Don't rely solely on Settler
- Keep reconciliation logic swappable
- Abstract Settler behind an interface

**5. Monitor activity**
- Watch GitHub activity (commits, releases, issues)
- Check release frequency
- Join discussions to gauge community health

**Signals of healthy project:**
- ✅ Regular commits and releases
- ✅ Active issue resolution
- ✅ Growing community contributors
- ✅ Commercial usage (Cloud customers)

**Conclusion:** OSS = no long-term guarantee. Fork to own your destiny.

---

## Summary: Should You Use Settler?

### Use Settler if:
- ✅ You need to reconcile data between multiple systems
- ✅ You want programmatic control (API/SDK)
- ✅ You understand and accept the limitations
- ✅ You have data quality processes in place
- ✅ You can implement missing pieces (audit logging, access control, etc.)
- ✅ You value open-source auditability

### Don't use Settler if:
- ❌ You expect it to replace your accounting system
- ❌ You need guaranteed compliance (SOX, PCI, HIPAA) out-of-the-box
- ❌ You cannot validate data quality
- ❌ You need managed support and SLA (use Cloud instead of OSS)
- ❌ You need fraud detection or business rule validation

### Use Settler Cloud if:
- ✅ All of the above "use Settler" criteria
- ✅ You need managed infrastructure
- ✅ You want pre-built adapters (Stripe, Shopify, etc.)
- ✅ You need SLA and support
- ✅ You want faster time-to-market

### Use something else if:
- ❌ Single-vendor reconciliation (use vendor's built-in tools)
- ❌ No technical team (use managed service, not OSS)
- ❌ Expecting "set and forget" solution (reconciliation requires ongoing review)

---

## References

- [GUARANTEES.md](./GUARANTEES.md) - What Settler guarantees (and doesn't)
- [THREAT_MODEL.md](./THREAT_MODEL.md) - Security risks and boundaries
- [DETERMINISM.md](./DETERMINISM.md) - Reproducibility specification
- [AUDIT_READINESS.md](./AUDIT_READINESS.md) - Using Settler in audit workflows
- [LONG_TERM_SUPPORT.md](./LONG_TERM_SUPPORT.md) - Compatibility and support policy
- [SECURITY.md](../SECURITY.md) - Security policy and vulnerability reporting

---

**This document is intentionally adversarial.** If a question makes Settler look bad, we answer it honestly. Trust is built on transparency, not spin.

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
