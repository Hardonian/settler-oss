#!/usr/bin/env node
/**
 * Secret Leak Detection Script
 * 
 * Checks for:
 * 1. Common secret patterns (API keys, passwords, tokens)
 * 2. Forbidden paths that shouldn't be in OSS
 * 3. Proprietary code references
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const WORKSPACE_ROOT = path.resolve(__dirname, '..');

// Patterns that indicate secrets (simplified - in production use tools like detect-secrets)
const SECRET_PATTERNS = [
  /api[_-]?key\s*[:=]\s*['"](sk_|pk_|AKIA|AIza|ghp_)[^'"]+/i,
  /password\s*[:=]\s*['"][^'"]{8,}/i,
  /secret\s*[:=]\s*['"][^'"]{16,}/i,
  /token\s*[:=]\s*['"][^'"]{20,}/i,
  /private[_-]?key\s*[:=]/i,
  /BEGIN\s+(RSA\s+)?PRIVATE\s+KEY/i,
  /^[^-]*-----BEGIN[^-]/m, // Only match if not in a regex pattern definition
  /mongodb\+srv:\/\/[^:]+:[^@]+@/,
  /postgres:\/\/[^:]+:[^@]+@/,
  /mysql:\/\/[^:]+:[^@]+@/,
  /redis:\/\/:[^@]+@/,
];

// Forbidden paths that shouldn't exist in OSS
const FORBIDDEN_PATHS = [
  /\.env$/,
  /\.env\.local$/,
  /\.env\.production$/,
  /secrets\.json$/,
  /credentials\.json$/,
  /config\/secrets/,
  /internal\//,
  /proprietary\//,
];

// Forbidden terms that indicate proprietary code
const FORBIDDEN_TERMS = [
  /@settler\/enterprise/,
  /apps\/console/,
  /proprietary/i,
  /customer[_-]?list/i,
  /internal[_-]?ops/i,
  /monetization/i,
  /revenue[_-]?share/i,
];

// Files/directories to ignore
const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.next/**',
  '**/.git/**',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
  '**/*.lock',
  'contracts/examples/**', // Examples may contain fake secrets
];

interface CheckResult {
  file: string;
  line?: number;
  issue: string;
  severity: 'error' | 'warning';
}

async function checkFile(filePath: string): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const relativePath = path.relative(WORKSPACE_ROOT, filePath);
  
  // Check forbidden paths
  for (const pattern of FORBIDDEN_PATHS) {
    if (pattern.test(relativePath)) {
      results.push({
        file: relativePath,
        issue: `Forbidden path pattern: ${pattern}`,
        severity: 'error',
      });
    }
  }
  
  // Skip binary files
  const ext = path.extname(filePath).toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
    return results;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // Check for secret patterns
    lines.forEach((line, index) => {
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(line)) {
          // Skip if it's a comment, example, or in a regex pattern definition
          const trimmed = line.trim();
          const isComment = trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('#');
          const isExample = line.includes('example') || line.includes('EXAMPLE');
          const isRegexPattern = line.includes('new RegExp') || (line.includes('/') && line.includes('pattern')) || line.includes('SECRET_PATTERNS') || line.includes('const SECRET_PATTERNS');
          const isInString = (line.match(/['"]/g) || []).length >= 2;
          const isInThisFile = relativePath.includes('check-secrets.ts');
          
          if (!isComment && !isExample && !isRegexPattern && !isInString && !isInThisFile) {
            results.push({
              file: relativePath,
              line: index + 1,
              issue: `Potential secret detected: ${pattern}`,
              severity: 'error',
            });
          }
        }
      }
      
      // Check for forbidden terms
      for (const term of FORBIDDEN_TERMS) {
        if (term.test(line)) {
          // Allow in comments/docs explaining boundaries
          const trimmed = line.trim();
          const isComment = trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('#');
          const isDocFile = relativePath.endsWith('.md') || relativePath.endsWith('.mdx');
          const isBoundaryScript = relativePath.includes('check-boundaries') || relativePath.includes('check-secrets');
          const isInQuotes = (line.match(/['"]/g) || []).length >= 2; // Likely in string literal
          
          if (!isComment && !isDocFile && !isBoundaryScript && !isInQuotes) {
            results.push({
              file: relativePath,
              line: index + 1,
              issue: `Forbidden term detected: ${term}`,
              severity: 'warning',
            });
          }
        }
      }
    });
  } catch (error) {
    // Skip files that can't be read (binary, etc.)
  }
  
  return results;
}

async function main() {
  console.log('🔒 Checking for secret leaks and forbidden content...\n');
  
  const allResults: CheckResult[] = [];
  
  // Check all files except ignored patterns
  const files = await glob('**/*', {
    cwd: WORKSPACE_ROOT,
    ignore: IGNORE_PATTERNS,
    nodir: true,
  });
  
  console.log(`Scanning ${files.length} files...\n`);
  
  for (const file of files) {
    const filePath = path.join(WORKSPACE_ROOT, file);
    const results = await checkFile(filePath);
    allResults.push(...results);
  }
  
  // Group by severity
  const errors = allResults.filter(r => r.severity === 'error');
  const warnings = allResults.filter(r => r.severity === 'warning');
  
  // Print results
  if (warnings.length > 0) {
    console.log(`⚠️  Warnings (${warnings.length}):`);
    warnings.forEach(w => {
      if (w.line) {
        console.log(`   ${w.file}:${w.line} - ${w.issue}`);
      } else {
        console.log(`   ${w.file} - ${w.issue}`);
      }
    });
    console.log();
  }
  
  if (errors.length > 0) {
    console.log(`❌ Errors (${errors.length}):`);
    errors.forEach(e => {
      if (e.line) {
        console.log(`   ${e.file}:${e.line} - ${e.issue}`);
      } else {
        console.log(`   ${e.file} - ${e.issue}`);
      }
    });
    console.log('\n❌ Secret leak check failed!');
    console.log('Please remove secrets and forbidden content before committing.');
    process.exit(1);
  } else {
    console.log('✅ No secret leaks detected!');
    if (warnings.length > 0) {
      console.log(`⚠️  ${warnings.length} warning(s) found - please review`);
    }
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
