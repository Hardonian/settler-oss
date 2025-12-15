/**
 * Settler Protocol Types
 * 
 * Core type definitions for the Settler protocol API.
 * These types are part of the open-source protocol specification.
 */

export interface ReconcileRequest {
  source: Transaction[];
  target: Transaction[];
  rules?: MatchingRules;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  [key: string]: unknown;
}

export interface MatchingRules {
  tolerance?: number;
  dateRange?: number;
  fields?: string[];
}

export interface ReconcileResponse {
  matched: MatchedPair[];
  unmatched: {
    source: Transaction[];
    target: Transaction[];
  };
  summary: ReconciliationSummary;
}

export interface MatchedPair {
  source: Transaction;
  target: Transaction;
  confidence: number;
}

export interface ReconciliationSummary {
  totalSource: number;
  totalTarget: number;
  matched: number;
  unmatchedSource: number;
  unmatchedTarget: number;
}

export interface SyncRequest {
  source: string;
  target: string;
  config: SyncConfig;
}

export interface SyncConfig {
  direction: 'source-to-target' | 'target-to-source' | 'bidirectional';
  filters?: Record<string, unknown>;
}

export interface SyncResponse {
  synced: number;
  errors: SyncError[];
}

export interface SyncError {
  transaction: Transaction;
  reason: string;
}
