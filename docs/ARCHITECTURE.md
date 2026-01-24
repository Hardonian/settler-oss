# Settler Architecture

**Version:** 1.0.0
**Last Updated:** 2026-01-24

This document provides a technical overview of Settler's architecture, covering both the OSS protocol components and the managed Cloud platform.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Applications                        │
│  (Your app using Settler SDKs or React components)             │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP/REST
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                    OSS Client SDKs (MIT)                        │
│  ┌──────────┐  ┌─────────┐  ┌──────┐  ┌──────┐  ┌──────────┐  │
│  │TypeScript│  │ Python  │  │  Go  │  │ Ruby │  │   CLI    │  │
│  └──────────┘  └─────────┘  └──────┘  └──────┘  └──────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          React Components (react-settler)                │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTPS API Calls
                 │
┌────────────────▼────────────────────────────────────────────────┐
│                  Settler Cloud Platform (Proprietary)           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     API Gateway                          │  │
│  │  - Authentication & API Key Validation                  │  │
│  │  - Rate Limiting                                         │  │
│  │  - Request Routing                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Reconciliation   │  │    Adapter       │  │   Webhook    │  │
│  │     Engine       │  │    Registry      │  │   Delivery   │  │
│  │ (Event-sourced)  │  │  (50+ providers) │  │   (Queue)    │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Developer Console (apps/console)               │  │
│  │  - Multi-tenant Admin, RBAC, Monitoring, Logs           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Architecture

### OSS Components (packages/*)

#### 1. SDK Layer (`packages/sdk`, `sdk-python`, `sdk-go`, `sdk-ruby`)
**Purpose:** HTTP client libraries for calling Settler APIs

**Responsibilities:**
- HTTP request/response handling
- Authentication (API key injection)
- Error handling and retries
- Type-safe method signatures
- Request serialization
- Response deserialization

**Key Exports:**
- `SettlerClient` - Main client class
- `reconcile()` - Trigger reconciliation jobs
- `getJob()` - Fetch job status
- `listJobs()` - List historical jobs
- Type definitions for requests/responses

**Architecture:**
```typescript
// Example: packages/sdk/src/index.ts
class SettlerClient {
  private apiKey: string;
  private baseURL: string;

  async reconcile(request: ReconcileRequest): Promise<ReconcileResult> {
    // HTTP POST to /v1/reconcile
    // Handle auth, retries, errors
  }
}
```

#### 2. Protocol Types (`packages/protocol`)
**Purpose:** Framework-agnostic type definitions and specifications

**Responsibilities:**
- Define job configuration interfaces
- Define reconciliation result types
- Define error schemas
- Define webhook event schemas
- Maintain protocol versioning

**Key Exports:**
- `ReconcileRequest` - Job configuration type
- `ReconcileResult` - Result type
- `MatchRule` - Matching rule configuration
- `SettlerError` - Error type
- `WebhookEvent` - Webhook event type

**Architecture:**
```typescript
// Example: packages/protocol/src/types.ts
export interface ReconcileRequest {
  source: Transaction[];
  target: Transaction[];
  rules?: MatchRule[];
  webhookUrl?: string;
}

export interface ReconcileResult {
  jobId: string;
  matched: Match[];
  unmatched: {
    source: Transaction[];
    target: Transaction[];
  };
  stats: ReconciliationStats;
}
```

#### 3. CLI Tool (`packages/cli`)
**Purpose:** Command-line interface for local development and testing

**Responsibilities:**
- Local reconciliation testing (demo mode)
- Job configuration helpers
- API key management (with Cloud)
- Environment checks (`doctor` command)
- Sample data generation

**Key Commands:**
```bash
settler doctor       # Check environment and dependencies
settler init         # Create sample config and data
settler reconcile    # Run reconciliation (local or API)
settler adapters     # List available adapters
settler demo         # Run canned demo
```

**Architecture:**
```typescript
// Example: packages/cli/src/index.ts
import { Command } from 'commander';

const program = new Command();

program
  .command('reconcile')
  .option('--source <file>', 'Source CSV file')
  .option('--target <file>', 'Target CSV file')
  .action(async (options) => {
    // Load CSVs, run reconciliation logic
  });
```

#### 4. React Components (`packages/react-settler`)
**Purpose:** UI building blocks for reconciliation interfaces

**Responsibilities:**
- Job configuration forms
- Result visualization
- Error display
- Loading states
- Accessibility

**Key Components:**
```tsx
<ReconcileForm onSubmit={handleReconcile} />
<ResultsTable results={reconcileResult} />
<MatchCard match={match} />
<ErrorBoundary />
```

#### 5. Shared Utilities (`packages/shared`)
**Purpose:** Common utilities safe for OSS use

**Responsibilities:**
- CSV parsing helpers
- Date/time utilities
- Validation functions (protocol-level only)
- Currency formatting
- Type guards

**Import Rule:** No dependencies on `packages/enterprise` or `apps/console`

---

### Cloud Components (Proprietary)

#### 1. Reconciliation Engine (Cloud-hosted)
**Purpose:** Core matching and reconciliation logic

**Architecture:**
- **Event-sourced** - All state changes recorded as events
- **Deterministic** - Same input → same output
- **Currency-safe** - Precise decimal math (no floating point)
- **Auditable** - Full history of all matching decisions

**Matching Strategies:**
1. **Exact matching** - ID, amount, date exact match
2. **Fuzzy matching** - Tolerance bands, date ranges
3. **Rule-based** - Custom matching rules
4. **ML-assisted** (Enterprise) - Learned matching patterns

**Data Flow:**
```
Reconcile Request
  → Parse & Validate
  → Load Transactions (via adapters)
  → Apply Matching Rules
  → Compute Matches
  → Store Results (event log)
  → Trigger Webhooks
  → Return Result
```

#### 2. Adapter Registry (Cloud-hosted)
**Purpose:** Managed connectors for external providers

**Pre-built Adapters:**
- **Payment Processors:** Stripe, PayPal, Square, Braintree
- **E-commerce:** Shopify, WooCommerce, Magento
- **Accounting:** QuickBooks, Xero, NetSuite
- **Banks:** Plaid, Yodlee

**Adapter Interface:**
```typescript
interface Adapter {
  authenticate(credentials: Credentials): Promise<void>;
  fetchTransactions(query: Query): Promise<Transaction[]>;
  syncIncremental(lastSync: Date): Promise<Transaction[]>;
}
```

#### 3. Developer Console (`apps/console`)
**Purpose:** Multi-tenant web dashboard

**Features:**
- **Job Monitoring** - Real-time job status, logs, exceptions
- **API Key Management** - Create, revoke, rotate keys
- **Adapter Configuration** - OAuth flows, credential storage
- **Exception Review** - Manual review of unmatched transactions
- **Analytics** - Usage metrics, match rates, performance
- **RBAC** - Team permissions, role management
- **Audit Logs** - Complete activity trail

**Tech Stack:**
- Next.js (React)
- TypeScript
- Tailwind CSS
- Multi-tenant architecture

#### 4. Webhook Delivery (Cloud-hosted)
**Purpose:** Reliable event delivery infrastructure

**Architecture:**
- **Queue-based** - Redis/SQS for event buffering
- **Retry logic** - Exponential backoff (3 attempts)
- **Signature verification** - HMAC-SHA256 signatures
- **Delivery tracking** - Success/failure logs

**Webhook Events:**
```typescript
{
  type: 'reconcile.completed',
  jobId: 'job_123',
  timestamp: '2026-01-24T10:00:00Z',
  data: ReconcileResult,
  signature: 'sha256=...'
}
```

---

## 🔄 Data Flow

### Reconciliation Flow (API)

```
1. User App calls SDK
   settlerClient.reconcile({ source, target, rules })

2. SDK sends HTTP POST to Cloud
   POST https://api.settler.dev/v1/reconcile
   Headers: { Authorization: 'Bearer <api-key>' }

3. API Gateway validates request
   - Check API key
   - Rate limit check
   - Parse payload

4. Reconciliation Engine processes
   - Load transactions from adapters (if needed)
   - Apply matching rules
   - Compute matches
   - Store event log

5. Results returned to SDK
   { jobId, matched, unmatched, stats }

6. Webhook delivery (if configured)
   POST to user's webhook URL

7. User App displays results
   Using ResultsTable component
```

### Local Development Flow (CLI)

```
1. User runs CLI locally
   settler reconcile --source a.csv --target b.csv

2. CLI parses CSV files
   Read and parse transaction data

3. CLI runs demo reconciliation logic
   Simple exact matching (OSS implementation)

4. CLI outputs results
   Console table or JSON output

5. No API calls made
   Fully local, no network required
```

---

## 🔐 Security Architecture

### Authentication & Authorization
- **API Keys** - Bearer token authentication
- **Key Scoping** - Read-only vs. read-write keys
- **Rate Limiting** - Per-key limits
- **IP Allowlisting** (Enterprise) - Restrict key usage by IP

### Data Security
- **Encryption at Rest** - AES-256 for stored data
- **Encryption in Transit** - TLS 1.3 for all API calls
- **PCI Compliance** - For payment data handling
- **SOC 2 Type II** - Annual audit

### Multi-Tenancy
- **Tenant Isolation** - Database-level separation
- **RBAC** - Role-based access control
- **Audit Logs** - All actions logged with actor
- **Data Residency** (Enterprise) - Regional deployments

---

## 🚀 Deployment Architecture

### OSS Packages
**Distribution:**
- npm registry: `@settler/sdk`, `@settler/cli`, `@settler/react-settler`
- PyPI: `settler-sdk`
- RubyGems: `settler-sdk`
- Go modules: `github.com/shardie-github/settler-oss/packages/sdk-go`

**Installation:**
```bash
npm install @settler/sdk
pip install settler-sdk
gem install settler-sdk
go get github.com/shardie-github/settler-oss/packages/sdk-go
```

### Cloud Platform
**Infrastructure:**
- **Hosting:** AWS (us-east-1, eu-west-1, ap-southeast-1)
- **Compute:** ECS Fargate (containerized services)
- **Database:** PostgreSQL (Aurora Serverless v2)
- **Cache:** Redis (ElastiCache)
- **Queue:** SQS + EventBridge
- **CDN:** CloudFront
- **DNS:** Route53

**Regions:**
- US: us-east-1 (primary), us-west-2 (backup)
- EU: eu-west-1 (GDPR compliance)
- APAC: ap-southeast-1

---

## 📊 Scalability

### Horizontal Scaling
- **API Servers** - Auto-scale based on CPU/memory
- **Workers** - Auto-scale based on queue depth
- **Database** - Aurora auto-scaling (read replicas)

### Performance
- **Latency** - P95 < 200ms for API calls
- **Throughput** - 10,000+ transactions/sec per region
- **Availability** - 99.9% uptime SLA (Enterprise)

---

## 🔧 Technology Stack

### OSS Components
- **Language:** TypeScript (Node.js ≥18)
- **Testing:** Jest
- **Linting:** ESLint + TypeScript ESLint
- **Build:** TypeScript Compiler (tsc)
- **CLI:** Commander.js
- **React:** React 18+

### Cloud Platform
- **Backend:** Node.js (TypeScript)
- **Frontend:** Next.js 14+ (React 18+)
- **Database:** PostgreSQL 15+
- **Cache:** Redis 7+
- **Queue:** AWS SQS + EventBridge
- **Monitoring:** Datadog
- **Logging:** CloudWatch + Datadog

---

## 📐 Design Principles

### OSS Design
1. **Zero Dependencies** - Minimize external deps for SDKs
2. **Type Safety** - Full TypeScript definitions
3. **Framework Agnostic** - Protocol types don't assume framework
4. **Composability** - Small, focused packages
5. **Testability** - Easy to test without real API calls

### Cloud Design
1. **Event Sourcing** - All state changes as events
2. **Idempotency** - Safe to retry any operation
3. **Graceful Degradation** - Degrade features, not fail hard
4. **Multi-Tenancy** - Tenant isolation at DB level
5. **Auditability** - Complete audit trail

---

## 🔗 Related Documentation

- **[OSS_SCOPE.md](../OSS_SCOPE.md)** - What's in OSS scope
- **[CLOUD_VS_OSS.md](./CLOUD_VS_OSS.md)** - Detailed comparison
- **[PRODUCT_BOUNDARIES.md](../PRODUCT_BOUNDARIES.md)** - Product boundaries
- **[BOUNDARY_MAP.md](./BOUNDARY_MAP.md)** - Technical module classification

---

**Questions?** Open a [GitHub Discussion](https://github.com/shardie-github/settler-oss/discussions)

Last Updated: 2026-01-24
