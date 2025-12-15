# Connector Model

This document describes the connector architecture for Settler, explaining how connectors work, the boundary between OSS protocol connectors and enterprise connectors, and how to keep connector implementations private while maintaining protocol stability.

---

## Overview

Settler uses a connector-based architecture to integrate with external systems. Connectors are classified into two categories:

1. **Public Connectors (OSS Protocol)** - Open-source connectors included in the protocol
2. **Enterprise Connectors (Licensed)** - Proprietary connectors requiring a commercial license

---

## Connector Interface Boundary

### Protocol Connector Interface

All connectors implement a common interface defined in the protocol:

```typescript
// Defined in @settler/protocol
export interface Connector {
  name: string;
  type: string;
  version: string;
  
  configure(config: ConnectorConfig): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sync(data: SyncRequest): Promise<SyncResponse>;
  health(): Promise<HealthStatus>;
}

export interface ConnectorConfig {
  endpoint?: string;
  credentials?: Record<string, unknown>;
  options?: Record<string, unknown>;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
}
```

**This interface is part of the open-source protocol** and remains stable across versions.

---

## Public Connectors (OSS Protocol)

### What They Are

Public connectors are part of the open-source protocol and can be:
- Used by anyone
- Self-hosted
- Modified and extended
- Included in protocol SDKs

### Available Public Connectors

1. **REST API Connector**
   - Connects to any REST API
   - Configurable endpoints and authentication
   - Part of `@settler/protocol`

2. **CSV File Connector**
   - Reads/writes CSV files
   - Local or remote file access
   - Part of `@settler/protocol`

3. **JSON File Connector**
   - Reads/writes JSON files
   - Local or remote file access
   - Part of `@settler/protocol`

### Implementation Location

Public connectors are implemented in:
- `packages/protocol/src/connectors/`
- Published as part of `@settler/protocol`
- MIT licensed

### Example: REST API Connector

```typescript
// packages/protocol/src/connectors/rest.ts
import { Connector, ConnectorConfig, SyncRequest, SyncResponse } from '../types';

export class RestApiConnector implements Connector {
  name = 'rest-api';
  type = 'api';
  version = '1.0.0';
  
  private config: ConnectorConfig;
  
  async configure(config: ConnectorConfig): Promise<void> {
    this.config = config;
  }
  
  async connect(): Promise<void> {
    // Implementation
  }
  
  async sync(data: SyncRequest): Promise<SyncResponse> {
    // Implementation
  }
  
  // ... other methods
}
```

---

## Enterprise Connectors (Licensed)

### What They Are

Enterprise connectors are proprietary implementations that:
- Require a commercial license
- Are part of `@settler/enterprise`
- Provide integrations with enterprise systems
- Are NOT included in OSS protocol bundles

### Available Enterprise Connectors

1. **SAP ERP Connector**
   - Integrates with SAP systems
   - Supports multiple SAP modules
   - Requires enterprise license

2. **Salesforce Connector**
   - Connects to Salesforce CRM
   - Supports custom objects and fields
   - Requires enterprise license

3. **Oracle Financials Connector**
   - Integrates with Oracle Financials
   - Supports multiple Oracle modules
   - Requires enterprise license

4. **Microsoft Dynamics Connector**
   - Connects to Dynamics 365
   - Supports Finance, Sales, and Operations
   - Requires enterprise license

5. **Custom Enterprise Integrations**
   - Tailored connectors for specific systems
   - Built on request
   - Requires enterprise license

### Implementation Location

Enterprise connectors are implemented in:
- `packages/enterprise/src/connectors/`
- Part of `@settler/enterprise` package
- Proprietary license
- **NOT imported by protocol packages**

### Example: SAP ERP Connector

```typescript
// packages/enterprise/src/connectors/sap.ts
/**
 * PROPRIETARY LICENSE - Enterprise connector
 */
import { Connector, ConnectorConfig } from '@settler/protocol';

export class SapErpConnector implements Connector {
  name = 'sap-erp';
  type = 'enterprise';
  version = '1.0.0';
  
  // Enterprise-specific implementation
  async configure(config: ConnectorConfig): Promise<void> {
    // SAP-specific configuration
  }
  
  // ... implementation
}
```

---

## Keeping Connector Implementations Private

### Architecture Pattern

The protocol defines the **interface**, while implementations can be private:

```
┌─────────────────────────────────────┐
│   @settler/protocol (OSS)           │
│   ┌───────────────────────────────┐ │
│   │  Connector Interface          │ │ ← Public, stable
│   └───────────────────────────────┘ │
└─────────────────────────────────────┘
           ↑                    ↑
           │                    │
    ┌──────┴──────┐      ┌──────┴──────┐
    │   Public    │      │ Enterprise  │
    │ Connectors  │      │ Connectors  │
    │  (OSS)      │      │ (Licensed)  │
    └─────────────┘      └─────────────┘
```

### Import Rules

**Protocol packages CANNOT import:**
```typescript
// ❌ FORBIDDEN in protocol packages
import { SapErpConnector } from '@settler/enterprise';
```

**Console app CAN import:**
```typescript
// ✅ ALLOWED in console app
import { SapErpConnector } from '@settler/enterprise';
import { RestApiConnector } from '@settler/protocol';
```

### Build-Time Separation

1. **Protocol Bundle**: Only includes public connectors
2. **Console Bundle**: Includes both public and enterprise connectors
3. **Enterprise Package**: Separate package, not published to public npm

---

## Protocol Stability

### Interface Stability

The connector interface in `@settler/protocol` is:
- **Versioned**: Follows semantic versioning
- **Stable**: Breaking changes only in major versions
- **Documented**: Full API documentation
- **Tested**: Protocol-level tests

### Implementation Flexibility

While the interface remains stable:
- **New connectors** can be added (public or enterprise)
- **Connector implementations** can evolve independently
- **Enterprise connectors** can extend functionality without affecting protocol

### Versioning Strategy

```
Protocol Interface: v1.0.0 (stable)
├── Public Connectors: v1.0.0
└── Enterprise Connectors: v1.0.0+ (can add features)
```

---

## Adding New Connectors

### Public Connector (OSS)

1. **Implement** connector in `packages/protocol/src/connectors/`
2. **Export** from `packages/protocol/src/index.ts`
3. **Document** in protocol docs
4. **Test** with protocol test suite
5. **License**: MIT (part of protocol)

### Enterprise Connector (Licensed)

1. **Implement** connector in `packages/enterprise/src/connectors/`
2. **Export** from `packages/enterprise/src/index.ts`
3. **Document** in enterprise docs (gated)
4. **Test** with enterprise test suite
5. **License**: Proprietary
6. **Verify**: No protocol packages import it

---

## Connector Registry

### Public Registry (OSS)

Public connectors are registered in:
- `packages/protocol/src/connectors/registry.ts`
- Published with protocol
- Available to all users

### Enterprise Registry (Licensed)

Enterprise connectors are registered in:
- `packages/enterprise/src/connectors/registry.ts`
- Only available to licensed users
- Loaded dynamically in console app

---

## Runtime Connector Loading

### Protocol (Self-Hosted)

```typescript
// Self-hosted protocol instance
import { RestApiConnector } from '@settler/protocol';

const connector = new RestApiConnector();
await connector.configure({ endpoint: 'https://api.example.com' });
```

### Console (Managed)

```typescript
// Console app loads both public and enterprise connectors
import { RestApiConnector } from '@settler/protocol';
import { SapErpConnector } from '@settler/enterprise';

// Available connectors based on license
const connectors = [
  new RestApiConnector(),  // Public
  new SapErpConnector(),   // Enterprise (if licensed)
];
```

---

## Verification

See [VERIFICATION.md](./VERIFICATION.md) for checks that ensure:
- Protocol packages don't import enterprise connectors
- Connector interface remains stable
- Enterprise connectors implement protocol interface

---

## Related Documentation

- [BOUNDARY_MAP.md](./BOUNDARY_MAP.md) - Protocol vs Management boundary
- [ENTERPRISE_INSTANCES.md](./ENTERPRISE_INSTANCES.md) - Enterprise deployment
- [LICENSING.md](./LICENSING.md) - Licensing information

---

Last updated: 2024-01-XX
