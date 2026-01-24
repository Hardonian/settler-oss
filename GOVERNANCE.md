# Governance

**Version:** 1.0.0
**Last Updated:** 2026-01-24

This document describes the governance model for Settler OSS, including decision-making processes, roles, and contributor pathways.

---

## Table of Contents

- [Principles](#principles)
- [Roles](#roles)
- [Decision-Making Process](#decision-making-process)
- [Contribution Workflow](#contribution-workflow)
- [Becoming a Maintainer](#becoming-a-maintainer)
- [Code of Conduct](#code-of-conduct)
- [Conflict Resolution](#conflict-resolution)
- [Changes to Governance](#changes-to-governance)

---

## Principles

Settler OSS governance is guided by these principles:

1. **Transparency** - Decisions are made in public (GitHub issues, discussions, PRs)
2. **Meritocracy** - Contributions and expertise earn influence
3. **Inclusivity** - Welcoming to contributors of all experience levels
4. **Sustainability** - Processes designed for long-term project health
5. **Focus** - Stay aligned with project scope and non-goals (see [OSS_SCOPE.md](./OSS_SCOPE.md))

---

## Roles

### Users

Anyone who uses Settler OSS.

**Responsibilities:**
- Follow the [Code of Conduct](./CODE_OF_CONDUCT.md)
- Report bugs and request features via GitHub Issues
- Provide feedback and use cases

**Rights:**
- Participate in Discussions
- Vote in community polls (when applicable)
- Fork and modify under MIT license

---

### Contributors

Anyone who submits a merged PR, files a helpful issue, or improves documentation.

**Responsibilities:**
- Follow [Contributing Guidelines](./CONTRIBUTING.md)
- Write clean, tested code
- Respond to review feedback
- Maintain authored code (fix bugs, respond to issues)

**Rights:**
- Credit in CHANGELOG and all-contributors
- Recognition in project communications
- Path to Committer role

**How to become a Contributor:**
- Submit at least one merged PR (code, docs, tests, examples)

---

### Committers

Contributors who have demonstrated consistent, high-quality contributions.

**Responsibilities:**
- Review PRs from other contributors
- Triage issues (label, prioritize, close duplicates)
- Mentor new contributors
- Participate in technical discussions
- Maintain code quality

**Rights:**
- Triage access to GitHub repository
- Can merge PRs after approval from Maintainer
- Can participate in RFC discussions
- Can be assigned issues

**How to become a Committer:**
- 5+ merged PRs
- Demonstrated technical expertise
- Active participation in issues/discussions (≥3 months)
- Nominated by existing Committer or Maintainer
- Approved by majority of Maintainers

**Current Committers:** (To be listed as they join)

---

### Maintainers

Core team responsible for project direction, releases, and long-term sustainability.

**Responsibilities:**
- Final approval on PRs
- Release management (versioning, changelogs, publishing)
- Roadmap planning
- Security response
- Governance decisions
- Invite Committers and Maintainers
- Represent the project publicly

**Rights:**
- Write access to repository
- npm publish access
- Can create releases and tags
- Can modify repository settings
- Final say on technical decisions

**How to become a Maintainer:**
- Active Committer for ≥6 months
- Demonstrated leadership (mentoring, RFC authorship, major features)
- Aligned with project principles
- Nominated by existing Maintainer
- Unanimous approval by existing Maintainers

**Current Maintainers:**
- Scott Hardie (@scotthardie) - Project Lead

---

### Emeritus Maintainers

Former Maintainers who have stepped down but retain honorary status.

**Rights:**
- Can return to Maintainer role by unanimous vote
- Credited in project history
- Can participate in discussions (advisory)

---

## Decision-Making Process

### Day-to-Day Decisions

**Examples:** Bug fixes, minor docs changes, dependency updates

**Process:**
1. Open PR
2. Review by Committer or Maintainer
3. Merge after approval

**Timeline:** Typically 1-7 days

---

### Feature Decisions

**Examples:** New API methods, new packages, architecture changes

**Process:**
1. Open GitHub Issue or Discussion
2. Gather feedback (≥7 days for major features)
3. Maintainer makes final decision
4. Document in ROADMAP.md if accepted

**Timeline:** 1-4 weeks

---

### Breaking Changes

**Examples:** Removing APIs, changing behavior, major version bumps

**Process:**
1. RFC (Request for Comments) in GitHub Discussions
2. Gather feedback (≥14 days)
3. Maintainers vote (majority approval required)
4. Migration guide required before merge
5. Deprecation warnings in N-1 version before removal

**Timeline:** 4-8 weeks minimum

---

### Governance Changes

**Examples:** Changing this document, adding roles, modifying decision process

**Process:**
1. PR to GOVERNANCE.md
2. Discussion (≥14 days)
3. Unanimous Maintainer approval required

**Timeline:** ≥4 weeks

---

## Contribution Workflow

### Standard Workflow

1. **Find or create issue**
   - Check [Issues](https://github.com/shardie-github/settler-oss/issues)
   - Look for `good first issue` or `help wanted` labels
   - Create new issue if needed

2. **Fork and branch**
   ```bash
   git clone https://github.com/YOUR_USERNAME/settler-oss.git
   cd settler-oss
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Follow [Code Style](./CONTRIBUTING.md#code-style)
   - Write tests (if applicable)
   - Update docs

4. **Test locally**
   ```bash
   npm run build
   npm run lint
   npm run typecheck
   npm run test
   ```

5. **Submit PR**
   - Reference issue number (`Closes #123`)
   - Describe changes clearly
   - Sign-off on commits (optional but recommended)

6. **Review and iterate**
   - Address review feedback
   - Maintain CI green

7. **Merge**
   - Committer or Maintainer merges after approval
   - Credit added to CHANGELOG

---

## Becoming a Maintainer

### Path: User → Contributor → Committer → Maintainer

**Typical Timeline:** 6-12 months from first contribution to Maintainer

**Steps:**

1. **First Contribution** → Contributor
   - Merge 1 PR (docs, code, tests, examples)

2. **Consistent Contributions** → Committer
   - Merge 5+ PRs
   - Active in issues/discussions
   - Demonstrate expertise
   - Nominated by Committer or Maintainer

3. **Leadership & Ownership** → Maintainer
   - 6+ months as Committer
   - Mentor new contributors
   - Author RFCs or major features
   - Demonstrate alignment with project principles
   - Nominated by Maintainer
   - Unanimous approval by existing Maintainers

---

## Code of Conduct

All participants must follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

**Summary:**
- Be respectful and inclusive
- No harassment, discrimination, or abuse
- Assume good intent
- Disagree constructively

**Enforcement:**
- Violations reported to [security@settler.dev](mailto:security@settler.dev)
- Reviewed by Maintainers
- Consequences: warning, temporary ban, permanent ban

---

## Conflict Resolution

### Process for Disagreements

1. **Direct discussion** - Parties discuss in issue/PR comments
2. **Mediator** - Request Maintainer to mediate
3. **Vote** - Maintainers vote (majority wins)
4. **Project Lead** - Final say on unresolved conflicts (Scott Hardie)

### Escalation Path

Issue/PR → Discussion → Maintainer mediation → Vote → Project Lead

---

## Changes to Governance

This document can be amended via PR with:
- ≥14 days public comment period
- Unanimous Maintainer approval
- Version number increment

**History:**
- v1.0.0 (2026-01-24) - Initial governance model

---

## Succession Planning

### If Project Lead is unavailable

1. Maintainers elect interim lead by majority vote
2. Interim lead serves until Project Lead returns or Maintainers elect permanent replacement
3. Permanent replacement requires unanimous Maintainer vote

### If all Maintainers are unavailable

1. Committers can elect temporary Maintainer by 2/3 majority vote
2. Temporary Maintainer can merge PRs and triage issues (no releases or governance changes)
3. Community notified via GitHub Discussions

---

## Communication Channels

- **GitHub Issues** - Bug reports, feature requests
- **GitHub Discussions** - Questions, ideas, RFCs
- **GitHub PRs** - Code review and collaboration
- **Security** - [security@settler.dev](mailto:security@settler.dev) (private)

---

## Transparency

All governance decisions are:
- Documented in GitHub (issues, PRs, discussions)
- Public (except security issues)
- Logged in CHANGELOG when relevant

---

## Related Documentation

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [OSS Scope](./OSS_SCOPE.md)
- [Roadmap](./ROADMAP.md)
- [Five Year Survivability](./docs/FIVE_YEAR_SURVIVABILITY.md)

---

**This governance model is binding for Settler OSS.**

For questions, open a [GitHub Discussion](https://github.com/shardie-github/settler-oss/discussions).

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
