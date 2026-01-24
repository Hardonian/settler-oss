# Repository Map

**Version:** 1.0.0
**Last Updated:** 2026-01-24

This document provides a comprehensive map of the Settler OSS repository structure, helping you navigate the codebase quickly.

---

## Quick Navigation

- [Core Packages](#core-packages) - OSS client libraries
- [Applications](#applications) - Web and console apps
- [Documentation](#documentation) - All documentation files
- [Infrastructure](#infrastructure) - Build, CI, and tooling
- [Key Files](#key-files) - Important files to know

---

## Repository Structure

```
settler-oss/
├── packages/           # Core OSS packages (npm workspaces)
│   ├── protocol/      # Protocol types and API specs (MIT)
│   ├── sdk/           # TypeScript/Node.js SDK (MIT)
│   ├── cli/           # Command-line tool (MIT)
│   ├── shared/        # Shared utilities (MIT)
│   ├── react-settler/ # React components (MIT, coming soon)
│   ├── enterprise/    # Enterprise features (PROPRIETARY)
│   ├── sdk-go/        # Go SDK (MIT, skeleton)
│   ├── sdk-python/    # Python SDK (MIT, skeleton)
│   └── sdk-ruby/      # Ruby SDK (MIT, skeleton)
├── apps/              # Applications
│   ├── web/           # Marketing site + docs (MIT)
│   └── console/       # Developer console (PROPRIETARY)
├── contracts/         # API contracts (OpenAPI spec)
├── docs/              # Technical documentation
├── examples/          # Example code (coming soon)
├── archive/           # Historical documentation (deprecated)
├── scripts/           # Build and validation scripts
├── .github/           # GitHub Actions workflows
└── [config files]     # package.json, tsconfig.json, etc.
```

---

## Core Packages

### packages/protocol/

**Purpose:** Type-safe API specification and core types
**License:** MIT
**Entry Point:** `src/index.ts`
**Exports:** Protocol types, constants, interfaces

**Key Files:**
- `src/index.ts` - Main entry with PROTOCOL_VERSION, PROTOCOL_ENDPOINTS
- `src/types/index.ts` - Core interfaces: ReconcileRequest, Transaction, MatchingRules, etc.
- `package.json` - Package metadata
- `README.md` - Package documentation

**Dependencies:** None (zero dependencies by design)

**Used By:** All other packages (foundation)

---

### packages/sdk/

**Purpose:** Official TypeScript/Node.js HTTP client
**License:** MIT
**Entry Point:** `src/index.ts`
**Exports:** SettlerClient class, types (re-exported from protocol)

**Key Files:**
- `src/index.ts` - Main SDK implementation (SettlerClient class)
- `src/types.ts` - SDK-specific types
- `package.json` - Package metadata
- `README.md` - SDK usage guide

**Dependencies:** `@settler/protocol`

**Used By:** Applications integrating with Settler Cloud

---

### packages/cli/

**Purpose:** Command-line tool for local development and testing
**License:** MIT
**Entry Point:** `src/cli.ts` (binary)
**Commands:** `demo`, `init`, `reconcile`, `doctor`, `adapters`

**Key Files:**
- `src/cli.ts` - CLI entry point and command router
- `src/commands/` - Individual command implementations
  - `demo.ts` - Run canned demo
  - `reconcile.ts` - Reconcile CSV files
  - `doctor.ts` - Environment health check
  - `init.ts` - Initialize sample data
  - `adapters.ts` - List adapters (placeholder)
- `src/utils/` - CLI utilities
  - `csv.ts` - CSV parsing
  - `reconcile.ts` - Local reconciliation logic
  - `format.ts` - Output formatting
- `package.json` - Package metadata with `bin` field
- `README.md` - CLI documentation

**Dependencies:** `commander`, `@settler/protocol`, `@settler/shared`

**Binary:** `settler` (installed globally via `npm install -g @settler/cli`)

---

### packages/shared/

**Purpose:** Shared utilities safe for OSS distribution
**License:** MIT
**Entry Point:** `src/index.ts`
**Exports:** Utility functions

**Key Files:**
- `src/index.ts` - Exported utilities
  - `generateCorrelationId()` - Request tracking
  - `isValidApiKeyFormat()` - API key validation
  - `formatError()` - Error formatting

**Dependencies:** None

**Boundary Rule:** CANNOT import `@settler/enterprise` or `apps/console` internals

---

### packages/react-settler/

**Purpose:** React components for reconciliation UIs
**License:** MIT
**Entry Point:** `src/index.ts`
**Status:** Coming soon (stub implementation)

**Key Files:**
- `src/index.ts` - Component exports (placeholder)
- `package.json` - Package metadata

**Planned Components:**
- `SettlerProvider` - Context provider
- `ReconciliationView` - Main reconciliation UI
- `MatchTable` - Display matches
- `TransactionList` - List transactions

**Dependencies:** `react`, `react-dom` (peer dependencies), `@settler/sdk`

---

### packages/enterprise/

**Purpose:** Enterprise/proprietary features
**License:** PROPRIETARY
**Status:** Workspace-only (not published)

**Boundary Enforcement:**
- OSS packages CANNOT import enterprise code
- Enforced by ESLint rules and `scripts/check-boundaries.ts`

---

### packages/sdk-{go,python,ruby}/

**Purpose:** Language-specific SDK implementations
**License:** MIT
**Status:** Skeleton implementations only

**Future Implementation:**
- Full HTTP client implementations
- Language-idiomatic APIs
- Published to respective package managers (Go modules, PyPI, RubyGems)

---

## Applications

### apps/web/

**Purpose:** Marketing site and documentation portal
**Framework:** Next.js 14 with React 18
**License:** MIT
**URL:** https://settler.dev (production)

**Key Directories:**
- `src/app/` - Next.js app router pages
  - `/` - Home page
  - `/download/` - Installation guide
  - `/docs/` - Documentation portal
  - `/protocol/` - API protocol pages
  - `/pricing/` - Pricing page
  - `/enterprise/` - Enterprise features
- `public/` - Static assets
- `package.json` - Dependencies and scripts

**Build:** `npm run build` (produces `.next/` directory)

**Deployment:** Vercel (configured in `vercel.json`)

---

### apps/console/

**Purpose:** Developer console (multi-tenant SaaS dashboard)
**Framework:** Next.js 14 with React 18
**License:** PROPRIETARY
**Status:** Workspace-only (not published)

**Key Directories:**
- `src/app/` - Console pages
- `package.json` - Dependencies and scripts

---

## Documentation

### Root Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview, quickstart, links |
| `CONTRIBUTING.md` | Contribution guidelines |
| `CODE_OF_CONDUCT.md` | Community guidelines |
| `SECURITY.md` | Security policy and disclosure |
| `LICENSE` | MIT license text |
| `CHANGELOG.md` | Version history and release notes |
| `GOVERNANCE.md` | Project governance model |
| `OSS_SCOPE.md` | OSS vs Cloud boundaries |
| `PRODUCT_BOUNDARIES.md` | Feature comparison |
| `VERSIONING.md` | Semantic versioning policy |
| `ROADMAP.md` | Product roadmap |
| `FAQ.md` | Frequently asked questions |
| `GETTING_STARTED.md` | Detailed setup guide |
| `QUICK_START.md` | Quick start tutorial |

---

### docs/ Directory

**Technical Documentation:**

| File | Topic |
|------|-------|
| `ARCHITECTURE.md` | System architecture |
| `STACK_AGNOSTICITY.md` | Provider-agnostic design |
| `CLOUD_VS_OSS.md` | Detailed OSS vs Cloud comparison |
| `BOUNDARY_MAP.md` | Module classification |
| `OSS_VS_ENTERPRISE_BOUNDARY.md` | Technical boundaries |

**Trust & Security:**

| File | Topic |
|------|-------|
| `THREAT_MODEL.md` | Security boundaries |
| `GUARANTEES.md` | Explicit guarantees and non-guarantees |
| `DETERMINISM.md` | Deterministic behavior spec |
| `INVARIANTS.md` | Financial correctness requirements |
| `VERIFICATION.md` | Testing approach |

**External Review:**

| File | Topic |
|------|-------|
| `ADVERSARIAL_FAQ.md` | Hard questions from auditors/CFOs |
| `AUDIT_READINESS.md` | Using Settler in financial audits |
| `LONG_TERM_SUPPORT.md` | Compatibility policy |

**Project Health & Release:**

| File | Topic |
|------|-------|
| `OSS_AUDIT_RUBRIC.md` | Release readiness scoring |
| `PRE_LAUNCH_CHECKLIST.md` | Pre-release checklist |
| `FIVE_YEAR_SURVIVABILITY.md` | Long-term viability framework |
| `RELEASING.md` | Release process |
| `REPO_MAP.md` | This file |
| `INDEX.md` | Documentation index |

**Guides:**

| File | Topic |
|------|-------|
| `QUICKSTART_10MIN.md` | 10-minute tutorial |
| `SELF_HOSTING.md` | Self-hosting guide |
| `LICENSING.md` | License details |

---

### archive/ Directory

**Status:** Deprecated (see `archive/README.md`)

Historical documentation from early development. Not current. Kept for reference only.

---

## Infrastructure

### scripts/

**Build and Validation Scripts:**

| File | Purpose | Command |
|------|---------|---------|
| `check-boundaries.ts` | Enforce OSS/Enterprise boundaries | `npm run check-boundaries` |
| `check-secrets.ts` | Detect secret leaks | `npm run secret-leak:check` |
| `validate-contracts.ts` | Validate OpenAPI contracts | `npm run contracts:check` |
| `classify-oss.sh` | Classify files as OSS/proprietary | `./scripts/classify-oss.sh` |

---

### .github/

**GitHub Actions Workflows:**

| File | Purpose | Trigger |
|------|---------|---------|
| `workflows/ci.yml` | Main CI pipeline | Push, PR |
| `workflows/auto-sync-oss.yml` | Auto-sync from private repo | Scheduled |
| `workflows/publish-mirror.yml` | Publish to mirror registry | Manual |
| `workflows/accept-sync.yml` | Accept auto-sync commits | Push |
| `workflows/stale.yml` | Mark stale issues | Scheduled |

**GitHub Configuration:**

- `ISSUE_TEMPLATE/` - Issue templates (bug, feature, security, question)
- `pull_request_template.md` - PR template
- `dependabot.yml` - Dependabot configuration

---

### contracts/

**API Contracts:**

- `openapi.yaml` - OpenAPI 3.0.3 specification for Settler Cloud API
- `schemas/` - Reusable JSON schemas (if any)
- `examples/` - Example requests/responses

**Validation:** `npm run contracts:check`

---

### examples/

**Status:** Placeholder (README only, actual examples coming soon)

**Planned Examples:**
- TypeScript integration
- Python integration
- Go integration
- Ruby integration
- Next.js app
- Express.js app
- Bank reconciliation workflow
- Invoice matching workflow

---

## Key Files

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Root workspace config, scripts, dependencies |
| `pnpm-workspace.yaml` | pnpm workspace configuration |
| `tsconfig.json` | Root TypeScript config |
| `.eslintrc.json` | ESLint configuration with boundary rules |
| `jest.config.js` | Jest testing configuration |
| `vercel.json` | Vercel deployment config |
| `.gitignore` | Git ignore patterns |

---

### Lock Files

| File | Purpose |
|------|---------|
| `package-lock.json` | npm dependency lock file |
| `pnpm-lock.yaml` | pnpm dependency lock file |

**Note:** Both committed for compatibility. Use `npm` or `pnpm` consistently within a session.

---

## Finding Things

### "I want to..."

**...understand the project**
- Start: `README.md`
- Deep dive: `docs/ARCHITECTURE.md`

**...contribute code**
- Start: `CONTRIBUTING.md`
- Governance: `GOVERNANCE.md`

**...use the SDK**
- Start: `packages/sdk/README.md`
- API: `packages/protocol/src/types/index.ts`

**...use the CLI**
- Start: `packages/cli/README.md`
- Commands: `packages/cli/src/commands/`

**...understand OSS vs Cloud**
- Start: `OSS_SCOPE.md`
- Details: `docs/CLOUD_VS_OSS.md`

**...report a security issue**
- Start: `SECURITY.md`

**...see what's changing**
- Start: `CHANGELOG.md`

**...understand the release process**
- Start: `docs/RELEASING.md`
- Checklist: `docs/PRE_LAUNCH_CHECKLIST.md`

---

## Entry Points by Use Case

### For Users

1. `README.md` - Start here
2. `packages/sdk/README.md` - If using TypeScript/Node.js
3. `packages/cli/README.md` - If using CLI
4. `docs/QUICKSTART_10MIN.md` - 10-minute tutorial
5. `FAQ.md` - Common questions

### For Contributors

1. `CONTRIBUTING.md` - How to contribute
2. `GOVERNANCE.md` - How decisions are made
3. `CODE_OF_CONDUCT.md` - Community standards
4. `docs/ARCHITECTURE.md` - Understand the design
5. `docs/REPO_MAP.md` - Navigate the codebase (this file)

### For Auditors/Compliance

1. `SECURITY.md` - Security policy
2. `docs/THREAT_MODEL.md` - Security boundaries
3. `docs/ADVERSARIAL_FAQ.md` - Hard questions answered
4. `docs/AUDIT_READINESS.md` - Using in audits
5. `docs/GUARANTEES.md` - What we guarantee (and don't)

### For Maintainers

1. `GOVERNANCE.md` - Decision process
2. `docs/RELEASING.md` - Release process
3. `docs/PRE_LAUNCH_CHECKLIST.md` - Pre-release checks
4. `docs/OSS_AUDIT_RUBRIC.md` - Quality scoring
5. `docs/FIVE_YEAR_SURVIVABILITY.md` - Long-term planning

---

## File Naming Conventions

- **ALL_CAPS.md** - Root-level documentation (README, CONTRIBUTING, etc.)
- **PascalCase.md** - Technical docs in `docs/` (ARCHITECTURE, THREAT_MODEL)
- **lowercase/** - Directories (packages, apps, docs)
- **kebab-case.ts** - Source files (check-boundaries.ts)
- **camelCase.ts** - Internal modules (reconcile.ts)

---

## Dependencies Between Packages

```
Protocol (no deps)
   ↑
   ├── SDK
   │    ↑
   │    ├── CLI
   │    └── React Components
   │
   └── Shared (no deps)
        ↑
        └── CLI
```

**Rule:** Protocol and Shared have ZERO external dependencies (by design).

---

## Build Order

1. `packages/protocol` (no deps)
2. `packages/shared` (no deps)
3. `packages/sdk` (depends on protocol)
4. `packages/cli` (depends on protocol, shared)
5. `packages/react-settler` (depends on SDK)
6. `apps/web` (standalone Next.js)
7. `apps/console` (standalone Next.js)

**Command:** `npm run build` (builds in correct order via npm workspaces)

---

## Related Documentation

- [Documentation Index](./INDEX.md) - All docs organized by topic
- [Architecture](./ARCHITECTURE.md) - System design
- [Contributing](../CONTRIBUTING.md) - How to contribute

---

**Questions?** Open a [GitHub Discussion](https://github.com/shardie-github/settler-oss/discussions).

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
