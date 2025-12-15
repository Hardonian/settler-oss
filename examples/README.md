# Settler Examples

Welcome! This directory contains example code demonstrating how to use Settler SDKs in real-world scenarios.

## 🚀 Quick Start Examples

### Basic Reconciliation

Learn how to perform basic transaction reconciliation:

- **[TypeScript](./basic-reconciliation/typescript/)** - Node.js/TypeScript example
- **[Python](./basic-reconciliation/python/)** - Python example
- **[Go](./basic-reconciliation/go/)** - Go example
- **[Ruby](./basic-reconciliation/ruby/)** - Ruby example

### Advanced Matching

Explore advanced matching rules and algorithms:

- **[Fuzzy Matching](./advanced-matching/fuzzy/)** - Match transactions with slight differences
- **[Date Range Matching](./advanced-matching/date-ranges/)** - Match within date ranges
- **[Custom Rules](./advanced-matching/custom-rules/)** - Implement custom matching logic

### Integration Examples

See how to integrate Settler into your stack:

- **[Next.js](./integrations/nextjs/)** - React/Next.js integration
- **[Express](./integrations/express/)** - Node.js Express API
- **[FastAPI](./integrations/fastapi/)** - Python FastAPI integration
- **[Gin](./integrations/gin/)** - Go Gin web framework
- **[Rails](./integrations/rails/)** - Ruby on Rails integration

### Real-World Scenarios

Practical examples for common use cases:

- **[Bank Reconciliation](./scenarios/bank-reconciliation/)** - Reconcile bank statements
- **[Invoice Matching](./scenarios/invoice-matching/)** - Match invoices with payments
- **[Multi-Currency](./scenarios/multi-currency/)** - Handle multiple currencies
- **[Batch Processing](./scenarios/batch-processing/)** - Process large datasets

## 📚 How to Use Examples

### Running Examples

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shardie-github/settler-oss.git
   cd settler-oss/examples
   ```

2. **Choose an example:**
   ```bash
   cd basic-reconciliation/typescript
   ```

3. **Install dependencies:**
   ```bash
   npm install
   # or
   pip install -r requirements.txt
   # or
   go mod download
   ```

4. **Set your API key:**
   ```bash
   export SETTLER_API_KEY=your_api_key_here
   ```

5. **Run the example:**
   ```bash
   npm start
   # or
   python main.py
   # or
   go run main.go
   ```

## 🎓 Learning Path

### Beginner
1. Start with [Basic Reconciliation](./basic-reconciliation/)
2. Try [Simple Matching](./basic-reconciliation/typescript/)
3. Explore [Error Handling](./basic-reconciliation/typescript/error-handling.ts)

### Intermediate
1. Learn [Advanced Matching](./advanced-matching/)
2. Try [Custom Rules](./advanced-matching/custom-rules/)
3. Build an [Integration](./integrations/)

### Advanced
1. Implement [Real-World Scenarios](./scenarios/)
2. Optimize [Performance](./scenarios/batch-processing/)
3. Build [Custom Solutions](./advanced-matching/custom-rules/)

## 💡 Example Structure

Each example includes:

- ✅ **README.md** - Explanation and setup instructions
- ✅ **Code files** - Complete, runnable code
- ✅ **Configuration** - Example config files
- ✅ **Tests** - Example tests (where applicable)
- ✅ **Comments** - Detailed code comments

## 🤝 Contributing Examples

We welcome example contributions! Here's how:

1. **Fork the repository**
2. **Create your example** in the appropriate directory
3. **Add a README** explaining the example
4. **Test your code** to ensure it works
5. **Submit a PR** with your example

**Guidelines:**
- Keep examples focused and clear
- Include comments explaining key concepts
- Add a README with setup instructions
- Test your code before submitting
- Follow the existing example structure

## 📖 Related Documentation

- [Getting Started Guide](../GETTING_STARTED.md)
- [API Documentation](https://docs.settler.dev/api)
- [FAQ](../FAQ.md)
- [Contributing Guide](../CONTRIBUTING.md)

## ❓ Need Help?

- 💬 [Ask in Discussions](https://github.com/shardie-github/settler-oss/discussions)
- 🐛 [Report Issues](https://github.com/shardie-github/settler-oss/issues)
- 📧 [Email Support](mailto:support@settler.dev)

---

**Have an example idea?** [Share it with us](https://github.com/shardie-github/settler-oss/discussions/categories/ideas)!
