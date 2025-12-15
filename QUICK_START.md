# Quick Start Guide

## For Repository Maintainers

### Initial Setup (One-time)

1. **Clone the OSS repository**:
   ```bash
   git clone https://github.com/shardie-github/settler-oss.git
   cd settler-oss
   ```

2. **Set up GitHub token** (for accessing private repo):
   ```bash
   export GITHUB_TOKEN=your_token_here
   ```

3. **Run mirror script** to port content from private repo:
   ```bash
   ./scripts/mirror-helper.sh
   ```

4. **Review exported content**:
   ```bash
   cd .mirror-out
   ls -la
   ```

5. **Copy to OSS repo**:
   ```bash
   cd ..
   cp -r .mirror-out/* .
   ```

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "chore: initial OSS mirror sync"
   git push origin main
   ```

### Regular Updates

When you want to sync new changes from private repo:

1. **Run mirror script**:
   ```bash
   ./scripts/mirror-helper.sh
   ```

2. **Review changes**:
   ```bash
   diff -r .mirror-out packages/
   ```

3. **Merge changes**:
   ```bash
   cp -r .mirror-out/* .
   git add .
   git commit -m "chore: sync OSS content from private repo"
   git push origin main
   ```

### Automated Publishing

The repository includes a GitHub Actions workflow that automatically publishes to the OSS repo when you create a version tag in the private repo:

1. **Create a version tag** in private repo:
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```

2. **Workflow automatically**:
   - Runs classification check
   - Generates mirror export
   - Pushes to OSS repo
   - Creates matching tag

## For Contributors

### Setting Up Development Environment

1. **Fork and clone**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/settler-oss.git
   cd settler-oss
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build packages**:
   ```bash
   npm run build
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

### Making Changes

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes** and test:
   ```bash
   npm run build
   npm test
   ```

3. **Commit**:
   ```bash
   git commit -m "feat: add your feature"
   ```

4. **Push and create PR**:
   ```bash
   git push origin feature/your-feature
   ```

## Common Commands

```bash
# Build all packages
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Clean build artifacts
npm run clean

# Install dependencies for a specific package
cd packages/sdk
npm install

# Build specific package
cd packages/sdk
npm run build
```

## Troubleshooting

### Build fails
- Check Node.js version: `node --version` (should be 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check package-specific errors in individual package directories

### Tests fail
- Run tests individually: `cd packages/sdk && npm test`
- Check test configuration files
- Verify dependencies are installed

### Mirror script fails
- Verify GITHUB_TOKEN is set
- Check token has `repo` scope
- Try cloning private repo manually to test access

## Getting Help

- **Issues**: https://github.com/shardie-github/settler-oss/issues
- **Discussions**: https://github.com/shardie-github/settler-oss/discussions
- **Email**: support@settler.dev
