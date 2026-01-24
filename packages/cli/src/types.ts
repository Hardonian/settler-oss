/**
 * CLI-specific types
 */

export interface ReconcileOptions {
  source: string;
  target: string;
  format?: 'json' | 'table';
  out?: string;
  tolerance?: number;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  [key: string]: unknown;
}

export interface Match {
  sourceId: string;
  targetId: string;
  confidence: number;
  reason: string;
}

export interface ReconcileResult {
  matched: Match[];
  unmatchedSource: Transaction[];
  unmatchedTarget: Transaction[];
  stats: {
    totalSource: number;
    totalTarget: number;
    matched: number;
    unmatchedSource: number;
    unmatchedTarget: number;
  };
}
