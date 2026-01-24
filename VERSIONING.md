# Versioning Policy

**Settler OSS** follows [Semantic Versioning 2.0.0](https://semver.org/).

## Version Format

```
MAJOR.MINOR.PATCH
```

- **MAJOR** version - Incompatible API changes
- **MINOR** version - New functionality (backward-compatible)
- **PATCH** version - Bug fixes (backward-compatible)

## Current Version

**0.1.0** - Initial development release

## Versioning Rules

### MAJOR version increment (1.0.0, 2.0.0, etc.)

Increment MAJOR version when you make incompatible API changes:
- Breaking changes to SDK method signatures
- Breaking changes to protocol types
- Removal of public APIs
- Breaking changes to CLI commands

### MINOR version increment (0.1.0, 0.2.0, etc.)

Increment MINOR version when you add functionality in a backward-compatible manner:
- New SDK methods
- New protocol types (additions only)
- New CLI commands
- New optional parameters

### PATCH version increment (0.1.1, 0.1.2, etc.)

Increment PATCH version when you make backward-compatible bug fixes:
- Bug fixes in SDK
- Documentation updates
- Internal refactoring (no API changes)
- Performance improvements

## Pre-release Versions

During development, we may use pre-release versions:
- **Alpha:** `0.1.0-alpha.1` - Early testing, incomplete features
- **Beta:** `0.1.0-beta.1` - Feature complete, testing
- **Release Candidate:** `0.1.0-rc.1` - Production candidate

## Package Versioning

All packages in the monorepo share the same version number:
- `@settler/sdk` - 0.1.0
- `@settler/protocol` - 0.1.0
- `@settler/cli` - 0.1.0
- `@settler/react-settler` - 0.1.0

This simplifies dependency management and ensures compatibility.

## Version Compatibility

### SDK ↔ Cloud API

The SDK version does NOT need to match the Cloud API version. The SDK is forward and backward compatible with Cloud API versions.

- SDK 0.1.x works with Cloud API v1.x
- SDK 0.2.x works with Cloud API v1.x and v2.x
- Cloud API maintains backward compatibility for at least 12 months

### Protocol Versions

Protocol types maintain strict backward compatibility:
- New fields can be added (optional)
- Existing fields cannot be removed or renamed (MAJOR version only)
- Field types cannot be changed (MAJOR version only)

## Deprecation Policy

When we deprecate a feature:
1. Mark as deprecated in documentation
2. Add deprecation warning in code (where possible)
3. Maintain for at least 2 MINOR versions
4. Remove in next MAJOR version

Example:
- Feature deprecated in 1.1.0
- Maintained through 1.2.0
- Removed in 2.0.0

## Git Tags

Each release is tagged in Git:
```
v0.1.0
v0.1.1
v1.0.0
```

## NPM Tags

- **latest** - Stable release
- **next** - Next version (pre-release)
- **beta** - Beta release

## Release Schedule

We aim for:
- **PATCH** releases - As needed (bug fixes)
- **MINOR** releases - Monthly
- **MAJOR** releases - Annually (or as needed for breaking changes)

## Breaking Changes

Breaking changes are announced:
1. In CHANGELOG.md
2. In GitHub releases
3. In migration guides (docs/MIGRATING.md)

Users have at least 3 months notice before breaking changes take effect.

## Questions?

See [docs/RELEASING.md](./docs/RELEASING.md) for the release process.

---

Last Updated: 2026-01-24
