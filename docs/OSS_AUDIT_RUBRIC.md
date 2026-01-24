# OSS Repository Audit Scoring Rubric

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Purpose:** Objective scoring framework for evaluating OSS project release readiness

---

## Overview

This rubric provides a weighted scoring system to assess whether an OSS repository is ready for official release. Each category is scored 0-3, with weights reflecting importance to project success and user trust.

**Passing Score for Release:** ≥ 85/100
**Target Score:** ≥ 90/100

---

## Scoring Scale

| Score | Meaning | Description |
|-------|---------|-------------|
| **0** | Missing | Feature/practice absent or severely deficient |
| **1** | Partial | Basic implementation but significant gaps |
| **2** | Good | Solid implementation with minor improvements needed |
| **3** | Excellent | Best-in-class, production-ready |

---

## Scoring Categories

### 1. Problem Clarity & Scope Definition (Weight: 8/100)

**What it measures:** Clear articulation of what the project does and does NOT do.

| Score | Criteria |
|-------|----------|
| **3** | README clearly states problem solved, target users, and explicit non-goals/out-of-scope items. OSS_SCOPE.md or equivalent defines boundaries. |
| **2** | README states purpose but lacks non-goals. Some ambiguity about scope. |
| **1** | Vague purpose statement. Unclear what's included vs excluded. |
| **0** | No clear problem statement. Users confused about use cases. |

**Current Score:** [ ]
**Evidence:** README.md, OSS_SCOPE.md, PRODUCT_BOUNDARIES.md

---

### 2. Trust & Inspectability (Weight: 12/100)

**What it measures:** No hidden behavior, telemetry, or "phone home" code. Source is the truth.

| Score | Criteria |
|-------|----------|
| **3** | Zero telemetry, no analytics, no account requirements. Automated checks (e.g., `secret-leak:check`). Threat model documented. |
| **2** | Minimal analytics (opt-in only). Source is inspectable but lacks automated checks. |
| **1** | Opt-out telemetry or unclear data collection. |
| **0** | Hidden telemetry, secret API calls, or account requirements for OSS features. |

**Current Score:** [ ]
**Evidence:** SECURITY.md, THREAT_MODEL.md, scripts/check-secrets.ts

---

### 3. Licensing Clarity & Fork Safety (Weight: 10/100)

**What it measures:** Unambiguous license, fork-friendly, no hidden restrictions.

| Score | Criteria |
|-------|----------|
| **3** | OSI-approved license (MIT, Apache 2.0, etc.). LICENSE file present. No CLA. Clear proprietary boundaries if open-core. |
| **2** | OSI license present but unclear proprietary boundaries or CLA required. |
| **1** | License present but restrictive (e.g., "non-commercial use"). |
| **0** | No license or all-rights-reserved. |

**Current Score:** [ ]
**Evidence:** LICENSE, docs/LICENSING.md, package.json `license` field

---

### 4. Determinism & Reproducibility (Weight: 8/100)

**What it measures:** Predictable behavior, reproducible builds, same input → same output.

| Score | Criteria |
|-------|----------|
| **3** | Documented determinism guarantees. Locked dependencies. Reproducible builds. Version pinning. |
| **2** | Mostly deterministic but lacks documentation or has unlocked deps. |
| **1** | Non-deterministic behavior in core logic. Unpinned dependencies. |
| **0** | Random outputs, no reproducibility. |

**Current Score:** [ ]
**Evidence:** docs/DETERMINISM.md, package-lock.json/pnpm-lock.yaml, docs/INVARIANTS.md

---

### 5. Governance & Contribution Paths (Weight: 8/100)

**What it measures:** Clear decision-making process, welcoming to contributors.

| Score | Criteria |
|-------|----------|
| **3** | GOVERNANCE.md defines decision process. CONTRIBUTING.md with first-PR-in-10-min path. Code of Conduct. Active maintainers. |
| **2** | CONTRIBUTING.md exists but lacks detail. Unclear decision process. |
| **1** | No contribution guide. Unclear how to participate. |
| **0** | Closed to contributions or hostile community. |

**Current Score:** [ ]
**Evidence:** GOVERNANCE.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md

---

### 6. Security Posture & Disclosure (Weight: 10/100)

**What it measures:** Responsible security practices, clear disclosure process.

| Score | Criteria |
|-------|----------|
| **3** | SECURITY.md with disclosure policy. Automated secret scanning. Threat model documented. Clear scope of security guarantees. |
| **2** | SECURITY.md exists but vague. No automated checks. |
| **1** | No formal security policy. Unclear disclosure process. |
| **0** | No security considerations documented. |

**Current Score:** [ ]
**Evidence:** SECURITY.md, docs/THREAT_MODEL.md, scripts/check-secrets.ts, .github/workflows/ci.yml

---

### 7. Documentation Quality & Time-to-First-Value (Weight: 12/100)

**What it measures:** Can a new user get value in ≤10 minutes?

| Score | Criteria |
|-------|----------|
| **3** | Quickstart guide ≤10 minutes. Clear README. API docs. Examples that run. FAQ. |
| **2** | Good README but missing quickstart or examples don't work. |
| **1** | Sparse docs. No examples. Unclear how to start. |
| **0** | No documentation or severely outdated. |

**Current Score:** [ ]
**Evidence:** README.md, docs/QUICKSTART_10MIN.md, examples/, FAQ.md

---

### 8. Portability & Stack-Agnosticity (Weight: 10/100)

**What it measures:** Works across OS, platforms, frameworks without vendor lock-in.

| Score | Criteria |
|-------|----------|
| **3** | Cross-platform (Windows/macOS/Linux). No vendor lock-in (categories, not brands). Adapter pattern for integrations. Stack-agnostic docs. |
| **2** | Works on major platforms but has vendor-specific examples or minor OS assumptions. |
| **1** | Linux-only or heavily coupled to specific vendors (e.g., "AWS-only"). |
| **0** | Single-platform, vendor-locked. |

**Current Score:** [ ]
**Evidence:** docs/STACK_AGNOSTICITY.md, package.json `engines`, build scripts

---

### 9. Composability & Adapter Architecture (Weight: 8/100)

**What it measures:** Clean separation of concerns, extensible design.

| Score | Criteria |
|-------|----------|
| **3** | Core logic pure/deterministic. Adapters for I/O. Stable interfaces. Clear extension points. |
| **2** | Some separation but tightly coupled in places. |
| **1** | Monolithic design. Hard to extend. |
| **0** | Spaghetti code. No modularity. |

**Current Score:** [ ]
**Evidence:** docs/ARCHITECTURE.md, docs/BOUNDARY_MAP.md, package structure

---

### 10. Release Hygiene (Weight: 14/100)

**What it measures:** Versioning, changelog, CI, build stability.

| Score | Criteria |
|-------|----------|
| **3** | Semantic versioning. CHANGELOG.md (Keep a Changelog format). CI green (lint/test/build). Automated release process documented. |
| **2** | Versioning but irregular changelog. CI mostly green. |
| **1** | No versioning or changelog. CI failing or missing. |
| **0** | No CI. No versioning. Broken builds. |

**Current Score:** [ ]
**Evidence:** CHANGELOG.md, package.json `version`, .github/workflows/ci.yml, docs/RELEASING.md

---

## Weighted Score Calculation

```
Total Score = Σ (Category Score × Weight)

Example:
- Problem Clarity: 3 × 8 = 24
- Trust: 3 × 12 = 36
- Licensing: 3 × 10 = 30
...
Total: 90/100
```

---

## Release Decision Matrix

| Total Score | Decision | Action |
|-------------|----------|--------|
| **90-100** | **Ready for Release** | Proceed with launch. Announce widely. |
| **85-89** | **Conditionally Ready** | Address minor gaps. Soft launch. |
| **70-84** | **Not Ready** | Fix critical gaps. Internal testing only. |
| **< 70** | **Block Release** | Major work needed. Do not release publicly. |

---

## Release Blockers (Auto-Fail)

**Any ONE of these blocks release, regardless of total score:**

- ❌ License missing or unclear
- ❌ Secrets/credentials committed to repo
- ❌ Telemetry without opt-in
- ❌ README missing or severely outdated (>6 months)
- ❌ CI failing on main branch
- ❌ Security vulnerabilities (high/critical) unpatched
- ❌ Proprietary code in OSS packages (boundary violation)
- ❌ No contribution guidelines (CONTRIBUTING.md)
- ❌ Broken installation instructions (cannot install)

---

## Current Audit

**Date:** _______________
**Auditor:** _______________
**Version:** _______________

| Category | Score (0-3) | Weight | Weighted Score | Notes |
|----------|-------------|--------|----------------|-------|
| 1. Problem Clarity | | 8 | | |
| 2. Trust & Inspectability | | 12 | | |
| 3. Licensing Clarity | | 10 | | |
| 4. Determinism | | 8 | | |
| 5. Governance | | 8 | | |
| 6. Security Posture | | 10 | | |
| 7. Documentation Quality | | 12 | | |
| 8. Portability | | 10 | | |
| 9. Composability | | 8 | | |
| 10. Release Hygiene | | 14 | | |
| **TOTAL** | | **100** | | |

**Release Blockers Present?** [ ] Yes [ ] No
**List Blockers:** _______________

**Decision:** [ ] Ready [ ] Conditional [ ] Not Ready [ ] Blocked

---

## Improvement Roadmap

**Gaps Identified:**

1. _______________
2. _______________
3. _______________

**Actions Required:**

1. _______________
2. _______________
3. _______________

**Target Completion:** _______________

---

## Appendix: Scoring Examples

### Example 1: Excellent Project (Score: 94/100)

- Problem Clarity: 3 (24/24)
- Trust: 3 (36/36)
- Licensing: 3 (30/30)
- Determinism: 3 (24/24)
- Governance: 2 (16/24) ← room for improvement
- Security: 3 (30/30)
- Documentation: 3 (36/36)
- Portability: 3 (30/30)
- Composability: 3 (24/24)
- Release Hygiene: 3 (42/42)

**Total: 292/300 → 97/100** ✅ **Ready for Release**

### Example 2: Borderline Project (Score: 82/100)

- Problem Clarity: 2 (16/24)
- Trust: 3 (36/36)
- Licensing: 2 (20/30) ← needs clarity
- Determinism: 2 (16/24)
- Governance: 1 (8/24) ← critical gap
- Security: 2 (20/30)
- Documentation: 2 (24/36)
- Portability: 2 (20/30)
- Composability: 2 (16/24)
- Release Hygiene: 2 (28/42)

**Total: 204/300 → 68/100** ❌ **Not Ready** (below 85 threshold)

---

## Continuous Improvement

**Re-audit frequency:** Every major release or every 6 months.

**Trend tracking:** Monitor score over time to ensure quality improvement.

---

## Related Documentation

- [Pre-Launch Checklist](./PRE_LAUNCH_CHECKLIST.md) - Tactical pre-release tasks
- [Five Year Survivability](./FIVE_YEAR_SURVIVABILITY.md) - Long-term viability assessment
- [Threat Model](./THREAT_MODEL.md) - Security boundaries
- [Architecture](./ARCHITECTURE.md) - Technical design

---

**This rubric is binding for Settler OSS releases.**

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
