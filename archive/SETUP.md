# OSS Repository Setup Guide

This guide explains how to populate the OSS repository with content from the private Settler repository.

## Prerequisites

1. Access to the private `shardie-github/Settler` repository
2. GitHub token with appropriate permissions
3. Node.js and npm installed

## Step 1: Configure GitHub Token

Set your GitHub token as an environment variable:

```bash
export GITHUB_TOKEN=your_github_token_here
```

Or create a `.env` file (make sure it's in `.gitignore`):

```
GITHUB_TOKEN=your_github_token_here
```

## Step 2: Run Mirror Helper Script

The mirror helper script will:
1. Clone the private repository
2. Identify OSS_PUBLIC content
3. Copy it to `.mirror-out` directory

```bash
./scripts/mirror-helper.sh
```

Or manually:

```bash
export PRIVATE_REPO_URL=https://github.com/shardie-github/Settler.git
export MIRROR_OUT_DIR=.mirror-out
./scripts/mirror-helper.sh
```

## Step 3: Review Mirror Export

Before committing, review the exported content:

```bash
cd .mirror-out
find . -type f | head -20
```

Verify:
- ✅ Only OSS_PUBLIC content is present
- ✅ No proprietary code leaked
- ✅ No internal documentation
- ✅ No secrets or API keys
- ✅ README.md is present
- ✅ LICENSE is present

## Step 4: Copy to OSS Repository

Once verified, copy the content to the OSS repo:

```bash
# From workspace root
cp -r .mirror-out/* .
```

Or merge selectively:

```bash
# Copy specific packages
cp -r .mirror-out/packages/sdk packages/
cp -r .mirror-out/packages/sdk-python packages/
# ... etc
```

## Step 5: Commit and Push

```bash
git add .
git commit -m "chore: initial OSS mirror sync from private repo"
git push origin main
```

## Step 6: Create Initial Release

```bash
git tag -a v0.1.0 -m "Initial OSS release"
git push origin v0.1.0
```

## Manual Process (Alternative)

If the mirror script doesn't work, you can manually:

1. Clone the private repo locally
2. Identify files/directories marked with `OSS_PUBLIC` or `.oss-public`
3. Copy them to this OSS repo maintaining directory structure
4. Review and commit

## Verification Checklist

Before pushing to public repo:

- [ ] No proprietary code present
- [ ] No internal documentation
- [ ] No secrets or credentials
- [ ] All package.json files updated with public package names
- [ ] README.md is comprehensive
- [ ] LICENSE is present
- [ ] CONTRIBUTING.md is present
- [ ] SECURITY.md is present
- [ ] Examples work correctly
- [ ] Build scripts work

## Troubleshooting

### Script fails to clone private repo

- Verify GITHUB_TOKEN is set correctly
- Check token has `repo` scope
- Try cloning manually: `git clone https://github.com/shardie-github/Settler.git`

### Missing OSS_PUBLIC markers

- Check if private repo uses different marker files
- Review private repo structure
- Manually identify OSS content

### Build errors after copying

- Check package.json dependencies
- Verify TypeScript/Python/Go/Ruby configurations
- Run `npm install` in each package directory

## Next Steps

After initial setup:

1. Set up GitHub Actions secrets (see main README)
2. Configure branch protection
3. Enable Dependabot
4. Set up monitoring
5. Announce OSS repo launch
