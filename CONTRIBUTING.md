# Contributing to Settler OSS

This document explains how to contribute to Settler OSS effectively.

**Before contributing:** Read [MAINTAINER_RESPONSE_POLICY.md](./docs/MAINTAINER_RESPONSE_POLICY.md) to understand response expectations and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community standards.

---

## Contribution Philosophy

Settler OSS is a maintained project with limited maintainer bandwidth. Contributions are welcome when they:
- Align with project scope and goals
- Include tests and documentation
- Don't significantly increase maintenance burden
- Solve real problems for multiple users

**What this means:**
- Not all feature requests will be accepted
- PRs may be closed if misaligned with project direction
- Response times vary based on maintainer capacity
- Quality and maintainability matter more than feature count

## Contribution Boundaries

### What We Accept

**Bug fixes:**
- Clear reproduction steps provided
- Includes test demonstrating the bug
- Fixes root cause, not symptoms
- Doesn't break existing functionality

**Documentation:**
- Typo fixes, clarity improvements
- Missing examples or use cases
- Updated API documentation
- Troubleshooting guides

**Tests:**
- Increased coverage for existing code
- Edge case testing
- Integration tests for workflows
- Fixing flaky tests

**Good first issues:**
- Labeled `good-first-issue`
- Well-scoped, clear solution path
- Maintainers provide guidance

### What Requires Prior Discussion

Open an issue **before** writing code for:
- New features or enhancements
- Breaking API changes
- New language SDKs
- Large refactors or architectural changes
- Changes to build or release process

**Why:** Avoids wasted effort on features that won't be accepted.

### What Will Be Rejected

**Out of scope:**
- Features that belong in Settler Cloud/Enterprise (see OSS_SCOPE.md)
- Narrow use cases serving one user
- Features that complicate the core library
- "Nice to have" without clear problem statement

**Quality issues:**
- No tests or insufficient test coverage
- Breaking changes without migration path
- Undocumented public APIs
- Code that doesn't follow project style

**Process issues:**
- Large PRs without prior discussion
- Multiple unrelated changes in one PR
- Ignoring code review feedback
- Hostile or unprofessional communication

## Non-Code Contributions

You can contribute without writing code:

**Community support:**
- Answer questions in GitHub Discussions
- Help reproduce reported bugs
- Test beta releases and provide feedback
- Share how you use Settler (use cases, blog posts)

**Documentation:**
- Fix typos and broken links
- Improve clarity and examples
- Write tutorials or guides
- Translate documentation

**Issue triage:**
- Add reproduction steps to bug reports
- Confirm bugs on different environments
- Suggest labels or categorization
- Close duplicates (with reference to original)

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

1. **Automated checks** - CI runs tests and linting (must pass)
2. **Code review** - Maintainers review when capacity allows (see MAINTAINER_RESPONSE_POLICY.md)
3. **Feedback** - Expect requests for changes, clarification, or refactoring
4. **Approval and merge** - Once approved, maintainers will merge

**Timeline expectations:**
- Small PRs (docs, typos): 1-2 weeks
- Medium PRs (bug fixes, tests): 2-4 weeks
- Large PRs (features, refactors): Several weeks to months
- No response after 30 days: Politely bump the PR

### Responding to Feedback

- Be open to suggestions and changes
- Ask questions if feedback is unclear
- Address all review comments
- Keep discussions technical and professional
- Understand that "no" is sometimes the answer

### Common Review Feedback

**"Can you add tests?"**
- All code changes require tests
- Tests should cover success and error cases

**"This needs documentation"**
- Public APIs must be documented
- Complex logic should have comments
- README/docs updated if behavior changes

**"Can you split this into smaller PRs?"**
- Large PRs are harder to review
- One feature/fix per PR is ideal

**"This is out of scope"**
- Feature doesn't align with project goals
- Consider implementing as external package or fork

### If Your PR Is Closed

PRs may be closed if:
- Out of scope for the project
- No response to feedback after 60 days
- Maintainers lack capacity to support the feature long-term
- Similar functionality added elsewhere

**Closed ≠ bad contribution.** It may not fit the project's direction right now.

## Recognition

Contributors are credited in:
- Release notes (for merged PRs)
- CHANGELOG.md (for significant contributions)
- GitHub contributor graph (automatic)

Contributions that help maintainers (bug fixes, docs, tests) are valued more than feature additions that increase maintenance burden.

## Maintainer Expectations

**Maintainers will:**
- Review PRs when capacity allows
- Provide constructive feedback
- Explain rejection reasons clearly
- Respect contributors' time and effort

**Maintainers are not obligated to:**
- Respond immediately
- Accept all contributions
- Justify every decision in detail
- Merge features they cannot maintain

See [MAINTAINER_RESPONSE_POLICY.md](./docs/MAINTAINER_RESPONSE_POLICY.md) for detailed expectations.

## Getting Help

**Technical questions:**
- [GitHub Discussions](https://github.com/shardie-github/settler-oss/discussions) (preferred)
- [Question issue template](https://github.com/shardie-github/settler-oss/issues/new?template=question.yml)

**Before asking:**
- Search existing issues and discussions
- Read relevant documentation
- Include reproduction steps and context

**Response time:** Best effort when maintainer capacity allows.

## Resources

- [Maintainer Response Policy](./docs/MAINTAINER_RESPONSE_POLICY.md) - Response expectations
- [Issue and PR Labels](./docs/ISSUE_AND_PR_LABELS.md) - Label taxonomy
- [Next 30 Days](./docs/NEXT_30_DAYS.md) - Current priorities
- [OSS Scope](./OSS_SCOPE.md) - What's in/out of scope
- [Code of Conduct](./CODE_OF_CONDUCT.md) - Community standards
- [Security Policy](./SECURITY.md) - Security reporting

---

Settler OSS is maintained by a small team with limited capacity. Realistic expectations and focused contributions make the project sustainable.
