/**
 * Settler Protocol - Open Source API Specification
 * 
 * This package contains the core protocol types, API contracts, and specifications
 * for the Settler reconciliation platform. All code in this package is MIT licensed
 * and can be freely used, modified, and self-hosted.
 */

// Re-export protocol types
export * from './types';

// Protocol version
export const PROTOCOL_VERSION = '1.0.0';

// Protocol API endpoints
export const PROTOCOL_ENDPOINTS = {
  RECONCILE: '/v1/reconcile',
  SYNC: '/v1/sync',
  HEALTH: '/v1/health',
} as const;
