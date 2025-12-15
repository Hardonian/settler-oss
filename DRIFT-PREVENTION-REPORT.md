# Drift Prevention Report

**Generated**: 2024-01-15  
**Contract Version**: 1.0.0  
**Status**: ✅ Active

## Executive Summary

This report documents the **contract surface** and **drift prevention mechanisms** implemented in the Settler OSS repository to ensure compatibility with the private Settler Platform repository.

## Contract Surface

The contract surface defines the **public API** that must remain compatible between OSS and Platform repositories.

### 1. API Endpoints

| Endpoint | Method | Description | Contract File |
|----------|--------|-------------|---------------|
| `/v1/health` | GET | Health check | `contracts/openapi.yaml` |
| `/v1/reconcile` | POST | Reconcile transactions | `contracts/openapi.yaml` |
| `/v1/sync` | POST | Synchronize data | `contracts/openapi.yaml` |

### 2. Core Types

All types are defined in:
- **JSON Schema**: `contracts/schemas/*.json`
- **OpenAPI**: `contracts/openapi.yaml`
- **TypeScript**: `packages/protocol/src/types/index.ts`

| Type | Schema File | TypeScript File |
|------|-------------|-----------------|
| `Transaction` | `schemas/transaction.json` | `types/index.ts` |
| `ReconcileRequest` | `schemas/reconcile-request.json` | `types/index.ts` |
| `ReconcileResponse` | `schemas/reconcile-response.json` | `types/index.ts` |
| `MatchingRules` | `schemas/matching-rules.json` | `types/index.ts` |
| `ErrorEnvelope` | `schemas/error-envelope.json` | (to be added) |
| `WebhookEnvelope` | `schemas/webhook-envelope.json` | (to be added) |
| `HealthResponse` | `schemas/health-response.json` | (to be added) |

### 3. SDK Method Signatures

| SDK | Package | Public Methods |
|-----|---------|----------------|
| TypeScript/Node.js | `@settler/sdk` | `SettlerClient.reconcile()`, `SettlerClient.sync()` |
| Python | `settler-sdk` | `SettlerClient.reconcile()`, `SettlerClient.sync()` |
| Go | `settler-go` | `Client.Reconcile()`, `Client.Sync()` |
| Ruby | `settler-sdk` | `SettlerClient.reconcile()`, `SettlerClient.sync()` |
| React | `@settler/react-settler` | React hooks and components |
| CLI | `@settler/cli` | Command-line interface |

### 4. Environment Variables

| Variable | Format | Description |
|----------|--------|-------------|
| `SETTLER_API_KEY` | String (min 20 chars, alphanumeric + `_-`) | API authentication key |
| `SETTLER_BASE_URL` | URL | API base URL (default: `https://api.settler.dev`) |

### 5. Error Codes

Standard error codes (defined in `schemas/error-envelope.json`):
- `INVALID_REQUEST` - Invalid request payload
- `UNAUTHORIZED` - Missing or invalid API key
- `INTERNAL_ERROR` - Server error
- `NOT_FOUND` - Resource not found
- `RATE_LIMITED` - Rate limit exceeded

## Drift Prevention Guards

### 1. Contract Validation (`contracts:check`)

**Script**: `scripts/validate-contracts.ts`  
**CI Job**: `.github/workflows/ci.yml` → `contracts`

**Checks**:
- ✅ JSON Schemas are valid
- ✅ Example fixtures match their schemas
- ✅ OpenAPI spec is valid
- ✅ Contract version follows semver
- ✅ Required endpoints are present

**Run**: `npm run contracts:check`

### 2. Boundary Checks (`check-boundaries`)

**Script**: `scripts/check-boundaries.ts`  
**CI Job**: `.github/workflows/ci.yml` → `lint`

**Checks**:
- ✅ Protocol packages don't import `@settler/enterprise`
- ✅ Protocol packages don't import `apps/console`
- ✅ Shared packages don't import enterprise code

**Run**: `npm run check-boundaries`

### 3. Secret Leak Detection (`secret-leak:check`)

**Script**: `scripts/check-secrets.ts`  
**CI Job**: `.github/workflows/ci.yml` → `lint`

**Checks**:
- ✅ No API keys, passwords, or tokens in code
- ✅ No forbidden paths (`.env`, `secrets.json`, etc.)
- ✅ No proprietary code references
- ✅ No customer lists or internal ops code

**Run**: `npm run secret-leak:check`

### 4. Type Checking (`typecheck`)

**CI Job**: `.github/workflows/ci.yml` → `typecheck`

**Checks**:
- ✅ TypeScript types compile correctly
- ✅ Protocol types match contract schemas
- ✅ No type errors in SDK packages

**Run**: `npm run typecheck`

### 5. Build Verification (`build`)

**CI Job**: `.github/workflows/ci.yml` → `build`

**Checks**:
- ✅ All packages build successfully
- ✅ Type definitions are generated
- ✅ Exports are correct

**Run**: `npm run build`

## Package Exports

### Published Packages

Only these packages are published to npm:

| Package | Exports | Files Included |
|---------|---------|----------------|
| `@settler/protocol` | `.`, `./types` | `dist/`, `README.md`, `LICENSE` |
| `@settler/sdk` | `.` | `dist/`, `README.md`, `LICENSE` |
| `@settler/react-settler` | `.` | `dist/`, `README.md`, `LICENSE` |
| `@settler/cli` | `.` | `dist/`, `README.md`, `LICENSE` |

**Excluded from publishing**:
- `packages/enterprise` - Proprietary code
- `apps/console` - Internal console app
- `apps/web` - Marketing website
- `contracts/` - Contract definitions (reference only)

## Version Bumping Process

### Contract Version

1. Update `contracts/CONTRACT_VERSION` following semver
2. Add entry to `contracts/CHANGELOG.md`
3. Update schemas/types if needed
4. Run `npm run contracts:check`
5. Update `packages/protocol/src/index.ts` → `PROTOCOL_VERSION`

### Package Versions

1. Update `package.json` version in affected packages
2. Update `CHANGELOG.md` at repo root
3. Run `npm run typecheck` and `npm run build`
4. Tag release: `git tag v1.0.0`

## Compatibility Testing

### Manual Verification

```bash
# 1. Validate contracts
npm run contracts:check

# 2. Check boundaries
npm run check-boundaries

# 3. Check for secrets
npm run secret-leak:check

# 4. Type check
npm run typecheck

# 5. Build all packages
npm run build

# 6. Test SDK compatibility (if tests exist)
npm test
```

### Expected Outputs

**contracts:check**:
```
✅ All contract validations passed!
```

**check-boundaries**:
```
✓ Protocol packages: No enterprise imports found
✓ Shared packages: No enterprise/console imports found
✓ All boundaries verified
```

**secret-leak:check**:
```
✅ No secret leaks detected!
```

**typecheck**:
```
(No errors)
```

**build**:
```
(All packages build successfully)
```

## Breaking Change Process

If a breaking change is needed:

1. **Update Contract Version**: Bump MAJOR version in `contracts/CONTRACT_VERSION`
2. **Update Schemas**: Modify JSON schemas and OpenAPI spec
3. **Update Types**: Update TypeScript types in `packages/protocol/src/types/`
4. **Update Examples**: Update example fixtures
5. **Update CHANGELOG**: Document breaking changes
6. **Run Checks**: All validation checks must pass
7. **Coordinate**: Ensure Platform repo is updated simultaneously

## Forbidden Patterns

These patterns are **blocked** by automated checks:

### Code Patterns
- ❌ `import ... from '@settler/enterprise'`
- ❌ `import ... from 'apps/console'`
- ❌ `require('@settler/enterprise')`
- ❌ Proprietary connector implementations
- ❌ Customer-specific logic

### File Patterns
- ❌ `.env` files
- ❌ `secrets.json`
- ❌ `credentials.json`
- ❌ `internal/` directories
- ❌ `proprietary/` directories

### Content Patterns
- ❌ API keys (`sk_`, `pk_`, `AKIA`, etc.)
- ❌ Database connection strings with passwords
- ❌ Private keys (PEM format)
- ❌ Customer lists
- ❌ Revenue/monetization logic

## Monitoring & Alerts

### CI Failures

All CI jobs must pass:
- ❌ **contracts**: Contract validation failed
- ❌ **lint**: Boundary or secret check failed
- ❌ **typecheck**: Type errors detected
- ❌ **build**: Build failures

### Drift Indicators

Watch for:
- Contract version mismatch between OSS and Platform
- Type errors in protocol packages
- Boundary violations (enterprise imports)
- Secret leaks in commits

## Recommendations

### Immediate Actions

1. ✅ **Contracts directory created** - Contract surface defined
2. ✅ **Validation scripts added** - Automated checks in place
3. ✅ **CI workflows updated** - All checks run on PR
4. ✅ **Package exports tightened** - Only intended files published
5. ✅ **Documentation updated** - README includes compatibility section

### Future Enhancements

1. **Schema-to-Type Generation**: Automatically generate TypeScript types from JSON schemas
2. **Contract Testing**: Add integration tests that validate against Platform API
3. **Version Compatibility Matrix**: Document which SDK versions work with which API versions
4. **Breaking Change Detection**: Automatically detect breaking changes in schemas
5. **Contract Diff Tool**: Tool to compare contract versions and highlight changes

## Verification Commands

Run these commands to verify everything is working:

```bash
# Full verification suite
npm run contracts:check && \
npm run check-boundaries && \
npm run secret-leak:check && \
npm run typecheck && \
npm run build

# Expected: All commands exit with code 0
```

## Conclusion

The Settler OSS repository now has comprehensive drift prevention mechanisms in place:

✅ **Contract Surface Defined** - Clear API contracts in `/contracts/`  
✅ **Automated Validation** - CI checks prevent drift  
✅ **Boundary Enforcement** - Enterprise code cannot leak into protocol  
✅ **Secret Protection** - No secrets or proprietary code in OSS  
✅ **Version Management** - Semver-based contract versioning  
✅ **Documentation** - Clear process for updates and breaking changes

The contract surface is **stable** and **well-documented**, ensuring long-term compatibility between OSS and Platform repositories.

---

**Last Updated**: 2024-01-15  
**Next Review**: When contract version changes  
**Maintainer**: Settler Team
