# Settler OSS

<div align="center">

[![CI](https://github.com/shardie-github/settler-oss/workflows/CI/badge.svg)](https://github.com/shardie-github/settler-oss/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**Open-source SDKs and tools for financial reconciliation**

[Documentation](./docs) • [Quick Start](#quick-start) • [Discussions](https://github.com/shardie-github/settler-oss/discussions)

</div>

---

## What is Settler OSS?

Settler OSS provides **open-source client SDKs, protocol types, and development tools** for building financial reconciliation workflows. This repository contains the building blocks for integrating with Settler Cloud or building your own reconciliation system.

> **Important for Finance Teams & Auditors:**
> Settler is a **matching tool**, not an accounting system or compliance solution. It compares datasets and identifies matches/discrepancies. You remain responsible for data quality, financial decisions, regulatory compliance, and human review of results. See [ADVERSARIAL_FAQ.md](./docs/ADVERSARIAL_FAQ.md) for critical questions and [AUDIT_READINESS.md](./docs/AUDIT_READINESS.md) for audit integration guidance.

### What's Included (MIT Licensed)

- **TypeScript/Node.js SDK** - HTTP client for Settler Cloud APIs
- **Protocol Types** - Type-safe interfaces for reconciliation workflows
- **CLI Tool** - Command-line tool for local development and testing
- **React Components** (coming soon) - UI components for reconciliation interfaces
- **Documentation & Examples** - Code samples and integration guides

### What's NOT Included (Cloud-Only)

This repository does **NOT** include:
- ❌ Reconciliation engine (proprietary, cloud-hosted)
- ❌ Managed adapters for providers like Stripe, Shopify, QuickBooks (cloud-only)
- ❌ Developer console/dashboard (cloud-only)
- ❌ Webhook delivery infrastructure (cloud-only)

**See [OSS_SCOPE.md](./OSS_SCOPE.md) for complete details on what's open-source vs. cloud-only.**

---

## Quick Start

Choose your integration path:

### Option 1: Try the Demo

See Settler's basic functionality locally:

```bash
npx @settler/cli demo
```

This runs a sample reconciliation showing matched and unmatched transactions.

**[Full Quickstart Guide](./docs/QUICKSTART_10MIN.md)** - Step-by-step tutorial

---

### Option 2: Use Settler Cloud (Recommended for Production)

Sign up for Settler Cloud to get:
- ✅ Managed reconciliation engine with advanced matching
- ✅ Pre-built adapters (Stripe, Shopify, QuickBooks, + 50 more)
- ✅ Developer console and monitoring
- ✅ Webhooks and scheduled jobs

```bash
npm install @settler/sdk
```

```typescript
import { SettlerClient } from '@settler/sdk';

const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY, // Get from https://settler.dev
});

const result = await client.reconcile({
  source: sourceTransactions,
  target: targetTransactions,
});

console.log(`Matched: ${result.summary.matched}`);
console.log(`Unmatched: ${result.summary.unmatchedSource}`);
```

**[Get Free API Key (100 transactions/month)](https://settler.dev)**

---

### Option 3: Local Development & Testing

Test reconciliation logic locally without a cloud account:

```bash
# Install CLI
npm install -g @settler/cli

# Run demo
settler demo

# Reconcile your own CSV files
settler reconcile --source payments.csv --target invoices.csv
```

**Local CLI features:**
- ✅ Works offline (no cloud needed)
- ✅ Exact matching algorithm
- ✅ CSV import/export
- ⚠️ No fuzzy matching or advanced rules (use Cloud for production)

---

## Repository Structure

```
settler-oss/
├── packages/
│   ├── sdk/              TypeScript/Node.js SDK (MIT)
│   ├── protocol/         Protocol types and specifications (MIT)
│   ├── cli/              Command-line tool (MIT)
│   ├── shared/           Shared utilities (MIT)
│   ├── react-settler/    React components (MIT, coming soon)
│   └── enterprise/       Enterprise features (proprietary)
├── apps/
│   ├── web/              Marketing site + docs (MIT)
│   └── console/          Developer console (proprietary)
└── docs/                 Documentation (MIT)
```

---

## Use Cases

### What You Can Build with OSS

✅ **Custom Reconciliation Logic** - Build your own matching engine  
✅ **Local Development & Testing** - Test reconciliation workflows locally  
✅ **Custom Adapters** - Connect to proprietary systems  
✅ **UI Integration** - Build reconciliation interfaces with React components  
✅ **Self-Hosted Solutions** - Run on your own infrastructure  

### What Cloud Provides

✅ **Managed Infrastructure** - No servers to maintain  
✅ **Pre-Built Adapters** - 50+ providers (Stripe, Shopify, QuickBooks, etc.)  
✅ **Advanced Matching** - Fuzzy matching, tolerance bands, ML-assisted  
✅ **Webhooks & Scheduling** - Real-time notifications and automated jobs  
✅ **Developer Console** - Monitoring, logs, exception handling  

---

## Documentation

### Getting Started
- **[⚡ 10-Minute Quickstart](./docs/QUICKSTART_10MIN.md)** - Reconcile your first dataset
- [OSS Scope](./OSS_SCOPE.md) - What's open-source vs. cloud-only
- [Architecture](./docs/ARCHITECTURE.md) - System architecture overview
- [Cloud vs OSS](./docs/CLOUD_VS_OSS.md) - Detailed comparison

### Core Principles & Trust Framework
- **[Guarantees](./docs/GUARANTEES.md)** - What Settler guarantees vs. explicit non-guarantees
- **[Threat Model](./docs/THREAT_MODEL.md)** - Security boundaries and responsibilities
- **[Determinism](./docs/DETERMINISM.md)** - Deterministic behavior specification
- **[Invariants](./docs/INVARIANTS.md)** - Financial correctness requirements
- **[Stack Agnosticity](./docs/STACK_AGNOSTICITY.md)** - Provider-agnostic design
- **[OSS vs Enterprise Boundary](./docs/OSS_VS_ENTERPRISE_BOUNDARY.md)** - Clear boundaries

### External Review & Institutional Use
- **[Adversarial FAQ](./docs/ADVERSARIAL_FAQ.md)** - Hard questions from auditors and CFOs
- **[Audit Readiness](./docs/AUDIT_READINESS.md)** - Using Settler in financial audits
- **[Long-Term Support](./docs/LONG_TERM_SUPPORT.md)** - Compatibility and support policy

### SDK Documentation
- [TypeScript/Node.js SDK](./packages/sdk/README.md) - API client documentation
- [Protocol Types](./packages/protocol/README.md) - Type definitions
- [CLI Tool](./packages/cli/README.md) - Command-line interface

### Development
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Product Boundaries](./PRODUCT_BOUNDARIES.md) - OSS vs Cloud boundaries
- [Security Policy](./SECURITY.md) - Security and compliance

---

## Development

This is a monorepo managed with npm workspaces (or pnpm).

```bash
# Install dependencies
npm install
# or: pnpm install

# Build all packages
npm run build

# Lint all packages
npm run lint

# Run tests
npm run test

# Check boundaries (ensure OSS doesn't import proprietary code)
npm run check-boundaries
```

---

## Contributing

We welcome contributions:
- Bug fixes
- Documentation improvements
- SDK enhancements
- New language SDKs (Python, Go, Ruby)
- Code examples

**Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.**

---

## Comparison: OSS vs Cloud

| Feature | OSS (This Repo) | Cloud (SaaS) |
|---------|-----------------|--------------|
| **Client SDKs** | ✅ Full (TypeScript/Node.js) | ✅ Full |
| **Protocol Types** | ✅ Full | ✅ Full |
| **CLI Tool** | ✅ Full | ✅ Full |
| **React Components** | 🚧 Coming Soon | ✅ Full |
| **Reconciliation Engine** | ⚠️ Basic (demo only) | ✅ Production-ready |
| **Managed Adapters** | ❌ None | ✅ 50+ providers |
| **Developer Console** | ❌ None | ✅ Full |
| **Webhooks** | ❌ None | ✅ Full |
| **Scheduled Jobs** | ❌ None | ✅ Full |
| **Support** | Community | 24/7 Dedicated (Enterprise) |
| **Pricing** | Free (MIT) | Free tier + Paid tiers |

**Full comparison:** [docs/CLOUD_VS_OSS.md](./docs/CLOUD_VS_OSS.md)

---

## Architecture

Settler uses an "open core" model:

- **Open-Source (this repo):** Client libraries, protocol specs, CLI tools
- **Cloud (proprietary):** Reconciliation engine, managed adapters, infrastructure

```
┌─────────────────────────────────────┐
│   Your Application                  │
└──────────┬──────────────────────────┘
           │
           │ uses SDK (OSS)
           │
┌──────────▼──────────────────────────┐
│   Settler SDK (@settler/sdk)        │  ← You are here (OSS)
└──────────┬──────────────────────────┘
           │
           │ HTTP/REST
           │
┌──────────▼──────────────────────────┐
│   Settler Cloud Platform            │  ← Optional (SaaS)
│   • Reconciliation Engine           │
│   • Managed Adapters                │
│   • Developer Console               │
└─────────────────────────────────────┘
```

**See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for details.**

---

## Security

Found a security vulnerability? Please email [security@settler.dev](mailto:security@settler.dev).

**Do not** create a public GitHub issue for security vulnerabilities.

See [SECURITY.md](./SECURITY.md) for our security policy.

---

## License

This repository is **MIT licensed** - see [LICENSE](./LICENSE) for details.

- ✅ Free for commercial use
- ✅ Modify and distribute freely
- ✅ Use in proprietary software
- ✅ Self-host without restrictions

**Proprietary components** (`apps/console`, `packages/enterprise`) are clearly marked and have separate licenses.

---

## Community & Support

- **[Star this repository](https://github.com/shardie-github/settler-oss/stargazers)** - Increase project visibility
- **[Fork it](https://github.com/shardie-github/settler-oss/fork)** - Build your own reconciliation system
- **[Report bugs](https://github.com/shardie-github/settler-oss/issues)** - Help improve code quality
- **[Contribute](./CONTRIBUTING.md)** - Code, documentation, or examples
- **[Join Discussions](https://github.com/shardie-github/settler-oss/discussions)** - Technical questions and use cases

---

## Links

- **Documentation:** [./docs](./docs)
- **Website:** [settler.dev](https://settler.dev) (Cloud platform)
- **Discussions:** [GitHub Discussions](https://github.com/shardie-github/settler-oss/discussions)
- **Issues:** [GitHub Issues](https://github.com/shardie-github/settler-oss/issues)

---

<div align="center">

**Settler OSS** - Open-source reconciliation toolkit

[Star on GitHub](https://github.com/shardie-github/settler-oss/stargazers) • [Fork](https://github.com/shardie-github/settler-oss/fork) • [Discussions](https://github.com/shardie-github/settler-oss/discussions)

</div>
