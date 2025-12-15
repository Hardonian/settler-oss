# Boundary Map: OSS Protocol vs Licensed SaaS Management Layer

This document maps all modules, packages, and routes into their respective categories to maintain clear separation between open-source protocol code and licensed SaaS management layer code.

## Classification Categories

- **Protocol (OSS)**: Open-source SDKs, API clients, specifications, CLI tools, and examples that anyone can use, modify, and self-host.
- **Management (Licensed SaaS)**: Console UI, admin workflows, enterprise connectors, billing, tenant administration, RBAC, and multi-tenant operations.
- **Shared (OSS-safe)**: Types, utilities, and common code that can safely be included in OSS bundles without exposing licensed functionality.

---

## Module Classification Table

| Module/Package | Category | Reason | License |
|----------------|----------|--------|---------|
| `packages/sdk` | Protocol | Core TypeScript/Node.js SDK for API client | MIT |
| `packages/sdk-python` | Protocol | Python SDK for API client | MIT |
| `packages/sdk-go` | Protocol | Go SDK for API client | MIT |
| `packages/sdk-ruby` | Protocol | Ruby SDK for API client | MIT |
| `packages/react-settler` | Protocol | React components for integrating Settler in frontend apps | MIT |
| `packages/cli` | Protocol | Command-line interface for protocol operations | MIT |
| `packages/protocol` | Protocol | Core protocol specification, types, and shared protocol utilities | MIT |
| `packages/shared` | Shared (OSS-safe) | Common types, utilities, and helpers safe for OSS inclusion | MIT |
| `apps/web` | Mixed | Marketing site + public docs + protocol pages (OSS) | MIT |
| `apps/console` | Management | Licensed SaaS console application (tenant management, RBAC, admin) | Proprietary |
| `packages/enterprise` | Management | Enterprise connectors, policy packs, deployment tooling | Proprietary |
| `/protocol/*` routes | Protocol | OSS protocol documentation, SDK docs, examples, quickstart | MIT |
| `/docs/*` routes | Protocol | Public documentation (clearly labeled OSS vs SaaS) | MIT |
| `/console/*` routes | Management | Licensed SaaS console (gated, requires authentication) | Proprietary |
| `/enterprise/*` routes | Management | Enterprise sales pages, connector docs, instance management | Proprietary |
| `/pricing` route | Mixed | Pricing page clearly separating Protocol (free) vs Console/Enterprise (paid) | MIT |

---

## Detailed Breakdown

### Protocol (OSS) Components

**SDKs & Clients**
- `packages/sdk` - TypeScript/Node.js SDK
- `packages/sdk-python` - Python SDK
- `packages/sdk-go` - Go SDK
- `packages/sdk-ruby` - Ruby SDK
- `packages/react-settler` - React components
- `packages/cli` - CLI tool

**Protocol Core**
- `packages/protocol` - Core protocol specification, API contracts, protocol-level types
- Protocol examples and tutorials
- API documentation and OpenAPI specs

**Routes**
- `/protocol` - Protocol overview, guarantees, quickstart
- `/protocol/sdk` - SDK documentation
- `/protocol/spec` - Protocol specification
- `/protocol/examples` - Code examples and tutorials
- `/docs` - Public documentation (OSS-focused)

### Management (Licensed SaaS) Components

**Console Application**
- `apps/console` - Full SaaS console application
  - Tenant management
  - User administration
  - RBAC and permissions
  - Audit logs
  - Billing integration
  - Multi-tenant operations
  - SSO configuration
  - Compliance dashboards

**Enterprise Components**
- `packages/enterprise` - Enterprise-only features
  - Enterprise connectors (private integrations)
  - Policy packs
  - Deployment tooling
  - Custom integrations
  - Advanced compliance features

**Routes**
- `/console` - Console product page (gated) + login entry
- `/console/*` - All console application routes (dashboard, settings, admin, etc.)
- `/enterprise` - Enterprise sales and feature pages
- `/enterprise/connectors` - Enterprise connector documentation
- `/enterprise/instances` - Dedicated instance management docs

### Shared (OSS-safe) Components

**Common Utilities**
- `packages/shared` - Safe shared code
  - Type definitions (protocol-level only)
  - Utility functions (no enterprise logic)
  - Common constants
  - Validation helpers (protocol-level)

**Rules for Shared Code**
- Must not import from `packages/enterprise`
- Must not import from `apps/console` internals
- Must not contain business logic specific to SaaS operations
- Can be safely included in OSS protocol bundles

---

## Import Boundaries

### Allowed Imports

**Protocol packages can import:**
- `packages/protocol`
- `packages/shared`
- Standard npm packages

**Console app can import:**
- `packages/protocol` (for protocol client usage)
- `packages/shared` (for shared utilities)
- `packages/enterprise` (for enterprise features)
- Standard npm packages

**Enterprise packages can import:**
- `packages/protocol` (for protocol client usage)
- `packages/shared` (for shared utilities)
- Standard npm packages

### Forbidden Imports

**Protocol packages CANNOT import:**
- `packages/enterprise/*`
- `apps/console/*` (except public API surface if needed)
- Any SaaS-specific business logic

**Shared packages CANNOT import:**
- `packages/enterprise/*`
- `apps/console/*`
- Any licensed SaaS code

---

## Route Classification

### Public OSS Routes (`/protocol/*`, `/docs/*`)
- No authentication required
- Fully accessible
- Can be cached/CDN'd
- No tenant isolation needed

### Licensed SaaS Routes (`/console/*`, `/enterprise/*`)
- Authentication required (except marketing pages)
- Tenant isolation enforced
- Graceful degradation on backend failures
- Error boundaries required
- Telemetry and logging

---

## Build & Bundle Boundaries

### OSS Protocol Bundle
**Includes:**
- All `packages/protocol/*` packages
- `packages/shared`
- Protocol examples
- Protocol documentation

**Excludes:**
- `packages/enterprise/*`
- `apps/console/*` internals
- SaaS-specific business logic

### Console Application Bundle
**Includes:**
- `apps/console` application
- `packages/enterprise` (if licensed)
- `packages/protocol` (as dependency)
- `packages/shared` (as dependency)

**Deploys independently** from protocol packages

---

## Verification

See [VERIFICATION.md](./VERIFICATION.md) for automated checks that enforce these boundaries.

---

## Updates

This boundary map should be updated whenever:
- New packages are added
- New routes are created
- Import relationships change
- New features are added that affect the protocol/management boundary

Last updated: 2024-01-XX
