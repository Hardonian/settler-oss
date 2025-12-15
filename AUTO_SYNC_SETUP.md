# Automated OSS Sync Setup Guide

This guide explains how to set up automatic syncing from your private repository to the public OSS repository.

## Overview

With this setup, you can:
- ✅ Commit to private repo via Cursor/agent
- ✅ Automatically sync OSS_PUBLIC content to public repo
- ✅ No manual CLI work needed
- ✅ Files are automatically partitioned (OSS vs private)
- ✅ Works seamlessly with GitHub Actions

## How It Works

1. **You commit** to private repo (via Cursor or any method)
2. **GitHub Actions workflow** triggers on push to main
3. **Classification script** identifies OSS_PUBLIC files
4. **Sync script** copies OSS files to public repo
5. **Auto-commit** happens in public repo with `[skip ci]` tag

## Setup Instructions

### Step 1: Copy Workflow to Private Repo

Copy the workflow file to your **PRIVATE** repository:

```bash
# In your private repo
cp PRIVATE_REPO_WORKFLOW_TEMPLATE.yml .github/workflows/auto-sync-oss.yml
```

Or manually create `.github/workflows/auto-sync-oss.yml` in your private repo with the content from `PRIVATE_REPO_WORKFLOW_TEMPLATE.yml`.

### Step 2: Configure GitHub Secrets (Private Repo)

In your **PRIVATE** repository (`shardie-github/Settler`), go to:
**Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

1. **`PUBLIC_MIRROR_REPO_URL`**
   - Value: `https://github.com/shardie-github/settler-oss.git`
   - Purpose: URL of the public OSS repository

2. **`PUBLIC_MIRROR_GIT_TOKEN`**
   - Value: A GitHub Personal Access Token (PAT) with `repo` scope
   - Purpose: Token to push to the public OSS repository
   - How to create:
     - Go to https://github.com/settings/tokens
     - Generate new token (classic)
     - Name: "Settler OSS Auto-Sync"
     - Scopes: `repo` (full control)
     - Generate and copy token

3. **`PUBLIC_MIRROR_GIT_USERNAME`** (optional)
   - Value: `github-actions[bot]` or your GitHub username
   - Purpose: Username for git commits
   - Default: `github-actions[bot]`

### Step 3: Configure Repository Variable (Private Repo)

In your **PRIVATE** repository, go to:
**Settings → Secrets and variables → Actions → Variables → New repository variable**

Add:
- **Name**: `ENABLE_AUTO_SYNC`
- **Value**: `true`
- **Purpose**: Kill switch to enable/disable auto-sync

### Step 4: Mark OSS_PUBLIC Content

In your **PRIVATE** repository, mark files/directories as OSS_PUBLIC using one of these methods:

#### Method 1: OSS_PUBLIC Marker File (Recommended)

Create an `OSS_PUBLIC` or `.oss-public` file in directories containing OSS content:

```
packages/sdk/OSS_PUBLIC
packages/sdk-python/OSS_PUBLIC
packages/sdk-go/OSS_PUBLIC
examples/OSS_PUBLIC
```

All files in that directory (and subdirectories) will be synced.

#### Method 2: Directory-Based (Automatic)

The following directories are automatically considered OSS_PUBLIC:
- `packages/sdk/`
- `packages/sdk-python/`
- `packages/sdk-go/`
- `packages/sdk-ruby/`
- `packages/api-client/`
- `packages/protocol/`
- `packages/react-settler/`
- `packages/cli/`
- `examples/`
- `docs/`

**To exclude a directory**, create a `.private` or `.oss-private` file in it.

#### Method 3: Root-Level Files

These files are automatically synced if they exist:
- `LICENSE`
- `README.public.md` (copied as `README.md` in OSS repo)
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CHANGELOG.md`

### Step 5: Test the Setup

1. **Make a test commit** in your private repo:
   ```bash
   # In private repo
   echo "test" >> packages/sdk/test.txt
   git add packages/sdk/test.txt
   git commit -m "test: auto-sync"
   git push origin main
   ```

2. **Check GitHub Actions**:
   - Go to your private repo → Actions
   - Find "Auto-Sync to OSS Repository" workflow
   - Verify it runs successfully

3. **Verify in OSS repo**:
   - Go to `shardie-github/settler-oss`
   - Check that `packages/sdk/test.txt` appears
   - Check commit message includes "auto-sync OSS content"

## Usage

### Normal Workflow

1. **Edit files** in private repo (via Cursor or any editor)
2. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```
3. **Auto-sync happens** automatically via GitHub Actions
4. **OSS files** appear in public repo within minutes

### Force Sync All OSS Content

If you need to sync all OSS content (ignoring change detection):

1. Go to private repo → Actions
2. Select "Auto-Sync to OSS Repository"
3. Click "Run workflow"
4. Check "Force sync all OSS content"
5. Run workflow

### Disable Auto-Sync Temporarily

Set repository variable `ENABLE_AUTO_SYNC` to `false` in private repo settings.

## File Classification Rules

### OSS_PUBLIC (Synced to Public Repo)
- Files in directories with `OSS_PUBLIC` marker
- Files in standard OSS directories (unless marked `.private`)
- Root-level OSS files (LICENSE, README.public.md, etc.)
- `.github/workflows/*.yml` (except private workflows)
- `.github/ISSUE_TEMPLATE/*`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/dependabot.yml`

### Private (NOT Synced)
- Files in directories with `.private` or `.oss-private` marker
- Files in `packages/web/`, `packages/api/` (unless explicitly marked OSS)
- Any file with `.private` extension
- Workflows with "private" in the name

## Troubleshooting

### Workflow Not Triggering

- Check workflow file exists: `.github/workflows/auto-sync-oss.yml`
- Verify branch name matches (main/master)
- Check `ENABLE_AUTO_SYNC` variable is set to `true`

### Sync Failing

- Verify `PUBLIC_MIRROR_GIT_TOKEN` secret is set correctly
- Check token has `repo` scope
- Verify OSS repo exists and is accessible
- Check workflow logs for specific errors

### Files Not Syncing

- Verify files are in OSS_PUBLIC directories
- Check for `.private` markers blocking sync
- Ensure files aren't in `paths-ignore` list
- Check classification script output in workflow logs

### Duplicate CI Runs

- Auto-sync commits include `[skip ci]` tag
- OSS repo CI should skip these commits
- Verify `accept-sync.yml` workflow handles this

## Advanced Configuration

### Custom Classification

Edit `scripts/classify-oss.sh` in your private repo to customize classification rules.

### Sync Specific Paths Only

Modify workflow `paths` filter:
```yaml
on:
  push:
    branches: [main]
    paths:
      - 'packages/sdk/**'
      - 'packages/sdk-python/**'
```

### Custom Commit Messages

Modify the commit message template in the workflow file.

## Security Considerations

- ✅ Token has minimal required permissions (`repo` scope)
- ✅ Only OSS_PUBLIC content is synced
- ✅ Classification happens before sync
- ✅ Workflow logs are visible to repo admins
- ✅ Can be disabled via repository variable

## Support

For issues or questions:
- Check workflow logs in private repo → Actions
- Review classification output in workflow steps
- Verify secrets and variables are set correctly
- Open an issue in the OSS repo
