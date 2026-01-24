/**
 * CSV parsing utilities
 */

import * as fs from 'fs';
import type { Transaction } from '../types';

/**
 * Simple CSV parser (no external dependencies)
 * Parses CSV files with headers
 */
export function parseCSV(filePath: string): Transaction[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');

  if (lines.length < 2) {
    throw new Error(`CSV file ${filePath} must have at least a header row and one data row`);
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim());

  // Parse data rows
  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());

    if (values.length !== headers.length) {
      console.warn(`Warning: Row ${i + 1} has ${values.length} values but expected ${headers.length}. Skipping.`);
      continue;
    }

    const transaction: Transaction = {
      id: '',
      amount: 0,
      date: '',
      description: '',
    };

    headers.forEach((header, index) => {
      const value = values[index];
      const lowerHeader = header.toLowerCase();

      // Map common field names
      if (lowerHeader === 'id' || lowerHeader === 'transaction_id' || lowerHeader === 'txn_id') {
        transaction.id = value;
      } else if (lowerHeader === 'amount' || lowerHeader === 'value') {
        transaction.amount = parseFloat(value.replace(/[^0-9.-]/g, ''));
      } else if (lowerHeader === 'date' || lowerHeader === 'transaction_date') {
        transaction.date = value;
      } else if (lowerHeader === 'description' || lowerHeader === 'desc' || lowerHeader === 'memo') {
        transaction.description = value;
      } else {
        // Store other fields as-is
        transaction[header] = value;
      }
    });

    transactions.push(transaction);
  }

  return transactions;
}

/**
 * Validate that all transactions have required fields
 */
export function validateTransactions(transactions: Transaction[], fileName: string): void {
  for (const txn of transactions) {
    if (!txn.id) {
      throw new Error(`Transaction in ${fileName} is missing required field: id`);
    }
    if (typeof txn.amount !== 'number' || isNaN(txn.amount)) {
      throw new Error(`Transaction ${txn.id} in ${fileName} has invalid amount: ${txn.amount}`);
    }
    if (!txn.date) {
      throw new Error(`Transaction ${txn.id} in ${fileName} is missing required field: date`);
    }
  }
}
