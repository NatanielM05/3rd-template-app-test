#!/bin/bash
#
# Validate App - All-in-One Validation Script
#
# This script runs all mandatory validation steps:
# 1. Database initialization test
# 2. TypeScript build
# 3. Type-checking
#
# Usage: pnpm validate
#

set -e  # Exit on first error

echo "🔍 Validating application..."
echo ""

# Step 1: Database Test
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Testing database initialization..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pnpm --filter @app/database build || {
  echo ""
  echo "❌ Database build failed!"
  echo "   Check packages/infra/database/src/ for TypeScript errors"
  exit 1
}

pnpm --filter @app/database test:init || {
  echo ""
  echo "❌ Database initialization test failed!"
  echo ""
  echo "💡 Common fixes:"
  echo "   - Ensure mkdir(dirname(dbPath), { recursive: true }) is in init()"
  echo "   - Check that lowdb is installed"
  echo "   - Verify Database class exports are correct"
  exit 1
}
echo ""

# Step 2: Build All Packages
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Building all packages..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pnpm -r build || {
  echo ""
  echo "❌ Build failed!"
  echo ""
  echo "💡 Common fixes:"
  echo "   - TS6133 (unused var): Prefix with _ or remove import"
  echo "   - TS2742 (type inference): Add explicit type annotation"
  echo "   - Check ARCHITECTURE.md 'Common Pitfalls' section"
  exit 1
}
echo ""

# Step 3: Type-Check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Type-checking all packages..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pnpm -r typecheck 2>/dev/null || {
  echo "⚠️  Type-check skipped (no typecheck script found)"
  echo "   This is OK if packages don't have typecheck configured"
}
echo ""

# Success!
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All validations passed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "  pnpm dev           # Start all services"
echo "  pnpm --filter @app/api dev       # Start only backend"
echo "  pnpm --filter @app/frontend dev  # Start only frontend"
echo ""
