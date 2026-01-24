# Settler Documentation

This directory contains technical and architectural documentation for Settler OSS.

## Core Documentation

### Trust & Safety Framework (Institution-Grade)
- **[THREAT_MODEL.md](./THREAT_MODEL.md)** - Threat modeling, attack scenarios, security boundaries
- **[GUARANTEES.md](./GUARANTEES.md)** - What Settler guarantees vs. explicit non-guarantees
- **[DETERMINISM.md](./DETERMINISM.md)** - Deterministic behavior specification and boundaries
- **[ADVERSARIAL_FAQ.md](./ADVERSARIAL_FAQ.md)** - Hard questions from auditors, CFOs, and skeptics
- **[AUDIT_READINESS.md](./AUDIT_READINESS.md)** - Using Settler within audit workflows
- **[LONG_TERM_SUPPORT.md](./LONG_TERM_SUPPORT.md)** - Compatibility and support policy

### System Specifications
- **[INVARIANTS.md](./INVARIANTS.md)** - Financial correctness and data integrity invariants
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and component design
- **[VERIFICATION.md](./VERIFICATION.md)** - Testing and verification approach

### Scope & Boundaries
- **[OSS_SCOPE.md](../OSS_SCOPE.md)** - What belongs in OSS vs. proprietary
- **[PRODUCT_BOUNDARIES.md](../PRODUCT_BOUNDARIES.md)** - OSS vs. Cloud product boundaries
- **[BOUNDARY_MAP.md](./BOUNDARY_MAP.md)** - Technical module classification
- **[CLOUD_VS_OSS.md](./CLOUD_VS_OSS.md)** - Detailed feature comparison

### Operational
- **[QUICKSTART_10MIN.md](./QUICKSTART_10MIN.md)** - Quick start guide
- **[SELF_HOSTING.md](./SELF_HOSTING.md)** - Self-hosting guide
- **[ENTERPRISE_INSTANCES.md](./ENTERPRISE_INSTANCES.md)** - Enterprise deployment
- **[BUSINESS_CONTINUITY.md](./BUSINESS_CONTINUITY.md)** - Business continuity planning

### Governance
- **[LICENSING.md](./LICENSING.md)** - License details and policies
- **[RELEASING.md](./RELEASING.md)** - Release process
- **[STACK_AGNOSTICITY.md](./STACK_AGNOSTICITY.md)** - Provider-agnostic design

## For Different Audiences

**Finance Engineers & Auditors:**
- Start with [ADVERSARIAL_FAQ.md](./ADVERSARIAL_FAQ.md) for honest answers to hard questions
- Review [AUDIT_READINESS.md](./AUDIT_READINESS.md) for using Settler in audits
- Read [GUARANTEES.md](./GUARANTEES.md) to understand what Settler does and doesn't guarantee
- See [THREAT_MODEL.md](./THREAT_MODEL.md) for security boundaries and responsibilities
- Check [INVARIANTS.md](./INVARIANTS.md) for financial correctness requirements

**Security Engineers:**
- Review [THREAT_MODEL.md](./THREAT_MODEL.md) for attack scenarios and controls
- Check [../SECURITY.md](../SECURITY.md) for security policy
- See [DETERMINISM.md](./DETERMINISM.md) for reproducibility guarantees

**Developers Implementing Reconciliation:**
- Read [DETERMINISM.md](./DETERMINISM.md) for deterministic behavior requirements
- Review [INVARIANTS.md](./INVARIANTS.md) for implementation constraints
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design

**Legal & Compliance:**
- Start with [ADVERSARIAL_FAQ.md](./ADVERSARIAL_FAQ.md) for institutional evaluation questions
- Review [GUARANTEES.md](./GUARANTEES.md) for liability boundaries
- See [THREAT_MODEL.md](./THREAT_MODEL.md) section "What Settler Does NOT Protect Against"
- Check [LONG_TERM_SUPPORT.md](./LONG_TERM_SUPPORT.md) for long-term commitments
- Review [LICENSING.md](./LICENSING.md) for license terms

## Contributing Documentation

Documentation improvements are welcome! See [../CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

**Questions?** Open a [GitHub Discussion](https://github.com/shardie-github/settler-oss/discussions)
