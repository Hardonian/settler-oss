# Pre-Launch / Release Readiness Checklist

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Purpose:** Tactical checklist for verifying release readiness before launch

---

## Overview

This checklist ensures all critical systems, documentation, and processes are verified before an official release. Use this before:
- Initial public release (v1.0.0)
- Major version releases (v2.0.0, v3.0.0, etc.)
- Announcing the project publicly (Product Hunt, HN, etc.)

**Completion requirement:** 100% of items checked before release.

---

## Pre-Launch Checklist

### 1. Build & Test Verification

**Goal:** Ensure code builds and tests pass across target platforms.

- [ ] **Local build succeeds**
  ```bash
  npm run build
  # All packages build without errors
  ```

- [ ] **Typecheck passes**
  ```bash
  npm run typecheck
  # No TypeScript errors
  ```

- [ ] **Linter passes**
  ```bash
  npm run lint
  # No ESLint errors (warnings acceptable if documented)
  ```

- [ ] **Tests pass** (or pass with no tests using `--passWithNoTests` if tests not yet written)
  ```bash
  npm run test
  # All tests green or no tests gracefully handled
  ```

- [ ] **CI pipeline green**
  - Check `.github/workflows/ci.yml` status
  - All jobs passing on main branch
  - No failing checks on latest commit

- [ ] **Dependency audit clean** (or vulnerabilities documented/accepted)
  ```bash
  npm audit
  # No high/critical vulnerabilities or documented exceptions
  ```

---

### 2. Cross-Platform Smoke Checks

**Goal:** Verify the project works on major platforms.

- [ ] **macOS verification**
  - [ ] `npm install` succeeds
  - [ ] `npm run build` succeeds
  - [ ] CLI tool runs: `npx @settler/cli demo`

- [ ] **Linux verification**
  - [ ] `npm install` succeeds
  - [ ] `npm run build` succeeds
  - [ ] CLI tool runs: `npx @settler/cli demo`

- [ ] **Windows verification** (if applicable)
  - [ ] `npm install` succeeds
  - [ ] `npm run build` succeeds
  - [ ] CLI tool runs: `npx @settler/cli demo`
  - [ ] Path separators work correctly (no hardcoded `/`)

- [ ] **Node.js version matrix**
  - [ ] Node 18.x LTS tested
  - [ ] Node 20.x LTS tested
  - [ ] `engines` field in package.json specifies minimum version

---

### 3. Documentation Sanity Checks

**Goal:** Ensure documentation is accurate, current, and complete.

- [ ] **README.md complete**
  - [ ] Project description clear
  - [ ] Installation instructions work
  - [ ] Quick start example works
  - [ ] Links not broken
  - [ ] Badges accurate (CI, license, version)

- [ ] **CONTRIBUTING.md present**
  - [ ] First PR path ≤10 minutes
  - [ ] Code of Conduct linked
  - [ ] Issue templates referenced

- [ ] **LICENSE file present**
  - [ ] Correct license text (MIT, Apache 2.0, etc.)
  - [ ] Year and copyright holder correct

- [ ] **SECURITY.md present**
  - [ ] Responsible disclosure process documented
  - [ ] Security contact email valid
  - [ ] Scope of security guarantees clear

- [ ] **CHANGELOG.md present**
  - [ ] Follows [Keep a Changelog](https://keepachangelog.com/) format
  - [ ] Latest version documented
  - [ ] Changes categorized (Added, Changed, Fixed, Removed, etc.)

- [ ] **Core docs accurate**
  - [ ] docs/ARCHITECTURE.md reflects current design
  - [ ] docs/QUICKSTART_10MIN.md instructions work
  - [ ] API examples run without errors
  - [ ] No broken internal links (`grep -r "](\./" docs/`)

- [ ] **No outdated claims**
  - [ ] Version numbers current
  - [ ] No "coming soon" for shipped features
  - [ ] No stale screenshots or examples

---

### 4. License & Legal Compliance

**Goal:** Ensure legal clarity and OSS compliance.

- [ ] **License file present and correct**
  - [ ] LICENSE file in root directory
  - [ ] Matches package.json `license` field
  - [ ] OSI-approved license (MIT, Apache 2.0, etc.)

- [ ] **Proprietary boundaries clear** (if open-core)
  - [ ] OSS_SCOPE.md or equivalent defines what's MIT vs proprietary
  - [ ] Boundary enforcement automated (e.g., `npm run check-boundaries`)
  - [ ] No accidental OSS → proprietary imports

- [ ] **Third-party licenses honored**
  - [ ] No GPL code in permissive-licensed project (unless intended)
  - [ ] Dependencies reviewed for license compatibility
  - [ ] NOTICE file if required (Apache 2.0, etc.)

- [ ] **No CLA required** (or CLA clearly documented if needed)

- [ ] **Copyright notices correct**
  - [ ] Year updated in LICENSE and package.json
  - [ ] Copyright holder accurate

---

### 5. Security Scan & Secret Leakage Check

**Goal:** Ensure no secrets, credentials, or vulnerabilities shipped.

- [ ] **Secret leak scan passes**
  ```bash
  npm run secret-leak:check
  # No API keys, passwords, or tokens in code
  ```

- [ ] **No .env files committed**
  ```bash
  git ls-files | grep '\.env'
  # Should return nothing (or only .env.example)
  ```

- [ ] **.gitignore hardened**
  - [ ] `.env`, `.env.local`, `.env.production` ignored
  - [ ] `node_modules/`, `dist/`, `.next/` ignored
  - [ ] No sensitive files tracked

- [ ] **Dependency vulnerabilities reviewed**
  ```bash
  npm audit
  # High/critical vulnerabilities addressed or documented
  ```

- [ ] **No hardcoded secrets in code**
  - [ ] API endpoints use environment variables
  - [ ] No embedded API keys or tokens
  - [ ] Example code uses `process.env.API_KEY` placeholders

---

### 6. Example Project Verification

**Goal:** Ensure examples run and provide value.

- [ ] **Examples directory present**
  - [ ] `examples/README.md` describes available examples
  - [ ] At least one working example for primary SDK

- [ ] **Example code runs**
  - [ ] TypeScript example: `cd examples/typescript && npm install && npm start`
  - [ ] CLI example: Commands in README execute successfully
  - [ ] React example (if applicable): Renders without errors

- [ ] **Example dependencies current**
  - [ ] No outdated or deprecated packages
  - [ ] Examples use latest SDK version

- [ ] **Example .env.example provided**
  - [ ] Shows required environment variables
  - [ ] No actual secrets included

---

### 7. Contributor Onboarding Verification

**Goal:** Ensure new contributors can onboard in ≤10 minutes.

- [ ] **First-time setup works**
  ```bash
  git clone <repo>
  cd <repo>
  npm install
  npm run build
  npm run test
  # All succeed without manual intervention
  ```

- [ ] **CONTRIBUTING.md tested**
  - [ ] Follow steps as written
  - [ ] No missing prerequisites
  - [ ] No assumed knowledge

- [ ] **Issue templates present**
  - [ ] `.github/ISSUE_TEMPLATE/bug_report.md`
  - [ ] `.github/ISSUE_TEMPLATE/feature_request.md`

- [ ] **PR template present** (optional but recommended)
  - [ ] `.github/pull_request_template.md`

---

### 8. Backward Compatibility & Migration

**Goal:** Ensure upgrades are safe and migration paths clear.

- [ ] **Semantic versioning followed**
  - [ ] Breaking changes documented in CHANGELOG
  - [ ] Migration guide provided for major versions
  - [ ] Deprecation warnings for removed features

- [ ] **API compatibility checked**
  - [ ] No breaking changes in minor/patch releases
  - [ ] Deprecated APIs still functional (with warnings)

- [ ] **Migration notes provided** (if breaking changes)
  - [ ] docs/MIGRATION.md or equivalent
  - [ ] Before/after code examples
  - [ ] Automated migration tool if possible

---

### 9. Tag, Release, & Distribution

**Goal:** Ensure release process is documented and repeatable.

- [ ] **Version bumped**
  - [ ] package.json version updated
  - [ ] Version follows semver (0.1.0 → 1.0.0 for first release)

- [ ] **Git tag created**
  ```bash
  git tag -a v1.0.0 -m "Release v1.0.0"
  git push origin v1.0.0
  ```

- [ ] **CHANGELOG.md updated**
  - [ ] New version entry added
  - [ ] Release date included
  - [ ] All changes since last release documented

- [ ] **Release notes drafted**
  - [ ] GitHub Releases page populated
  - [ ] Highlights key features/fixes
  - [ ] Links to CHANGELOG

- [ ] **Distribution channels verified**
  - [ ] npm registry: `npm publish --dry-run` succeeds
  - [ ] Package metadata correct (`name`, `description`, `keywords`, `repository`)
  - [ ] Entry points valid (`main`, `types`, `bin`)

- [ ] **Installation smoke test**
  ```bash
  # In a fresh directory
  npm install @settler/sdk
  node -e "const {SettlerClient} = require('@settler/sdk'); console.log('OK')"
  # Should print "OK"
  ```

---

### 10. Rollback Plan

**Goal:** Ensure ability to rollback if release fails.

- [ ] **Rollback procedure documented**
  - [ ] How to unpublish from npm (if within 72 hours)
  - [ ] How to revert Git tags
  - [ ] Communication plan for rollback announcement

- [ ] **Backup of current state**
  - [ ] Git SHA of pre-release commit recorded
  - [ ] Ability to rebuild previous version

- [ ] **Monitoring plan**
  - [ ] Watch GitHub issues for user reports
  - [ ] Monitor npm download stats
  - [ ] Check CI status post-release

---

## Release Types & Requirements

### Alpha/Beta Release (v0.x.x)

**Purpose:** Early testing, gather feedback
**Requirements:** Sections 1, 3, 4, 5, 9 (minimal subset)
**Audience:** Early adopters, internal testing

### Stable Release (v1.0.0+)

**Purpose:** Production-ready, public announcement
**Requirements:** ALL sections 1-10
**Audience:** General public, production users

### Patch Release (v1.0.x)

**Purpose:** Bug fixes, no new features
**Requirements:** Sections 1, 5, 8, 9
**Audience:** Existing users

### Major Release (v2.0.0, v3.0.0)

**Purpose:** Breaking changes, new major features
**Requirements:** ALL sections 1-10 + extra emphasis on section 8 (migration)
**Audience:** All users, migration required

---

## Pre-Announcement Checklist

**Before announcing on social media, Product Hunt, Hacker News, etc.**

- [ ] **Community channels ready**
  - [ ] GitHub Discussions enabled
  - [ ] Issue templates in place
  - [ ] Maintainers ready to respond

- [ ] **Support plan**
  - [ ] Maintainers available for first 48 hours post-launch
  - [ ] FAQ.md includes common questions
  - [ ] Support email or Discord monitored

- [ ] **Analytics & monitoring**
  - [ ] CI badge on README (shows green status)
  - [ ] Download stats tracking enabled (npm, GitHub)
  - [ ] Error monitoring (if applicable)

- [ ] **Announcement draft ready**
  - [ ] Key value proposition clear
  - [ ] Screenshots/demos prepared
  - [ ] Link to quickstart guide included

---

## Post-Release Verification (First 24 Hours)

- [ ] **Installation works**
  - [ ] Fresh npm install successful
  - [ ] No user reports of install failures

- [ ] **CI still green**
  - [ ] No regressions introduced by release process

- [ ] **Documentation accessible**
  - [ ] Website/docs live and loading
  - [ ] Links in README resolve correctly

- [ ] **Community engagement**
  - [ ] Issues/PRs triaged within 24 hours
  - [ ] Questions in Discussions answered

---

## Troubleshooting

### Common Issues

**Build fails on CI but passes locally**
- Check Node version mismatch
- Review CI logs for missing environment variables
- Verify all files committed (`git status`)

**Npm publish fails**
- Ensure logged in: `npm whoami`
- Check package name not taken: `npm search <package-name>`
- Verify version not already published: `npm view <package>@<version>`

**Examples don't work after release**
- Verify example dependencies use latest version
- Test examples in fresh directory (not local workspace)
- Check for hardcoded paths or assumptions

---

## Automated Verification Script

**Create a script to automate checks:**

```bash
#!/bin/bash
# scripts/pre-launch-check.sh

set -e

echo "🚀 Pre-Launch Verification"

echo "✓ Installing dependencies..."
npm install

echo "✓ Running build..."
npm run build

echo "✓ Running typecheck..."
npm run typecheck

echo "✓ Running lint..."
npm run lint

echo "✓ Running tests..."
npm run test

echo "✓ Checking boundaries..."
npm run check-boundaries

echo "✓ Checking for secret leaks..."
npm run secret-leak:check

echo "✓ Running audit..."
npm audit --audit-level=moderate

echo "✅ All checks passed! Ready for release."
```

**Run before every release:**
```bash
chmod +x scripts/pre-launch-check.sh
./scripts/pre-launch-check.sh
```

---

## Sign-Off

**Release Manager:** _______________
**Date:** _______________
**Version:** _______________

**Checklist Completion:** _____ / _____ items checked

**Approval:** [ ] Approved [ ] Blocked

**Blocker Notes:** _______________

---

## Related Documentation

- [OSS Audit Rubric](./OSS_AUDIT_RUBRIC.md) - Qualitative scoring framework
- [Five Year Survivability](./FIVE_YEAR_SURVIVABILITY.md) - Long-term viability
- [Releasing](./RELEASING.md) - Step-by-step release process
- [Contributing](../CONTRIBUTING.md) - Contributor guidelines

---

**This checklist is mandatory for all Settler OSS releases.**

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
