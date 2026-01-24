# Settler OSS Scope & Product Boundaries

**Version:** 1.0.0
**Last Updated:** 2026-01-23

This document defines the boundaries between Settler's **open-source SDK** (MIT licensed) and the **commercial Settler Cloud platform** (proprietary).

---

## 🎯 Product Positioning

### Open Source SDK (This Repository)
**What it is:** Client libraries and protocol definitions for building reconciliation workflows

**License:** MIT License

**Purpose:** Enable developers to:
- Integrate with the Settler Cloud API
- Build custom reconciliation logic (self-hosted)
- Create UI components for reconciliation workflows
- Contribute to the SDK ecosystem

**NOT a complete reconciliation platform** — it's the tools to build one or connect to one.

### Settler Cloud (Commercial SaaS)
**What it is:** Fully managed reconciliation platform with infrastructure, engine, and adapters

**License:** Proprietary

**Purpose:** Provide a production-ready, scalable reconciliation service with:
- Managed infrastructure
- Pre-built payment provider adapters
- Reconciliation engine with deterministic matching
- Real-time webhooks and scheduled jobs
- Developer console and monitoring

---

## 📦 What's Open Source (MIT Licensed)

### 1. Client SDKs
**Location:** `packages/sdk/`, `sdk-go/`, `sdk-python/`, `sdk-ruby/`

**What OSS users get:**
- TypeScript/JavaScript SDK (`@settler/sdk`)
- Go SDK (in development)
- Python SDK (in development)
- Ruby SDK (in development)
- HTTP client implementations
- Request/response types
- Error handling utilities

**What OSS users CAN do:**
- ✅ Call Settler Cloud APIs (with API key)
- ✅ Build custom clients in other languages
- ✅ Fork and modify for self-hosted implementations
- ✅ Use in commercial projects without attribution
- ✅ Publish modified versions (MIT license)

**What OSS users CANNOT do:**
- ❌ Access Settler Cloud without an API key
- ❌ Get managed adapters (Stripe, Shopify, etc.) without Cloud
- ❌ Run reconciliations without Cloud or self-hosted engine

### 2. Protocol Types
**Location:** `packages/protocol/`

**What OSS users get:**
- Framework-agnostic TypeScript types
- Job configuration interfaces
- Reconciliation result types
- Error type definitions
- Webhook event schemas

**What OSS users CAN do:**
- ✅ Use types in their own implementations
- ✅ Build custom reconciliation engines
- ✅ Create compatible services
- ✅ Extend types for custom workflows

**What OSS users CANNOT do:**
- ❌ Claim compatibility with Settler Cloud without testing
- ❌ Trademark or brand projects as "Settler-certified"

### 3. React Components
**Location:** `packages/react-settler/`

**What OSS users get:**
- React UI components for reconciliation workflows
- Form components for job configuration
- Result display components
- Error boundary components

**What OSS users CAN do:**
- ✅ Use components in their own apps
- ✅ Customize styles and behavior
- ✅ Build on top of components
- ✅ Use with self-hosted backends

**What OSS users CANNOT do:**
- ❌ Expect components to work with Settler Cloud without API key
- ❌ Access cloud-only features (webhooks, scheduling) without Cloud

### 4. CLI Tool
**Location:** `packages/cli/`

**What OSS users get:**
- Command-line tool for local development
- Job configuration helpers
- Testing utilities
- API exploration commands

**What OSS users CAN do:**
- ✅ Test reconciliation workflows locally
- ✅ Manage API keys (with Cloud account)
- ✅ Debug job configurations
- ✅ Extend CLI with custom commands

**What OSS users CANNOT do:**
- ❌ Run reconciliations without Cloud or self-hosted engine
- ❌ Access managed adapters without Cloud

### 5. Examples & Documentation
**Location:** `examples/`, `docs/public/`

**What OSS users get:**
- Code examples for common use cases
- Best practices and patterns
- Integration guides
- Public API documentation

**What OSS users CAN do:**
- ✅ Copy-paste examples into their projects
- ✅ Learn from examples
- ✅ Contribute new examples
- ✅ Build tutorials and guides

---

## 🔒 What's Proprietary (Settler Cloud Only)

### 1. Reconciliation Engine
**Status:** Not open source, cloud-hosted only

**What it includes:**
- Event-sourced matching engine
- Deterministic math for currency calculations
- Transaction deduplication
- Conflict resolution algorithms
- Performance optimizations for high volume

**Why it's proprietary:**
- Core competitive advantage
- Complex algorithmic IP
- Requires managed infrastructure
- Continuous improvement and tuning

**OSS alternative:** Build your own matching logic using SDK types

### 2. Managed Adapters
**Status:** Not open source, cloud-hosted only

**What it includes:**
- Pre-built connectors for 50+ providers:
  - Payment processors (Stripe, PayPal, Square, Braintree)
  - E-commerce (Shopify, WooCommerce, Magento)
  - Accounting (QuickBooks, Xero, NetSuite)
  - Banks (Plaid, Yodlee)
- OAuth flows and credential management
- Rate limiting and retries
- Schema normalization
- Incremental sync

**Why it's proprietary:**
- High development and maintenance cost
- Requires ongoing provider compatibility
- Credentials and security infrastructure
- Business partnerships with providers

**OSS alternative:** Build your own adapters or use provider SDKs directly

### 3. Developer Console
**Status:** Not open source, cloud-hosted only

**What it includes:**
- Web dashboard for monitoring reconciliations
- API key management UI
- Job configuration wizard
- Real-time execution logs
- Exception review and resolution
- Usage metrics and billing
- Tenant management (super admin)

**Why it's proprietary:**
- Requires backend infrastructure
- Integrated with billing and auth
- Continuous UI/UX improvements
- Multi-tenant architecture

**OSS alternative:** Build your own admin UI using SDK and React components

### 4. Webhooks & Scheduling
**Status:** Not open source, cloud-hosted only

**What it includes:**
- Webhook delivery infrastructure
- Event queue and retry logic
- Signature verification
- Cron-based job scheduling
- Timezone handling
- Failure notifications

**Why it's proprietary:**
- Requires worker infrastructure
- Queue management (Redis/SQS)
- Monitoring and alerting
- Delivery guarantees

**OSS alternative:** Build your own job scheduler (cron, Celery, etc.)

### 5. Enterprise Features
**Status:** Not open source, enterprise-only

**What it includes:**
- SSO / SAML integration
- Audit logs and compliance reports
- SLA guarantees (99.9% uptime)
- Dedicated support
- Custom contract terms
- On-premise deployment options

**Why it's proprietary:**
- High-touch sales and support
- Legal and compliance requirements
- Custom infrastructure needs

---

## 🚦 What OSS Users Can/Cannot Do

### ✅ What You CAN Do (Permitted)

1. **Use SDK with Settler Cloud**
   - Install SDK via npm/pip/gem
   - Sign up for free account at settler.dev
   - Get API key and start reconciling
   - Use free tier (100 transactions/month)

2. **Build Self-Hosted Solutions**
   - Fork SDK and modify
   - Implement your own reconciliation engine
   - Use protocol types for compatibility
   - Build custom adapters
   - Create your own UI with React components

3. **Commercial Use**
   - Use SDK in commercial projects (MIT license)
   - Sell products built on Settler Cloud
   - White-label solutions (with Cloud subscription)
   - Build SaaS apps using SDK

4. **Contribute to OSS**
   - Submit PRs for bug fixes
   - Add new language SDKs
   - Contribute examples
   - Improve documentation

### ❌ What You CANNOT Do (Prohibited)

1. **Access Cloud Without Account**
   - Cannot call Settler Cloud APIs without API key
   - Cannot bypass authentication
   - Cannot reverse-engineer Cloud services

2. **Redistribute Proprietary Code**
   - Cannot extract proprietary adapters
   - Cannot clone Developer Console code
   - Cannot republish cloud-only features

3. **Claim Official Support**
   - Cannot claim "official Settler support" without contract
   - Cannot use "Settler Certified" without authorization
   - Cannot imply partnership without agreement

4. **Abuse Free Tier**
   - Cannot create multiple accounts to exceed limits
   - Cannot use bots to generate free transactions
   - Cannot resell free tier access

---

## 💰 Monetization Model

### Open Source Strategy (SDKs)
**Business model:** Free forever, MIT licensed

**Why open source the SDKs?**
1. **Developer adoption**: Remove friction for trying Settler
2. **Ecosystem growth**: Enable community-built integrations
3. **Quality improvements**: Leverage community contributions
4. **Transparency**: Build trust with open client code
5. **Multi-language support**: Community can add new SDKs

**What we DON'T monetize:**
- SDK downloads or usage
- Protocol implementations
- React components
- CLI tool
- Documentation and examples

### Commercial Revenue (Cloud Platform)
**Business model:** Usage-based SaaS with tiered pricing

**What we DO monetize:**
1. **Reconciliation transactions** ($0.01 per transaction)
2. **Managed adapters** (included in Cloud subscription)
3. **Infrastructure** (API hosting, database, workers)
4. **Scheduled jobs** (automated reconciliations)
5. **Webhooks** (real-time event delivery)
6. **Developer Console** (monitoring and management)
7. **Enterprise features** (SSO, SLA, support)

**Pricing Tiers:**
- **Free**: 100 transactions/month (no credit card)
- **Starter**: $29/month + $0.01/transaction (1,000 included)
- **Growth**: $99/month + $0.01/transaction (10,000 included)
- **Enterprise**: Custom pricing (volume discounts, SLA)

**Why usage-based?**
- Aligns cost with value delivered
- Scales with customer growth
- Predictable for customers
- Fair for all sizes (startups to enterprise)

---

## 🎓 OSS User Paths

### Path 1: Settler Cloud User (Recommended)
**Who:** Developers who want a managed solution

1. Install SDK: `npm install @settler/sdk`
2. Sign up at [settler.dev](https://settler.dev)
3. Get API key
4. Create reconciliation jobs
5. Monitor in Developer Console
6. Upgrade as you grow

**Cost:** Free tier → Paid tiers as usage grows

### Path 2: Self-Hosted (Advanced)
**Who:** Developers who want full control

1. Fork this repository
2. Implement your own reconciliation engine
3. Build custom adapters for your providers
4. Use protocol types for consistency
5. Host on your own infrastructure

**Cost:** Free (MIT license) + your infrastructure costs

**Trade-offs:**
- ✅ Full control and customization
- ✅ No per-transaction fees
- ✅ Data stays on your infrastructure
- ❌ Build and maintain your own engine
- ❌ Build and maintain provider adapters
- ❌ No managed infrastructure
- ❌ No official support

### Path 3: Hybrid
**Who:** Developers who want flexibility

1. Use Settler Cloud for production workloads
2. Self-host for development/testing
3. Use SDK and protocol types for both
4. Contribute improvements back to OSS

---

## 📊 Competitive Positioning

### vs. Fully Proprietary SaaS (e.g., Rutter, Merge)
**Advantage:** Open SDK reduces vendor lock-in, enables self-hosting

### vs. Fully Open Source (e.g., Airbyte)
**Advantage:** Managed Cloud is faster to start, no infrastructure needed

### Our Approach: "Open Core"
- **Core SDKs**: Open source (adoption)
- **Managed Platform**: Commercial (revenue)
- **Clear boundaries**: No "bait and switch"

---

## 🔮 Future Considerations

### Potential OSS Additions
We may open-source additional components in the future:
- Sample reconciliation engine (reference implementation)
- Example adapter implementations (Stripe, Shopify)
- Self-hosted dashboard template

**Decision criteria:**
1. Does it help adoption?
2. Does it reduce support burden?
3. Does it create competitive advantage for Cloud?
4. Is it sustainable to maintain?

### Potential Commercial Additions
We may add new commercial features:
- Advanced analytics and reporting
- Multi-region deployment
- Custom SLA tiers
- White-label options

**Decision criteria:**
1. Is there customer demand?
2. Can we deliver quality?
3. Does it require managed infrastructure?
4. Is it financially sustainable?

---

## 📞 Contact & Governance

### Questions About Scope?
- **GitHub Discussions**: [github.com/shardie-github/settler-oss/discussions](https://github.com/shardie-github/settler-oss/discussions)
- **Email**: opensource@settler.dev

### License Clarifications
- **OSS License**: MIT (see [LICENSE](LICENSE))
- **Commercial License**: Proprietary (see [settler.dev/terms](https://settler.dev/terms))

### Governance
- **OSS Maintainer**: Settler Engineering Team
- **Commercial Owner**: Settler Inc.
- **Contributions**: Accepted via GitHub PRs (CLA required)

---

## 🔗 Related Documentation

- **[BOUNDARY_MAP.md](./docs/BOUNDARY_MAP.md)** - Technical module/package classification
- **[LICENSING.md](./docs/LICENSING.md)** - License details and contributor guidance
- **[VERIFICATION.md](./docs/VERIFICATION.md)** - Automated boundary checks
- **[README.md](./README.md)** - Main project overview

---

**Last Updated:** 2026-01-23 • **Version:** 1.0.0
