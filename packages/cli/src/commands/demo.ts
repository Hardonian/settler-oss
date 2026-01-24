/**
 * Demo command - Run a canned demo
 */

import { reconcile } from '../utils/reconcile';
import { formatTable } from '../utils/format';
import type { Transaction } from '../types';

export function demo(): void {
  console.log('');
  console.log('🎬 Running Settler Demo...');
  console.log('');
  console.log('This demo shows how Settler matches transactions from two sources:');
  console.log('  • Source: Payment processor (e.g., Stripe)');
  console.log('  • Target: Accounting system (e.g., QuickBooks)');
  console.log('');

  // Sample source transactions (payment processor)
  const sourceTransactions: Transaction[] = [
    {
      id: 'ch_1234',
      amount: 100.00,
      date: '2026-01-15',
      description: 'Payment from Customer A',
    },
    {
      id: 'ch_1235',
      amount: 250.50,
      date: '2026-01-16',
      description: 'Payment from Customer B',
    },
    {
      id: 'ch_1236',
      amount: 75.25,
      date: '2026-01-17',
      description: 'Payment from Customer C',
    },
    {
      id: 'ch_1237',
      amount: 500.00,
      date: '2026-01-18',
      description: 'Payment from Customer D',
    },
    {
      id: 'ch_1238',
      amount: 120.00,
      date: '2026-01-19',
      description: 'Payment from Customer E',
    },
  ];

  // Sample target transactions (accounting system)
  const targetTransactions: Transaction[] = [
    {
      id: 'inv_001',
      amount: 100.00,
      date: '2026-01-15',
      description: 'Invoice 001 - Customer A',
    },
    {
      id: 'inv_002',
      amount: 250.50,
      date: '2026-01-16',
      description: 'Invoice 002 - Customer B',
    },
    {
      id: 'inv_003',
      amount: 75.25,
      date: '2026-01-17',
      description: 'Invoice 003 - Customer C',
    },
    {
      id: 'inv_004',
      amount: 500.00,
      date: '2026-01-18',
      description: 'Invoice 004 - Customer D',
    },
    {
      id: 'inv_006',
      amount: 200.00,
      date: '2026-01-20',
      description: 'Invoice 006 - Customer F (no matching payment)',
    },
  ];

  console.log(`Source transactions: ${sourceTransactions.length}`);
  console.log(`Target transactions: ${targetTransactions.length}`);
  console.log('');
  console.log('Running reconciliation...');
  console.log('');

  // Run reconciliation
  const result = reconcile(sourceTransactions, targetTransactions);

  // Display results
  console.log(formatTable(result));

  // Explanation
  console.log('📚 What happened:');
  console.log('');
  console.log(`  • ${result.stats.matched} transactions matched perfectly`);
  console.log(`  • ${result.stats.unmatchedSource} payment(s) with no matching invoice`);
  console.log(`  • ${result.stats.unmatchedTarget} invoice(s) with no matching payment`);
  console.log('');
  console.log('This is a simple demo using exact matching.');
  console.log('');
  console.log('For production use:');
  console.log('  • Use Settler Cloud for advanced matching (fuzzy, ML-assisted)');
  console.log('  • Connect to real data sources (Stripe, Shopify, QuickBooks, etc.)');
  console.log('  • Set up webhooks for real-time notifications');
  console.log('  • Schedule automated reconciliations');
  console.log('');
  console.log('Get started: https://settler.dev');
  console.log('');
}
