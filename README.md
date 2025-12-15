# Settler OSS

<div align="center">

[![CI](https://github.com/shardie-github/settler-oss/workflows/CI/badge.svg)](https://github.com/shardie-github/settler-oss/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![Go](https://img.shields.io/badge/Go-1.19%2B-blue.svg)](https://golang.org/)
[![Ruby](https://img.shields.io/badge/Ruby-2.7%2B-red.svg)](https://www.ruby-lang.org/)

**Official SDKs for Node.js, Python, Go, Ruby, React, and CLI**

[Documentation](https://docs.settler.dev) • [Examples](./examples) • [Contributing](./CONTRIBUTING.md) • [Discussions](https://github.com/shardie-github/settler-oss/discussions)

---

### ⭐ Star us on GitHub — it motivates us a lot!

[![GitHub stars](https://img.shields.io/github/stars/shardie-github/settler-oss?style=social)](https://github.com/shardie-github/settler-oss/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/shardie-github/settler-oss?style=social)](https://github.com/shardie-github/settler-oss/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/shardie-github/settler-oss?style=social)](https://github.com/shardie-github/settler-oss/watchers)

</div>

---

## 🎯 What is Settler?

**Settler** provides powerful APIs and SDKs for **financial reconciliation**, **transaction matching**, and **data synchronization**. This repository contains the open-source SDKs and tools for integrating Settler into your applications.

### ✨ Key Features

- 🔄 **Multi-Language Support** - TypeScript, Python, Go, Ruby, React, and CLI
- 💰 **Financial Reconciliation** - Match and reconcile transactions intelligently
- 🎯 **Rule-Based Matching** - Flexible matching rules and algorithms
- 📊 **Data Synchronization** - Sync data between different systems
- 🚀 **Easy Integration** - Simple APIs, comprehensive documentation
- 🔒 **Secure** - Industry-standard security practices
- ⚡ **Fast** - Optimized for performance
- 🌐 **Production Ready** - Battle-tested in production environments

### 🏆 Why Choose Settler?

- ✅ **Open Source** - Transparent, community-driven development
- ✅ **Well Documented** - Comprehensive guides and API reference
- ✅ **Active Community** - Get help from developers worldwide
- ✅ **Regular Updates** - Continuous improvements and new features
- ✅ **Multiple SDKs** - Use your favorite programming language

## 🚀 Quick Start

### Node.js/TypeScript SDK

**Installation:**
```bash
npm install @settler/sdk
# or
yarn add @settler/sdk
# or
pnpm add @settler/sdk
```

**Basic Usage:**
```typescript
import { SettlerClient } from '@settler/sdk';

// Initialize the client
const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY,
  baseURL: 'https://api.settler.dev', // optional, defaults to production
});

// Reconcile transactions
const result = await client.reconcile({
  source: [
    { id: '1', amount: 100.00, date: '2024-01-01' },
    { id: '2', amount: 200.00, date: '2024-01-02' },
  ],
  target: [
    { id: '1', amount: 100.00, date: '2024-01-01' },
    { id: '2', amount: 200.00, date: '2024-01-02' },
  ],
});

console.log('Reconciliation result:', result);
```

**See more examples:** [TypeScript SDK Examples](./packages/sdk/README.md)

---

### Python SDK

**Installation:**
```bash
pip install settler-sdk
# or
pipenv install settler-sdk
# or
poetry add settler-sdk
```

**Basic Usage:**
```python
import os
from settler import SettlerClient

# Initialize the client
client = SettlerClient(
    api_key=os.environ.get('SETTLER_API_KEY'),
    base_url='https://api.settler.dev'  # optional
)

# Reconcile transactions
result = client.reconcile({
    'source': [
        {'id': '1', 'amount': 100.00, 'date': '2024-01-01'},
        {'id': '2', 'amount': 200.00, 'date': '2024-01-02'},
    ],
    'target': [
        {'id': '1', 'amount': 100.00, 'date': '2024-01-01'},
        {'id': '2', 'amount': 200.00, 'date': '2024-01-02'},
    ],
})

print('Reconciliation result:', result)
```

**See more examples:** [Python SDK Examples](./packages/sdk-python/README.md)

---

### Go SDK

**Installation:**
```bash
go get github.com/shardie-github/settler-oss/packages/sdk-go
```

**Basic Usage:**
```go
package main

import (
    "context"
    "os"
    "fmt"
    
    "github.com/shardie-github/settler-oss/packages/sdk-go"
)

func main() {
    // Initialize the client
    client := settler.NewClient(settler.Config{
        APIKey:  os.Getenv("SETTLER_API_KEY"),
        BaseURL: "https://api.settler.dev", // optional
    })
    
    // Reconcile transactions
    ctx := context.Background()
    result, err := client.Reconcile(ctx, settler.ReconcileRequest{
        Source: []interface{}{
            map[string]interface{}{"id": "1", "amount": 100.00, "date": "2024-01-01"},
            map[string]interface{}{"id": "2", "amount": 200.00, "date": "2024-01-02"},
        },
        Target: []interface{}{
            map[string]interface{}{"id": "1", "amount": 100.00, "date": "2024-01-01"},
            map[string]interface{}{"id": "2", "amount": 200.00, "date": "2024-01-02"},
        },
    })
    
    if err != nil {
        panic(err)
    }
    
    fmt.Println("Reconciliation result:", result)
}
```

**See more examples:** [Go SDK Examples](./packages/sdk-go/README.md)

---

### Ruby SDK

**Installation:**
```bash
gem install settler-sdk
# or add to Gemfile
# gem 'settler-sdk'
```

**Basic Usage:**
```ruby
require 'settler-sdk'

# Initialize the client
client = Settler::Client.new(
  api_key: ENV['SETTLER_API_KEY'],
  base_url: 'https://api.settler.dev'  # optional
)

# Reconcile transactions
result = client.reconcile({
  source: [
    { id: '1', amount: 100.00, date: '2024-01-01' },
    { id: '2', amount: 200.00, date: '2024-01-02' },
  ],
  target: [
    { id: '1', amount: 100.00, date: '2024-01-01' },
    { id: '2', amount: 200.00, date: '2024-01-02' },
  ],
})

puts "Reconciliation result: #{result}"
```

**See more examples:** [Ruby SDK Examples](./packages/sdk-ruby/README.md)

---

### React Components

**Installation:**
```bash
npm install @settler/react-settler
# or
yarn add @settler/react-settler
```

**Basic Usage:**
```tsx
import React from 'react';
import { SettlerProvider, ReconciliationView } from '@settler/react-settler';

function App() {
  return (
    <SettlerProvider apiKey={process.env.REACT_APP_SETTLER_API_KEY}>
      <div className="app">
        <h1>Transaction Reconciliation</h1>
        <ReconciliationView />
      </div>
    </SettlerProvider>
  );
}

export default App;
```

**See more examples:** [React SDK Examples](./packages/react-settler/README.md)

---

### CLI Tool

**Installation:**
```bash
# Via npm
npm install -g @settler/cli

# Via Homebrew (macOS/Linux)
brew install settler-cli

# Via direct download
# Check releases page for binaries
```

**Basic Usage:**
```bash
# Set your API key
export SETTLER_API_KEY=your_api_key_here

# Reconcile from a CSV file
settler reconcile --file transactions.csv --output results.json

# Sync data between sources
settler sync --source database --target api --config sync-config.json

# Get help
settler --help
```

**See more examples:** [CLI Examples](./packages/cli/README.md)

## 📦 Packages

This monorepo contains multiple SDK packages:

| Package | Language | Status | Description |
|---------|----------|--------|-------------|
| [`@settler/sdk`](./packages/sdk) | TypeScript/Node.js | ✅ Active | Official Node.js and TypeScript SDK |
| [`settler-sdk`](./packages/sdk-python) | Python | ✅ Active | Official Python SDK |
| [`settler-go`](./packages/sdk-go) | Go | ✅ Active | Official Go SDK |
| [`settler-sdk`](./packages/sdk-ruby) | Ruby | ✅ Active | Official Ruby SDK |
| [`@settler/react-settler`](./packages/react-settler) | React/TypeScript | ✅ Active | React components for Settler |
| [`@settler/cli`](./packages/cli) | TypeScript/Node.js | ✅ Active | Command-line interface tool |

Each package includes:
- 📚 Comprehensive documentation
- 💡 Usage examples
- ✅ Type definitions (where applicable)
- 🧪 Test suite
- 📦 Published to respective package registries

## 🔄 Auto-Sync from Private Repo

This repository is automatically synced from the private Settler repository. Content marked as `OSS_PUBLIC` in the private repo is automatically ported here.

**For maintainers**: See [AUTO_SYNC_SETUP.md](./AUTO_SYNC_SETUP.md) for setup instructions.

**How it works**:
1. ✅ Commit changes to private repo (via Cursor or any method)
2. 🤖 GitHub Actions automatically detects `OSS_PUBLIC` content
3. 📤 OSS content is automatically synced to this public repo
4. 🎉 No manual CLI work needed!

> **Note**: This is an internal workflow detail. Contributors can work directly with this repository.

## 📚 Documentation

- 📖 [Full Documentation](https://docs.settler.dev) - Complete guides and API reference
- 🚀 [Getting Started Guide](https://docs.settler.dev/getting-started) - Step-by-step setup
- 💡 [Examples](./examples) - Code examples and tutorials
- 🤝 [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- 🔒 [Security Policy](./SECURITY.md) - Security reporting
- 📋 [Changelog](./CHANGELOG.md) - Release notes and updates
- 🔄 [Auto-Sync Setup](./AUTO_SYNC_SETUP.md) - For maintainers

## 🛠️ Development

### Prerequisites

- **Node.js** 18+ (required for TypeScript SDK, React SDK, CLI)
- **Python** 3.8+ (for Python SDK development)
- **Go** 1.19+ (for Go SDK development)
- **Ruby** 2.7+ (for Ruby SDK development)
- **npm** 9+ or **yarn** or **pnpm**

### Setup

```bash
# Clone the repository
git clone https://github.com/shardie-github/settler-oss.git
cd settler-oss

# Install root dependencies
npm install

# Install all package dependencies
npm install --workspaces

# Build all packages
npm run build

# Run linting
npm run lint

# Run tests
npm test

# Run tests for a specific package
cd packages/sdk && npm test
```

### Project Structure

```
settler-oss/
├── packages/              # SDK packages
│   ├── sdk/              # TypeScript/Node.js SDK
│   ├── sdk-python/       # Python SDK
│   ├── sdk-go/           # Go SDK
│   ├── sdk-ruby/         # Ruby SDK
│   ├── react-settler/   # React components
│   └── cli/              # CLI tool
├── examples/             # Example code and tutorials
├── docs/                 # Additional documentation
├── scripts/              # Utility scripts
├── .github/              # GitHub workflows and templates
│   ├── workflows/        # CI/CD workflows
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   └── DISCUSSION_TEMPLATE/ # Discussion templates
└── README.md             # This file
```

### Available Scripts

- `npm run build` - Build all packages
- `npm run test` - Run tests for all packages
- `npm run lint` - Lint all packages
- `npm run clean` - Clean build artifacts

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, documentation improvements, or examples, your help makes Settler better.

<div align="center">

### 🎉 First time contributing to open source?

**We're here to help!** Check out our [Contributing Guide](./CONTRIBUTING.md) and look for issues labeled [`good first issue`](https://github.com/shardie-github/settler-oss/labels/good%20first%20issue).

</div>

**Quick Start:**
1. 🍴 [Fork the repository](https://github.com/shardie-github/settler-oss/fork)
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💻 Make your changes
4. ✅ Run tests and linting (`npm test && npm run lint`)
5. 📝 Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. 📤 Push to the branch (`git push origin feature/amazing-feature`)
7. 🔄 [Open a Pull Request](https://github.com/shardie-github/settler-oss/compare)

**See our [Contributing Guide](./CONTRIBUTING.md) for:**
- 📋 Code style guidelines
- 🧪 Testing requirements
- 📝 Commit message conventions
- 👀 PR review process
- 🤝 Community guidelines

**Ways to Contribute:**
- 🐛 [Report bugs](https://github.com/shardie-github/settler-oss/issues/new?template=bug_report.md)
- 💡 [Suggest features](https://github.com/shardie-github/settler-oss/issues/new?template=feature_request.md)
- 📚 [Improve documentation](./CONTRIBUTING.md#documentation)
- 💻 [Write code](./CONTRIBUTING.md#development-setup)
- 🎨 [Design improvements](https://github.com/shardie-github/settler-oss/discussions/categories/ideas)
- 📖 [Write tutorials](./examples)
- 🌍 [Translate documentation](https://github.com/shardie-github/settler-oss/discussions)

**Need help?** 
- 💬 [Join Discussions](https://github.com/shardie-github/settler-oss/discussions)
- ❓ [Ask a Question](https://github.com/shardie-github/settler-oss/issues/new?template=question.md)
- 📧 [Email Us](mailto:support@settler.dev)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links & Resources

- 🌐 **Website**: [settler.dev](https://settler.dev)
- 📚 **Documentation**: [docs.settler.dev](https://docs.settler.dev)
- 🔌 **API Reference**: [docs.settler.dev/api](https://docs.settler.dev/api)
- 📊 **Status Page**: [status.settler.dev](https://status.settler.dev)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/shardie-github/settler-oss/discussions)
- 🐛 **Issue Tracker**: [GitHub Issues](https://github.com/shardie-github/settler-oss/issues)
- 📧 **Support**: support@settler.dev
- 🔒 **Security**: security@settler.dev

## ⚠️ Security

**Found a security vulnerability?** We take security seriously!

- 🔒 **Email**: security@settler.dev
- 📋 **Policy**: See our [Security Policy](./SECURITY.md) for details
- 🚨 **Report**: Use [GitHub Security Advisories](https://github.com/shardie-github/settler-oss/security/advisories/new) for responsible disclosure

**Please do not** create a public GitHub issue for security vulnerabilities.

## 🌟 Show Your Support

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Starring helps others discover Settler and shows your appreciation!**

[![Star History Chart](https://api.star-history.com/svg?repos=shardie-github/settler-oss&type=Date)](https://star-history.com/#shardie-github/settler-oss&Date)

</div>

**Other ways to support:**
- 🍴 [Fork the repository](https://github.com/shardie-github/settler-oss/fork)
- 💬 [Share on social media](https://twitter.com/intent/tweet?text=Check%20out%20Settler%20OSS%20-%20powerful%20SDKs%20for%20financial%20reconciliation!&url=https://github.com/shardie-github/settler-oss)
- 📝 [Write a blog post](https://github.com/shardie-github/settler-oss/discussions/categories/show-and-tell)
- 🐛 [Report bugs](https://github.com/shardie-github/settler-oss/issues/new?template=bug_report.md)
- 💡 [Suggest features](https://github.com/shardie-github/settler-oss/issues/new?template=feature_request.md)
- 🤝 [Contribute code](./CONTRIBUTING.md)

## 🙏 Acknowledgments

Thank you to all contributors who help make Settler better! Your contributions, feedback, and support are invaluable.

### Contributors

<!-- Contributors will be automatically added via all-contributors bot -->
<!-- Uncomment when all-contributors is set up:
<img src="https://contrib.rocks/image?repo=shardie-github/settler-oss" />
-->

**Want to contribute?** See our [Contributing Guide](./CONTRIBUTING.md) to get started!

### Special Thanks

- 🙏 All our [contributors](https://github.com/shardie-github/settler-oss/graphs/contributors)
- 💬 Everyone who provides feedback and suggestions
- 🐛 Bug reporters who help us improve
- 📚 Documentation contributors
- 🌟 Everyone who stars and shares Settler

---

<div align="center">

**Made with ❤️ by the Settler team and community**

[⭐ Star us on GitHub](https://github.com/shardie-github/settler-oss/stargazers) • [🍴 Fork us](https://github.com/shardie-github/settler-oss/fork) • [📖 Read the Docs](https://docs.settler.dev) • [💬 Join Discussions](https://github.com/shardie-github/settler-oss/discussions) • [🐛 Report Issues](https://github.com/shardie-github/settler-oss/issues)

**⭐ If Settler helps you, please consider giving us a star! ⭐**

</div>
