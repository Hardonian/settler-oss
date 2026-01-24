/**
 * Output formatting utilities
 */

import type { ReconcileResult } from '../types';

/**
 * Format reconciliation result as a table
 */
export function formatTable(result: ReconcileResult): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('='.repeat(80));
  lines.push('  RECONCILIATION SUMMARY');
  lines.push('='.repeat(80));
  lines.push('');
  lines.push(`  Total Source Transactions:    ${result.stats.totalSource}`);
  lines.push(`  Total Target Transactions:    ${result.stats.totalTarget}`);
  lines.push(`  Matched:                      ${result.stats.matched} (${((result.stats.matched / result.stats.totalSource) * 100).toFixed(1)}%)`);
  lines.push(`  Unmatched Source:             ${result.stats.unmatchedSource}`);
  lines.push(`  Unmatched Target:             ${result.stats.unmatchedTarget}`);
  lines.push('');
  lines.push('='.repeat(80));

  if (result.matched.length > 0) {
    lines.push('');
    lines.push('MATCHED TRANSACTIONS');
    lines.push('-'.repeat(80));
    lines.push(padRight('Source ID', 20) + padRight('Target ID', 20) + padRight('Confidence', 12) + 'Reason');
    lines.push('-'.repeat(80));

    for (const match of result.matched) {
      lines.push(
        padRight(match.sourceId, 20) +
        padRight(match.targetId, 20) +
        padRight(match.confidence.toFixed(2), 12) +
        match.reason
      );
    }
  }

  if (result.unmatchedSource.length > 0) {
    lines.push('');
    lines.push('UNMATCHED SOURCE TRANSACTIONS');
    lines.push('-'.repeat(80));
    lines.push(padRight('ID', 20) + padRight('Amount', 15) + padRight('Date', 15) + 'Description');
    lines.push('-'.repeat(80));

    for (const txn of result.unmatchedSource) {
      lines.push(
        padRight(txn.id, 20) +
        padRight(txn.amount.toFixed(2), 15) +
        padRight(txn.date, 15) +
        txn.description
      );
    }
  }

  if (result.unmatchedTarget.length > 0) {
    lines.push('');
    lines.push('UNMATCHED TARGET TRANSACTIONS');
    lines.push('-'.repeat(80));
    lines.push(padRight('ID', 20) + padRight('Amount', 15) + padRight('Date', 15) + 'Description');
    lines.push('-'.repeat(80));

    for (const txn of result.unmatchedTarget) {
      lines.push(
        padRight(txn.id, 20) +
        padRight(txn.amount.toFixed(2), 15) +
        padRight(txn.date, 15) +
        txn.description
      );
    }
  }

  lines.push('');
  lines.push('='.repeat(80));
  lines.push('');

  return lines.join('\n');
}

/**
 * Format reconciliation result as JSON
 */
export function formatJSON(result: ReconcileResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Pad string to the right with spaces
 */
function padRight(str: string, length: number): string {
  return str + ' '.repeat(Math.max(0, length - str.length));
}
