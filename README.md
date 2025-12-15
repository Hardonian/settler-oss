# Settler Protocol

<div align="center">

[![CI](https://github.com/shardie-github/settler-oss/workflows/CI/badge.svg)](https://github.com/shardie-github/settler-oss/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Go](https://img.shields.io/badge/Go-1.19+-blue.svg)](https://golang.org/)
[![Ruby](https://img.shields.io/badge/Ruby-2.7+-red.svg)](https://www.ruby-lang.org/)

**The Open-Source Protocol for Financial Reconciliation & Transaction Matching**

[🌐 Website](https://settler.dev) • [📚 Documentation](https://docs.settler.dev) • [🚀 Quick Start](#-quick-start) • [💼 Enterprise](https://settler.dev/enterprise) • [💬 Discussions](https://github.com/shardie-github/settler-oss/discussions)

[![GitHub stars](https://img.shields.io/github/stars/shardie-github/settler-oss?style=social)](https://github.com/shardie-github/settler-oss/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/shardie-github/settler-oss?style=social)](https://github.com/shardie-github/settler-oss/network/members)

</div>

---

## 🎯 What is Settler?

**Settler Protocol** is an open-source, self-hostable API specification and comprehensive SDK suite for **financial reconciliation**, **transaction matching**, and **data synchronization**. Built for developers who need powerful reconciliation capabilities without vendor lock-in.

### Why Settler?

- 🆓 **100% Free & Open Source** - MIT licensed, no strings attached
- 🏠 **Self-Hostable** - Run on your infrastructure, own your data
- 🌍 **Multi-Language** - Official SDKs for TypeScript, Python, Go, Ruby, React, and CLI
- ⚡ **Production Ready** - Battle-tested APIs designed for scale
- 🔒 **Secure by Design** - Industry-standard security practices
- 📈 **Enterprise Ready** - Upgrade to managed SaaS when you need it

### 🚀 Get Started in 60 Seconds

```bash
# Install the SDK
npm install @settler/sdk

# Use it
import { SettlerClient } from '@settler/sdk';

const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY,
  baseURL: 'https://api.settler.dev', // or self-host
});

const result = await client.reconcile({
  source: transactionsA,
  target: transactionsB,
});
```

**[👉 View Full Documentation](https://docs.settler.dev)** • **[🏠 Self-Hosting Guide](./docs/SELF_HOSTING.md)** • **[💼 Enterprise Features](https://settler.dev/enterprise)**

---

## ✨ Key Features

### Core Capabilities

- 💰 **Intelligent Reconciliation** - Match transactions across systems with configurable rules
- 🎯 **Flexible Matching** - Rule-based algorithms for exact, fuzzy, and custom matching
- 📊 **Data Synchronization** - Sync data between databases, APIs, and file systems
- 🔄 **Multi-Source Support** - Reconcile data from multiple sources simultaneously
- 📈 **Analytics & Reporting** - Built-in reconciliation reports and analytics
- 🔌 **Extensible Connectors** - Connect to REST APIs, databases, files, and more

### Developer Experience

- 📦 **6 Official SDKs** - TypeScript, Python, Go, Ruby, React, and CLI
- 📚 **Comprehensive Docs** - API reference, guides, and examples
- 🧪 **Type-Safe** - Full TypeScript definitions for all SDKs
- 🚀 **Fast Integration** - Get started in minutes, not days
- 🔧 **CLI Tools** - Powerful command-line interface for automation
- ⚙️ **Self-Hostable** - Deploy on your infrastructure

---

## 📦 SDKs & Packages

| SDK | Language | Status | Install | Docs |
|-----|----------|--------|---------|------|
| **@settler/sdk** | TypeScript/Node.js | ✅ Stable | `npm install @settler/sdk` | [📖 Docs](./packages/sdk/README.md) |
| **settler-sdk** | Python | ✅ Stable | `pip install settler-sdk` | [📖 Docs](./packages/sdk-python/README.md) |
| **settler-go** | Go | ✅ Stable | `go get github.com/shardie-github/settler-oss/packages/sdk-go` | [📖 Docs](./packages/sdk-go/README.md) |
| **settler-sdk** | Ruby | ✅ Stable | `gem install settler-sdk` | [📖 Docs](./packages/sdk-ruby/README.md) |
| **@settler/react-settler** | React/TypeScript | ✅ Stable | `npm install @settler/react-settler` | [📖 Docs](./packages/react-settler/README.md) |
| **@settler/cli** | CLI Tool | ✅ Stable | `npm install -g @settler/cli` | [📖 Docs](./packages/cli/README.md) |

All SDKs are:
- ✅ **MIT Licensed** - Free for commercial use
- ✅ **Self-Hostable** - Works with your own API instance
- ✅ **Type-Safe** - Full type definitions included
- ✅ **Well Documented** - Comprehensive guides and examples
- ✅ **Production Ready** - Used by companies worldwide

---

## 🚀 Quick Start

### Option 1: Use Managed API (Free Tier Available)

```typescript
import { SettlerClient } from '@settler/sdk';

const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY, // Get free API key at settler.dev
  baseURL: 'https://api.settler.dev',
});

const result = await client.reconcile({
  source: [
    { id: '1', amount: 100.00, date: '2024-01-01', description: 'Payment' },
    { id: '2', amount: 200.00, date: '2024-01-02', description: 'Refund' },
  ],
  target: [
    { id: '1', amount: 100.00, date: '2024-01-01', description: 'Payment' },
    { id: '2', amount: 200.00, date: '2024-01-02', description: 'Refund' },
  ],
  rules: {
    tolerance: 0.01,
    dateRange: 1, // days
  },
});

console.log('Matched:', result.matched.length);
console.log('Unmatched:', result.unmatched);
```

**[👉 Get Free API Key](https://settler.dev/signup)** • **[📚 Full API Docs](https://docs.settler.dev/api)**

### Option 2: Self-Host (100% Free)

```bash
# Clone and deploy
git clone https://github.com/shardie-github/settler-oss.git
cd settler-oss

# Follow self-hosting guide
# See: docs/SELF_HOSTING.md
```

**[🏠 Self-Hosting Guide](./docs/SELF_HOSTING.md)** • **[🐳 Docker Setup](./docs/SELF_HOSTING.md#docker)**

### Python Example

```python
from settler import SettlerClient

client = SettlerClient(
    api_key=os.environ.get('SETTLER_API_KEY'),
    base_url='https://api.settler.dev'  # or your self-hosted URL
)

result = client.reconcile({
    'source': [...],
    'target': [...],
    'rules': {'tolerance': 0.01}
})

print(f"Matched: {len(result['matched'])}")
```

### Go Example

```go
import "github.com/shardie-github/settler-oss/packages/sdk-go"

client := settler.NewClient(settler.Config{
    APIKey:  os.Getenv("SETTLER_API_KEY"),
    BaseURL: "https://api.settler.dev",
})

result, err := client.Reconcile(ctx, settler.ReconcileRequest{
    Source: sourceTransactions,
    Target: targetTransactions,
})
```

**[👉 View All SDK Examples](./examples)** • **[📚 API Reference](https://docs.settler.dev/api)**

---

## 💼 Enterprise Features

While the **Settler Protocol is 100% free and open-source**, we offer **enterprise-grade managed services** for teams that need:

### 🎯 Managed Console (SaaS)

- ✅ **Managed Hosting** - We handle infrastructure, you focus on business
- ✅ **Multi-Tenant Administration** - Manage multiple organizations
- ✅ **RBAC & Permissions** - Fine-grained access control
- ✅ **SSO Integration** - SAML, OIDC, and more
- ✅ **Audit Logs** - Complete activity tracking
- ✅ **24/7 Support** - Dedicated support team
- ✅ **SLA Guarantees** - 99.9% uptime SLA

**[👉 Learn More About Console](https://settler.dev/console)** • **[📧 Contact Sales](mailto:sales@settler.dev)**

### 🏢 Enterprise Connectors

- ✅ **SAP ERP** - Direct integration with SAP systems
- ✅ **Salesforce** - CRM data synchronization
- ✅ **Oracle Financials** - Enterprise financial systems
- ✅ **Microsoft Dynamics** - Dynamics 365 integration
- ✅ **Custom Integrations** - Tailored connectors for your stack

### 🌍 Enterprise Infrastructure

- ✅ **Dedicated Instances** - Single-tenant deployments
- ✅ **Data Residency** - Deploy in your region (EU, US, APAC)
- ✅ **VPC/Private Networking** - Connect via private networks
- ✅ **BYO-Key/KMS** - Bring your own encryption keys
- ✅ **SIEM Integration** - Forward audit logs to your SIEM
- ✅ **Custom SLAs** - Tailored service level agreements

**[👉 Enterprise Features](https://settler.dev/enterprise)** • **[📧 Schedule Demo](mailto:sales@settler.dev)**

---

## 📊 Use Cases

### Financial Reconciliation
- **Bank Reconciliation** - Match bank statements with accounting records
- **Payment Processing** - Reconcile payment processor data with internal systems
- **Invoice Matching** - Match invoices with purchase orders and receipts
- **Expense Reconciliation** - Reconcile employee expenses with corporate cards

### Data Synchronization
- **Multi-System Sync** - Keep data consistent across systems
- **ETL Pipelines** - Transform and load data between systems
- **Data Migration** - Verify data integrity during migrations
- **API Integration** - Sync data between REST APIs

### Transaction Matching
- **Order Matching** - Match orders across fulfillment systems
- **Inventory Reconciliation** - Reconcile inventory across warehouses
- **Subscription Matching** - Match subscription events with billing records

**[👉 View More Use Cases](https://settler.dev/use-cases)** • **[📚 Case Studies](https://settler.dev/case-studies)**

---

## 🆚 Protocol vs Enterprise

| Feature | Protocol (OSS) | Enterprise (SaaS) |
|---------|----------------|-------------------|
| **License** | ✅ MIT (Free) | ✅ Proprietary |
| **SDKs** | ✅ All 6 SDKs Free | ✅ All SDKs Included |
| **API Specification** | ✅ Open & Free | ✅ Included |
| **Self-Hosting** | ✅ Fully Supported | ❌ Managed Only |
| **CLI Tool** | ✅ Free | ✅ Included |
| **Managed Hosting** | ❌ | ✅ Included |
| **Enterprise Connectors** | ❌ | ✅ SAP, Salesforce, Oracle, etc. |
| **Multi-Tenant Admin** | ❌ | ✅ Full RBAC & SSO |
| **Audit Logs** | ❌ | ✅ Complete Audit Trail |
| **Dedicated Instances** | ❌ | ✅ Single-Tenant Deployments |
| **Data Residency** | ❌ | ✅ EU, US, APAC Options |
| **VPC/Private Networking** | ❌ | ✅ Private Network Access |
| **BYO-Key/KMS** | ❌ | ✅ Customer-Managed Keys |
| **SIEM Integration** | ❌ | ✅ Splunk, Datadog, ELK |
| **Support** | ✅ Community | ✅ 24/7 Dedicated Support |
| **SLA** | ❌ | ✅ 99.9% Uptime SLA |

**Start with the free Protocol, upgrade to Enterprise when you need managed services.**

**[👉 Compare Plans](https://settler.dev/pricing)** • **[📧 Contact Sales](mailto:sales@settler.dev)**

---

## 🔗 Protocol Compatibility & Contract Surface

The Settler Protocol maintains a **stable contract surface** that ensures compatibility between:
- **OSS Repository** (this repo) - Open-source SDKs and API specification
- **Settler Platform** (private) - Managed SaaS implementation

### Contract Surface

The contract surface is defined in [`/contracts/`](./contracts/) and includes:

- **API Endpoints**: `/v1/reconcile`, `/v1/sync`, `/v1/health`
- **Request/Response Types**: All payload schemas (JSON Schema + OpenAPI)
- **Error Format**: Standard error envelope structure
- **Webhook Format**: Standard webhook event envelope
- **SDK Method Signatures**: Public SDK methods and their types

### Versioning

Contract versions follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (X.0.0): Breaking API changes
- **MINOR** (0.X.0): New endpoints, optional fields (backward-compatible)
- **PATCH** (0.0.X): Bug fixes, clarifications

Current contract version: **1.0.0** (see [`contracts/CONTRACT_VERSION`](./contracts/CONTRACT_VERSION))

### Compatibility Guarantees

✅ **OSS SDKs** work with both self-hosted and managed Settler Platform APIs  
✅ **API contracts** remain stable across versions  
✅ **Type definitions** are generated from schemas for consistency  
✅ **Automated checks** prevent drift between OSS and Platform

### Verifying Compatibility

```bash
# Validate contracts
npm run contracts:check

# Check for boundary violations
npm run check-boundaries

# Check for secret leaks
npm run secret-leak:check
```

**[📋 Contract Documentation](./contracts/README.md)** • **[🔒 Drift Prevention Report](./DRIFT-PREVENTION-REPORT.md)**

---

## 🏠 Self-Hosting

The Settler Protocol is **100% self-hostable**. Deploy on your infrastructure, own your data.

### Quick Start (Docker)

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  settler/protocol:latest
```

### Self-Hosting Benefits

- 🔒 **Data Sovereignty** - Your data stays on your infrastructure
- 💰 **No Usage Limits** - Process unlimited transactions
- ⚙️ **Full Control** - Customize to your needs
- 🌍 **Compliance** - Meet data residency requirements
- 🚀 **Performance** - Deploy close to your data

**[🏠 Full Self-Hosting Guide](./docs/SELF_HOSTING.md)** • **[🐳 Docker Setup](./docs/SELF_HOSTING.md#docker)** • **[☁️ Cloud Deployment](./docs/SELF_HOSTING.md#cloud)**

---

## 📚 Documentation

### Getting Started
- 🚀 [Quick Start Guide](./GETTING_STARTED.md)
- 📖 [API Documentation](https://docs.settler.dev/api)
- 💡 [Code Examples](./examples)
- 🏠 [Self-Hosting Guide](./docs/SELF_HOSTING.md)

### SDK Documentation
- 📘 [TypeScript/Node.js SDK](./packages/sdk/README.md)
- 🐍 [Python SDK](./packages/sdk-python/README.md)
- 🐹 [Go SDK](./packages/sdk-go/README.md)
- 💎 [Ruby SDK](./packages/sdk-ruby/README.md)
- ⚛️ [React SDK](./packages/react-settler/README.md)
- 🖥️ [CLI Tool](./packages/cli/README.md)

### Enterprise
- 💼 [Enterprise Features](https://settler.dev/enterprise)
- 🔌 [Enterprise Connectors](./docs/CONNECTOR_MODEL.md)
- 🌍 [Dedicated Instances](./docs/ENTERPRISE_INSTANCES.md)
- 📧 [Contact Sales](mailto:sales@settler.dev)

**[👉 Full Documentation](https://docs.settler.dev)** • **[🌐 Website](https://settler.dev)**

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, documentation improvements, or examples, your help makes Settler better.

### Quick Start Contributing

1. 🍴 [Fork the repository](https://github.com/shardie-github/settler-oss/fork)
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💻 Make your changes
4. ✅ Run tests and linting (`npm test && npm run lint`)
5. 📝 Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. 📤 Push to the branch (`git push origin feature/amazing-feature`)
7. 🔄 [Open a Pull Request](https://github.com/shardie-github/settler-oss/compare)

### Ways to Contribute

- 🐛 [Report bugs](https://github.com/shardie-github/settler-oss/issues/new?template=bug_report.md)
- 💡 [Suggest features](https://github.com/shardie-github/settler-oss/issues/new?template=feature_request.md)
- 📚 [Improve documentation](./CONTRIBUTING.md#documentation)
- 💻 [Write code](./CONTRIBUTING.md#development-setup)
- 📖 [Write tutorials](./examples)
- 🌍 [Translate documentation](https://github.com/shardie-github/settler-oss/discussions)

**[👉 Contributing Guide](./CONTRIBUTING.md)** • **[💬 Join Discussions](https://github.com/shardie-github/settler-oss/discussions)**

---

## 🔗 Links & Resources

### Official Resources
- 🌐 **Website**: [settler.dev](https://settler.dev)
- 📚 **Documentation**: [docs.settler.dev](https://docs.settler.dev)
- 🔌 **API Reference**: [docs.settler.dev/api](https://docs.settler.dev/api)
- 💼 **Enterprise**: [settler.dev/enterprise](https://settler.dev/enterprise)
- 🏠 **Console**: [settler.dev/console](https://settler.dev/console)

### Community
- 💬 **Discussions**: [GitHub Discussions](https://github.com/shardie-github/settler-oss/discussions)
- 🐛 **Issue Tracker**: [GitHub Issues](https://github.com/shardie-github/settler-oss/issues)
- 📧 **Support**: [support@settler.dev](mailto:support@settler.dev)
- 🔒 **Security**: [security@settler.dev](mailto:security@settler.dev)

### Enterprise
- 📧 **Sales**: [sales@settler.dev](mailto:sales@settler.dev)
- 📅 **Schedule Demo**: [settler.dev/demo](https://settler.dev/demo)
- 💰 **Pricing**: [settler.dev/pricing](https://settler.dev/pricing)

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

- ✅ **Free for commercial use**
- ✅ **Modify and distribute freely**
- ✅ **Use in proprietary software**
- ✅ **Self-host without restrictions**

**Enterprise features** (managed console, enterprise connectors) require a commercial license. See [settler.dev/pricing](https://settler.dev/pricing) for details.

---

## ⚠️ Security

**Found a security vulnerability?** We take security seriously!

- 🔒 **Email**: [security@settler.dev](mailto:security@settler.dev)
- 📋 **Policy**: See our [Security Policy](./SECURITY.md) for details
- 🚨 **Report**: Use [GitHub Security Advisories](https://github.com/shardie-github/settler-oss/security/advisories/new) for responsible disclosure

**Please do not** create a public GitHub issue for security vulnerabilities.

---

## 🌟 Show Your Support

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Starring helps others discover Settler and shows your appreciation!**

[![Star History Chart](https://api.star-history.com/svg?repos=shardie-github/settler-oss&type=Date)](https://star-history.com/#shardie-github/settler-oss&Date)

</div>

**Other ways to support:**
- 🍴 [Fork the repository](https://github.com/shardie-github/settler-oss/fork)
- 💬 [Share on social media](https://twitter.com/intent/tweet?text=Check%20out%20Settler%20Protocol%20-%20open-source%20financial%20reconciliation!&url=https://github.com/shardie-github/settler-oss)
- 📝 [Write a blog post](https://github.com/shardie-github/settler-oss/discussions/categories/show-and-tell)
- 🐛 [Report bugs](https://github.com/shardie-github/settler-oss/issues/new?template=bug_report.md)
- 💡 [Suggest features](https://github.com/shardie-github/settler-oss/issues/new?template=feature_request.md)
- 🤝 [Contribute code](./CONTRIBUTING.md)

---

## 🙏 Acknowledgments

Thank you to all contributors who help make Settler better! Your contributions, feedback, and support are invaluable.

**Want to contribute?** See our [Contributing Guide](./CONTRIBUTING.md) to get started!

---

<div align="center">

**Made with ❤️ by the Settler team and community**

[⭐ Star us on GitHub](https://github.com/shardie-github/settler-oss/stargazers) • [🍴 Fork us](https://github.com/shardie-github/settler-oss/fork) • [🌐 Visit Website](https://settler.dev) • [📖 Read the Docs](https://docs.settler.dev) • [💬 Join Discussions](https://github.com/shardie-github/settler-oss/discussions) • [🐛 Report Issues](https://github.com/shardie-github/settler-oss/issues)

**[👉 Get Started with Settler Protocol →](https://settler.dev)**

**⭐ If Settler helps you, please consider giving us a star! ⭐**

</div>
