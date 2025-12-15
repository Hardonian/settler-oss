# Contributing to Settler OSS

Thank you for your interest in contributing to Settler! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/shardie-github/settler-oss/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, SDK version, etc.)
   - Code examples or error messages

### Suggesting Features

1. Check existing [Issues](https://github.com/shardie-github/settler-oss/issues) and [Discussions](https://github.com/shardie-github/settler-oss/discussions)
2. Create a new issue with:
   - Clear description of the feature
   - Use case and motivation
   - Proposed implementation (if applicable)

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**:
   - Follow the code style and conventions
   - Add tests for new functionality
   - Update documentation as needed
4. **Commit your changes**:
   ```bash
   git commit -m "feat: add your feature description"
   ```
   Use conventional commits format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for tests
   - `refactor:` for refactoring
   - `chore:` for maintenance
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**:
   - Provide a clear description
   - Reference related issues
   - Ensure CI checks pass

## Development Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Python 3.8+ (for Python SDK)
- Go 1.19+ (for Go SDK)
- Ruby 2.7+ (for Ruby SDK)

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/shardie-github/settler-oss.git
   cd settler-oss
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build all packages:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Code Style

- **TypeScript/JavaScript**: Follow ESLint configuration
- **Python**: Follow PEP 8, use Black for formatting
- **Go**: Follow `gofmt` and `golint` standards
- **Ruby**: Follow RuboCop configuration

## Testing

- Write tests for all new features
- Ensure all existing tests pass
- Aim for high test coverage
- Include integration tests for SDKs

## Documentation

- Update README.md for user-facing changes
- Add JSDoc/TSDoc comments for public APIs
- Update examples if behavior changes
- Keep CHANGELOG.md updated

## Release Process

Releases are managed by maintainers. Version tags follow semantic versioning (v1.2.3).

## Questions?

- Open a [Discussion](https://github.com/shardie-github/settler-oss/discussions)
- Check existing [Issues](https://github.com/shardie-github/settler-oss/issues)
- Contact maintainers

Thank you for contributing! 🎉
