/**
 * Init command - Create sample config and data
 */

import * as fs from 'fs';
import * as path from 'path';

export function init(): void {
  console.log('');
  console.log('🚀 Initializing Settler project...');
  console.log('');

  const cwd = process.cwd();
  const dataDir = path.join(cwd, 'settler-data');

  // Create data directory
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`✅ Created directory: ${dataDir}`);
  } else {
    console.log(`⚠️  Directory already exists: ${dataDir}`);
  }

  // Create sample source CSV
  const sourceCsvPath = path.join(dataDir, 'source.csv');
  if (!fs.existsSync(sourceCsvPath)) {
    const sourceCsv = `id,amount,date,description
txn_001,100.00,2026-01-15,Payment from Customer A
txn_002,250.50,2026-01-16,Payment from Customer B
txn_003,75.25,2026-01-17,Payment from Customer C
txn_004,500.00,2026-01-18,Payment from Customer D
txn_005,120.00,2026-01-19,Payment from Customer E
`;
    fs.writeFileSync(sourceCsvPath, sourceCsv);
    console.log(`✅ Created sample file: ${sourceCsvPath}`);
  } else {
    console.log(`⚠️  File already exists: ${sourceCsvPath}`);
  }

  // Create sample target CSV
  const targetCsvPath = path.join(dataDir, 'target.csv');
  if (!fs.existsSync(targetCsvPath)) {
    const targetCsv = `id,amount,date,description
inv_001,100.00,2026-01-15,Invoice 001 - Customer A
inv_002,250.50,2026-01-16,Invoice 002 - Customer B
inv_003,75.25,2026-01-17,Invoice 003 - Customer C
inv_004,500.00,2026-01-18,Invoice 004 - Customer D
inv_006,200.00,2026-01-20,Invoice 006 - Customer F
`;
    fs.writeFileSync(targetCsvPath, targetCsv);
    console.log(`✅ Created sample file: ${targetCsvPath}`);
  } else {
    console.log(`⚠️  File already exists: ${targetCsvPath}`);
  }

  // Create .env.example
  const envExamplePath = path.join(cwd, '.env.example');
  if (!fs.existsSync(envExamplePath)) {
    const envExample = `# Settler API Configuration
# Get your API key from https://settler.dev

# For Cloud API (optional)
# SETTLER_API_KEY=sk_test_...
# SETTLER_BASE_URL=https://api.settler.dev

# For self-hosted (optional)
# SETTLER_BASE_URL=http://localhost:3000
`;
    fs.writeFileSync(envExamplePath, envExample);
    console.log(`✅ Created file: ${envExamplePath}`);
  } else {
    console.log(`⚠️  File already exists: ${envExamplePath}`);
  }

  console.log('');
  console.log('✅ Initialization complete!');
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Review the sample data in: ${dataDir}/`);
  console.log(`  2. Run a demo reconciliation:`);
  console.log(`     settler reconcile --source ${dataDir}/source.csv --target ${dataDir}/target.csv`);
  console.log(`  3. Or run the canned demo:`);
  console.log(`     settler demo`);
  console.log('');
}
