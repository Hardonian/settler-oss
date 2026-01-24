# Next 30 Days — OSS Roadmap

**Period:** January 24 - February 24, 2026
**Status:** Active
**Philosophy:** No hype, no aspirational features. Only maintenance, hardening, and high-confidence improvements.

---

## Purpose of This Document

This roadmap exists to:
1. Signal maintainer focus areas
2. Set realistic contributor expectations
3. Avoid roadmap weaponization ("you promised X!")
4. Provide safe entry points for new contributors

**What this is NOT:**
- ❌ A commitment or promise
- ❌ An exhaustive list of all work
- ❌ A feature wishlist
- ❌ A timeline you can hold us to

**What this IS:**
- ✅ Current maintainer priorities
- ✅ Areas where PRs are most likely to be reviewed
- ✅ Transparency into project direction
- ✅ Subject to change based on issues, security, or maintainer capacity

---

## Maintenance & Hardening

### 1. Security & Dependency Updates

**Status:** Ongoing
**Priority:** Critical

- Regular dependency updates (`npm audit`, `pip-audit`, etc.)
- Address Dependabot alerts within 7 days
- Security patch releases as needed
- No breaking changes in patch releases

**Safe for contributors:**
- Dependency update PRs (after testing)
- Security documentation improvements
- Test coverage for security-sensitive code paths

### 2. Documentation Quality

**Status:** In progress
**Priority:** High

- Fix known documentation gaps identified in issues
- Ensure all SDK methods have clear examples
- Update migration guides for v1.x changes
- Verify code examples actually work

**Safe for contributors:**
- Fix typos, broken links, outdated examples
- Add missing API documentation
- Improve quickstart guides
- Add troubleshooting sections based on common issues

### 3. Test Coverage Improvements

**Status:** Ongoing
**Priority:** Medium

- Increase core SDK test coverage (targeting 80%+)
- Add integration tests for critical workflows
- Improve test reliability (reduce flakiness)
- Document testing approach for contributors

**Safe for contributors:**
- Add unit tests for uncovered code paths
- Fix flaky tests
- Improve test documentation
- Add edge case tests

### 4. Issue Triage & Repository Health

**Status:** Ongoing
**Priority:** High

- Triage open issues (label, request reproduction, close stale)
- Respond to high-priority bugs within 1-2 weeks
- Close duplicate or out-of-scope issues with clear explanations
- Review and merge low-risk PRs (typos, docs, tests)

**Safe for contributors:**
- Help reproduce bugs
- Provide additional context on open issues
- Test proposed fixes
- Review PRs (even without merge rights, feedback helps!)

---

## High-Confidence Improvements

These are features or enhancements we're confident will ship in the next 30 days:

### 5. CLI Error Message Improvements

**Status:** Planned
**Priority:** Medium
**Issue:** TBD

Make CLI error messages more actionable:
- Clear next steps when errors occur
- Better validation error messages
- Link to relevant documentation from error output
- Consistent error format across commands

**Why now:** Frequent user confusion from vague errors; low-risk change.

**Safe for contributors:** Yes, after discussion with maintainers on specific error messages.

### 6. TypeScript SDK: Retry Logic for Transient Failures

**Status:** In design
**Priority:** Medium
**Issue:** TBD

Add configurable retry logic for network failures:
- Exponential backoff for rate limits
- Retry on 5xx errors
- Opt-in (disabled by default for now)
- Clear documentation on when/how to use

**Why now:** Common pain point; well-understood problem; existing libraries to leverage.

**Safe for contributors:** After design is approved in issue discussion.

---

## Explicitly NOT Planned (Next 30 Days)

To manage expectations, here's what we're **not** working on right now:

### ❌ New SDKs or Language Support
**Why:** Existing SDKs need stability before expanding surface area.
**When:** After v1.2 is stable and well-documented.

### ❌ Breaking API Changes
**Why:** Just released v1.0; need stability period.
**When:** v2.0, timeline TBD (6+ months minimum).

### ❌ GraphQL API
**Why:** REST API serves current needs; additional complexity not justified.
**When:** Maybe never; would need strong user demand.

### ❌ Built-in AI/ML Features
**Why:** Out of scope for core reconciliation library.
**When:** Never in core; possible as plugins or extensions.

### ❌ Enterprise-Only Features in OSS
**Why:** Business model requires some features remain enterprise-only.
**When:** See OSS_VS_ENTERPRISE_BOUNDARY.md for clarity.

---

## How to Contribute

### Most Helpful Right Now

1. **Report bugs with clear reproduction steps** (use bug template)
2. **Improve documentation** (examples, guides, API docs)
3. **Add tests** (unit, integration, edge cases)
4. **Fix low-priority bugs** (labeled `good-first-issue`)
5. **Answer questions in Discussions** (reduce maintainer support load)

### Less Helpful Right Now

1. Large refactors (we need stability, not churn)
2. New feature PRs without prior discussion (may be rejected)
3. "I want to add X" without use case justification
4. PRs that expand scope (focus on doing less, better)

---

## Risk & Uncertainty

### What Could Delay This Roadmap

- **Security vulnerabilities** requiring immediate attention
- **Critical bugs** in production use cases
- **Maintainer availability** (vacations, day jobs, life)
- **Upstream dependency issues** blocking progress

If the roadmap shifts, we'll update this document and communicate in GitHub Discussions.

---

## Progress Tracking

We'll update this document monthly. Check commit history for latest changes.

**Next update:** February 24, 2026

### Quick Status Legend
- ✅ **Done** - Shipped
- 🚧 **In progress** - Active work
- 📝 **Planned** - Designed, ready to start
- ⏸️ **Paused** - Deprioritized
- ❌ **Cancelled** - Not doing anymore

---

## Questions?

- **General questions:** GitHub Discussions
- **Roadmap suggestions:** Open a governance issue
- **Urgent bugs:** Follow bug report template

**Remember:** This roadmap is guidance, not gospel. We prioritize based on community needs, maintainer capacity, and project health.

---

**Last updated:** 2026-01-24
**Next review:** 2026-02-24
