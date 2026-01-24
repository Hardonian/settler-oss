# Documentation Index

**Version:** 1.0.0
**Last Updated:** 2026-01-24

Welcome to the Settler OSS documentation! This index organizes all documentation by topic for easy navigation.

---

## Getting Started

**New to Settler? Start here:**

| Document | Description | Time |
|----------|-------------|------|
| [README](../README.md) | Project overview and quickstart | 5 min |
| [Quick Start](../QUICK_START.md) | Quick introduction | 5 min |
| [10-Minute Quickstart](./QUICKSTART_10MIN.md) | Hands-on tutorial | 10 min |
| [Getting Started](../GETTING_STARTED.md) | Detailed setup guide | 15 min |
| [FAQ](../FAQ.md) | Frequently asked questions | 10 min |

---

## Core Concepts

**Understanding Settler's design and scope:**

| Document | Description |
|----------|-------------|
| [OSS Scope](../OSS_SCOPE.md) | What's OSS vs Cloud (quick reference) |
| [Product Boundaries](../PRODUCT_BOUNDARIES.md) | Complete boundary definitions |
| [Cloud vs OSS](./CLOUD_VS_OSS.md) | Detailed comparison |
| [Architecture](./ARCHITECTURE.md) | System architecture overview |
| [Stack Agnosticity](./STACK_AGNOSTICITY.md) | Provider-agnostic design principles |

---

## SDK & API Documentation

**Using Settler programmatically:**

| Document | Description |
|----------|-------------|
| [TypeScript/Node.js SDK](../packages/sdk/README.md) | Official SDK documentation |
| [Protocol Types](../packages/protocol/README.md) | Type definitions and contracts |
| [CLI Tool](../packages/cli/README.md) | Command-line interface guide |
| [React Components](../packages/react-settler/README.md) | React UI components (coming soon) |
| [Go SDK](../packages/sdk-go/README.md) | Go client (skeleton) |
| [Python SDK](../packages/sdk-python/README.md) | Python client (skeleton) |
| [Ruby SDK](../packages/sdk-ruby/README.md) | Ruby client (skeleton) |

---

## Trust & Security Framework

**Security, guarantees, and trust:**

| Document | Description |
|----------|-------------|
| [Security Policy](../SECURITY.md) | Responsible disclosure and security practices |
| [Threat Model](./THREAT_MODEL.md) | Security boundaries and responsibilities |
| [Guarantees](./GUARANTEES.md) | What Settler guarantees (and doesn't) |
| [Determinism](./DETERMINISM.md) | Deterministic behavior specification |
| [Invariants](./INVARIANTS.md) | Financial correctness requirements |
| [Verification](./VERIFICATION.md) | Testing and validation approach |

---

## External Review & Institutional Use

**For auditors, CFOs, and compliance teams:**

| Document | Description |
|----------|-------------|
| [Adversarial FAQ](./ADVERSARIAL_FAQ.md) | Hard questions from auditors and executives |
| [Audit Readiness](./AUDIT_READINESS.md) | Using Settler in financial audits |
| [Long-Term Support](./LONG_TERM_SUPPORT.md) | Compatibility and support policy |

---

## Project Health & Release

**Release readiness and long-term viability:**

| Document | Description |
|----------|-------------|
| [OSS Audit Rubric](./OSS_AUDIT_RUBRIC.md) | Scoring framework for release readiness |
| [Pre-Launch Checklist](./PRE_LAUNCH_CHECKLIST.md) | Tactical pre-release verification |
| [Five Year Survivability](./FIVE_YEAR_SURVIVABILITY.md) | Long-term viability assessment |
| [Releasing](./RELEASING.md) | Release process guide |
| [Versioning](../VERSIONING.md) | Semantic versioning policy |
| [Roadmap](../ROADMAP.md) | Product roadmap |
| [Changelog](../CHANGELOG.md) | Version history and release notes |

---

## Contributing & Community

**How to participate:**

| Document | Description |
|----------|-------------|
| [Contributing Guide](../CONTRIBUTING.md) | How to contribute code, docs, or examples |
| [Code of Conduct](../CODE_OF_CONDUCT.md) | Community standards and expectations |
| [Governance](../GOVERNANCE.md) | Decision-making process and roles |

---

## Technical Reference

**Deep dives into technical design:**

| Document | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | System design and component structure |
| [Boundary Map](./BOUNDARY_MAP.md) | OSS vs proprietary module classification |
| [OSS vs Enterprise Boundary](./OSS_VS_ENTERPRISE_BOUNDARY.md) | Technical boundary enforcement |
| [Repository Map](./REPO_MAP.md) | Codebase navigation guide |
| [Licensing](./LICENSING.md) | License details and open-core model |

---

## Guides & How-Tos

**Step-by-step instructions:**

| Document | Description |
|----------|-------------|
| [10-Minute Quickstart](./QUICKSTART_10MIN.md) | Get started in 10 minutes |
| [Self-Hosting Guide](./SELF_HOSTING.md) | Run Settler on your own infrastructure |
| [Getting Started](../GETTING_STARTED.md) | Comprehensive setup guide |

---

## Policy Documents

**Formal policies and commitments:**

| Document | Description |
|----------|-------------|
| [Security Policy](../SECURITY.md) | Security vulnerability disclosure |
| [Code of Conduct](../CODE_OF_CONDUCT.md) | Community behavior standards |
| [Long-Term Support](./LONG_TERM_SUPPORT.md) | Version support policy |
| [Versioning](../VERSIONING.md) | Semantic versioning rules |
| [License](../LICENSE) | MIT license text |

---

## For Different Audiences

### For Users

**"I want to use Settler in my app"**

1. [README](../README.md) - Start here
2. [10-Minute Quickstart](./QUICKSTART_10MIN.md) - Hands-on tutorial
3. [SDK Documentation](../packages/sdk/README.md) - API reference
4. [FAQ](../FAQ.md) - Common questions
5. [Cloud vs OSS](./CLOUD_VS_OSS.md) - Choose deployment option

---

### For Contributors

**"I want to contribute code or docs"**

1. [Contributing Guide](../CONTRIBUTING.md) - How to contribute
2. [Code of Conduct](../CODE_OF_CONDUCT.md) - Community standards
3. [Repository Map](./REPO_MAP.md) - Navigate the codebase
4. [Architecture](./ARCHITECTURE.md) - Understand the design
5. [Governance](../GOVERNANCE.md) - Decision-making process

---

### For Auditors & Compliance Teams

**"I need to evaluate Settler for audit/compliance"**

1. [Security Policy](../SECURITY.md) - Security practices
2. [Threat Model](./THREAT_MODEL.md) - Security boundaries
3. [Adversarial FAQ](./ADVERSARIAL_FAQ.md) - Hard questions answered
4. [Audit Readiness](./AUDIT_READINESS.md) - Using in audits
5. [Guarantees](./GUARANTEES.md) - Explicit guarantees and non-guarantees

---

### For Maintainers & Release Managers

**"I need to release a new version"**

1. [Releasing](./RELEASING.md) - Release process
2. [Pre-Launch Checklist](./PRE_LAUNCH_CHECKLIST.md) - Pre-release verification
3. [OSS Audit Rubric](./OSS_AUDIT_RUBRIC.md) - Quality scoring
4. [Governance](../GOVERNANCE.md) - Decision authority
5. [Versioning](../VERSIONING.md) - Versioning rules

---

### For Architects & Technical Decision Makers

**"I need to understand Settler's design"**

1. [Architecture](./ARCHITECTURE.md) - System design
2. [Stack Agnosticity](./STACK_AGNOSTICITY.md) - Provider neutrality
3. [Boundary Map](./BOUNDARY_MAP.md) - Module boundaries
4. [Determinism](./DETERMINISM.md) - Behavior guarantees
5. [Invariants](./INVARIANTS.md) - Correctness properties

---

## By Topic

### Architecture & Design

- [Architecture](./ARCHITECTURE.md)
- [Stack Agnosticity](./STACK_AGNOSTICITY.md)
- [Boundary Map](./BOUNDARY_MAP.md)
- [OSS vs Enterprise Boundary](./OSS_VS_ENTERPRISE_BOUNDARY.md)

### Security

- [Security Policy](../SECURITY.md)
- [Threat Model](./THREAT_MODEL.md)
- [Guarantees](./GUARANTEES.md)

### Financial Correctness

- [Determinism](./DETERMINISM.md)
- [Invariants](./INVARIANTS.md)
- [Verification](./VERIFICATION.md)

### Product Scope

- [OSS Scope](../OSS_SCOPE.md)
- [Product Boundaries](../PRODUCT_BOUNDARIES.md)
- [Cloud vs OSS](./CLOUD_VS_OSS.md)

### Process & Governance

- [Governance](../GOVERNANCE.md)
- [Contributing](../CONTRIBUTING.md)
- [Releasing](./RELEASING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)

### Quality & Sustainability

- [OSS Audit Rubric](./OSS_AUDIT_RUBRIC.md)
- [Pre-Launch Checklist](./PRE_LAUNCH_CHECKLIST.md)
- [Five Year Survivability](./FIVE_YEAR_SURVIVABILITY.md)
- [Long-Term Support](./LONG_TERM_SUPPORT.md)

---

## Documentation Statistics

**Total Documentation Files:** 73 markdown files

**By Category:**
- Getting Started: 5 files
- Core Concepts: 5 files
- SDK/API: 7 files
- Trust & Security: 6 files
- External Review: 3 files
- Project Health: 7 files
- Contributing: 3 files
- Technical Reference: 6 files
- Guides: 3 files
- Policy: 5 files

---

## Documentation Standards

All Settler OSS documentation follows these standards:

- **Format:** Markdown (GitHub Flavored)
- **Encoding:** UTF-8
- **Line Endings:** LF (Unix-style)
- **Max Line Length:** None (soft wrap preferred)
- **Headers:** ATX-style (`#` not `===`)
- **Links:** Relative paths for internal docs
- **Last Updated:** Frontmatter with date and version

---

## Contributing to Documentation

Found a typo or want to improve docs? See [Contributing Guide](../CONTRIBUTING.md).

**Documentation contribution guidelines:**
- Fix typos and grammar errors (no PR needed for minor fixes)
- Improve clarity and examples
- Add missing documentation
- Update outdated information
- Translate to other languages (future)

---

## Feedback

**Have questions or suggestions about documentation?**
- [Open a Discussion](https://github.com/shardie-github/settler-oss/discussions)
- [File an Issue](https://github.com/shardie-github/settler-oss/issues)
- Email: opensource@settler.dev

---

## Quick Links

- **Website:** [settler.dev](https://settler.dev)
- **GitHub:** [github.com/shardie-github/settler-oss](https://github.com/shardie-github/settler-oss)
- **Discussions:** [GitHub Discussions](https://github.com/shardie-github/settler-oss/discussions)
- **Issues:** [GitHub Issues](https://github.com/shardie-github/settler-oss/issues)
- **npm:** [@settler/sdk](https://www.npmjs.com/package/@settler/sdk)

---

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
