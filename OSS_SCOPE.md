# Settler OSS Scope Definition

**Version:** 1.0.0
**Last Updated:** 2026-01-23

This document defines the technical scope and boundaries of the Settler open-source repository. It is the **source of truth** for what belongs in OSS vs. what remains in the proprietary Settler Cloud platform.

---

## 🎯 OSS Mission Statement

The Settler OSS repository provides **client-side tools, protocol specifications, and building blocks** for developers to:

1. **Integrate** with the Settler Cloud API
2. **Build** custom reconciliation workflows using our protocol
3. **Extend** the ecosystem with adapters, UI components, and examples
4. **Self-host** deterministic reconciliation runs with the Settler Engine sidecar

**What OSS is NOT:** A complete, production-ready reconciliation platform. Managed reconciliation infrastructure, hosted adapters, and enterprise orchestration remain proprietary.

---

## ✅ IN SCOPE: What Belongs in OSS

### 1. Protocol Specification (`packages/protocol`)

**Purpose:** Define the contract surface for reconciliation APIs

**Includes:**
- TypeScript type definitions for requests/responses
- API endpoint specifications
- Error format standards
- Webhook event schemas
- Protocol version management

**License:** MIT
**Rationale:** Open protocol drives adoption and enables interoperability

---

### 2. Client SDKs

#### TypeScript/Node.js SDK (`packages/sdk`)

**Purpose:** Official SDK for calling Settler APIs from Node.js/TypeScript

**Includes:**
- HTTP client with auth handling
- Request/response type safety
- Error handling utilities
- CSV parsing helpers (for demo purposes)
- Basic result formatting
- Adapter registration utilities (for custom adapters)

**Excludes:**
- Reconciliation engine logic
- Managed adapter implementations
- Multi-tenant features

**License:** MIT
**Rationale:** Remove friction for developers trying Settler

---

#### Future SDKs (Planned)

**Status:** Placeholder packages exist but not implemented yet

- `packages/sdk-python` - Python SDK
- `packages/sdk-go` - Go SDK
- `packages/sdk-ruby` - Ruby SDK

**Decision:** Keep placeholders OR remove from README until implemented. No misleading "stable" claims.

---

### 3. CLI Tool (`packages/cli`)

**Purpose:** Command-line interface for local development and testing

**Includes:**
- `settler doctor` - Environment checks (no network calls required)
- `settler init` - Generate sample config files
- `settler reconcile` - Run reconciliation with demo CSV files (local-only)
- `settler adapters` - List installed adapters
- `settler demo` - Run canned demo with sample data

**Requirements:**
- Must work with ZERO environment variables
- Must not require Settler Cloud API key for demo/doctor commands
- Must have helpful error messages and exit codes
- Must support `--help` for all commands

**License:** MIT
**Rationale:** Enable local development and experimentation

---

### 4. Settler Engine (`tools/settler-engine`)

**Purpose:** Deterministic sidecar that surfaces discrepancies in local and CI contexts

**Includes:**
- Schema-first input/output contracts
- CSV/JSON normalization into canonical records
- Deterministic variance computation with stable ordering
- Evidence bundle output (manifest, normalized records, variances)

**Excludes:**
- Hosted execution infrastructure
- Managed adapters or data ingestion pipelines
- Enterprise workflow orchestration

**License:** MIT
**Rationale:** Provide OSS-first deterministic reconciliation runs without requiring hosted services

---

### 5. React Components (`packages/react-settler`)

**Purpose:** UI components for building reconciliation interfaces

**Includes:**
- Job configuration forms
- Results display components
- Error boundaries
- Loading states
- Basic reconciliation status views

**Excludes:**
- Multi-tenant admin UI
- Console-specific features
- Enterprise RBAC components

**License:** MIT
**Rationale:** Help developers build UIs quickly

---

### 5. Shared Utilities (`packages/shared`)

**Purpose:** Common code safe to include in OSS bundles

**Includes:**
- Type utilities
- Validation helpers (protocol-level only)
- Common constants
- Date/time utilities
- Safe logging utilities

**Excludes:**
- Enterprise business logic
- SaaS-specific code
- Billing logic
- Tenant isolation code

**License:** MIT
**Rationale:** Reduce duplication across packages

---

### 6. Demo Adapters & Examples

**Purpose:** Reference implementations for learning

**Includes:**
- Demo CSV adapter (simple, no external APIs)
- Example reconciliation workflows
- Integration guides
- Best practices documentation

**Excludes:**
- Production adapters (Stripe, Shopify, etc.)
- OAuth flows for real providers
- Enterprise connector examples

**License:** MIT
**Rationale:** Help developers understand how to build adapters

---

### 7. Documentation

**In Scope for OSS:**
- Protocol specification docs
- SDK usage guides
- CLI command reference
- Adapter development guide
- Self-hosting guide (conceptual - users implement their own engine)
- Contributing guide
- Code examples

**Out of Scope for OSS:**
- Console user guides
- Enterprise feature docs (stays in docs/ENTERPRISE_INSTANCES.md but marked clearly)
- Internal implementation docs for proprietary features

**License:** MIT (for OSS docs), Proprietary (for enterprise docs in this repo)

---

### 8. Testing & Development Tools

**In Scope:**
- Test utilities for SDK
- Mock data generators
- Local dev server (for testing integrations)
- Boundary checking scripts
- Contract validation scripts

**Out of Scope:**
- Internal testing infrastructure
- Load testing tools for Cloud
- Monitoring/observability setup

**License:** MIT

---

## ❌ OUT OF SCOPE: What Stays Proprietary

### 1. Reconciliation Engine

**Location:** Not in this repository (proprietary codebase)

**What it includes:**
- Event-sourced matching algorithms
- Deterministic currency calculations
- Transaction deduplication logic
- Conflict resolution algorithms
- Performance optimizations

**Why proprietary:** Core competitive advantage, complex IP

**OSS alternative:** Users can implement their own matching logic using protocol types

---

### 2. Managed Adapters

**Location:** `packages/enterprise` (in this repo but proprietary license)

**What it includes:**
- Pre-built connectors for 50+ providers
- OAuth credential management
- Rate limiting and retry logic
- Schema normalization
- Incremental sync

**Why proprietary:** High development cost, ongoing maintenance, provider partnerships

**OSS alternative:** Users can build custom adapters using SDK utilities

---

### 3. Developer Console

**Location:** `apps/console` (in this repo but proprietary license)

**What it includes:**
- Multi-tenant admin UI
- API key management
- Real-time monitoring dashboards
- Tenant isolation
- RBAC and permissions
- Usage metrics and billing
- Audit logs

**Why proprietary:** Requires backend infrastructure, integrated with billing/auth

**OSS alternative:** Users can build their own admin UI using SDK and React components

---

### 4. Infrastructure & Platform Services

**Location:** Not in this repository

**What it includes:**
- Webhook delivery infrastructure
- Cron-based job scheduling
- Queue management (Redis/SQS)
- Database and storage
- API hosting
- Monitoring and alerting

**Why proprietary:** Requires managed infrastructure, operational complexity

**OSS alternative:** Users deploy their own infrastructure if self-hosting

---

### 5. Enterprise Features

**Location:** `packages/enterprise` and private infrastructure

**What it includes:**
- SSO/SAML integration
- Advanced audit logging
- Compliance reporting
- SLA monitoring
- Custom deployment tools
- VPC networking
- BYO-Key/KMS support

**Why proprietary:** High-touch sales, legal compliance, custom infrastructure

**OSS alternative:** None - these are enterprise-only value-adds

---

## 🔀 HYBRID: Marketing Site (`apps/web`)

**Status:** Mixed OSS + proprietary content

**OSS Routes:**
- `/` - Homepage (OSS-focused)
- `/docs/*` - Public documentation
- `/protocol/*` - Protocol specification pages
- `/pricing` - Pricing page (clearly separates free vs paid)

**Proprietary Routes:**
- `/console` - Console product page (marketing only)
- `/console/*` - Console login/redirect (no implementation in OSS)
- `/enterprise/*` - Enterprise marketing pages

**Build/Deploy:**
- OSS can build and deploy the marketing site
- Console routes gracefully degrade or redirect to Cloud login
- No auth gates on public routes
- Clear labeling of what requires Cloud vs OSS-only

**License:** MIT for public routes, proprietary for console/enterprise routes

---

## 🚫 IMPORT BOUNDARIES (Enforced by Scripts)

### Protocol Packages CAN Import:
- ✅ Other protocol packages (`packages/sdk`, `packages/protocol`, etc.)
- ✅ `packages/shared` (OSS-safe utilities)
- ✅ External npm dependencies (MIT/Apache/BSD licensed)

### Protocol Packages CANNOT Import:
- ❌ `packages/enterprise/*`
- ❌ `apps/console/*` internals
- ❌ Any proprietary SaaS code

### Verification:
```bash
npm run check-boundaries
```

Fails CI if protocol packages import proprietary code.

---

## 🧪 RECONCILIATION LOGIC: What Can OSS Implement?

**Question:** Can OSS include basic reconciliation logic?

**Answer:** YES, but with limitations:

### ✅ Allowed in OSS:
- **Demo reconciliation logic** - Simple matching for demo/examples (exact match only)
- **CSV file reconciliation** - Read two CSVs, compare, output results (educational)
- **Utility functions** - Date range matching, amount tolerance checks
- **Format conversion** - Parse various input formats to protocol types

### ❌ NOT Allowed in OSS:
- **Production matching engine** - Event-sourced, complex algorithms (proprietary IP)
- **Fuzzy matching** - Advanced similarity algorithms (competitive advantage)
- **Multi-source orchestration** - Complex workflow engine (requires infrastructure)
- **Real adapter implementations** - Stripe, Shopify, etc. (proprietary)

### Design Principle:
> OSS provides **building blocks and examples**. Cloud provides **production-grade, optimized implementation**.

**Example:**
```typescript
// ✅ Allowed in OSS: Simple demo matcher
function demoReconcile(source: Transaction[], target: Transaction[]) {
  return source.filter(s =>
    target.some(t => t.id === s.id && t.amount === s.amount)
  );
}

// ❌ Not in OSS: Production engine (stays proprietary)
// Uses event sourcing, fuzzy matching, conflict resolution, etc.
```

---

## 📊 FEATURE COMPARISON

| Feature | OSS | Cloud |
|---------|-----|-------|
| TypeScript SDK | ✅ Yes | ✅ Yes |
| CLI Tool | ✅ Yes (demo mode) | ✅ Yes (full API access) |
| Protocol Types | ✅ Yes | ✅ Yes |
| React Components | ✅ Yes | ✅ Yes |
| Demo Reconciliation | ✅ Yes (simple) | ✅ Yes (advanced) |
| Custom Adapters | ✅ Yes (DIY) | ✅ Yes (DIY) |
| Managed Adapters | ❌ No | ✅ Yes (50+) |
| Production Engine | ❌ No | ✅ Yes |
| Webhooks | ❌ No | ✅ Yes |
| Scheduling | ❌ No | ✅ Yes |
| Console UI | ❌ No | ✅ Yes |
| Enterprise SSO | ❌ No | ✅ Yes (Enterprise) |
| Self-Hosting | ✅ Yes (DIY engine) | ❌ No |
| API Key Required | ❌ No (for demo) | ✅ Yes |

---

## 🔮 FUTURE OSS ADDITIONS (Under Consideration)

### May Add to OSS:
1. **Sample reconciliation engine** - Reference implementation (not production-grade)
2. **Example adapters** - Stripe/Shopify examples (read-only, educational)
3. **Self-hosted dashboard template** - Basic UI template (users deploy)

### Decision Criteria:
- ✅ Does it help adoption?
- ✅ Does it reduce support burden?
- ✅ Does it create competitive advantage for Cloud?
- ✅ Is it sustainable to maintain?

### Will NOT Add to OSS:
- Production reconciliation engine
- Real OAuth flows for managed adapters
- Multi-tenant infrastructure code
- Billing and payment processing
- Enterprise compliance features

---

## 📞 Scope Questions & Governance

**Have a question about scope?**
- GitHub Discussions: https://github.com/shardie-github/settler-oss/discussions
- Email: opensource@settler.dev

**Proposing a new OSS feature?**
1. Check this document first
2. Open a GitHub Discussion
3. Explain how it fits OSS mission (building blocks, not platform)
4. Wait for maintainer response before implementing

**Reporting a scope violation?**
- Use GitHub Issues with `scope-violation` label
- Automated checks: `npm run check-boundaries`

---

## 🔗 Related Documentation

- **[PRODUCT_BOUNDARIES.md](./PRODUCT_BOUNDARIES.md)** - User-facing product overview
- **[docs/BOUNDARY_MAP.md](./docs/BOUNDARY_MAP.md)** - Technical module classification
- **[docs/CLOUD_VS_OSS.md](./docs/CLOUD_VS_OSS.md)** - Detailed feature comparison
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Technical architecture overview

---

**Last Updated:** 2026-01-23 • **Version:** 1.0.0
