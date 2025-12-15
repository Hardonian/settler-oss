# Licensing Guide

This document describes the licensing model for Settler and provides guidance for contributors on what code belongs where.

## License Overview

Settler uses a dual-licensing model:

1. **Protocol (OSS)** - MIT License
2. **Console & Enterprise (Licensed SaaS)** - Proprietary License

---

## Protocol License (MIT)

### What is Covered

The **Settler Protocol** is open-source and licensed under the MIT License. This includes:

- **SDKs**: All language SDKs (`@settler/sdk`, `settler-sdk` Python, Go SDK, Ruby SDK)
- **CLI Tool**: `@settler/cli`
- **React Components**: `@settler/react-settler`
- **Protocol Core**: `@settler/protocol` - API specification, types, and protocol contracts
- **Shared Utilities**: `@settler/shared` - OSS-safe utilities
- **Documentation**: Protocol documentation, API specs, examples
- **Frontend Routes**: `/protocol/*`, `/docs/*` (public documentation)

### MIT License Terms

```
MIT License

Copyright (c) 2024 Settler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### What You Can Do

- ✅ Use the protocol in commercial and non-commercial projects
- ✅ Modify the protocol code
- ✅ Distribute modified or unmodified versions
- ✅ Self-host protocol instances
- ✅ Create derivative works
- ✅ Use in proprietary software

---

## Console & Enterprise License (Proprietary)

### What is Covered

The **Settler Console** and **Enterprise** components are proprietary and require a commercial license:

- **Console Application**: `apps/console` - SaaS management layer
- **Enterprise Package**: `packages/enterprise` - Enterprise connectors, policy packs, deployment tooling
- **Console Routes**: `/console/*` (in web app)
- **Enterprise Routes**: `/enterprise/*` (in web app)

### Proprietary License Terms

These components are **NOT** open-source. Access requires:

1. **Console License**: Paid subscription for managed console access
2. **Enterprise License**: Custom commercial license for enterprise features

### What You Cannot Do

- ❌ Copy, modify, or distribute console/enterprise code
- ❌ Reverse engineer console/enterprise functionality
- ❌ Use console/enterprise code without a valid license
- ❌ Include console/enterprise code in OSS protocol bundles

---

## Contributor Guidance

### Where Should My Code Go?

#### Protocol (OSS) - `packages/protocol`, `packages/sdk-*`, `packages/cli`, `packages/react-settler`

**Put code here if it:**
- Implements the core protocol API
- Provides SDK functionality
- Is a CLI tool for protocol operations
- Is a React component for protocol integration
- Can be safely used, modified, and self-hosted by anyone

**Examples:**
- API client implementations
- Protocol type definitions
- SDK utilities
- CLI commands
- Protocol examples

#### Shared (OSS-safe) - `packages/shared`

**Put code here if it:**
- Is a utility function used by both protocol and console
- Contains no SaaS-specific business logic
- Can be safely included in OSS bundles
- Does NOT import from `packages/enterprise` or `apps/console`

**Examples:**
- Correlation ID generation
- API key validation (format only)
- Error formatting utilities
- Common type definitions (protocol-level)

#### Console (Licensed) - `apps/console`

**Put code here if it:**
- Implements SaaS management features
- Requires authentication/authorization
- Manages tenants, users, or billing
- Provides admin/operational interfaces
- Implements RBAC or audit logging

**Examples:**
- Dashboard UI
- Tenant management
- User administration
- Billing integration
- SSO configuration
- Audit log views

#### Enterprise (Licensed) - `packages/enterprise`

**Put code here if it:**
- Implements enterprise connectors
- Provides policy packs
- Contains deployment tooling
- Requires commercial license
- Should NOT be imported by protocol packages

**Examples:**
- SAP ERP connector
- Salesforce connector
- Custom enterprise integrations
- Compliance policy packs
- Advanced deployment tools

---

## Import Rules

### Protocol packages CAN import:
- `@settler/protocol`
- `@settler/shared`
- Standard npm packages

### Protocol packages CANNOT import:
- `@settler/enterprise` ❌
- `apps/console/*` ❌
- Any SaaS-specific business logic ❌

### Shared packages CAN import:
- Standard npm packages only

### Shared packages CANNOT import:
- `@settler/enterprise` ❌
- `apps/console/*` ❌
- `@settler/protocol` (to avoid circular dependencies) ❌

### Console app CAN import:
- `@settler/protocol` ✅
- `@settler/shared` ✅
- `@settler/enterprise` ✅
- Standard npm packages ✅

### Enterprise package CAN import:
- `@settler/protocol` ✅
- `@settler/shared` ✅
- Standard npm packages ✅

---

## License Headers

### Protocol Files

Add this header to protocol source files:

```typescript
/**
 * Settler Protocol - Open Source
 * 
 * MIT License
 * Copyright (c) 2024 Settler
 */
```

### Enterprise Files

Add this header to enterprise source files:

```typescript
/**
 * Settler Enterprise - Licensed SaaS Components
 * 
 * PROPRIETARY LICENSE - This code requires a commercial license.
 * Copyright (c) 2024 Settler. All rights reserved.
 */
```

### Console Files

Add this header to console source files:

```typescript
/**
 * Settler Console - Licensed SaaS Management Layer
 * 
 * PROPRIETARY LICENSE - This code requires a commercial license.
 * Copyright (c) 2024 Settler. All rights reserved.
 */
```

---

## Enforcement

See [VERIFICATION.md](./VERIFICATION.md) for automated checks that enforce these boundaries.

---

## Questions?

If you're unsure where code belongs:

1. Check [BOUNDARY_MAP.md](./BOUNDARY_MAP.md)
2. Ask: "Can this be safely self-hosted by anyone?"
3. Ask: "Does this require authentication or SaaS infrastructure?"
4. When in doubt, ask maintainers before contributing

---

Last updated: 2024-01-XX
