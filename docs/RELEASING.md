# Release Process

This document describes how to release a new version of Settler OSS.

> **For comprehensive pre-release verification, see [PRE_LAUNCH_CHECKLIST.md](./PRE_LAUNCH_CHECKLIST.md).**

## Pre-Release Checklist

Before releasing, ensure:

- [ ] All tests pass (`npm test`)
- [ ] All lints pass (`npm run lint`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] All packages build successfully (`npm run build`)
- [ ] Boundary checks pass (`npm run check-boundaries`)
- [ ] Contract validation passes (`npm run contracts:check`)
- [ ] Secret leak checks pass (`npm run secret-leak:check`)
- [ ] CHANGELOG.md is updated with release notes
- [ ] Version numbers are bumped in all package.json files
- [ ] Documentation is up to date

## Release Checklist

Use this checklist for each release:

### 1. Prepare Release

```bash
# Ensure clean working tree
git status

# Pull latest from main
git checkout main
git pull origin main

# Create release branch
git checkout -b release/v0.1.0
```

### 2. Update Version Numbers

Update version in all package.json files:
- Root package.json
- packages/sdk/package.json
- packages/protocol/package.json
- packages/cli/package.json
- packages/shared/package.json
- packages/react-settler/package.json

```bash
# Use npm version (updates all workspaces)
npm version <major|minor|patch>
```

### 3. Update CHANGELOG.md

Add a new section for the release:

```markdown
## [0.1.0] - 2026-01-24

### Added
- Initial release of Settler OSS
- TypeScript/Node.js SDK
- Protocol types
- CLI tool with demo command
- Comprehensive documentation

### Changed
- N/A (initial release)

### Fixed
- N/A (initial release)

### Breaking Changes
- N/A (initial release)
```

### 4. Run Full Verification

```bash
# Run release check script
npm run release:check

# Or manually:
npm install
npm run lint
npm run typecheck
npm run test
npm run build
npm run check-boundaries
npm run contracts:check
npm run secret-leak:check
```

If any checks fail, fix the issues before proceeding.

### 5. Commit Release Changes

```bash
git add .
git commit -m "chore: release v0.1.0"
git push origin release/v0.1.0
```

### 6. Create Pull Request

1. Open PR from `release/v0.1.0` to `main`
2. Title: "Release v0.1.0"
3. Description: Copy CHANGELOG.md section for this release
4. Wait for CI to pass
5. Get review and approval
6. Merge PR

### 7. Tag Release

```bash
# Checkout main
git checkout main
git pull origin main

# Create tag
git tag -a v0.1.0 -m "Release v0.1.0"

# Push tag
git push origin v0.1.0
```

### 8. Publish to npm

```bash
# Publish packages (in order of dependencies)
cd packages/protocol
npm publish --access public

cd ../shared
npm publish --access public

cd ../sdk
npm publish --access public

cd ../cli
npm publish --access public

cd ../react-settler
npm publish --access public
```

**Note:** You need npm publish access to the @settler organization.

### 9. Create GitHub Release

1. Go to https://github.com/shardie-github/settler-oss/releases/new
2. Select tag: v0.1.0
3. Title: "v0.1.0"
4. Description: Copy CHANGELOG.md section
5. Attach any release artifacts (if applicable)
6. Publish release

### 10. Post-Release Tasks

- [ ] Announce release in GitHub Discussions
- [ ] Update documentation site (if applicable)
- [ ] Tweet about release (if applicable)
- [ ] Update Settler Cloud compatibility matrix

## Hotfix Releases

For critical bug fixes between regular releases:

```bash
# Create hotfix branch from main
git checkout main
git pull
git checkout -b hotfix/v0.1.1

# Make fix, update CHANGELOG.md, bump version to 0.1.1
# ... make changes ...

# Commit and push
git commit -m "fix: critical bug in SDK"
git push origin hotfix/v0.1.1

# Create PR, merge, tag, and publish
# Follow steps 6-9 above
```

## Release Automation

We use GitHub Actions for some automation:

- **CI checks** - Automatic on every PR
- **Publish to npm** - Manual (for now)
- **GitHub release notes** - Manual (for now)

Future improvements:
- Automated npm publishing on tag push
- Automated changelog generation
- Automated GitHub release creation

## Versioning Rules

See [VERSIONING.md](../VERSIONING.md) for semantic versioning rules.

## Questions?

Contact the maintainers:
- GitHub: @shardie-github
- Email: opensource@settler.dev

---

Last Updated: 2026-01-24
