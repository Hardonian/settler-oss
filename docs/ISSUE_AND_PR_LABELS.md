# Issue and PR Label Taxonomy

This document defines the minimal label set used for triaging issues and pull requests in Settler OSS.

**Philosophy:** Labels exist to reduce maintainer cognitive load, not to decorate issues. Every label must serve a clear purpose in triage, prioritization, or release planning.

## Core Labels

### Type Labels

#### `bug`
**When to apply:** Issue reports broken behavior in existing functionality
**Contributor expectation:** Will be evaluated for severity and reproduction steps
**Blocks release:** Only if labeled `severity: critical`
**Required info:** Reproduction steps, expected vs actual behavior, environment details

#### `enhancement`
**When to apply:** Feature requests or improvements to existing features
**Contributor expectation:** May be declined if out of scope; not a commitment
**Blocks release:** No
**Required info:** Problem statement, use case, alternatives considered

#### `documentation`
**When to apply:** Issues or PRs related only to documentation changes
**Contributor expectation:** Generally easier to review; good for first contributions
**Blocks release:** Only if docs are factually incorrect or misleading
**Required info:** What's wrong/missing, suggested fix

#### `security`
**When to apply:** Security vulnerabilities or security policy discussions
**Contributor expectation:** Handled privately if vulnerability; see SECURITY.md
**Blocks release:** Yes, if confirmed vulnerability
**Required info:** Must follow responsible disclosure process

### Status Labels

#### `needs-repro`
**When to apply:** Bug reports that lack clear reproduction steps
**Contributor expectation:** Issue may be closed if repro not provided within 14 days
**Blocks release:** No
**Action required:** Provide minimal reproduction steps or code example

#### `needs-triage`
**When to apply:** Newly created issues that haven't been reviewed by maintainers
**Contributor expectation:** Maintainer will review when capacity allows
**Blocks release:** No
**Action required:** None from contributor; maintainer action needed

#### `awaiting-response`
**When to apply:** Maintainer requested clarification or additional info
**Contributor expectation:** Issue may be closed if no response within 14 days
**Blocks release:** No
**Action required:** Respond to maintainer questions

#### `duplicate`
**When to apply:** Issue is a duplicate of an existing issue
**Contributor expectation:** Will be closed; redirected to original issue
**Blocks release:** No
**Action required:** None; follow original issue instead

#### `wontfix`
**When to apply:** Valid issue but won't be fixed (by design, out of scope, etc.)
**Contributor expectation:** Will be closed with explanation
**Blocks release:** No
**Action required:** None; explanation provided in comments

#### `out-of-scope`
**When to apply:** Feature/change doesn't align with project goals
**Contributor expectation:** Will be closed or redirected to discussions
**Blocks release:** No
**Action required:** Consider implementing externally or as plugin

### Priority Labels

#### `priority: critical`
**When to apply:** Blocks production usage, security issues, data loss
**Contributor expectation:** Addressed as soon as possible
**Blocks release:** Yes
**Examples:** Security vulnerabilities, data corruption, complete feature breakage

#### `priority: high`
**When to apply:** Significant impact but workarounds exist
**Contributor expectation:** Prioritized for next minor release
**Blocks release:** No, but strongly considered
**Examples:** Major bugs with workarounds, important features with broad impact

#### `priority: medium`
**When to apply:** Moderate impact, affects some users
**Contributor expectation:** Will be addressed when maintainer capacity allows
**Blocks release:** No
**Examples:** Minor bugs, quality-of-life improvements

#### `priority: low`
**When to apply:** Nice to have, minimal impact
**Contributor expectation:** May remain open indefinitely; PRs welcome
**Blocks release:** No
**Examples:** Cosmetic issues, minor inconveniences, niche features

### Impact Labels

#### `breaking-change`
**When to apply:** Change requires user code modifications or breaks existing APIs
**Contributor expectation:** Requires major version bump; extensive review needed
**Blocks release:** Yes, until next major version planned
**Required info:** Migration guide, deprecation timeline, impact assessment

#### `good-first-issue`
**When to apply:** Suitable for first-time contributors; well-scoped, clear solution
**Contributor expectation:** Maintainers will provide extra guidance if needed
**Blocks release:** No
**Required info:** Clear description of what needs to be done, where to start

### Component Labels

#### `sdk: typescript`
**When to apply:** Affects TypeScript/Node.js SDK

#### `sdk: python`
**When to apply:** Affects Python SDK

#### `sdk: go`
**When to apply:** Affects Go SDK

#### `sdk: ruby`
**When to apply:** Affects Ruby SDK

#### `cli`
**When to apply:** Affects CLI tool

#### `react`
**When to apply:** Affects React components

#### `protocol`
**When to apply:** Affects core protocol or types

#### `infrastructure`
**When to apply:** Build system, CI/CD, testing infrastructure

### Meta Labels

#### `governance`
**When to apply:** Discussions about project governance, policies, processes
**Contributor expectation:** May take time for community discussion
**Blocks release:** No
**Required info:** Clear proposal or concern

#### `question`
**When to apply:** Support questions or usage help
**Contributor expectation:** May be redirected to Discussions
**Blocks release:** No
**Action:** Consider using GitHub Discussions instead

## Label Application Rules

### For Maintainers

1. **Every issue must have at least one type label** (`bug`, `enhancement`, `documentation`, `security`, `governance`, `question`)

2. **Bugs must have priority within 48 hours of validation** (when maintainer capacity allows)

3. **Apply `needs-repro` immediately** if bug report lacks reproduction steps

4. **Apply `breaking-change`** to any PR that modifies public APIs incompatibly

5. **Apply `good-first-issue` sparingly** - only when you're willing to mentor

6. **Remove `needs-triage`** after initial review, even if not immediately actionable

### Label Lifecycle

```
New Issue
  → needs-triage
  → [type label] + [component label] (optional)
  → [priority label] (if bug)
  → [status label] (if action needed)
  → Open/Closed
```

```
New PR
  → [type label]
  → [component label] (optional)
  → breaking-change (if applicable)
  → awaiting-review / needs-changes / approved
  → Merged/Closed
```

## When Issues Get Closed

Issues may be closed without resolution in these cases:

1. **Duplicate** - Redirected to existing issue
2. **Out of scope** - Doesn't align with project goals
3. **Wontfix** - Valid but won't be implemented (with explanation)
4. **Stale** - No response to maintainer questions after 14 days
5. **Cannot reproduce** - After maintainer attempts with provided info
6. **Resolved externally** - Fixed in another way or no longer relevant

**Closed ≠ Rejected:** Issues closed as `out-of-scope` may still be valuable as plugins, forks, or external tools. Consider these alternatives.

## Anti-Patterns to Avoid

❌ **Don't use labels as status theater** - Labels should drive action, not document history
❌ **Don't create labels for one-off situations** - Keep taxonomy minimal
❌ **Don't use priority labels to pressure maintainers** - Priority is maintainer's judgment
❌ **Don't label-spam** - More labels ≠ more visibility
❌ **Don't leave `needs-triage` forever** - Triage doesn't mean "fix now," just "reviewed"

## Label Changes

This taxonomy may evolve. Changes to label definitions will be discussed in issues labeled `governance`.

**Last updated:** 2026-01-24
