/**
 * Reconcile command - Run reconciliation on CSV files
 */

import * as fs from 'fs';
import { parseCSV, validateTransactions } from '../utils/csv';
import { reconcile } from '../utils/reconcile';
import { formatTable, formatJSON } from '../utils/format';
import type { ReconcileOptions } from '../types';

export function reconcileCommand(options: ReconcileOptions): void {
  console.log('');
  console.log('🔄 Running reconciliation...');
  console.log('');

  // Validate inputs
  if (!options.source) {
    console.error('❌ Error: --source file is required');
    process.exit(1);
  }

  if (!options.target) {
    console.error('❌ Error: --target file is required');
    process.exit(1);
  }

  if (!fs.existsSync(options.source)) {
    console.error(`❌ Error: Source file not found: ${options.source}`);
    process.exit(1);
  }

  if (!fs.existsSync(options.target)) {
    console.error(`❌ Error: Target file not found: ${options.target}`);
    process.exit(1);
  }

  try {
    // Parse CSV files
    console.log(`📄 Reading source: ${options.source}`);
    const sourceTransactions = parseCSV(options.source);
    validateTransactions(sourceTransactions, options.source);
    console.log(`   Loaded ${sourceTransactions.length} source transactions`);

    console.log(`📄 Reading target: ${options.target}`);
    const targetTransactions = parseCSV(options.target);
    validateTransactions(targetTransactions, options.target);
    console.log(`   Loaded ${targetTransactions.length} target transactions`);

    console.log('');
    console.log('⚙️  Running reconciliation logic...');

    // Run reconciliation
    const result = reconcile(sourceTransactions, targetTransactions, {
      tolerance: options.tolerance ?? 0.01,
    });

    console.log('   Reconciliation complete!');
    console.log('');

    // Format output
    const format = options.format || 'table';
    let output: string;

    if (format === 'json') {
      output = formatJSON(result);
    } else {
      output = formatTable(result);
    }

    // Write to file or stdout
    if (options.out) {
      fs.writeFileSync(options.out, output);
      console.log(`✅ Results written to: ${options.out}`);
      console.log('');
    } else {
      console.log(output);
    }

    // Summary
    const matchRate = (result.stats.matched / result.stats.totalSource) * 100;
    if (matchRate >= 90) {
      console.log(`✅ Reconciliation successful! ${matchRate.toFixed(1)}% match rate`);
    } else if (matchRate >= 70) {
      console.log(`⚠️  Reconciliation completed with ${matchRate.toFixed(1)}% match rate`);
    } else {
      console.log(`❌ Low match rate: ${matchRate.toFixed(1)}%. Review unmatched transactions.`);
    }
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ Error during reconciliation:');
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    console.error('');
    process.exit(1);
  }
}
