# Long-Term Support & Compatibility Policy

**Version:** 1.0.0
**Last Updated:** 2026-01-24
**Status:** Binding Commitment

---

## Purpose

This document defines Settler's long-term support strategy, backward-compatibility guarantees, and evolution policy for the next 5-10 years.

**Target Audience:** Engineering teams planning long-term integrations, procurement teams evaluating vendor lock-in, finance teams assessing tool longevity

**Key Principle:** Financial reconciliation workflows are critical infrastructure. Breaking changes must be rare, planned, and communicated with significant advance notice.

---

## Summary: What You Can Rely On

### For OSS Users (MIT Licensed)

**Guaranteed for life:**
- ✅ MIT license remains (code is yours to fork and maintain)
- ✅ Protocol types remain open-source (data format is not proprietary)
- ✅ You can fork and maintain indefinitely

**Guaranteed within major version (e.g., 1.x.x):**
- ✅ Backward compatibility for minor/patch versions
- ✅ Existing fields and methods remain unchanged
- ✅ New features are additive only

**NOT guaranteed:**
- ❌ Major version upgrades (2.0.0) may have breaking changes
- ❌ Active maintenance (project could be archived)
- ❌ Bug fix timelines (no SLA)

### For Cloud Users (SaaS)

**Guaranteed (Enterprise tier):**
- ✅ API versions supported for 12 months after deprecation
- ✅ 90-day advance notice for breaking changes
- ✅ Migration guides provided
- ✅ SLA for uptime and support

**NOT guaranteed:**
- ❌ Service will run forever (90-day shutdown notice minimum)
- ❌ Pricing will remain unchanged (subject to change with notice)

---

## Semantic Versioning Policy

Settler follows **strict semantic versioning** (semver) for all OSS packages.

### Version Format: `MAJOR.MINOR.PATCH`

**Example:** `1.2.3`
- `1` = Major version
- `2` = Minor version
- `3` = Patch version

---

### PATCH Releases (`1.0.0 → 1.0.1`)

**What changes:**
- ✅ Bug fixes only
- ✅ Security patches
- ✅ Documentation corrections

**What does NOT change:**
- ❌ No API changes
- ❌ No new features
- ❌ No behavior changes (except bug fixes)

**Backward compatibility:** **100% guaranteed**

**Release frequency:** As needed (urgent bugs, security)

**Example:**
```
1.0.0 → 1.0.1: Fixed floating-point precision bug in OSS demo
1.0.1 → 1.0.2: Security patch for dependency vulnerability
```

---

### MINOR Releases (`1.0.0 → 1.1.0`)

**What changes:**
- ✅ New features (additive only)
- ✅ New optional fields in protocol types
- ✅ New SDK methods
- ✅ Performance improvements
- ✅ Deprecation warnings (for future removal in major version)

**What does NOT change:**
- ❌ Existing fields remain (no removals)
- ❌ Existing methods remain (no signature changes)
- ❌ Existing behavior remains (no breaking changes)

**Backward compatibility:** **100% guaranteed**

**Release frequency:** Quarterly (approximately 4 per year)

**Example:**
```
1.0.0 → 1.1.0: Added optional `currency` field to Transaction type
1.1.0 → 1.2.0: Added `reconcileMany()` batch API method
1.2.0 → 1.3.0: Added confidence scoring for fuzzy matching (Cloud only)
```

**Deprecation policy:**
- Features deprecated in minor versions
- Deprecation warnings logged
- Deprecated features removed only in next major version
- Minimum 6 months between deprecation and removal

---

### MAJOR Releases (`1.0.0 → 2.0.0`)

**What changes:**
- ⚠️ Breaking changes allowed
- ⚠️ Removed deprecated features
- ⚠️ Renamed or restructured APIs
- ⚠️ Changed default behavior

**What is guaranteed:**
- ✅ Migration guide provided
- ✅ 90-day advance notice (pre-release candidate)
- ✅ Changelog documenting all breaking changes
- ✅ Previous major version supported for 12 months minimum

**Release frequency:** Rare (1-2 years, or never)

**Example major version scenarios:**
```
1.x → 2.0.0: Protocol redesign (new reconciliation algorithm)
2.x → 3.0.0: TypeScript SDK split into multiple packages
```

**Upgrade path:**
1. Release candidate (RC) published 90 days before final release
2. Migration guide published with RC
3. Users test and provide feedback
4. Final 2.0.0 released
5. 1.x supported for 12 months (bug fixes and security patches only)
6. 1.x enters maintenance mode (security patches only for 12 more months)
7. 1.x end-of-life (EOL) after 24 months total

---

## Protocol Type Stability

The `@settler/protocol` package defines transaction data formats and reconciliation types. **This is the most critical package for long-term stability.**

### Stability Guarantees

**Within major version (1.x.x):**
- ✅ Existing fields remain unchanged
- ✅ New fields are optional only
- ✅ Field types remain unchanged
- ✅ Enum values remain (new values may be added)

**Example: Adding optional field (backward-compatible):**
```typescript
// v1.0.0
interface Transaction {
  id: string;
  amount: number;
  date: string;
}

// v1.1.0 (backward-compatible)
interface Transaction {
  id: string;
  amount: number;
  date: string;
  currency?: string; // ← NEW, optional
}
```

**Example: Breaking change (requires major version):**
```typescript
// v1.0.0
interface Transaction {
  id: string;
  amount: number; // JavaScript number
  date: string;
}

// v2.0.0 (BREAKING: amount type changed)
interface Transaction {
  id: string;
  amount: string; // ← BREAKING: now string (for Decimal compatibility)
  date: string;
}
```

---

## SDK API Stability

### TypeScript/Node.js SDK (`@settler/sdk`)

**Stability commitment:**
- ✅ Public API methods remain within major version
- ✅ Method signatures remain unchanged (parameters, return types)
- ✅ New methods may be added
- ✅ Deprecated methods remain functional (with warnings)

**What is NOT stable:**
- ❌ Private/internal APIs (prefixed with `_` or marked `@internal`)
- ❌ Experimental features (marked `@experimental` or `@beta`)

**Example:**
```typescript
// v1.0.0
class SettlerClient {
  reconcile(request: ReconcileRequest): Promise<ReconcileResponse>
}

// v1.1.0 (backward-compatible: new method)
class SettlerClient {
  reconcile(request: ReconcileRequest): Promise<ReconcileResponse>
  reconcileMany(requests: ReconcileRequest[]): Promise<ReconcileResponse[]> // ← NEW
}

// v1.2.0 (backward-compatible: deprecation warning)
class SettlerClient {
  /** @deprecated Use reconcile() instead. Will be removed in v2.0.0 */
  reconcileSync(request: ReconcileRequest): ReconcileResponse
  reconcile(request: ReconcileRequest): Promise<ReconcileResponse>
}

// v2.0.0 (BREAKING: removed deprecated method)
class SettlerClient {
  reconcile(request: ReconcileRequest): Promise<ReconcileResponse>
  // reconcileSync removed
}
```

---

## CLI Tool Stability

**Commitment:**
- ✅ Command names remain unchanged within major version
- ✅ Existing flags remain (new flags may be added)
- ✅ Output format remains stable (for scripting)

**Example:**
```bash
# v1.0.0
settler reconcile --source payments.csv --target invoices.csv

# v1.1.0 (backward-compatible: new flag)
settler reconcile --source payments.csv --target invoices.csv --tolerance 0.01

# v2.0.0 (BREAKING: command renamed)
settler match --source payments.csv --target invoices.csv # ← renamed
```

**JSON output stability:**
- JSON output format is stable within major version
- Scripts relying on JSON output will not break

---

## Data Format Stability

**What is stable:**
- ✅ CSV import/export format (column names remain)
- ✅ JSON schema for reconciliation results
- ✅ API request/response formats

**Example CSV format (stable within major version):**
```csv
id,amount,date,description
txn_001,100.00,2026-01-24,Payment
```

**Adding new field (backward-compatible):**
```csv
id,amount,date,description,currency
txn_001,100.00,2026-01-24,Payment,USD
```

**Removing field (BREAKING, requires major version):**
```csv
# v2.0.0: description field removed (BREAKING)
id,amount,date,currency
txn_001,100.00,2026-01-24,USD
```

---

## Cloud API Versioning

Settler Cloud uses **explicit API versioning** for stability.

### API Version Format

**URL-based versioning:**
```
https://api.settler.dev/v1/reconcile  ← API version in URL
https://api.settler.dev/v2/reconcile  ← New API version
```

**Version support policy:**
- ✅ Each API version supported for **minimum 12 months** after successor release
- ✅ Deprecation notice **minimum 90 days** before EOL
- ✅ Migration guide provided

**Example timeline:**
```
2026-01-01: v1 API launched
2027-01-01: v2 API launched
2027-01-01 to 2028-01-01: v1 and v2 both supported (12 months)
2027-10-01: v1 deprecation notice (90-day warning)
2028-01-01: v1 API end-of-life (EOL)
```

**Deprecation communication:**
- Email notification to all Cloud users
- In-app banner warning
- API response header: `Sunset: Sat, 1 Jan 2028 00:00:00 GMT`
- Documentation updated with migration guide

---

## Behavioral Stability

**What remains stable within major version:**

### 1. Determinism
- Same inputs → same outputs (guaranteed forever)
- No random behavior
- No timestamp-dependent matching

**See [DETERMINISM.md](./DETERMINISM.md) for specification.**

---

### 2. Balance Preservation
- Sum of inputs = sum of outputs (guaranteed forever)
- No value created or destroyed

**See [GUARANTEES.md](./GUARANTEES.md#g3-balance-preservation) for formula.**

---

### 3. Completeness
- All transactions appear in output (guaranteed forever)
- No dropped transactions

**See [GUARANTEES.md](./GUARANTEES.md#g8-completeness) for specification.**

---

### 4. Immutability
- Input data never modified (guaranteed forever)

---

## Dependency Management

**Philosophy:** Minimize dependencies to reduce breaking change risk.

### OSS Package Dependencies

**Current strategy:**
- Minimal dependencies (10 or fewer direct dependencies per package)
- Well-established libraries only (avoid experimental packages)
- Pin major versions in `package.json`

**Dependency update policy:**
- Security patches: Applied immediately (may break minor versions if critical)
- Major version updates: Only with major version release (e.g., Settler 2.0.0)
- Deprecated dependencies: Replaced in next major version

**Example:**
```json
{
  "dependencies": {
    "decimal.js": "^10.0.0"  // Pin to major version 10
  }
}
```

---

## End-of-Life (EOL) Policy

### OSS Packages

**Maintenance phases:**

1. **Active support** (current major version)
   - New features
   - Bug fixes
   - Security patches
   - Performance improvements

2. **Maintenance mode** (previous major version, 12 months)
   - Bug fixes (critical only)
   - Security patches
   - No new features

3. **Security-only mode** (12-24 months after next major release)
   - Security patches only
   - No bug fixes
   - No new features

4. **End-of-life (EOL)** (24 months after next major release)
   - No updates
   - No support
   - Archived on GitHub
   - Users must upgrade or fork

**Example timeline:**
```
2026-01-01: Settler v1.0.0 released (Active support)
2027-01-01: Settler v2.0.0 released
            → v1.x enters Maintenance mode
2028-01-01: v1.x enters Security-only mode
2029-01-01: v1.x reaches EOL (archived)
```

---

### Cloud API Versions

**Support timeline:**
- Minimum 12 months after successor version launch
- Minimum 90-day deprecation notice
- Migration guide provided

**EOL process:**
1. New API version released (e.g., v2)
2. Old API version (v1) marked as deprecated (90-day notice)
3. Deprecation warnings added to API responses
4. Email notifications to all users
5. Migration guide published
6. Old API version reaches EOL (minimum 12 months after v2 launch)
7. Old API version shut down (returns HTTP 410 Gone)

---

## Migration Support

### Documentation

**Provided for major version upgrades:**
- ✅ Comprehensive migration guide
- ✅ Changelog with all breaking changes
- ✅ Code examples (before/after)
- ✅ Automated migration scripts (when possible)

**Example migration guide structure:**
```markdown
# Migrating from v1 to v2

## Breaking Changes
1. Transaction `amount` field changed from `number` to `string`
2. `reconcileSync()` method removed
3. Default tolerance changed from 0.01 to 0.00 (exact match)

## Step-by-Step Migration
1. Update package.json: `"@settler/sdk": "^2.0.0"`
2. Update Transaction types: `amount: string` (not `number`)
3. Replace `reconcileSync()` with `reconcile()` (async)
4. Test with sample data
5. Deploy

## Automated Migration Script
Run: `npx @settler/migrate-v1-to-v2`
```

---

### Support Channels

**OSS:**
- GitHub Discussions (community help)
- Migration guides in documentation
- Example code in repository

**Cloud:**
- Email support (all tiers)
- Migration assistance (Enterprise tier)
- Dedicated Slack channel during migration period (Enterprise)

---

## Long-Term Data Format Evolution

### Reconciliation Result Format

**Current format (v1.x):**
```typescript
interface ReconcileResponse {
  matched: MatchedPair[];
  unmatched: {
    source: Transaction[];
    target: Transaction[];
  };
  summary: {
    totalSource: number;
    totalTarget: number;
    matched: number;
    unmatchedSource: number;
    unmatchedTarget: number;
  };
}
```

**Future evolution (example v2.0):**
- May add new top-level fields (e.g., `confidence`, `warnings`)
- May nest existing fields differently
- **Will provide migration script** to convert v1 results to v2 format

**Data storage recommendation:**
- Store reconciliation results in original format (v1)
- Convert to new format (v2) on read (backward-compatible)
- Or: Run migration script to bulk-convert historical data

---

## Guarantees That Will Never Change

**These are permanent commitments, regardless of version:**

### 1. MIT License for OSS
- ✅ OSS packages will always be MIT licensed
- ✅ You can always fork and maintain yourself
- ✅ No bait-and-switch to proprietary license

### 2. Deterministic Behavior
- ✅ Same inputs → same outputs (forever)
- ✅ Matching logic will never use randomness or timestamps

### 3. Balance Preservation
- ✅ Sum of inputs = sum of outputs (forever)
- ✅ No value created or destroyed

### 4. Open Protocol Types
- ✅ Protocol types will always be open-source
- ✅ Data format will never be proprietary

---

## What We Do NOT Guarantee

**Be realistic about limitations:**

### 1. Active Maintenance (OSS)
- ❌ Project could be archived or abandoned
- ❌ Maintainers may move on
- **Mitigation:** Fork early, contribute to reduce dependency

### 2. Pricing Stability (Cloud)
- ❌ Pricing may increase with advance notice
- ❌ Free tier may be reduced or removed
- **Mitigation:** Budget for potential price increases

### 3. Performance Improvements
- ❌ OSS demo code will remain naive (O(n²))
- ❌ Cloud may not scale to your data volume forever
- **Mitigation:** Test with realistic data, optimize if needed

### 4. Backward Compatibility Across Major Versions
- ❌ Major versions may have breaking changes
- **Mitigation:** Pin to major version, plan migration windows

### 5. Forever-Support
- ❌ Eventually, all software reaches end-of-life
- **Mitigation:** Fork OSS before EOL, maintain yourself

---

## Commitment to Transparency

**We commit to:**
- ✅ Honest communication about roadmap
- ✅ Advance notice for breaking changes (90 days minimum)
- ✅ Public changelog for all releases
- ✅ Migration guides for major versions
- ✅ Deprecation warnings before removals

**We will NOT:**
- ❌ Surprise users with breaking changes
- ❌ Remove features without deprecation period
- ❌ Change licenses without community input
- ❌ Shut down Cloud without 90-day notice

---

## Roadmap Visibility

**Public roadmap:**
- Available at: [GitHub Projects](https://github.com/shardie-github/settler-oss/projects)
- Updated quarterly
- Includes major version plans (if any)

**What roadmap includes:**
- Planned features (non-binding)
- Deprecation timeline
- EOL dates for old versions

**What roadmap does NOT include:**
- Binding commitments to ship features (best effort)
- Exact release dates (approximate quarters)

---

## Sunset/Shutdown Policy (Cloud)

**If Settler Cloud shuts down:**
- ✅ Minimum 90-day advance notice
- ✅ Data export tools provided
- ✅ OSS SDK remains available (MIT licensed)
- ✅ Historical data exportable

**User options:**
1. Export data before shutdown
2. Migrate to self-hosted OSS
3. Migrate to alternative service
4. Fork OSS and maintain yourself

---

## Fork-Friendly Approach

**We encourage forking:**
- ✅ MIT license allows it
- ✅ No restrictions on forking or modification
- ✅ You can maintain your own version indefinitely

**Best practices for forking:**
1. Fork repository to your GitHub org
2. Rename packages (avoid npm namespace conflicts)
3. Update `package.json` name and repository
4. Maintain changelog for your fork
5. Contribute improvements back upstream (optional but appreciated)

**Example fork:**
```json
{
  "name": "@your-company/settler-fork",
  "version": "1.0.0-fork.1",
  "repository": "https://github.com/your-company/settler-fork"
}
```

---

## Testing Long-Term Compatibility

**How to verify compatibility across versions:**

### 1. Pin major version
```json
{
  "dependencies": {
    "@settler/sdk": "^1.0.0"  // ← Allows 1.x.x updates, blocks 2.0.0
  }
}
```

### 2. Lock file
Use `package-lock.json` or `pnpm-lock.yaml` to freeze exact versions.

### 3. Automated testing
Test against multiple versions:
```bash
npm install @settler/sdk@1.0.0 && npm test
npm install @settler/sdk@1.1.0 && npm test
npm install @settler/sdk@1.2.0 && npm test
```

### 4. Upgrade testing
Before deploying major version upgrade:
1. Test in staging environment
2. Run full test suite
3. Verify reconciliation results match (determinism)
4. Deploy to production

---

## Summary: 5-10 Year Outlook

**What you can bet on:**
- ✅ MIT license remains (code is yours)
- ✅ Protocol types remain open-source
- ✅ Backward compatibility within major version
- ✅ Deterministic behavior (forever)
- ✅ Balance preservation (forever)

**What you cannot bet on:**
- ❌ Active maintenance (could be archived)
- ❌ Performance improvements (OSS demo is naive)
- ❌ Backward compatibility across major versions
- ❌ Cloud pricing stability

**Conservative approach:**
- Fork OSS early
- Pin to major version
- Test before upgrading
- Budget for potential Cloud price increases
- Plan migration windows for major versions

**Result:** You have control over your long-term destiny (thanks to MIT license and open protocol).

---

## References

- [GUARANTEES.md](./GUARANTEES.md) - Binding guarantees (determinism, balance, completeness)
- [DETERMINISM.md](./DETERMINISM.md) - Deterministic behavior specification
- [ADVERSARIAL_FAQ.md](./ADVERSARIAL_FAQ.md) - Hard questions about Settler
- [AUDIT_READINESS.md](./AUDIT_READINESS.md) - Using Settler in audits
- [SECURITY.md](../SECURITY.md) - Security policy

---

**This policy is binding.** We commit to backward compatibility, advance notice, and transparency.

**Last Updated:** 2026-01-24 • **Version:** 1.0.0
