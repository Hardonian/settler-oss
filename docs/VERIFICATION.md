# Verification Guide

This document describes the automated checks that enforce the boundary between OSS Protocol and Licensed SaaS Management Layer code.

---

## Automated Checks

### 1. ESLint: No Restricted Imports

**Purpose**: Prevent protocol packages from importing enterprise or console code.

**Configuration**: `.eslintrc.json` and package-specific `.eslintrc.json` files

**Rules**:
- Protocol packages cannot import `@settler/enterprise`
- Protocol packages cannot import `apps/console/*`
- Shared packages cannot import enterprise or console code

**Run**:
```bash
pnpm lint
```

**Expected Output**: No errors related to restricted imports

---

### 2. TypeScript Project References

**Purpose**: Enforce compile-time boundaries using TypeScript project references.

**Configuration**: `tsconfig.json` files in each package

**Structure**:
```json
{
  "references": [
    { "path": "../protocol" },    // Allowed
    { "path": "../shared" },       // Allowed
    // NO reference to enterprise in protocol packages
  ]
}
```

**Run**:
```bash
pnpm typecheck
```

**Expected Output**: TypeScript compilation succeeds without cross-boundary errors

---

### 3. Boundary Check Script

**Purpose**: Scan imports to detect forbidden cross-boundary imports.

**Script**: `scripts/check-boundaries.ts`

**Run**:
```bash
pnpm run check-boundaries
```

**Expected Output**:
```
✓ Protocol packages: No enterprise imports found
✓ Shared packages: No enterprise/console imports found
✓ All boundaries verified
```

---

### 4. Build Verification

**Purpose**: Ensure builds succeed and don't accidentally bundle enterprise code into protocol packages.

**Run**:
```bash
pnpm build
```

**Expected Output**: 
- Protocol packages build successfully
- Console app builds successfully
- No enterprise code in protocol bundles

---

### 5. Route Smoke Tests

**Purpose**: Verify that routes don't hard-500 and degrade gracefully.

**Run** (if Playwright is configured):
```bash
pnpm test:e2e
```

**Expected Output**:
- `/protocol` routes load successfully
- `/console` routes show graceful fallback if not authenticated
- `/console` routes show graceful error if backend unreachable
- No unhandled exceptions

---

## Manual Verification Steps

### Check Import Boundaries

1. **Protocol Packages**:
   ```bash
   grep -r "@settler/enterprise" packages/protocol packages/sdk packages/cli packages/react-settler
   ```
   **Expected**: No matches

2. **Shared Package**:
   ```bash
   grep -r "@settler/enterprise\|apps/console" packages/shared
   ```
   **Expected**: No matches

3. **Console App** (should be able to import enterprise):
   ```bash
   grep -r "@settler/enterprise" apps/console
   ```
   **Expected**: Matches are allowed

### Check License Headers

1. **Protocol Files**:
   ```bash
   find packages/protocol packages/sdk packages/cli -name "*.ts" -exec grep -L "MIT License\|Open Source" {} \;
   ```
   **Expected**: All files have license headers

2. **Enterprise Files**:
   ```bash
   find packages/enterprise -name "*.ts" -exec grep -L "PROPRIETARY" {} \;
   ```
   **Expected**: All files have proprietary license headers

### Check Route Structure

1. **Protocol Routes** (should exist):
   ```bash
   ls -la apps/web/src/app/protocol*
   ```
   **Expected**: `/protocol`, `/protocol/sdk`, `/protocol/spec`, `/protocol/examples`

2. **Console Routes** (should have error boundaries):
   ```bash
   ls -la apps/web/src/app/console/error.tsx
   ```
   **Expected**: Error boundary exists

---

## CI Integration

### GitHub Actions

The CI workflow (`.github/workflows/ci.yml`) runs:

1. **Lint Check**:
   ```yaml
   - name: Run linter
     run: pnpm lint
   ```

2. **Type Check**:
   ```yaml
   - name: Run typecheck
     run: pnpm typecheck
   ```

3. **Build Check**:
   ```yaml
   - name: Build
     run: pnpm build
   ```

4. **Boundary Check** (if script exists):
   ```yaml
   - name: Check boundaries
     run: pnpm run check-boundaries
   ```

### Pre-commit Hooks (Optional)

Add to `.husky/pre-commit`:
```bash
#!/bin/sh
pnpm lint
pnpm typecheck
pnpm run check-boundaries
```

---

## Boundary Check Script Implementation

Create `scripts/check-boundaries.ts`:

```typescript
#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const FORBIDDEN_IMPORTS = {
  'packages/protocol': ['@settler/enterprise', 'apps/console'],
  'packages/shared': ['@settler/enterprise', 'apps/console'],
  'packages/sdk': ['@settler/enterprise', 'apps/console'],
  'packages/cli': ['@settler/enterprise', 'apps/console'],
  'packages/react-settler': ['@settler/enterprise', 'apps/console'],
};

async function checkBoundaries() {
  let errors = 0;

  for (const [packagePath, forbidden] of Object.entries(FORBIDDEN_IMPORTS)) {
    const files = await glob(`${packagePath}/**/*.{ts,tsx}`, {
      ignore: ['**/node_modules/**', '**/dist/**'],
    });

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      
      for (const importPattern of forbidden) {
        const regex = new RegExp(`import.*from.*['"]${importPattern.replace(/\//g, '\\/')}`, 'g');
        if (regex.test(content)) {
          console.error(`❌ ${file}: Forbidden import from ${importPattern}`);
          errors++;
        }
      }
    }
  }

  if (errors > 0) {
    console.error(`\n❌ Found ${errors} boundary violations`);
    process.exit(1);
  }

  console.log('✓ All boundaries verified');
}

checkBoundaries().catch(console.error);
```

---

## Expected Verification Results

### Successful Verification

```
$ pnpm lint
✓ Linting complete

$ pnpm typecheck
✓ Type checking complete

$ pnpm build
✓ Build complete

$ pnpm run check-boundaries
✓ Protocol packages: No enterprise imports found
✓ Shared packages: No enterprise/console imports found
✓ All boundaries verified
```

### Failed Verification Example

```
$ pnpm run check-boundaries
❌ packages/protocol/src/index.ts: Forbidden import from @settler/enterprise
❌ Found 1 boundary violations
```

---

## Troubleshooting

### Import Errors

**Problem**: TypeScript errors about missing modules

**Solution**: 
- Check `tsconfig.json` references
- Ensure package is in `package.json` dependencies
- Verify workspace configuration

### Build Failures

**Problem**: Build fails with import errors

**Solution**:
- Check ESLint rules
- Verify `next.config.js` webpack aliases
- Check TypeScript project references

### Boundary Violations

**Problem**: Script detects forbidden imports

**Solution**:
- Remove the import
- Move code to appropriate package
- Use dependency injection if needed

---

## Continuous Monitoring

### Regular Checks

Run verification checks:
- Before committing code
- In CI/CD pipeline
- Before releases
- Weekly audits

### Monitoring

Track:
- Boundary violations over time
- Build success rate
- Type check errors
- Import patterns

---

## Related Documentation

- [BOUNDARY_MAP.md](./BOUNDARY_MAP.md) - Boundary definitions
- [LICENSING.md](./LICENSING.md) - Licensing rules
- [CONNECTOR_MODEL.md](./CONNECTOR_MODEL.md) - Connector boundaries

---

Last updated: 2024-01-XX
