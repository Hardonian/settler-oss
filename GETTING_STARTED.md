# Getting Started with Settler

Welcome to Settler! This guide will help you get up and running quickly.

## 🎯 What is Settler?

Settler provides powerful APIs and SDKs for:
- 💰 **Financial Reconciliation** - Match and reconcile transactions
- 🔄 **Data Synchronization** - Sync data between systems
- 📊 **Transaction Matching** - Intelligent transaction matching
- 🎯 **Rule-Based Processing** - Flexible rule engine

## 🚀 Quick Start (5 Minutes)

### Step 1: Choose Your SDK

Settler supports multiple languages:

| Language | Package | Install Command |
|----------|---------|----------------|
| TypeScript/Node.js | `@settler/sdk` | `npm install @settler/sdk` |
| Python | `settler-sdk` | `pip install settler-sdk` |
| Go | `settler-go` | `go get github.com/shardie-github/settler-oss/packages/sdk-go` |
| Ruby | `settler-sdk` | `gem install settler-sdk` |
| React | `@settler/react-settler` | `npm install @settler/react-settler` |
| CLI | `@settler/cli` | `npm install -g @settler/cli` |

### Step 2: Get Your API Key

1. Sign up at [settler.dev](https://settler.dev)
2. Navigate to your dashboard
3. Generate an API key
4. Copy your API key

> ⚠️ **Important**: Keep your API key secure! Never commit it to version control.

### Step 3: Install and Use

#### TypeScript/Node.js

```bash
npm install @settler/sdk
```

```typescript
import { SettlerClient } from '@settler/sdk';

const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY,
});

// Reconcile transactions
const result = await client.reconcile({
  source: [
    { id: '1', amount: 100.00, date: '2024-01-01' },
  ],
  target: [
    { id: '1', amount: 100.00, date: '2024-01-01' },
  ],
});

console.log(result);
```

#### Python

```bash
pip install settler-sdk
```

```python
import os
from settler import SettlerClient

client = SettlerClient(api_key=os.environ['SETTLER_API_KEY'])

result = client.reconcile({
    'source': [{'id': '1', 'amount': 100.00}],
    'target': [{'id': '1', 'amount': 100.00}],
})

print(result)
```

#### Go

```bash
go get github.com/shardie-github/settler-oss/packages/sdk-go
```

```go
package main

import (
    "context"
    "os"
    "github.com/shardie-github/settler-oss/packages/sdk-go"
)

func main() {
    client := settler.NewClient(settler.Config{
        APIKey: os.Getenv("SETTLER_API_KEY"),
    })
    
    result, _ := client.Reconcile(context.Background(), settler.ReconcileRequest{
        Source: []interface{}{map[string]interface{}{"id": "1", "amount": 100.00}},
        Target: []interface{}{map[string]interface{}{"id": "1", "amount": 100.00}},
    })
}
```

#### Ruby

```bash
gem install settler-sdk
```

```ruby
require 'settler-sdk'

client = Settler::Client.new(api_key: ENV['SETTLER_API_KEY'])

result = client.reconcile({
  source: [{id: '1', amount: 100.00}],
  target: [{id: '1', amount: 100.00}],
})
```

### Step 4: Set Up Environment Variables

**Never hardcode your API key!** Use environment variables:

```bash
# .env file (never commit this!)
SETTLER_API_KEY=your_api_key_here
```

```bash
# Or export directly
export SETTLER_API_KEY=your_api_key_here
```

## 📚 Next Steps

### Learn More

- 📖 [Full Documentation](https://docs.settler.dev) - Complete API reference
- 💡 [Examples](./examples) - Real-world examples
- 🎓 [Tutorials](https://docs.settler.dev/tutorials) - Step-by-step guides
- 🔌 [API Reference](https://docs.settler.dev/api) - Detailed API docs

### Common Use Cases

1. **Reconcile Bank Transactions**
   ```typescript
   const result = await client.reconcile({
     source: bankTransactions,
     target: accountingRecords,
     rules: { matchBy: ['amount', 'date'] }
   });
   ```

2. **Match Invoices**
   ```typescript
   const result = await client.reconcile({
     source: invoices,
     target: payments,
     rules: { matchBy: ['invoiceNumber', 'amount'] }
   });
   ```

3. **Sync Data Between Systems**
   ```typescript
   const result = await client.sync({
     source: sourceSystem,
     target: targetSystem,
     mapping: fieldMapping
   });
   ```

## 🛠️ Development Setup

Want to contribute or run locally?

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

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## ❓ Troubleshooting

### Common Issues

**Issue**: "API key is required"
- **Solution**: Make sure `SETTLER_API_KEY` environment variable is set

**Issue**: "Module not found"
- **Solution**: Run `npm install` or `pip install settler-sdk`

**Issue**: "Connection timeout"
- **Solution**: Check your internet connection and firewall settings

**More help?** Check our [FAQ](./FAQ.md) or [open a discussion](https://github.com/shardie-github/settler-oss/discussions).

## 🎉 You're Ready!

You now have everything you need to start using Settler. Happy coding!

- 💬 [Join Discussions](https://github.com/shardie-github/settler-oss/discussions)
- 🐛 [Report Issues](https://github.com/shardie-github/settler-oss/issues)
- 📚 [Read Docs](https://docs.settler.dev)
- ⭐ [Star Us on GitHub](https://github.com/shardie-github/settler-oss)
