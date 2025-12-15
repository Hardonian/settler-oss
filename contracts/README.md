# Settler Protocol Contracts

This directory contains the **contract surface** for the Settler Protocol API. These contracts define the public API that must remain compatible between the OSS repository and the private Settler Platform repository.

## Structure

```
contracts/
├── CONTRACT_VERSION          # Current contract version (semver)
├── CHANGELOG.md              # Version history and breaking changes
├── openapi.yaml              # OpenAPI 3.0 specification
├── schemas/                  # JSON Schema definitions
│   ├── transaction.json
│   ├── reconcile-request.json
│   ├── reconcile-response.json
│   ├── matching-rules.json
│   ├── error-envelope.json
│   ├── webhook-envelope.json
│   └── health-response.json
├── examples/                 # Example fixtures for validation
│   ├── reconcile-request.json
│   ├── reconcile-response.json
│   ├── error-envelope.json
│   ├── health-response.json
│   └── webhook-envelope.json
└── README.md                 # This file
```

## Contract Surface

The contract surface includes:

1. **API Endpoints**: `/v1/reconcile`, `/v1/sync`, `/v1/health`
2. **Request/Response Types**: All request and response payloads
3. **Error Format**: Standard error envelope structure
4. **Webhook Format**: Standard webhook event envelope
5. **Environment Variables**: API key format, base URL conventions
6. **SDK Method Signatures**: Public SDK methods and their signatures

## Versioning

- **MAJOR** (X.0.0): Breaking changes to API contracts
- **MINOR** (0.X.0): New endpoints, optional fields (backward-compatible)
- **PATCH** (0.0.X): Bug fixes, clarifications

## Validation

Run contract validation:

```bash
npm run contracts:check
```

This checks:
- Schema validity
- Example fixtures match schemas
- TypeScript types are up-to-date with schemas
- OpenAPI spec is valid

## Compatibility

These contracts must remain compatible with:
- `packages/protocol/src/types/index.ts` (TypeScript types)
- `packages/sdk/src/index.ts` (SDK implementation)
- Private Settler Platform API implementation

## Updating Contracts

1. Update schemas in `schemas/`
2. Update OpenAPI spec in `openapi.yaml`
3. Update examples in `examples/`
4. Update `CONTRACT_VERSION` following semver
5. Add entry to `CHANGELOG.md`
6. Run `npm run contracts:check`
7. Update TypeScript types in `packages/protocol/src/types/`
