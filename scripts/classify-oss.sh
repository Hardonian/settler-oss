#!/bin/bash
# Classify files as OSS_PUBLIC or private
# This script identifies which files should be synced to the OSS repository

set -e

OSS_FILES=""

# Method 1: Find files marked with OSS_PUBLIC marker files
find . -type f \( -name "OSS_PUBLIC" -o -name ".oss-public" \) 2>/dev/null | while read marker; do
  dir=$(dirname "$marker")
  # Get all files in this directory (excluding markers and git files)
  find "$dir" -type f ! -name "OSS_PUBLIC" ! -name ".oss-public" ! -path "*/.git/*" ! -name "*.private" 2>/dev/null | while read file; do
    # Make path relative
    rel_path=$(echo "$file" | sed 's|^\./||')
    echo "$rel_path"
  done
done

# Method 2: Check for explicit OSS_PUBLIC directories
for dir in packages/sdk packages/sdk-python packages/sdk-go packages/sdk-ruby packages/api-client packages/protocol packages/react-settler packages/cli examples docs; do
  if [ -d "$dir" ]; then
    # Skip if marked as private
    if [ -f "$dir/.private" ] || [ -f "$dir/.oss-private" ]; then
      continue
    fi
    
    # Include all files in OSS directories (unless marked private)
    find "$dir" -type f ! -path "*/.git/*" ! -name "*.private" ! -name ".private" ! -name ".oss-private" 2>/dev/null | while read file; do
      rel_path=$(echo "$file" | sed 's|^\./||')
      echo "$rel_path"
    done
  fi
done

# Method 3: Include common OSS files at root
for file in LICENSE README.public.md README.md CONTRIBUTING.md SECURITY.md CHANGELOG.md; do
  if [ -f "$file" ]; then
    echo "$file"
  fi
done

# Method 4: Include .github workflows and templates (public repo needs these)
if [ -d ".github/workflows" ] || [ -d ".github/ISSUE_TEMPLATE" ]; then
  find .github -type f ! -path "*/.git/*" 2>/dev/null | while read file; do
    rel_path=$(echo "$file" | sed 's|^\./||')
    echo "$rel_path"
  done
fi

# Sort and deduplicate
# Note: This script outputs to stdout, caller should handle sorting
