#!/bin/bash
# Mirror Helper Script
# Helps sync OSS_PUBLIC content from private repo to OSS repo

set -e

PRIVATE_REPO_URL="${PRIVATE_REPO_URL:-https://github.com/shardie-github/Settler.git}"
MIRROR_OUT_DIR="${MIRROR_OUT_DIR:-.mirror-out}"
TEMP_DIR="/tmp/settler-mirror-$$"

echo "🔄 Starting mirror process..."

# Clean up on exit
trap "rm -rf $TEMP_DIR" EXIT

# Clone private repo (requires authentication)
echo "📥 Cloning private repository..."
if [ -z "$GITHUB_TOKEN" ]; then
    echo "⚠️  GITHUB_TOKEN not set. Attempting to clone..."
fi

git clone "$PRIVATE_REPO_URL" "$TEMP_DIR" 2>&1 || {
    echo "❌ Failed to clone private repository"
    echo "   Make sure GITHUB_TOKEN is set or you have access configured"
    exit 1
}

cd "$TEMP_DIR"

# Check for classification script
if [ -f "scripts/classify.sh" ] || [ -f "package.json" ]; then
    echo "🔍 Running classification..."
    if [ -f "package.json" ] && grep -q "classify" package.json; then
        npm install
        npm run classify:strict || echo "⚠️  Classification check failed, continuing..."
    fi
fi

# Create mirror output directory
mkdir -p "$MIRROR_OUT_DIR"

# Copy OSS_PUBLIC files
echo "📋 Copying OSS_PUBLIC content..."

# Look for OSS_PUBLIC marker files or directories
find . -name "OSS_PUBLIC" -o -name ".oss-public" | while read marker; do
    if [ -f "$marker" ]; then
        dir=$(dirname "$marker")
        echo "  Found OSS_PUBLIC marker in: $dir"
        # Copy directory contents
        rel_path=$(echo "$dir" | sed 's|^\./||')
        mkdir -p "$MIRROR_OUT_DIR/$rel_path"
        cp -r "$dir"/* "$MIRROR_OUT_DIR/$rel_path/" 2>/dev/null || true
    fi
done

# Copy common OSS files
echo "📄 Copying common OSS files..."
for file in README.public.md LICENSE CONTRIBUTING.md SECURITY.md; do
    if [ -f "$file" ]; then
        cp "$file" "$MIRROR_OUT_DIR/"
        if [ "$file" == "README.public.md" ]; then
            mv "$MIRROR_OUT_DIR/README.public.md" "$MIRROR_OUT_DIR/README.md"
        fi
    fi
done

# Copy packages marked as OSS_PUBLIC
if [ -d "packages" ]; then
    echo "📦 Copying OSS packages..."
    for pkg in packages/*; do
        if [ -d "$pkg" ] && [ -f "$pkg/OSS_PUBLIC" ] || [ -f "$pkg/.oss-public" ]; then
            pkg_name=$(basename "$pkg")
            echo "  Copying package: $pkg_name"
            cp -r "$pkg" "$MIRROR_OUT_DIR/packages/"
        fi
    done
fi

# Copy examples if marked as OSS_PUBLIC
if [ -d "examples" ]; then
    if [ -f "examples/OSS_PUBLIC" ] || [ -f "examples/.oss-public" ]; then
        echo "📚 Copying examples..."
        cp -r examples "$MIRROR_OUT_DIR/"
    fi
fi

echo "✅ Mirror export created in: $MIRROR_OUT_DIR"
echo ""
echo "Next steps:"
echo "1. Review the contents: ls -la $MIRROR_OUT_DIR"
echo "2. Verify no proprietary content leaked"
echo "3. Commit and push to OSS repo"
