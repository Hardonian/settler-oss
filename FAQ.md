# Frequently Asked Questions (FAQ)

## General Questions

### What is Settler?

Settler is a platform that provides APIs and SDKs for financial reconciliation, transaction matching, and data synchronization. It helps you match transactions, reconcile accounts, and sync data between different systems.

### What languages are supported?

Settler currently supports:
- ✅ TypeScript/Node.js
- ✅ Python
- ✅ Go
- ✅ Ruby
- ✅ React (components)
- ✅ CLI tool

More languages coming soon! [Request a language](https://github.com/shardie-github/settler-oss/issues/new?template=feature_request.md).

### Is Settler free?

Settler offers a free tier with generous limits. Check [settler.dev/pricing](https://settler.dev/pricing) for details.

### Is Settler open source?

Yes! The SDKs are open source and available on GitHub. The core platform is managed by the Settler team.

## Getting Started

### How do I get an API key?

1. Sign up at [settler.dev](https://settler.dev)
2. Navigate to your dashboard
3. Generate an API key
4. Copy and store it securely

### Where should I store my API key?

**Never commit API keys to version control!** Use environment variables:

```bash
# .env file (add to .gitignore!)
SETTLER_API_KEY=your_key_here
```

```typescript
// In your code
const client = new SettlerClient({
  apiKey: process.env.SETTLER_API_KEY,
});
```

### How do I install the SDK?

See the [Getting Started Guide](./GETTING_STARTED.md) for detailed installation instructions for each SDK.

## Usage Questions

### How does reconciliation work?

Settler matches transactions from a source system with transactions from a target system based on rules you define (amount, date, ID, etc.). It returns matched pairs, unmatched items, and discrepancies.

### What matching rules are supported?

Common matching rules include:
- Exact amount match
- Date range matching
- ID matching
- Fuzzy matching (for amounts with small differences)
- Custom rules via API

See the [API documentation](https://docs.settler.dev/api) for details.

### Can I use Settler for real-time reconciliation?

Yes! Settler supports both batch and real-time reconciliation. Use the API directly for real-time processing.

### What's the rate limit?

Rate limits depend on your plan. Free tier includes generous limits. Check your dashboard for current limits.

### How do I handle errors?

All SDKs provide proper error handling:

```typescript
try {
  const result = await client.reconcile(data);
} catch (error) {
  if (error.statusCode === 401) {
    // Invalid API key
  } else if (error.statusCode === 429) {
    // Rate limit exceeded
  } else {
    // Other error
  }
}
```

## Technical Questions

### What Node.js version do I need?

Node.js 18+ is required for the TypeScript/Node.js SDK.

### Can I use TypeScript?

Yes! All Node.js SDKs are written in TypeScript and include type definitions.

### Do you support TypeScript types?

Yes! All SDKs include TypeScript definitions or equivalent type information.

### How do I update the SDK?

```bash
# npm
npm update @settler/sdk

# pip
pip install --upgrade settler-sdk

# go
go get -u github.com/shardie-github/settler-oss/packages/sdk-go

# gem
gem update settler-sdk
```

### Can I use Settler in a browser?

The React SDK is designed for browser use. The Node.js SDK can be used with bundlers like Webpack or Vite.

### Is there a Docker image?

Not yet, but it's on our roadmap! [Request it here](https://github.com/shardie-github/settler-oss/issues/new?template=feature_request.md).

## Troubleshooting

### "API key is required" error

Make sure you've set the `SETTLER_API_KEY` environment variable or passed it to the client constructor.

### "Module not found" error

Run `npm install` (or equivalent for your package manager) to install dependencies.

### Connection timeout

- Check your internet connection
- Verify firewall settings
- Check if you're behind a proxy
- Try increasing timeout settings

### Rate limit errors

- Check your current usage in the dashboard
- Implement exponential backoff
- Consider upgrading your plan
- Use batch processing for large datasets

### Results don't match expectations

- Check your matching rules
- Verify data format
- Review API documentation
- Check for data quality issues (nulls, formatting, etc.)

## Contributing

### How can I contribute?

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

### Where do I report bugs?

[Open a bug report](https://github.com/shardie-github/settler-oss/issues/new?template=bug_report.md).

### Can I request a feature?

Yes! [Open a feature request](https://github.com/shardie-github/settler-oss/issues/new?template=feature_request.md).

### How do I get help with contributing?

- Check [CONTRIBUTING.md](./CONTRIBUTING.md)
- Look for [good first issues](https://github.com/shardie-github/settler-oss/labels/good%20first%20issue)
- [Join discussions](https://github.com/shardie-github/settler-oss/discussions)

## Security

### How do I report a security vulnerability?

**Do not open a public issue!** Email security@settler.dev or use [GitHub Security Advisories](https://github.com/shardie-github/settler-oss/security/advisories/new).

See [SECURITY.md](./SECURITY.md) for details.

### Is my data secure?

Yes! We use industry-standard encryption and security practices. See our [security documentation](https://docs.settler.dev/security) for details.

## Support

### Where can I get help?

- 📚 [Documentation](https://docs.settler.dev)
- 💬 [GitHub Discussions](https://github.com/shardie-github/settler-oss/discussions)
- 🐛 [GitHub Issues](https://github.com/shardie-github/settler-oss/issues)
- 📧 [Email Support](mailto:support@settler.dev)

### What's the response time?

- GitHub Issues: Usually within 24-48 hours
- Email Support: Usually within 48-72 hours
- Security Issues: Acknowledged within 48 hours

## Still Have Questions?

- 💬 [Start a Discussion](https://github.com/shardie-github/settler-oss/discussions/new)
- 🐛 [Open an Issue](https://github.com/shardie-github/settler-oss/issues/new)
- 📧 [Email Us](mailto:support@settler.dev)

---

**Can't find your question?** [Ask it in Discussions](https://github.com/shardie-github/settler-oss/discussions/new?category=q-a)!
