/**
 * Simple reconciliation logic for OSS demo
 * This is NOT the production reconciliation engine (which is cloud-only)
 * This is a basic implementation for local testing and demos
 */

import type { Transaction, Match, ReconcileResult } from '../types';

export interface ReconcileConfig {
  tolerance?: number; // Amount tolerance (default: 0.01)
  dateTolerance?: number; // Days tolerance (default: 0)
}

/**
 * Simple exact matching reconciliation
 * Matches transactions based on ID, amount (within tolerance), and date
 */
export function reconcile(
  source: Transaction[],
  target: Transaction[],
  config: ReconcileConfig = {}
): ReconcileResult {
  const tolerance = config.tolerance ?? 0.01;
  const dateTolerance = config.dateTolerance ?? 0;

  const matched: Match[] = [];
  const matchedSourceIds = new Set<string>();
  const matchedTargetIds = new Set<string>();

  // Try to match each source transaction with target transactions
  for (const sourceTxn of source) {
    for (const targetTxn of target) {
      if (matchedTargetIds.has(targetTxn.id)) {
        continue; // Already matched
      }

      // Check if amounts match within tolerance
      const amountDiff = Math.abs(sourceTxn.amount - targetTxn.amount);
      if (amountDiff > tolerance) {
        continue;
      }

      // Check if dates match within tolerance
      const sourceDateMs = new Date(sourceTxn.date).getTime();
      const targetDateMs = new Date(targetTxn.date).getTime();
      const dateDiffDays = Math.abs(sourceDateMs - targetDateMs) / (1000 * 60 * 60 * 24);

      if (dateDiffDays > dateTolerance) {
        continue;
      }

      // Match found!
      matched.push({
        sourceId: sourceTxn.id,
        targetId: targetTxn.id,
        confidence: amountDiff === 0 && dateDiffDays === 0 ? 1.0 : 0.9,
        reason: amountDiff === 0 && dateDiffDays === 0
          ? 'Exact match on amount and date'
          : `Match within tolerance (amount diff: ${amountDiff.toFixed(2)}, date diff: ${dateDiffDays.toFixed(1)} days)`,
      });

      matchedSourceIds.add(sourceTxn.id);
      matchedTargetIds.add(targetTxn.id);
      break; // Move to next source transaction
    }
  }

  // Collect unmatched transactions
  const unmatchedSource = source.filter(txn => !matchedSourceIds.has(txn.id));
  const unmatchedTarget = target.filter(txn => !matchedTargetIds.has(txn.id));

  return {
    matched,
    unmatchedSource,
    unmatchedTarget,
    stats: {
      totalSource: source.length,
      totalTarget: target.length,
      matched: matched.length,
      unmatchedSource: unmatchedSource.length,
      unmatchedTarget: unmatchedTarget.length,
    },
  };
}
