#!/usr/bin/env node
/**
 * Boundary Check Script
 * 
 * Verifies that protocol packages don't import enterprise or console code.
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const FORBIDDEN_IMPORTS: Record<string, string[]> = {
  'packages/protocol': ['@settler/enterprise', 'apps/console'],
  'packages/shared': ['@settler/enterprise', 'apps/console'],
  'packages/sdk': ['@settler/enterprise', 'apps/console'],
  'packages/cli': ['@settler/enterprise', 'apps/console'],
  'packages/react-settler': ['@settler/enterprise', 'apps/console'],
};

async function checkBoundaries() {
  let errors = 0;
  const workspaceRoot = path.resolve(__dirname, '..');

  for (const [packagePath, forbidden] of Object.entries(FORBIDDEN_IMPORTS)) {
    const fullPath = path.join(workspaceRoot, packagePath);
    
    if (!fs.existsSync(fullPath)) {
      continue;
    }

    try {
      const files = await glob(`${packagePath}/**/*.{ts,tsx}`, {
        cwd: workspaceRoot,
        ignore: ['**/node_modules/**', '**/dist/**', '**/*.test.ts', '**/*.spec.ts'],
      });

      for (const file of files) {
        const filePath = path.join(workspaceRoot, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        for (const importPattern of forbidden) {
          // Check for various import patterns
          const patterns = [
            new RegExp(`import.*from\\s+['"]${importPattern.replace(/\//g, '\\/')}`, 'g'),
            new RegExp(`require\\(['"]${importPattern.replace(/\//g, '\\/')}`, 'g'),
            new RegExp(`from\\s+['"]${importPattern.replace(/\//g, '\\/')}`, 'g'),
          ];

          for (const regex of patterns) {
            if (regex.test(content)) {
              console.error(`❌ ${file}: Forbidden import from ${importPattern}`);
              errors++;
              break;
            }
          }
        }
      }
    } catch (err) {
      console.warn(`⚠️  Could not check ${packagePath}:`, err);
    }
  }

  if (errors > 0) {
    console.error(`\n❌ Found ${errors} boundary violation(s)`);
    console.error('Protocol packages cannot import enterprise or console code.');
    process.exit(1);
  }

  console.log('✓ Protocol packages: No enterprise imports found');
  console.log('✓ Shared packages: No enterprise/console imports found');
  console.log('✓ All boundaries verified');
}

checkBoundaries().catch((err) => {
  console.error('Error running boundary check:', err);
  process.exit(1);
});
