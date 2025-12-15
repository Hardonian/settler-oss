# Contributing to Settler OSS

<div align="center">

**Thank you for your interest in contributing to Settler!** 🎉

We welcome contributions from everyone, regardless of experience level.

[Code of Conduct](./CODE_OF_CONDUCT.md) • [Community Guidelines](./.github/COMMUNITY.md) • [Getting Started](./GETTING_STARTED.md)

</div>

---

## 🌟 Why Contribute?

- 🎓 **Learn** - Improve your skills and learn from experienced developers
- 🤝 **Connect** - Join a welcoming community of developers
- 🚀 **Impact** - Help build tools that thousands of developers use
- 🏆 **Recognition** - Get credit for your contributions
- 💼 **Portfolio** - Build your open source portfolio

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Code Style](#code-style)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Review Process](#review-process)
- [Recognition](#recognition)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors.

## Ways to Contribute

There are many ways to contribute, and all contributions are valued!

### 🐛 Report Bugs

Found a bug? Help us fix it!

1. **Check existing issues** - [Search Issues](https://github.com/shardie-github/settler-oss/issues)
2. **Create a bug report** - [Use our template](https://github.com/shardie-github/settler-oss/issues/new?template=bug_report.md)
3. **Include details**:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Code examples or error messages

### 💡 Suggest Features

Have an idea? We'd love to hear it!

1. **Check existing** - [Issues](https://github.com/shardie-github/settler-oss/issues) and [Discussions](https://github.com/shardie-github/settler-oss/discussions)
2. **Create a feature request** - [Use our template](https://github.com/shardie-github/settler-oss/issues/new?template=feature_request.md)
3. **Include**:
   - Clear description
   - Use case and motivation
   - Proposed implementation (if applicable)

### 💻 Write Code

Ready to code? Here's how:

1. **Find an issue** - Look for [good first issues](https://github.com/shardie-github/settler-oss/labels/good%20first%20issue) or [help wanted](https://github.com/shardie-github/settler-oss/labels/help%20wanted)
2. **Fork the repository** - [Fork it](https://github.com/shardie-github/settler-oss/fork)
3. **Create a branch** - `git checkout -b feature/your-feature-name`
4. **Make changes** - Follow our guidelines below
5. **Submit a PR** - [Create Pull Request](https://github.com/shardie-github/settler-oss/compare)

### 📚 Improve Documentation

Documentation is crucial! Help us improve it:

- Fix typos and errors
- Improve clarity
- Add examples
- Translate documentation
- Write tutorials

### 🧪 Write Tests

Help improve test coverage:

- Add unit tests
- Add integration tests
- Improve test quality
- Fix flaky tests

### 💬 Help Others

Community support is invaluable:

- Answer questions in [Discussions](https://github.com/shardie-github/settler-oss/discussions)
- Help troubleshoot issues
- Review pull requests
- Share knowledge

### 🎨 Design & UX

Design contributions welcome:

- UI/UX improvements
- Logo and branding
- Documentation design
- Example projects

### 🌍 Translation

Help us reach more users:

- Translate documentation
- Translate error messages
- Improve localization

## Getting Started

### For New Contributors

**Never contributed to open source before?** No problem! Here's how to get started:

1. **Read this guide** - You're doing it! ✅
2. **Set up your environment** - See [Development Setup](#development-setup)
3. **Find a good first issue** - [Browse good first issues](https://github.com/shardie-github/settler-oss/labels/good%20first%20issue)
4. **Ask questions** - [Join Discussions](https://github.com/shardie-github/settler-oss/discussions)
5. **Make your first contribution** - Follow the steps below!

### Prerequisites

- **Node.js** 18+ (required)
- **npm** 9+ or **yarn** or **pnpm**
- **Git** 2.30+
- **Python** 3.8+ (for Python SDK development)
- **Go** 1.19+ (for Go SDK development)
- **Ruby** 2.7+ (for Ruby SDK development)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/settler-oss.git
   cd settler-oss
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/shardie-github/settler-oss.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Build all packages**
   ```bash
   npm run build
   ```

5. **Run tests**
   ```bash
   npm test
   ```

6. **Run linting**
   ```bash
   npm run lint
   ```

### Working on a Specific SDK

**TypeScript/Node.js SDK:**
```bash
cd packages/sdk
npm install
npm run build
npm test
npm run lint
```

**Python SDK:**
```bash
cd packages/sdk-python
pip install -e .
pytest
```

**Go SDK:**
```bash
cd packages/sdk-go
go mod download
go test ./...
go fmt ./...
```

**Ruby SDK:**
```bash
cd packages/sdk-ruby
bundle install
bundle exec rake test
```

## Making Changes

### Creating a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `test/` - Tests
- `refactor/` - Refactoring
- `chore/` - Maintenance

### Making Your Changes

1. **Write clean code** - Follow code style guidelines
2. **Add tests** - Include tests for new functionality
3. **Update docs** - Update relevant documentation
4. **Keep it focused** - One feature/fix per PR

### Code Style

**TypeScript/JavaScript:**
- Follow ESLint configuration (`.eslintrc.json`)
- Use TypeScript for new code
- Add type annotations
- Use meaningful variable names

**Python:**
- Follow PEP 8
- Use type hints
- Run `black` for formatting
- Use `mypy` for type checking

**Go:**
- Run `go fmt`
- Follow `golint` standards
- Add comments for exported functions
- Keep functions focused

**Ruby:**
- Follow RuboCop configuration
- Use meaningful names
- Add documentation comments
- Keep methods focused

### Testing

**Requirements:**
- ✅ Write tests for all new features
- ✅ Ensure all existing tests pass
- ✅ Aim for high test coverage (>80%)
- ✅ Include integration tests for SDKs
- ✅ Test error cases

**Running tests:**
```bash
# All tests
npm test

# Specific package
cd packages/sdk && npm test

# Watch mode
npm test -- --watch
```

### Documentation

**When to update docs:**
- Adding new features
- Changing APIs
- Fixing bugs that affect behavior
- Adding examples

**What to document:**
- Public APIs (JSDoc/TSDoc comments)
- README.md for user-facing changes
- Examples if behavior changes
- CHANGELOG.md for releases

## Submitting Changes

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add reconciliation endpoint
fix: handle null values in matching
docs: update API documentation
test: add integration tests
refactor: simplify matching logic
chore: update dependencies
```

**Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Refactoring
- `chore:` - Maintenance
- `perf:` - Performance
- `style:` - Formatting

### Creating a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**
   - Go to [New Pull Request](https://github.com/shardie-github/settler-oss/compare)
   - Select your branch
   - Fill out the PR template
   - Reference related issues

3. **PR Checklist**
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] All tests pass
   - [ ] Linting passes
   - [ ] No breaking changes (or documented)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Related Issues
Closes #123

## Testing
- [ ] Tests added
- [ ] All tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
```

## Review Process

### What to Expect

1. **Automated checks** - CI will run tests and linting
2. **Code review** - Maintainers will review your code
3. **Feedback** - You may receive suggestions for improvements
4. **Approval** - Once approved, your PR will be merged

### Responding to Feedback

- ✅ Be open to suggestions
- ✅ Ask questions if unclear
- ✅ Make requested changes
- ✅ Keep discussions constructive
- ✅ Thank reviewers for their time

### After Approval

- 🎉 Your PR will be merged
- 📝 You'll be credited in the release notes
- 🌟 Your contribution helps the community!

## Recognition

We recognize all contributions:

- **Code** - PRs, bug fixes, features
- **Documentation** - Docs, examples, tutorials
- **Community** - Answering questions, helping others
- **Design** - UI/UX improvements
- **Testing** - Bug reports, test improvements

Contributors are:
- Listed in release notes
- Credited in CHANGELOG.md
- Recognized in discussions
- Featured (with permission) in blog posts

## Questions?

- 💬 [Join Discussions](https://github.com/shardie-github/settler-oss/discussions)
- ❓ [Ask a Question](https://github.com/shardie-github/settler-oss/issues/new?template=question.md)
- 📧 [Email Support](mailto:support@settler.dev)
- 📚 [Read Documentation](https://docs.settler.dev)

## Resources

- [Getting Started Guide](./GETTING_STARTED.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Community Guidelines](./.github/COMMUNITY.md)
- [FAQ](./FAQ.md)
- [Roadmap](./ROADMAP.md)

---

<div align="center">

**Thank you for contributing to Settler!** 🎉

Your contributions make Settler better for everyone.

[⭐ Star us on GitHub](https://github.com/shardie-github/settler-oss/stargazers) • [💬 Join Discussions](https://github.com/shardie-github/settler-oss/discussions) • [🐛 Report Issues](https://github.com/shardie-github/settler-oss/issues)

</div>
