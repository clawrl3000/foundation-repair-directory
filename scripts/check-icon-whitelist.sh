#!/bin/bash
# Verify all Material Symbols icons used in code are in the Google Fonts whitelist
# Run before deploying to catch missing icons

set -e
cd "$(dirname "$0")/.."

# Extract whitelist from layout.tsx
WHITELIST=$(grep -o 'icon_names=[^"&]*' src/app/layout.tsx | head -1 | sed 's/icon_names=//' | tr ',' '\n' | sort)

# Extract all icons used in code (static references only)
USED=$(
  {
    grep -roh 'material-symbols-outlined[^>]*>[a-z_]*<' src/ --include="*.tsx" | grep -o '>[a-z_]*<' | tr -d '><'
    grep -roh "icon: '[a-z_]*'" src/ --include="*.tsx" | sed "s/icon: '//;s/'//"
  } | sort -u
)

MISSING=$(comm -23 <(echo "$USED") <(echo "$WHITELIST"))

if [ -n "$MISSING" ]; then
  echo "❌ Missing icons from Google Fonts whitelist in layout.tsx:"
  echo "$MISSING" | while read icon; do
    echo "  - $icon"
    grep -rn "$icon" src/ --include="*.tsx" | head -2 | sed 's/^/    /'
  done
  echo ""
  echo "Add them to icon_names in src/app/layout.tsx (MUST be alphabetically sorted!)"
  exit 1
else
  echo "✅ All icons are in the whitelist"
fi
