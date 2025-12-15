# Contract Version Changelog

This file tracks changes to the Settler Protocol contract surface. All changes must follow semantic versioning.

## Versioning Rules

- **MAJOR** (X.0.0): Breaking changes to API contracts, schemas, or types
- **MINOR** (0.X.0): New endpoints, new optional fields, backward-compatible additions
- **PATCH** (0.0.X): Bug fixes, clarifications, non-breaking corrections

## 1.0.0 (Initial Release)

### Added
- `/v1/reconcile` endpoint specification
- `/v1/sync` endpoint specification  
- `/v1/health` endpoint specification
- Transaction, ReconcileRequest, ReconcileResponse types
- SyncRequest, SyncResponse types
- MatchingRules configuration
- Error envelope structure
- Webhook envelope structure (for future use)

### Contract Surface
- OpenAPI 3.0 specification
- JSON Schema definitions for all core types
- TypeScript type definitions (generated from schema)
