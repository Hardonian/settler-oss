/**
 * Settler Shared Utilities
 * 
 * This package contains shared utilities, types, and helpers that are safe
 * for inclusion in OSS protocol bundles. It must NOT import from:
 * - packages/enterprise
 * - apps/console internals
 * - Any SaaS-specific business logic
 */

/**
 * Generate a correlation ID for request tracking
 */
export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(key: string): boolean {
  return typeof key === 'string' && key.length >= 20 && /^[a-zA-Z0-9_-]+$/.test(key);
}

/**
 * Format error for user display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
