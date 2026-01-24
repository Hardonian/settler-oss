/**
 * Settler Node.js/TypeScript SDK
 *
 * Official SDK for Settler reconciliation platform
 */

// Re-export protocol types
export * from '@settler/protocol';

// SDK-specific types
export interface SettlerConfig {
  /**
   * API key for authentication (optional for local/demo use)
   */
  apiKey?: string;
  /**
   * Base URL for Settler API
   * Default: https://api.settler.dev
   * For self-hosted: your API URL
   * For local/demo: can be omitted
   */
  baseURL?: string;
  /**
   * Request timeout in milliseconds
   * Default: 30000 (30 seconds)
   */
  timeout?: number;
}

export interface ReconcileOptions {
  /**
   * Source transactions
   */
  source: Array<Record<string, unknown>>;
  /**
   * Target transactions
   */
  target: Array<Record<string, unknown>>;
  /**
   * Matching rules (optional)
   */
  rules?: {
    /**
     * Amount tolerance for matching (default: 0.01)
     */
    tolerance?: number;
    /**
     * Date range tolerance in days (default: 0)
     */
    dateRange?: number;
    /**
     * Fields to use for matching (default: ['id', 'amount', 'date'])
     */
    fields?: string[];
  };
}

export interface ReconcileResult {
  /**
   * Matched transaction pairs
   */
  matched: Array<{
    source: Record<string, unknown>;
    target: Record<string, unknown>;
    confidence: number;
  }>;
  /**
   * Unmatched transactions
   */
  unmatched: {
    source: Array<Record<string, unknown>>;
    target: Array<Record<string, unknown>>;
  };
  /**
   * Summary statistics
   */
  summary: {
    totalSource: number;
    totalTarget: number;
    matched: number;
    unmatchedSource: number;
    unmatchedTarget: number;
  };
}

/**
 * Settler API Client
 *
 * @example
 * ```typescript
 * const client = new SettlerClient({
 *   apiKey: process.env.SETTLER_API_KEY,
 *   baseURL: 'https://api.settler.dev',
 * });
 *
 * const result = await client.reconcile({
 *   source: sourceTransactions,
 *   target: targetTransactions,
 * });
 * ```
 */
export class SettlerClient {
  private config: Required<SettlerConfig>;

  constructor(config: SettlerConfig = {}) {
    this.config = {
      apiKey: config.apiKey || '',
      baseURL: config.baseURL || 'https://api.settler.dev',
      timeout: config.timeout || 30000,
    };
  }

  /**
   * Reconcile transactions between source and target
   *
   * @param options - Reconciliation options
   * @returns Reconciliation result with matched and unmatched transactions
   *
   * @example
   * ```typescript
   * const result = await client.reconcile({
   *   source: [
   *     { id: '1', amount: 100, date: '2026-01-15' },
   *     { id: '2', amount: 200, date: '2026-01-16' },
   *   ],
   *   target: [
   *     { id: 'A', amount: 100, date: '2026-01-15' },
   *     { id: 'B', amount: 200, date: '2026-01-16' },
   *   ],
   * });
   * ```
   */
  async reconcile(options: ReconcileOptions): Promise<ReconcileResult> {
    // If API key is not configured, throw helpful error
    if (!this.config.apiKey) {
      throw new Error(
        'API key not configured. ' +
        'To use Settler Cloud API:\n' +
        '  1. Sign up at https://settler.dev\n' +
        '  2. Get your API key\n' +
        '  3. Initialize client with: new SettlerClient({ apiKey: "sk_..." })\n\n' +
        'For local/demo use, use the CLI: npm install -g @settler/cli && settler demo'
      );
    }

    // Call Settler Cloud API
    const url = `${this.config.baseURL}/v1/reconcile`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        source: options.source,
        target: options.target,
        rules: options.rules,
      }),
      signal: AbortSignal.timeout(this.config.timeout),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Settler API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    return result as ReconcileResult;
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<SettlerConfig> {
    return {
      apiKey: this.config.apiKey ? '***' + this.config.apiKey.slice(-4) : undefined,
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
    };
  }
}

/**
 * Default export for convenience
 */
export default SettlerClient;
