# Changelog

All notable changes to Settler OSS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- React SDK components (packages/react-settler)
- Python SDK (packages/sdk-python)
- Go SDK (packages/sdk-go)
- Ruby SDK (packages/sdk-ruby)
- Example reconciliation adapter implementations
- Enhanced CLI commands (API mode, webhooks)

## [0.1.0] - 2026-01-24

### Added
- **TypeScript/Node.js SDK** (`@settler/sdk`) - HTTP client for Settler Cloud APIs
- **Protocol Types** (`@settler/protocol`) - Type-safe interfaces for reconciliation workflows
- **CLI Tool** (`@settler/cli`) - Command-line tool with demo, reconcile, doctor, init, and adapters commands
- **Shared Utilities** (`@settler/shared`) - Common utilities safe for OSS use
- **Comprehensive Documentation:**
  - OSS_SCOPE.md - Quick reference for OSS vs Cloud scope
  - docs/ARCHITECTURE.md - System architecture overview
  - docs/CLOUD_VS_OSS.md - Detailed OSS vs Cloud comparison
  - PRODUCT_BOUNDARIES.md - Complete boundary definitions
  - VERSIONING.md - Semantic versioning policy
  - docs/RELEASING.md - Release process documentation
- **Developer Experience:**
  - Monorepo structure with npm/pnpm workspaces
  - CI/CD pipeline with GitHub Actions
  - Automated boundary checks
  - Contract validation
  - Secret leak detection
- **Repository Hygiene:**
  - GitHub issue templates (bug, feature, security, question)
  - Pull request template
  - Code of Conduct
  - Contributing guidelines
  - Security policy
  - Dependabot configuration

### Fixed
- Test scripts now use `--passWithNoTests` to allow packages without tests to pass CI
- SDK lint warnings removed (unused parameters, explicit any types)
- Build process works cleanly for all packages

### Breaking Changes
- None (initial release)

---

## Release Notes Format

### [Version] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes in existing functionality

#### Deprecated
- Soon-to-be removed features

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Security fixes

---

## How to Read This Changelog

- **[Unreleased]** - Changes in development, not yet released
- **[Version]** - Released versions with dates
- **Added** - New features
- **Changed** - Changes to existing features
- **Deprecated** - Features that will be removed
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security-related changes

---

For detailed release notes, see [GitHub Releases](https://github.com/shardie-github/settler-oss/releases).
