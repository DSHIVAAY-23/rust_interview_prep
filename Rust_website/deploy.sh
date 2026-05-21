#!/bin/bash
# deploy.sh — push rust-prep to GitHub Pages

set -e

REPO="rust-prep"
GITHUB_USER="DSHIVAAY-23"

echo ""
echo "=== rust-prep deploy ==="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
fi

echo "Staging all files..."
git add index.html data.js app.js themes.js search.js compiler.js README.md deploy.sh

echo "Creating commit..."
git commit -m "feat: rust-prep v2 — 8 themes, compiler, global search, Q&A upgrade, font controls" || echo "(nothing new to commit)"

# Add remote if not already set
if ! git remote get-url origin &>/dev/null 2>&1; then
  echo "Adding remote origin..."
  git remote add origin "https://github.com/$GITHUB_USER/$REPO.git"
fi

echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "=== Done! ==="
echo ""
echo "Visit:  https://$GITHUB_USER.github.io/$REPO"
echo ""
echo "Enable GitHub Pages:"
echo "  GitHub repo → Settings → Pages → Branch: main → / (root) → Save"
echo ""
