# Settler OSS

- **Deterministic reconciliation tooling** for comparing datasets, surfacing variances, and producing audit-ready evidence bundles.
- **Open-source SDKs and CLI** for integrating reconciliation into local workflows or CI.
- **Local-first**: run the engine with fixtures in this repo, no hosted account required.
- **Cloud optional**: hosted adapters and managed runs live outside this repo.

**Who this is for:** engineers and operators building reconciliation workflows who need a transparent, self-hostable baseline.

**Quick start:** follow [Quick Start](#quick-start) to run the engine on the included fixtures in a few minutes.

---

## Why This Exists

Financial reconciliation is often hidden behind opaque systems and manual spreadsheets. That makes audits slow, repeatability weak, and engineering teams dependent on vendor-specific logic. Settler OSS exists to provide a deterministic, inspectable baseline for reconciliation so teams can test locally, integrate in CI, and reason about results without vendor lock-in.

## What This Project Is

- An open-source toolkit that ships SDKs, protocol types, and a local reconciliation engine.
- A monorepo for building and validating reconciliation workflows with deterministic outputs.
- A foundation you can self-host, extend, or integrate with optional cloud services.

## What This Project Is NOT

- Not an accounting system, ledger, or compliance solution.
- Not a hosted service by default (cloud is optional and separate).
- Not a managed adapter library for third-party providers.

## Where This Fits

Settler OSS is the open-source layer in an open-core model:

```
Your system → Settler OSS SDK/CLI → (optional) Settler Cloud
```

- **Depends on:** Node.js tooling and the local engine binary (Go build) for engine runs.
- **Used by:** application teams that need deterministic reconciliation runs and audit artifacts.

## Core Capabilities

- Deterministic reconciliation engine with fixture-based local runs.
- SDKs and protocol types for modeling reconciliation inputs/outputs.
- CLI and scripts for local execution and CI integration.
- Documentation that defines invariants, guarantees, and boundaries.

## Quick Start

**Prerequisites:** Node.js 18+, Go 1.21+, and npm.

```bash
npm install
npm run settler:run -- --input tools/settler-engine/fixtures/basic/engine_input.json
```

**Success signal:** the command prints `Run complete.` plus a variance total and output paths.

Need a longer walkthrough? See [docs/engine/QUICKSTART.md](./docs/engine/QUICKSTART.md).

## Architecture Overview

Key directories:

- `packages/` — SDKs, shared utilities, and protocol definitions.
- `tools/settler-engine/` — Go-based reconciliation engine and fixtures.
- `apps/` — UI apps and console tooling.
- `docs/` — guarantees, invariants, and operational guidance.

High-level flow:

1. Define inputs and ruleset (fixtures or your own data).
2. Run the engine locally to produce deterministic outputs.
3. Consume output in your own system or optional UI tooling.

## Extending the Project

- Add new SDKs or packages under `packages/` and wire them into workspace scripts.
- Preserve protocol invariants defined in `packages/protocol` and docs.
- Run `npm run check-boundaries` to ensure OSS/cloud separation stays intact.
- Update docs alongside behavioral changes.

Common pitfalls:

- Shipping cloud-only behavior inside OSS packages.
- Changing protocol types without updating fixtures and docs.
- Skipping deterministic output validation.

## Failure & Degradation Model

- Engine and CLI commands exit non-zero on invalid inputs or build failures.
- Local runs do not require network access unless you call cloud APIs explicitly.
- Outputs are written to a target directory for inspection; nothing is auto-deployed.

## Security & Safety Considerations

- Treat API keys as secrets and load them via environment variables.
- Use test data when iterating on reconciliation rules.
- Review `docs/THREAT_MODEL.md` and `docs/INVARIANTS.md` before production use.

## Contributing

We welcome focused contributions that improve stability, documentation, and real-world usability.

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for workflow and expectations.
- Use Discussions for open-ended questions and design proposals.
- Run `npm run verify` before submitting a PR.

## License & Governance

- MIT licensed (see [LICENSE](./LICENSE)).
- Governance model in [GOVERNANCE.md](./GOVERNANCE.md).
- Security reporting in [SECURITY.md](./SECURITY.md).
