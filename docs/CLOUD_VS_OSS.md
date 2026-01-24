# Cloud vs OSS: Feature Comparison

**Version:** 1.0.0
**Last Updated:** 2026-01-24

This document provides a side-by-side comparison of Settler's open-source (OSS) components and the managed Cloud platform.

---

## 📊 Feature Matrix

| Feature | OSS (MIT) | Cloud (SaaS) | Notes |
|---------|-----------|--------------|-------|
| **Client SDKs** | ✅ Full | ✅ Full | Same SDKs work with both |
| **Protocol Types** | ✅ Full | ✅ Full | Type-safe interfaces |
| **React Components** | ✅ Full | ✅ Full | UI building blocks |
| **CLI Tool** | ✅ Full | ✅ Full | Local testing + Cloud API |
| **Documentation** | ✅ Full | ✅ Full | Public docs for all |
| **Code Examples** | ✅ Full | ✅ Full | MIT licensed examples |
| | | | |
| **Reconciliation Engine** | ❌ No | ✅ Full | Core matching logic (proprietary) |
| **Managed Adapters** | ❌ No | ✅ 50+ | Stripe, Shopify, etc. |
| **Developer Console** | ❌ No | ✅ Full | Web dashboard |
| **Webhooks** | ❌ No | ✅ Full | Event delivery infrastructure |
| **Scheduled Jobs** | ❌ No | ✅ Full | Cron-based automation |
| **API Hosting** | ⚠️ Self-host | ✅ Managed | Infrastructure required for OSS |
| **Database** | ⚠️ Self-host | ✅ Managed | You provide for OSS |
| **Monitoring** | ⚠️ DIY | ✅ Built-in | Cloud includes logs/metrics |
| **Support** | Community | 24/7 Dedicated | Enterprise tier |
| **SLA** | None | 99.9% | Enterprise tier |
| **Data Residency** | Your choice | EU/US/APAC | Enterprise tier |
| **SSO/SAML** | ❌ No | ✅ Enterprise | Enterprise tier |
| **Audit Logs** | ⚠️ DIY | ✅ Full | Enterprise tier |
| **RBAC** | ⚠️ DIY | ✅ Full | Console feature |

**Legend:**
- ✅ **Full** - Fully included, no restrictions
- ⚠️ **DIY/Self-host** - Possible but you build/maintain it
- ❌ **No** - Not included

---

## 🎯 Use Case Recommendations

### Choose OSS When:

#### 1. **Custom Reconciliation Logic**
- You need specialized matching rules
- Industry-specific requirements
- Regulatory constraints on data flow
- **Example:** Financial institution with custom compliance rules

#### 2. **Full Infrastructure Control**
- Data must stay on-premises
- Existing infrastructure investment
- Security/compliance requirements
- **Example:** Enterprise with on-premise data policies

#### 3. **Prototyping & Development**
- Early-stage testing
- Local development workflows
- No production traffic yet
- **Example:** Startup validating product concept

#### 4. **Custom Data Sources**
- Proprietary systems
- Internal databases
- Legacy applications
- **Example:** Company with custom ERP system

#### 5. **Cost Optimization (High Volume)**
- Very high transaction volumes (millions/day)
- Per-transaction fees not viable
- Willing to invest in ops team
- **Example:** Large-scale payment processor

### Choose Cloud When:

#### 1. **Standard Provider Integrations**
- Need Stripe, Shopify, QuickBooks, etc.
- OAuth flows and credential management
- Regular provider updates
- **Example:** E-commerce platform reconciling multiple payment processors

#### 2. **Fast Time-to-Market**
- Need to launch quickly
- Limited engineering resources
- No ops team
- **Example:** Startup launching MVP

#### 3. **Managed Infrastructure**
- Don't want to run servers
- Need automatic scaling
- Want SLA guarantees
- **Example:** SaaS company focusing on core product

#### 4. **Real-Time Workflows**
- Webhooks for instant notifications
- Scheduled jobs (daily/hourly reconciliations)
- Event-driven architecture
- **Example:** Fintech app with real-time transaction monitoring

#### 5. **Enterprise Features**
- SSO/SAML required
- Audit logs for compliance
- RBAC for team management
- **Example:** Enterprise with SOX compliance requirements

### Hybrid Approach

Many teams use **both OSS and Cloud**:

**Development:**
- Use OSS SDK for all code
- Test locally with CLI
- Prototype with sample data

**Production:**
- Connect to Cloud API
- Use managed adapters
- Monitor in Console

**Advantages:**
- ✅ No vendor lock-in (SDK is OSS)
- ✅ Fast development (local testing)
- ✅ Production reliability (managed infrastructure)
- ✅ Can self-host if needed later

---

## 💰 Cost Comparison

### OSS (Self-Hosted)

**One-Time Costs:**
- ✅ **Free** - MIT license, no licensing fees
- ⚠️ **Development** - Build reconciliation engine ($20k-$100k+)
- ⚠️ **Adapters** - Build custom connectors ($5k-$20k per adapter)

**Ongoing Costs:**
- ⚠️ **Infrastructure** - AWS/GCP/Azure hosting ($500-$5k/month)
- ⚠️ **Engineering** - Ops team for maintenance ($100k+/year)
- ⚠️ **Adapter Updates** - Provider API changes ($2k-$10k/year)

**Break-Even Analysis:**
- Makes sense at **very high volumes** (millions of transactions/month)
- Or when **data control is mandatory**

### Cloud (Managed SaaS)

**Pricing Tiers:**

| Tier | Monthly Base | Included Transactions | Overage |
|------|--------------|----------------------|---------|
| **Free** | $0 | 100 | N/A |
| **Starter** | $29 | 1,000 | $0.01/transaction |
| **Growth** | $99 | 10,000 | $0.01/transaction |
| **Enterprise** | Custom | Custom | Volume discounts |

**Example Costs:**

| Monthly Volume | OSS (Self-Hosted) | Cloud (Managed) | Winner |
|----------------|-------------------|-----------------|--------|
| 1,000 txns | $2,000+ (infra) | $29 | **Cloud** |
| 10,000 txns | $3,000+ | $99 | **Cloud** |
| 100,000 txns | $5,000+ | $999 | **Cloud** |
| 1,000,000 txns | $10,000+ | $9,999 | **Cloud** |
| 10,000,000 txns | $20,000+ | $99,999 | **OSS** (if high-volume) |

**Hidden Cloud Benefits:**
- ✅ No engineering time spent on ops
- ✅ No adapter maintenance burden
- ✅ Automatic scaling and updates
- ✅ SLA guarantees (Enterprise)

---

## 🛠️ Technical Capabilities

### What OSS Provides

#### Client Libraries
```typescript
// Same SDK for both OSS and Cloud
import { SettlerClient } from '@settler/sdk';

const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY,
  baseURL: 'https://api.settler.dev', // or your self-hosted URL
});

const result = await client.reconcile({
  source: transactions1,
  target: transactions2,
  rules: { tolerance: 0.01 },
});
```

#### Protocol Types
```typescript
// Type-safe interfaces for any implementation
import { ReconcileRequest, ReconcileResult } from '@settler/protocol';

function myCustomReconcile(request: ReconcileRequest): ReconcileResult {
  // Your own reconciliation logic
}
```

#### React Components
```tsx
// UI building blocks
import { ReconcileForm, ResultsTable } from '@settler/react-settler';

function MyApp() {
  return (
    <>
      <ReconcileForm onSubmit={handleReconcile} />
      <ResultsTable results={results} />
    </>
  );
}
```

#### CLI Tool
```bash
# Local testing without Cloud
settler reconcile --source a.csv --target b.csv --format json

# Or use with Cloud API
settler reconcile --source a.csv --target b.csv --api
```

### What Cloud Provides (Additional)

#### Managed Adapters
```typescript
// Pre-built connectors (Cloud only)
const result = await client.reconcile({
  source: {
    adapter: 'stripe',
    credentials: { apiKey: '...' },
    query: { startDate: '2026-01-01' },
  },
  target: {
    adapter: 'quickbooks',
    credentials: { oauth: '...' },
    query: { account: 'revenue' },
  },
});
```

#### Webhooks
```typescript
// Real-time notifications (Cloud only)
const job = await client.reconcile({
  source: transactions1,
  target: transactions2,
  webhookUrl: 'https://myapp.com/webhooks/settler',
});

// Your webhook receives:
// POST https://myapp.com/webhooks/settler
// { type: 'reconcile.completed', jobId: '...', data: {...} }
```

#### Scheduled Jobs
```typescript
// Automated reconciliations (Cloud only, via Console UI)
// Schedule: Daily at 2am UTC
// Source: Stripe (last 24 hours)
// Target: QuickBooks (unreconciled)
// Webhook: https://myapp.com/webhooks/settler
```

---

## 🔄 Migration Paths

### OSS → Cloud

**When to Migrate:**
- Need pre-built adapters
- Want managed infrastructure
- Need webhooks/scheduling
- Want to reduce ops burden

**Migration Steps:**
1. Sign up for Cloud account
2. Get API key
3. Update SDK `baseURL` to `https://api.settler.dev`
4. Replace custom adapters with managed ones (optional)
5. Configure webhooks in Console (optional)

**No Code Changes:**
- SDK code stays the same
- Types stay the same
- React components stay the same

### Cloud → OSS

**When to Migrate:**
- Need full infrastructure control
- Data residency requirements
- Very high volume (cost optimization)
- Vendor lock-in concerns

**Migration Steps:**
1. Fork OSS repository
2. Implement reconciliation engine (or use custom)
3. Build custom adapters for your providers
4. Deploy infrastructure (database, API server, workers)
5. Update SDK `baseURL` to your self-hosted URL

**Code Changes:**
- SDK code stays the same
- Replace managed adapters with custom ones
- Build webhook infrastructure (if needed)

---

## 🎓 Decision Framework

### Quick Decision Tree

```
Do you need pre-built provider integrations (Stripe, Shopify, etc.)?
├─ YES → Cloud (or hybrid)
└─ NO ↓

Do you have regulatory requirements for on-premise hosting?
├─ YES → OSS (self-hosted)
└─ NO ↓

Do you have a dedicated ops team?
├─ YES → OSS could work
└─ NO → Cloud (managed)

Is your transaction volume > 10M/month?
├─ YES → OSS might be cost-effective
└─ NO → Cloud (managed)

Do you need webhooks and scheduled jobs?
├─ YES → Cloud
└─ NO → OSS works
```

### Evaluation Criteria

| Criterion | Favors OSS | Favors Cloud |
|-----------|------------|--------------|
| **Budget** | High volume, low ops cost | Low-medium volume |
| **Engineering** | Strong ops team | Small/no ops team |
| **Time-to-Market** | Can wait 3-6 months | Need it now |
| **Customization** | Highly specialized | Standard workflows |
| **Compliance** | On-premise required | Cloud-friendly |
| **Scaling** | Millions/day | Thousands-hundreds of thousands/day |
| **Support** | Community OK | Need SLA/support |

---

## 📈 Feature Roadmap

### OSS (Planned)
- ✅ TypeScript/Node.js SDK (stable)
- ⏳ Python SDK (in development)
- ⏳ Go SDK (in development)
- ⏳ Ruby SDK (in development)
- ✅ React Components (stable)
- ✅ CLI Tool (stable)
- 🔮 Reference reconciliation engine (considering)
- 🔮 Example adapter implementations (considering)

### Cloud (Planned)
- ✅ Core reconciliation engine (stable)
- ✅ 50+ managed adapters (stable)
- ✅ Developer Console (stable)
- ✅ Webhooks (stable)
- ✅ Scheduled jobs (stable)
- ⏳ Advanced analytics (in development)
- ⏳ Multi-region deployment (EU, APAC)
- 🔮 ML-assisted matching (enterprise, considering)
- 🔮 White-label options (enterprise, considering)

**Legend:**
- ✅ Stable and available
- ⏳ In active development
- 🔮 Under consideration

---

## 🔗 Related Documentation

- **[OSS_SCOPE.md](../OSS_SCOPE.md)** - Quick reference for OSS scope
- **[PRODUCT_BOUNDARIES.md](../PRODUCT_BOUNDARIES.md)** - Complete boundary definitions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture overview
- **[BOUNDARY_MAP.md](./BOUNDARY_MAP.md)** - Technical module classification

---

## 💬 Questions?

- **OSS Questions:** [GitHub Discussions](https://github.com/shardie-github/settler-oss/discussions)
- **Cloud Questions:** [support@settler.dev](mailto:support@settler.dev)
- **Sales:** [sales@settler.dev](mailto:sales@settler.dev)

---

**Summary:** OSS provides **building blocks** for self-hosting or Cloud integration. Cloud provides **managed infrastructure** and **pre-built integrations** for faster time-to-market.

Last Updated: 2026-01-24
