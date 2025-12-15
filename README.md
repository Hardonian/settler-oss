# Settler OSS

[![CI](https://github.com/shardie-github/settler-oss/workflows/CI/badge.svg)](https://github.com/shardie-github/settler-oss/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Settler Open-Source SDKs and Tools - Official SDKs for Node.js, Python, Go, Ruby, React, and CLI.

Settler provides powerful APIs and SDKs for financial reconciliation, transaction matching, and data synchronization.

## 🚀 Quick Start

### Node.js/TypeScript SDK

```bash
npm install @settler/sdk
```

```typescript
import { SettlerClient } from '@settler/sdk';

const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY,
});

const result = await client.reconcile({
  // your reconciliation data
});
```

### Python SDK

```bash
pip install settler-sdk
```

```python
from settler import SettlerClient

client = SettlerClient(api_key=os.environ['SETTLER_API_KEY'])
result = client.reconcile({
    # your reconciliation data
})
```

### Go SDK

```bash
go get github.com/shardie-github/settler-oss/packages/sdk-go
```

```go
import "github.com/shardie-github/settler-oss/packages/sdk-go"

client := settler.NewClient(settler.Config{
    APIKey: os.Getenv("SETTLER_API_KEY"),
})

result, err := client.Reconcile(ctx, settler.ReconcileRequest{
    // your reconciliation data
})
```

### Ruby SDK

```bash
gem install settler-sdk
```

```ruby
require 'settler-sdk'

client = Settler::Client.new(api_key: ENV['SETTLER_API_KEY'])
result = client.reconcile({
  # your reconciliation data
})
```

### React Components

```bash
npm install @settler/react-settler
```

```tsx
import { SettlerProvider, ReconciliationView } from '@settler/react-settler';

function App() {
  return (
    <SettlerProvider apiKey={process.env.SETTLER_API_KEY}>
      <ReconciliationView />
    </SettlerProvider>
  );
}
```

### CLI Tool

```bash
npm install -g @settler/cli
# or
brew install settler-cli
```

```bash
settler reconcile --file transactions.csv
settler sync --source db --target api
```

## 📦 Packages

This repository contains multiple packages:

- **[`packages/sdk`](./packages/sdk)** - Node.js/TypeScript SDK
- **[`packages/sdk-python`](./packages/sdk-python)** - Python SDK
- **[`packages/sdk-go`](./packages/sdk-go)** - Go SDK
- **[`packages/sdk-ruby`](./packages/sdk-ruby)** - Ruby SDK
- **[`packages/api-client`](./packages/api-client)** - REST API client
- **[`packages/protocol`](./packages/protocol)** - Protocol types and schemas
- **[`packages/react-settler`](./packages/react-settler)** - React components
- **[`packages/cli`](./packages/cli)** - Command-line interface

## 🔄 Auto-Sync from Private Repo

This repository is automatically synced from the private Settler repository. Content marked as `OSS_PUBLIC` in the private repo is automatically ported here.

**For maintainers**: See [AUTO_SYNC_SETUP.md](./AUTO_SYNC_SETUP.md) for setup instructions.

**How it works**:
1. Commit changes to private repo (via Cursor or any method)
2. GitHub Actions automatically detects OSS_PUBLIC content
3. OSS content is automatically synced to this public repo
4. No manual CLI work needed!

## 📚 Documentation

- [API Reference](https://docs.settler.dev/api)
- [Getting Started Guide](https://docs.settler.dev/getting-started)
- [Examples](./examples)
- [Contributing](./CONTRIBUTING.md)
- [Security Policy](./SECURITY.md)
- [Auto-Sync Setup](./AUTO_SYNC_SETUP.md)

## 🛠️ Development

### Prerequisites

- Node.js 18+
- Python 3.8+ (for Python SDK)
- Go 1.19+ (for Go SDK)
- Ruby 2.7+ (for Ruby SDK)

### Setup

```bash
# Clone the repository
git clone https://github.com/shardie-github/settler-oss.git
cd settler-oss

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

### Project Structure

```
settler-oss/
├── packages/          # SDK packages
├── examples/          # Example code
├── docs/              # Documentation
├── .github/           # GitHub workflows and templates
└── README.md          # This file
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- **Website**: https://settler.dev
- **Documentation**: https://docs.settler.dev
- **API Reference**: https://docs.settler.dev/api
- **Status**: https://status.settler.dev
- **Support**: support@settler.dev

## ⚠️ Security

If you discover a security vulnerability, please email security@settler.dev. See our [Security Policy](./SECURITY.md) for details.

## 🙏 Acknowledgments

Thank you to all contributors who help make Settler better!

---

Made with ❤️ by the Settler team
