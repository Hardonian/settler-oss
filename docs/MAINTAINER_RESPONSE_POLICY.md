# Maintainer Response Policy

This document sets realistic expectations for how and when maintainers respond to issues, pull requests, and community engagement.

## Core Principles

1. **Maintainers are human** with limited time and competing priorities
2. **Open source is not a support contract** unless you have an enterprise agreement
3. **Silence is not rejection** - lack of response indicates limited capacity, not dismissal
4. **No guaranteed response times** - maintainers respond when possible, not on demand
5. **Quality over speed** - thoughtful delayed responses beat rushed poor ones

## What This Project Is

- A maintained open-source project with active development
- A community of contributors working to improve reconciliation infrastructure
- A foundation for production use with appropriate caution and testing
- Supported by maintainers when time and expertise allow

## What This Project Is Not

- A 24/7 support service
- A debugging consultancy for your specific environment
- A feature factory accepting all requests
- Obligated to respond to every issue or comment

## Response Expectations

### Issues

**New issues:**
- **Triage:** Best-effort review within 1-2 weeks when possible
- **Reality:** May take longer during high-activity periods or maintainer unavailability
- **No response after 30 days?** Bump the issue politely. Maintainers may have missed it.

**Bug reports:**
- **Critical bugs** (security, data loss, total breakage): Prioritized immediately
- **High-priority bugs** (major functionality broken): Addressed when capacity allows
- **Medium/low priority bugs:** May remain open for extended periods; PRs welcome

**Feature requests:**
- **Initial response:** May take several weeks to evaluate
- **Decision timeline:** No guaranteed timeline for acceptance/rejection
- **Long silence:** Often means "uncertain, evaluating, or low priority" not "no"
- **Closure:** May be closed without implementation if out of scope

### Pull Requests

**Review timeline:**
- **Trivial fixes** (typos, docs): Usually reviewed within 1-2 weeks
- **Small PRs** (< 100 lines, clear scope): Reviewed when maintainer capacity allows
- **Large PRs** (> 500 lines, complex changes): May take several weeks or longer
- **Surprise PRs** (no prior discussion): May be closed if misaligned with project direction

**Review frequency:**
- Maintainers review when they have focused time available
- Multiple review rounds may be needed; this is normal
- Delays between review rounds are expected

**Stale PRs:**
- PRs requiring changes but with no activity for 60 days may be closed
- Closed PRs can be reopened if contributor returns

### Questions and Discussions

**Support questions:**
- Best asked in GitHub Discussions, not Issues
- Community members often respond faster than maintainers
- Maintainers contribute when they have relevant expertise and time

**General discussions:**
- Maintainers participate when interested and available
- Lack of maintainer presence ≠ lack of value in the discussion

## What "Reasonable Response" Means

Maintainers will make best efforts to:

1. **Triage new issues** within 1-2 weeks (label, categorize, request clarification)
2. **Respond to critical security issues** within 48-72 hours
3. **Review PR submissions** within 2-4 weeks for small, well-scoped changes
4. **Provide clear rejection reasons** when closing issues or PRs as out-of-scope
5. **Update the community** if major delays are expected (vacations, crunch periods)

Maintainers are **not** obligated to:

1. Respond to every comment or question
2. Implement requested features
3. Debug user-specific environment issues
4. Justify every decision in detail
5. Provide ETAs for fixes or features

## How to Escalate Responsibly

If you need faster response or dedicated support:

### For critical issues:
1. Clearly mark as `priority: critical` with justification
2. Provide complete reproduction steps and environment details
3. If security-related, follow SECURITY.md process
4. Consider enterprise support if available

### For stalled issues/PRs:
1. Wait at least 2 weeks before bumping
2. Bump with new information, not just "any update?"
3. Offer to help move things forward (testing, docs, etc.)
4. Respect that "no" or silence may be the answer

### What doesn't work:
- ❌ Demanding immediate responses
- ❌ Tagging maintainers repeatedly
- ❌ Opening duplicate issues for visibility
- ❌ Complaining about response times in unrelated issues
- ❌ Appealing to urgency of *your* business timeline

## When Issues May Be Closed Without Resolution

Issues may be closed in the following scenarios:

1. **Duplicate** - Already tracked elsewhere
2. **Out of scope** - Doesn't align with project goals
3. **Wontfix** - Valid but won't be implemented (explained why)
4. **Cannot reproduce** - Insufficient information after follow-up requests
5. **Stale** - No response to clarification requests after 14 days
6. **Hostile or abusive** - Violates code of conduct

**Being closed is not personal.** It's project hygiene. Closed issues can be referenced, linked, and reopened if circumstances change.

## Maintainer Bandwidth Reality

This project is maintained by:
- A small team with full-time jobs and lives
- Contributors who volunteer their expertise
- Individuals balancing OSS work with other commitments

**Current maintainer capacity:** Limited

This means:
- Not every feature request will be implemented
- Some bugs may persist longer than ideal
- Response times vary based on real-world constraints
- PRs may require patience

## For Enterprise Users

If your business depends on Settler OSS and needs:
- Guaranteed response times
- Dedicated support
- Feature prioritization
- SLA commitments

**Consider:** Settler Cloud Enterprise (if available) or becoming a sponsor to support maintainer time.

## Contributing to Better Response Times

You can help maintainers respond faster by:

1. **Searching before posting** - Reduce duplicate issues
2. **Providing complete information** - Saves round-trip clarification
3. **Using templates fully** - Makes triage faster
4. **Writing clear, minimal reproductions** - Easier to debug
5. **Submitting well-formed PRs** - Easier to review
6. **Helping others in discussions** - Reduces maintainer support load
7. **Being patient and respectful** - Maintainers are human

## Updates to This Policy

This policy may be updated as the project and maintainer team evolves. Changes will be announced in project discussions.

**Last updated:** 2026-01-24

---

**Remember:** Open source thrives on mutual respect. Maintainers give time freely; contributors engage constructively. This balance makes great projects possible.
