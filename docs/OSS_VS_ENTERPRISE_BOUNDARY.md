# OSS vs Enterprise Boundary

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Status:** Binding Specification

This document establishes the **non-negotiable boundaries** between Settler OSS (MIT licensed) and Settler Enterprise (proprietary). These boundaries are enforced through automated checks, license headers, and architectural constraints.

---

## 🎯 Core Principle

> **Settler OSS provides complete, usable tools for building reconciliation systems.
> Settler Enterprise provides managed infrastructure and scale guarantees.**

The boundary is **not** between "demo" and "production."
The boundary **is** between **tools** (OSS) and **managed services** (Enterprise).

---

## 📋 Capability Comparison Table

| Capability | OSS (MIT) | Enterprise (Proprietary) | Boundary Rationale |
|------------|-----------|--------------------------|-------------------|
| **Client SDKs** | ✅ Complete | ✅ Same SDKs | SDKs are adoption enablers, not competitive advantage |
| **Protocol Types** | ✅ Complete | ✅ Same types | Open protocols enable ecosystem growth |
| **CLI Tool** | ✅ Complete | ✅ Same CLI | Developer experience and local testing |
| **React Components** | ✅ Complete | ✅ Same components | UI building blocks reduce integration friction |
| **Documentation** | ✅ Complete | ✅ Extended (Enterprise features) | Open documentation builds trust |
| **Examples** | ✅ Complete | ✅ Additional patterns | Community learns from examples |
| | | | |
| **Reconciliation Engine** | ❌ Not included | ✅ Managed, event-sourced | Core IP and competitive advantage |
| **Provider Adapters** | ❌ Not included | ✅ 50+ managed connectors | High maintenance cost, requires partnerships |
| **OAuth Infrastructure** | ❌ Not included | ✅ Managed credential storage | Security-sensitive, requires PKI infrastructure |
| **Developer Console** | ❌ Not included | ✅ Web dashboard | Multi-tenant SaaS platform |
| **Webhook Delivery** | ❌ Not included | ✅ Guaranteed delivery queue | Requires worker infrastructure |
| **Scheduled Jobs** | ❌ Not included | ✅ Cron-based automation | Requires distributed scheduler |
| **Monitoring/Logging** | ⚠️ DIY | ✅ Built-in observability | Enterprise-grade telemetry stack |
| **SLA Guarantees** | ❌ None | ✅ 99.9% uptime (Enterprise tier) | Requires redundancy and on-call |
| **Support** | Community | ✅ 24/7 dedicated (Enterprise tier) | Professional support team |
| **SSO/SAML** | ❌ Not included | ✅ Enterprise tier | Enterprise security requirement |
| **Audit Logs** | ⚠️ DIY | ✅ Compliance-ready logs | Regulatory requirement |
| **Data Residency** | Your infrastructure | ✅ EU/US/APAC regions | GDPR/sovereignty compliance |
| **Custom SLAs** | N/A | ✅ Contractual terms | Enterprise procurement |

**Legend:**
- ✅ **Fully included** - Complete implementation, production-ready
- ⚠️ **DIY** - You can build it yourself using OSS tools
- ❌ **Not included** - Not available in OSS, requires Enterprise

---

## 🔒 Explicit Invariants: What OSS Will NEVER Lose

These guarantees are **permanent and irrevocable**:

### 1. Complete Client SDKs
**Guarantee:** OSS will always include fully-functional, production-ready client SDKs.

**What this means:**
- ✅ HTTP client implementations for TypeScript, Python, Go, Ruby
- ✅ Type-safe method signatures matching Enterprise APIs
- ✅ Authentication handling (API key injection)
- ✅ Error handling and retries
- ✅ Request/response serialization

**What this does NOT mean:**
- ❌ OSS does not include the backend server implementation
- ❌ OSS does not include data storage or processing infrastructure

### 2. Open Protocol Specifications
**Guarantee:** All protocol types and interfaces remain MIT licensed.

**What this means:**
- ✅ `ReconcileRequest`, `ReconcileResponse`, `Transaction` types
- ✅ Webhook event schemas
- ✅ Error type definitions
- ✅ Matching rule interfaces

**Why this matters:**
- Enables compatible third-party implementations
- Prevents vendor lock-in
- Allows self-hosted alternatives

### 3. Local Development Tools
**Guarantee:** CLI and development tools remain fully functional without Enterprise.

**What this means:**
- ✅ CLI can run reconciliations locally (basic exact matching)
- ✅ CLI can parse CSV files and generate sample data
- ✅ CLI includes environment checks and debugging tools
- ✅ No cloud connection required for local testing

**What this does NOT mean:**
- ❌ CLI's local reconciliation is basic (exact matching only)
- ❌ Advanced matching (fuzzy, ML-assisted) requires Enterprise

### 4. UI Component Library
**Guarantee:** React components for building reconciliation interfaces.

**What this means:**
- ✅ Job configuration forms
- ✅ Result visualization tables
- ✅ Error boundary components
- ✅ Loading and status indicators

**Self-hosting use case:**
- Build your own reconciliation UI
- Connect to self-hosted backend
- No Enterprise dependency

### 5. No Feature Removal
**Guarantee:** Features in OSS will not be moved to Enterprise-only.

**What this means:**
- Once a capability is in OSS, it stays in OSS
- OSS features will not be degraded to "push" users to Enterprise
- Bug fixes and security patches apply to OSS

**Exception:**
- Experimental features marked "preview" may change scope

---

## 🚫 Explicit Exclusions: What OSS Will NEVER Include

These capabilities are **permanently Enterprise-only**:

### 1. Reconciliation Engine Implementation
**Why excluded:** Core competitive IP and algorithmic advantage.

**What OSS lacks:**
- Event-sourced matching engine
- Deterministic currency calculation logic
- Transaction deduplication algorithms
- Conflict resolution heuristics
- Performance optimizations for high-volume data

**OSS alternative:**
- Build your own matching logic using protocol types
- Reference implementations may be added to examples/ (TBD)

### 2. Managed Provider Adapters
**Why excluded:** High development cost, ongoing maintenance burden, vendor partnerships.

**What OSS lacks:**
- Pre-built connectors for Stripe, Shopify, QuickBooks, Xero, etc.
- OAuth flow implementations
- Provider-specific schema normalization
- Rate limiting and retry logic per provider
- Incremental sync with provider APIs

**OSS alternative:**
- Use provider SDKs directly (Stripe SDK, Shopify SDK, etc.)
- Build custom adapters for your specific needs
- Community may contribute adapter examples (not maintained by Settler)

### 3. Multi-Tenant SaaS Infrastructure
**Why excluded:** Requires managed infrastructure, security operations, billing systems.

**What OSS lacks:**
- Developer Console (web dashboard)
- API key management UI
- Multi-tenant database architecture
- Usage metering and billing
- Team/RBAC management

**OSS alternative:**
- Build your own admin UI using React components
- Single-tenant deployment (self-hosted)

### 4. Event Infrastructure
**Why excluded:** Requires worker pools, queues, retry logic, monitoring.

**What OSS lacks:**
- Webhook delivery guarantees
- Event queue (SQS/Redis)
- Retry logic with exponential backoff
- Signature verification infrastructure
- Scheduled job orchestration (cron)

**OSS alternative:**
- Use Celery, Sidekiq, or cloud functions for job scheduling
- Implement your own webhook delivery logic

### 5. Enterprise Security Features
**Why excluded:** Requires PKI infrastructure, compliance certifications, legal commitments.

**What OSS lacks:**
- SSO/SAML integration
- SOC 2 / ISO 27001 certifications
- Compliance audit logs
- Penetration testing reports
- SLA guarantees (uptime, latency)

**OSS alternative:**
- Implement your own authentication (Auth0, Okta, etc.)
- Pursue your own compliance certifications if needed

---

## ⚖️ Trust Commitments to OSS Users

### Commitment 1: No Bait-and-Switch
**Promise:** Features in OSS will not be removed or crippled to drive Enterprise sales.

**Enforcement:**
- OSS license is MIT (permissive, irrevocable)
- Automated boundary checks prevent accidental feature removal
- Public changelog documents all changes

### Commitment 2: No Artificial Limitations
**Promise:** OSS tools will not contain artificial rate limits, transaction caps, or "nag screens."

**Enforcement:**
- OSS code does not check license status
- No telemetry or phone-home behavior
- No time-based expirations

### Commitment 3: No Delayed Security Patches
**Promise:** Security vulnerabilities in OSS will be patched immediately, not held for Enterprise.

**Enforcement:**
- Public security policy (SECURITY.md)
- Same-day patches for critical vulnerabilities
- Security advisories published on GitHub

### Commitment 4: No Opaque Boundaries
**Promise:** The OSS/Enterprise boundary will always be clearly documented.

**Enforcement:**
- This document (OSS_VS_ENTERPRISE_BOUNDARY.md)
- README.md clearly states what's included
- License headers in all files

### Commitment 5: Community Contribution Welcome
**Promise:** We accept contributions to OSS components (SDKs, types, CLI, React).

**Enforcement:**
- CONTRIBUTING.md with clear guidelines
- CLA for legal protection (contributor retains copyright)
- Public roadmap for OSS features

---

## 🏗️ Architectural Enforcement

### Import Rules
**Automated checks prevent OSS code from importing Enterprise code:**

```typescript
// ❌ FORBIDDEN (build fails)
import { EnterpriseFeature } from '@settler/enterprise';

// ❌ FORBIDDEN
import { ConsoleUI } from 'apps/console';

// ✅ ALLOWED
import { ReconcileRequest } from '@settler/protocol';
import { SettlerClient } from '@settler/sdk';
import { ReconcileForm } from '@settler/react-settler';
```

**Enforcement:** `check-boundaries.ts` script runs in CI/CD pipeline.

### License Headers
**Every file has a license header:**

```typescript
// OSS files:
/**
 * @license MIT
 * Copyright (c) 2026 Settler
 */

// Enterprise files:
/**
 * @license Proprietary
 * Copyright (c) 2026 Settler, Inc.
 * Unauthorized copying prohibited.
 */
```

### Package.json Markers
**Enterprise packages are marked `private: true`:**

```json
// packages/enterprise/package.json
{
  "name": "@settler/enterprise",
  "private": true,  // ← Not published to npm
  "license": "UNLICENSED"
}

// packages/sdk/package.json
{
  "name": "@settler/sdk",
  "private": false,  // ← Published to npm
  "license": "MIT"
}
```

---

## 🎓 Decision Framework: OSS or Enterprise?

### When Designing New Features

**Add to OSS if:**
- ✅ Improves developer experience (DX)
- ✅ Enables self-hosting use cases
- ✅ Reduces integration friction
- ✅ Community can maintain/extend
- ✅ Does not require managed infrastructure

**Add to Enterprise if:**
- ✅ Requires ongoing operational cost (infrastructure, support)
- ✅ Involves third-party partnerships (provider integrations)
- ✅ Contains core algorithmic IP
- ✅ Requires security infrastructure (OAuth, PKI)
- ✅ Provides SLA or compliance guarantees

### Example: Fuzzy Matching

**Question:** Should fuzzy matching be in OSS or Enterprise?

**Analysis:**
- Algorithm itself: Could be OSS (educational value, trust-building)
- Tuned parameters: Enterprise IP (competitive advantage)
- UI for configuring: OSS (React components)
- Execution at scale: Enterprise (requires infrastructure)

**Decision:** Add basic fuzzy matching algorithm to OSS examples/, keep production-tuned version in Enterprise.

---

## 📊 Competitive Positioning

### vs. Fully Proprietary SaaS
**Our advantage:** OSS reduces vendor lock-in, enables self-hosting fallback.

### vs. Fully Open Source
**Our advantage:** Enterprise provides managed infrastructure for teams without ops capacity.

### "Open Core" Balance
**What makes it work:**
- OSS is complete and usable (not a "demo")
- Enterprise adds managed infrastructure (not core features)
- Clear boundary prevents confusion

---

## 🔮 Future Considerations

### Potential OSS Additions (Under Review)
- **Reference reconciliation engine** - Basic educational implementation
- **Sample provider adapters** - Stripe/Shopify examples (community-maintained)
- **Self-hosting guide** - Docker Compose setup for single-tenant deployment

**Decision criteria:**
1. Does it help adoption?
2. Does it build trust?
3. Can we sustain maintenance?
4. Does it create competitive advantage for Enterprise?

### Never Going to OSS (Permanent)
- Multi-tenant infrastructure
- Provider partnerships and credentials
- Compliance certifications (SOC 2, ISO 27001)
- SLA guarantees and dedicated support

---

## 📞 Governance

### Boundary Changes
**Who decides:** Settler Engineering Leadership + Open Source Steward

**Process:**
1. Propose boundary change in GitHub Discussion
2. Community feedback period (14 days)
3. Document rationale and migration path
4. Update this file and increment version
5. Announce in CHANGELOG.md and GitHub release

### Disputes
**If users believe boundary was violated:**
1. Open GitHub Issue with tag `boundary-violation`
2. Settler Engineering reviews within 5 business days
3. If violation confirmed: revert change + apology
4. If intentional: explain rationale + offer migration path

---

## 🔗 Related Documentation

- **[PRODUCT_BOUNDARIES.md](../PRODUCT_BOUNDARIES.md)** - User-facing product positioning
- **[CLOUD_VS_OSS.md](./CLOUD_VS_OSS.md)** - Feature comparison and use cases
- **[BOUNDARY_MAP.md](./BOUNDARY_MAP.md)** - Technical module classification
- **[LICENSING.md](./LICENSING.md)** - License details

---

## ✅ Verification

**Automated checks:**
```bash
# Check that OSS doesn't import Enterprise
npm run check-boundaries

# Check for secret leaks
npm run check-secrets

# Verify license headers
npm run check-licenses
```

**Manual verification:**
- [ ] All packages have correct license in package.json
- [ ] All files have license headers
- [ ] No Enterprise code in OSS packages
- [ ] No artificial limitations in OSS code

---

**This document is binding.** Any changes require versioning and community notice.

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
