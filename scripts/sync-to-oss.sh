#!/bin/bash
# Sync OSS_PUBLIC content to OSS repository
# This script handles the actual file operations (add/update/delete)

set -e

PRIVATE_REPO_PATH="${1:-.}"
OSS_REPO_PATH="${2:-/tmp/oss-repo}"
OSS_FILES_LIST="${3:-/tmp/oss_files.txt}"

if [ ! -f "$OSS_FILES_LIST" ]; then
  echo "❌ OSS files list not found: $OSS_FILES_LIST"
  exit 1
fi

echo "🔄 Syncing OSS content..."
echo "  Private repo: $PRIVATE_REPO_PATH"
echo "  OSS repo: $OSS_REPO_PATH"
echo "  Files list: $OSS_FILES_LIST"

cd "$OSS_REPO_PATH"

# Read OSS files list
OSS_FILES=$(cat "$OSS_FILES_LIST" | grep -v '^$' | sort -u)

# Track what we've synced
SYNCED_COUNT=0
DELETED_COUNT=0

# Copy OSS files
echo "$OSS_FILES" | while read file; do
  if [ -z "$file" ]; then
    continue
  fi
  
  private_file="$PRIVATE_REPO_PATH/$file"
  oss_file="$file"
  
  # Skip if file doesn't exist in private repo (might have been deleted)
  if [ ! -f "$private_file" ]; then
    # Check if it exists in OSS repo and should be deleted
    if [ -f "$oss_file" ]; then
      git rm "$oss_file" 2>/dev/null || rm -f "$oss_file"
      echo "  ✗ Deleted: $file"
      DELETED_COUNT=$((DELETED_COUNT + 1))
    fi
    continue
  fi
  
  # Create directory structure
  dir=$(dirname "$oss_file")
  if [ "$dir" != "." ]; then
    mkdir -p "$dir"
  fi
  
  # Copy file
  cp "$private_file" "$oss_file"
  echo "  ✓ $file"
  SYNCED_COUNT=$((SYNCED_COUNT + 1))
done

# Handle special files
for file in LICENSE README.public.md CONTRIBUTING.md SECURITY.md CHANGELOG.md; do
  private_file="$PRIVATE_REPO_PATH/$file"
  
  if [ -f "$private_file" ]; then
    if [ "$file" == "README.public.md" ]; then
      cp "$private_file" "README.md"
      echo "  ✓ README.md (from README.public.md)"
    else
      cp "$private_file" "$file"
      echo "  ✓ $file"
    fi
  fi
done

# Copy .github directory (workflows, templates, etc.)
if [ -d "$PRIVATE_REPO_PATH/.github" ]; then
  # Only copy public GitHub files
  if [ -d "$PRIVATE_REPO_PATH/.github/workflows" ]; then
    mkdir -p .github/workflows
    find "$PRIVATE_REPO_PATH/.github/workflows" -name "*.yml" -o -name "*.yaml" | while read workflow; do
      # Only copy workflows that don't contain "private" in name
      if ! echo "$workflow" | grep -qi "private"; then
        cp "$workflow" ".github/workflows/$(basename $workflow)"
        echo "  ✓ .github/workflows/$(basename $workflow)"
      fi
    done
  fi
  
  if [ -d "$PRIVATE_REPO_PATH/.github/ISSUE_TEMPLATE" ]; then
    mkdir -p .github/ISSUE_TEMPLATE
    cp -r "$PRIVATE_REPO_PATH/.github/ISSUE_TEMPLATE"/* .github/ISSUE_TEMPLATE/ 2>/dev/null || true
    echo "  ✓ .github/ISSUE_TEMPLATE/"
  fi
  
  # Copy other public .github files
  for file in PULL_REQUEST_TEMPLATE.md dependabot.yml; do
    if [ -f "$PRIVATE_REPO_PATH/.github/$file" ]; then
      mkdir -p .github
      cp "$PRIVATE_REPO_PATH/.github/$file" ".github/$file"
      echo "  ✓ .github/$file"
    fi
  done
fi

echo ""
echo "✅ Sync complete:"
echo "  - Synced: $SYNCED_COUNT files"
echo "  - Deleted: $DELETED_COUNT files"
