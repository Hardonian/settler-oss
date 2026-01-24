# Will This Survive 5 Years? — OSS Project Survivability Framework

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Purpose:** Long-term viability assessment and sustainability planning

---

## Overview

This framework evaluates whether an OSS project can survive, thrive, and remain useful for **at least 5 years** after public release. It addresses:
- Maintainer sustainability (bus factor)
- Backward compatibility strategy
- Dependency risk management
- Governance maturity
- Ecosystem capture resistance
- Community health
- Financial sustainability (OSS-safe)

**Target Score:** ≥ 80/100 for projects targeting 5+ year lifespan.

---

## Five Year Survivability Assessment

### 1. Bus Factor & Maintainer Sustainability (Weight: 15/100)

**Question:** What happens if the primary maintainer disappears tomorrow?

#### Scoring Rubric

| Score | Criteria |
|-------|----------|
| **3** | 3+ active maintainers. Knowledge documented. Succession plan. Newcomer onboarding process. |
| **2** | 2 maintainers. Some docs but key knowledge in heads. No formal succession plan. |
| **1** | Single maintainer. Minimal docs. Knowledge siloed. |
| **0** | Single maintainer, no docs, no activity in 6+ months. |

#### Mitigation Strategies

- **Document everything**: Architecture, release process, deployment, edge cases
- **Grow co-maintainers**: Identify 2-3 trusted contributors, grant commit access
- **Create runbooks**: Step-by-step guides for common tasks (releases, security patches)
- **Automate critical paths**: CI/CD for releases, automated dependency updates
- **Public succession plan**: GOVERNANCE.md defines how new maintainers are elected
- **"Hit by a bus" test**: Can a stranger fork and maintain using only public docs?

#### Current State

**Maintainers:** [ ] 1 [ ] 2 [ ] 3+ [ ] Team
**Succession Plan:** [ ] Yes [ ] No
**Knowledge Docs:** [ ] Comprehensive [ ] Partial [ ] Missing

**Score:** _____ / 3

---

### 2. Backward Compatibility Policy (Weight: 15/100)

**Question:** Can users upgrade without breaking their code?

#### Scoring Rubric

| Score | Criteria |
|-------|----------|
| **3** | Semantic versioning enforced. Deprecation warnings 1-2 major versions before removal. Migration guides. LTS support defined. |
| **2** | Semver followed but no deprecation warnings. Some migration docs. |
| **1** | Breaking changes in minor versions. No migration guides. |
| **0** | No versioning or frequent breaking changes without notice. |

#### Mitigation Strategies

- **Adopt semantic versioning**: Breaking = major, features = minor, fixes = patch
- **Deprecation timeline**: Deprecate → warn (v1.x) → remove (v2.0)
- **LTS policy**: Support N-1 major versions for security patches
- **Migration scripts**: Provide codemods or automated migration tools
- **Changelog discipline**: Document EVERY breaking change
- **Compatibility tests**: CI tests against previous major versions

#### Current State

**Versioning:** [ ] Semver [ ] Adhoc [ ] None
**LTS Policy:** [ ] Defined [ ] Informal [ ] None
**Migration Guides:** [ ] Yes [ ] Partial [ ] No

**Score:** _____ / 3

---

### 3. Dependency Risk & Update Strategy (Weight: 12/100)

**Question:** What happens when a critical dependency is abandoned?

#### Scoring Rubric

| Score | Criteria |
|-------|----------|
| **3** | Minimal dependencies. All pinned. Automated updates (Dependabot). Regular audits. Vendoring strategy for critical deps. |
| **2** | Few dependencies, mostly pinned. Manual updates. No vendoring plan. |
| **1** | Many dependencies, unpinned. No update strategy. |
| **0** | Unmaintained or deprecated dependencies. Security vulnerabilities. |

#### Mitigation Strategies

- **Minimize dependencies**: Prefer standard library over npm packages
- **Pin dependencies**: Lock files committed (`package-lock.json`, `pnpm-lock.yaml`)
- **Automated updates**: Dependabot or Renovate for automated PRs
- **Dependency audits**: Weekly `npm audit` runs in CI
- **Vendoring strategy**: For critical deps, copy source into repo if abandoned
- **Escape hatches**: Design adapters so dependencies are swappable
- **Avoid "magic" deps**: No dependencies that do "too much" (hard to replace)

#### Dependency Health Matrix

| Dependency | Purpose | Maintained? | Alternatives | Vendorable? |
|------------|---------|-------------|--------------|-------------|
| commander | CLI parsing | ✅ Active | yargs, oclif | ✅ Yes |
| typescript | Compiler | ✅ Active | None (standard) | ❌ No |
| ... | ... | ... | ... | ... |

#### Current State

**Total Dependencies:** _____
**Pinned:** [ ] All [ ] Most [ ] Some [ ] None
**Automated Updates:** [ ] Yes [ ] No
**Last Audit:** _____

**Score:** _____ / 3

---

### 4. Governance Maturity Path (Weight: 12/100)

**Question:** How are decisions made? Can the project survive organizational change?

#### Scoring Rubric

| Score | Criteria |
|-------|----------|
| **3** | GOVERNANCE.md defines decision process. Multiple maintainers. Transparent roadmap. Contributor ladder (user → contributor → maintainer). |
| **2** | Informal governance. Decisions documented in issues. Single-maintainer final say. |
| **1** | No governance docs. Opaque decision-making. |
| **0** | Hostile to contributors or decisions made privately. |

#### Mitigation Strategies

- **Document governance**: GOVERNANCE.md with decision process
- **Define roles**: Maintainer, committer, contributor, user
- **Contributor ladder**: Clear path from first PR to maintainer
- **Transparent roadmap**: Public ROADMAP.md or GitHub Projects
- **RFC process**: Proposal → discussion → decision → implementation
- **Avoid BDFL forever**: Transition to committee or meritocracy
- **Conflict resolution**: Documented process for disagreements

#### Governance Models

| Model | Description | Pros | Cons |
|-------|-------------|------|------|
| **BDFL** | Benevolent Dictator for Life | Fast decisions | Bus factor = 1 |
| **Meritocracy** | Commit access by contribution | Scales well | Can be political |
| **Committee** | Core team votes | Democratic | Slow decisions |
| **Foundation** | Legal entity governs | Institutional trust | Overhead/cost |

#### Current State

**Governance Model:** _____
**GOVERNANCE.md:** [ ] Exists [ ] Missing
**Contributor Ladder:** [ ] Defined [ ] Informal [ ] None

**Score:** _____ / 3

---

### 5. Ecosystem Neutrality & Capture Resistance (Weight: 12/100)

**Question:** Can the project survive if a major vendor (Stripe, AWS, etc.) exits or becomes hostile?

#### Scoring Rubric

| Score | Criteria |
|-------|----------|
| **3** | Stack-agnostic design. Adapter pattern. No vendor partnerships. Works with any provider. |
| **2** | Works with major vendors but examples favor one. Some coupling. |
| **1** | Tightly coupled to specific vendors. Would break if vendor changes API. |
| **0** | Single-vendor dependent. "Official Stripe tool" positioning. |

#### Mitigation Strategies

- **Adapter pattern**: Vendor integrations behind stable interfaces
- **Category thinking**: "Payment processors" not "Stripe integration"
- **No vendor partnerships**: Avoid exclusive deals or sponsorships that bias design
- **Multi-provider examples**: Show Stripe AND PayPal AND Square in docs
- **Protocol-first design**: Define vendor-agnostic protocol (see STACK_AGNOSTICITY.md)
- **Self-hosting support**: Must work without any SaaS vendor

#### Vendor Risk Matrix

| Vendor | Dependency Level | Risk | Mitigation |
|--------|------------------|------|------------|
| Stripe | Example only | Low | Adapter pattern, multi-provider examples |
| AWS | None (OSS) | None | Cloud-agnostic design |
| ... | ... | ... | ... |

#### Current State

**Vendor Coupling:** [ ] None [ ] Low [ ] Medium [ ] High
**Adapter Pattern:** [ ] Implemented [ ] Partial [ ] None
**Self-Hosting Support:** [ ] Full [ ] Partial [ ] None

**Score:** _____ / 3

---

### 6. Community Flywheel (Issues/PRs/Reviews) (Weight: 10/100)

**Question:** Is there a healthy cycle of contributions, reviews, and releases?

#### Scoring Rubric

| Score | Criteria |
|-------|----------|
| **3** | Regular PRs from community (not just maintainers). Issues triaged within 7 days. Monthly releases. Active Discussions. |
| **2** | Occasional PRs. Issues triaged within 30 days. Irregular releases. |
| **1** | No community PRs. Issues ignored. No releases in 6+ months. |
| **0** | Dead project. No activity. |

#### Mitigation Strategies

- **"Good first issue" labels**: Lower barrier to entry
- **Fast triage**: Respond to issues within 48 hours (even if just "acknowledged")
- **Recognize contributors**: Shout-outs in CHANGELOG, all-contributors bot
- **Regular releases**: Monthly or quarterly cadence (even if minor)
- **Community calls**: Optional but builds engagement (monthly Zoom)
- **Hacktoberfest participation**: Annual spike in contributions
- **Clear contribution guide**: First PR in ≤10 minutes (CONTRIBUTING.md)

#### Community Health Metrics

| Metric | Target | Current | Trend |
|--------|--------|---------|-------|
| PRs/month | ≥5 | ___ | [ ] ↑ [ ] → [ ] ↓ |
| Issues closed/month | ≥10 | ___ | [ ] ↑ [ ] → [ ] ↓ |
| Avg issue triage time | ≤7 days | ___ | [ ] ↑ [ ] → [ ] ↓ |
| Contributors (30 days) | ≥3 | ___ | [ ] ↑ [ ] → [ ] ↓ |

#### Current State

**Recent PRs (30 days):** _____
**Recent Issues (30 days):** _____
**Active Contributors:** _____
**Last Release:** _____

**Score:** _____ / 3

---

### 7. Clear Deprecation Strategy (Weight: 8/100)

**Question:** How does the project sunset features without breaking users?

#### Scoring Rubric

| Score | Criteria |
|-------|----------|
| **3** | Documented deprecation policy. Warnings logged. Migration guides. Removal only in major versions. |
| **2** | Informal deprecation. Some warnings. Docs mention alternatives. |
| **1** | Features removed without warning. |
| **0** | No consideration for deprecation. |

#### Mitigation Strategies

- **Deprecation policy**: Document in GOVERNANCE.md or separate DEPRECATION.md
- **Timeline**: Deprecate → warn (v1.x) → remove (v2.0, ≥6 months later)
- **Runtime warnings**: Console.warn() when deprecated APIs used
- **Docs badges**: Mark deprecated APIs in docs with ⚠️ DEPRECATED badge
- **Migration guides**: Provide before/after examples
- **Codemods**: Automated migration scripts (e.g., jscodeshift)

#### Deprecation Template

```markdown
## Deprecated: `oldFunction()`

**Deprecated in:** v1.5.0
**To be removed in:** v2.0.0 (no earlier than 2027-01-01)
**Reason:** Performance issues, replaced by `newFunction()`
**Migration:**

```typescript
// Before
const result = oldFunction(data);

// After
const result = newFunction(data);
```

**See:** [Migration Guide](./MIGRATION.md#oldFunction)
```

#### Current State

**Deprecation Policy:** [ ] Documented [ ] Informal [ ] None
**Warning System:** [ ] Implemented [ ] Partial [ ] None

**Score:** _____ / 3

---

### 8. Supply Chain Security Posture (Weight: 10/100)

**Question:** Can the project resist supply chain attacks?

#### Scoring Rubric

| Score | Criteria |
|-------|----------|
| **3** | Automated secret scanning. Dependency audits in CI. 2FA required for maintainers. Signed commits. Provenance attestation. |
| **2** | Secret scanning. Dependency audits. 2FA recommended. |
| **1** | Manual security review. No automation. |
| **0** | No security practices. Secrets in repo. |

#### Mitigation Strategies

- **Secret scanning**: Pre-commit hooks + CI checks (scripts/check-secrets.ts)
- **Dependency audits**: `npm audit` in CI, fail on high/critical
- **2FA enforcement**: Require for all maintainers (GitHub org setting)
- **Signed commits**: GPG signatures required for main branch
- **Provenance**: npm provenance attestation (npm publish --provenance)
- **Lockfiles committed**: Ensure reproducible builds
- **Automated updates**: Dependabot with auto-merge for patches
- **Minimal publish access**: Only 1-2 maintainers can publish to npm

#### Security Checklist

- [ ] **Secret scanning automated**
- [ ] **Dependency audits in CI**
- [ ] **2FA required for maintainers**
- [ ] **Signed commits enforced**
- [ ] **Provenance attestation enabled**
- [ ] **Lockfiles committed**
- [ ] **Minimal publish access**

#### Current State

**Automated Security:** [ ] Full [ ] Partial [ ] None
**2FA Enforced:** [ ] Yes [ ] No
**Signed Commits:** [ ] Required [ ] Optional [ ] None

**Score:** _____ / 3

---

### 9. Documentation Evolution Strategy (Weight: 8/100)

**Question:** How does documentation stay current as the project evolves?

#### Scoring Rubric

| Score | Criteria |
|-------|----------|
| **3** | Docs versioned alongside code. Automated checks for broken links/examples. Docs in CI (tests run examples). Last-updated dates. |
| **2** | Docs updated manually. Some staleness. Links mostly work. |
| **1** | Docs rarely updated. Many broken links. Examples don't run. |
| **0** | Docs severely outdated or missing. |

#### Mitigation Strategies

- **Docs as code**: Markdown in repo, versioned with Git
- **Link checking**: CI job checks for broken links (`markdown-link-check`)
- **Example testing**: CI runs code examples to ensure they work
- **Last-updated dates**: Frontmatter with version and date
- **Automated API docs**: Generate from JSDoc/TSDoc (TypeDoc)
- **Version docs**: Keep docs for v1.x, v2.x, etc. (Docusaurus versioning)
- **Deprecation badges**: Automated badges for deprecated features

#### Documentation Health

| Doc | Last Updated | Status | Owner |
|-----|--------------|--------|-------|
| README.md | 2026-01-24 | ✅ Current | Maintainer |
| ARCHITECTURE.md | 2026-01-24 | ✅ Current | Maintainer |
| QUICKSTART.md | 2026-01-24 | ✅ Current | Maintainer |
| ... | ... | ... | ... |

#### Current State

**Docs Versioned:** [ ] Yes [ ] No
**Automated Checks:** [ ] Yes [ ] Partial [ ] None
**Last Audit:** _____

**Score:** _____ / 3

---

### 10. Funding & Enterprise Coexistence (OSS-Safe) (Weight: 8/100)

**Question:** Can the project sustain itself financially without compromising OSS principles?

#### Scoring Rubric

| Score | Criteria |
|-------|----------|
| **3** | Clear business model (open-core, support, hosting). OSS scope protected. No feature paywalls in OSS. Transparent roadmap. |
| **2** | Some funding (sponsorships, donations). OSS scope slightly fuzzy. |
| **1** | No funding model. OSS may be neglected for commercial. |
| **0** | OSS is abandonware or bait-and-switch for paid product. |

#### Sustainable Funding Models (OSS-Safe)

| Model | Description | OSS Impact | Example |
|-------|-------------|------------|---------|
| **Open Core** | OSS client, proprietary server | ✅ Clean boundaries | GitLab, Sentry |
| **Managed Hosting** | OSS self-host, paid cloud | ✅ OSS fully functional | Grafana, Plausible |
| **Support Contracts** | OSS free, paid support | ✅ No code restrictions | Red Hat, Canonical |
| **Sponsorships** | GitHub Sponsors, Open Collective | ✅ No strings attached | Sindre Sorhus |
| **Dual License** | OSS AGPL, commercial MIT | ⚠️ Can be adversarial | MySQL |
| **Feature Paywall** | OSS limited, paid unlocks | ❌ Not OSS-safe | Avoid |

#### Red Lines (Never Cross)

- ❌ Never move OSS features to paid tier
- ❌ Never add telemetry for commercial purposes
- ❌ Never require account signup for OSS features
- ❌ Never deprecate OSS to push commercial

#### Current State

**Funding Model:** _____
**OSS Boundaries Clear:** [ ] Yes [ ] No
**Business/OSS Conflict:** [ ] None [ ] Minor [ ] Major

**Score:** _____ / 3

---

## Five Year Survivability Score

```
Total Score = Σ (Category Score × Weight)

Example:
- Bus Factor: 3 × 15 = 45
- Backward Compat: 3 × 15 = 45
- Dependency Risk: 2 × 12 = 24
- Governance: 2 × 12 = 24
- Ecosystem Neutrality: 3 × 12 = 36
- Community: 2 × 10 = 20
- Deprecation: 3 × 8 = 24
- Supply Chain: 3 × 10 = 30
- Docs Evolution: 2 × 8 = 16
- Funding: 2 × 8 = 16

Total: 280/300 → 93/100
```

---

## Survivability Grades

| Score | Grade | Prognosis |
|-------|-------|-----------|
| **90-100** | **A+** | Excellent 5+ year survivability. Institutional-grade. |
| **80-89** | **A** | Good survivability. Minor risks identified. |
| **70-79** | **B** | Moderate risks. Address gaps for long-term viability. |
| **60-69** | **C** | Significant risks. Not recommended for 5-year planning. |
| **< 60** | **F** | High failure risk. Major work needed. |

---

## Five Year Action Plan Template

**Current Score:** _____ / 100
**Target Score:** 90 / 100
**Timeline:** Next 12 months

### Priority 1 (Critical, 0-3 months)
1. _____________________
2. _____________________
3. _____________________

### Priority 2 (Important, 3-6 months)
1. _____________________
2. _____________________
3. _____________________

### Priority 3 (Nice-to-have, 6-12 months)
1. _____________________
2. _____________________
3. _____________________

---

## Case Studies

### Case Study 1: Left-pad Incident (2016)

**What happened:** Developer unpublished 273 packages from npm, breaking thousands of projects.

**Lessons:**
- Pin dependencies (package-lock.json)
- Minimize dependencies
- Vendor critical code
- Bus factor matters (single maintainer risk)

**Survivor strategies:**
- ✅ Fork and maintain if original abandoned
- ✅ Vendor tiny dependencies
- ✅ Use lockfiles religiously

---

### Case Study 2: Python 2 → Python 3 (2008-2020)

**What happened:** Breaking changes took 12 years for ecosystem to migrate.

**Lessons:**
- Backward compatibility is critical
- Migration tools needed (2to3)
- LTS support essential (Python 2 EOL 2020)
- Deprecation timelines must be realistic (years, not months)

**Survivor strategies:**
- ✅ Semantic versioning enforced
- ✅ Long deprecation timelines
- ✅ Automated migration tools
- ✅ LTS support for old versions

---

## Annual Review

**Conduct this assessment annually:**
- Score the project
- Identify regressions
- Update action plan
- Document trends

**Review Date:** _____
**Next Review:** _____

---

## Related Documentation

- [OSS Audit Rubric](./OSS_AUDIT_RUBRIC.md) - Release readiness scoring
- [Pre-Launch Checklist](./PRE_LAUNCH_CHECKLIST.md) - Tactical release tasks
- [Long-Term Support](../LONG_TERM_SUPPORT.md) - LTS policy
- [Governance](../GOVERNANCE.md) - Decision-making process

---

**This framework guides Settler OSS toward 5+ year viability.**

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
