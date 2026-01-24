/**
 * Doctor command - Environment and dependency checks
 */

import * as fs from 'fs';
import * as path from 'path';

export function doctor(): void {
  console.log('');
  console.log('🔍 Running Settler environment checks...');
  console.log('');

  const checks: Array<{ name: string; status: string; message?: string }> = [];

  // Check Node.js version
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  if (nodeMajor >= 18) {
    checks.push({ name: 'Node.js version', status: '✅', message: nodeVersion });
  } else {
    checks.push({
      name: 'Node.js version',
      status: '❌',
      message: `${nodeVersion} (minimum: 18.0.0)`,
    });
  }

  // Check for package.json
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    checks.push({ name: 'package.json found', status: '✅' });
  } else {
    checks.push({ name: 'package.json found', status: '⚠️', message: 'Not in a Node.js project' });
  }

  // Check for Settler SDK
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const hasSdk =
      (packageJson.dependencies && packageJson.dependencies['@settler/sdk']) ||
      (packageJson.devDependencies && packageJson.devDependencies['@settler/sdk']);

    if (hasSdk) {
      checks.push({ name: '@settler/sdk installed', status: '✅' });
    } else {
      checks.push({
        name: '@settler/sdk installed',
        status: '⚠️',
        message: 'Not found. Run: npm install @settler/sdk',
      });
    }
  } catch {
    checks.push({ name: '@settler/sdk installed', status: '⚠️', message: 'Cannot read package.json' });
  }

  // Check for API key in environment
  if (process.env.SETTLER_API_KEY) {
    checks.push({ name: 'SETTLER_API_KEY env var', status: '✅' });
  } else {
    checks.push({
      name: 'SETTLER_API_KEY env var',
      status: '⚠️',
      message: 'Not set (required for Cloud API calls)',
    });
  }

  // Check current directory
  checks.push({ name: 'Working directory', status: 'ℹ️', message: cwd });

  // Print results
  console.log('Check Results:');
  console.log('─'.repeat(80));

  for (const check of checks) {
    const statusPadded = check.status.padEnd(4);
    const namePadded = check.name.padEnd(30);
    const message = check.message ? ` ${check.message}` : '';
    console.log(`${statusPadded} ${namePadded}${message}`);
  }

  console.log('─'.repeat(80));
  console.log('');

  const failures = checks.filter(c => c.status === '❌');
  if (failures.length > 0) {
    console.log('❌ Some checks failed. Fix the issues above before using Settler.');
    console.log('');
    process.exit(1);
  } else {
    console.log('✅ All critical checks passed! Settler CLI is ready to use.');
    console.log('');
    console.log('Next steps:');
    console.log('  - Run "settler init" to create sample data');
    console.log('  - Run "settler demo" to see a demo reconciliation');
    console.log('  - Run "settler --help" to see all commands');
    console.log('');
  }
}
