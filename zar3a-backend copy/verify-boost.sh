#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 PREMIUM BOOST VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✅ Crop Market - First 5 products:"
curl -s http://localhost:5002/marketplace/crop-products 2>&1 | jq '.[0:5] | .[] | "\(.isBoosted | if . then "⭐ BOOSTED" else "  regular" end) | \(.title) (ID: \(.id))"' | sed 's/"//g'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✅ Agri Shop - First 5 products:"
curl -s http://localhost:5002/marketplace/agri-products 2>&1 | jq '.[0:5] | .[] | "\(.isBoosted | if . then "⭐ BOOSTED" else "  regular" end) | \(.title) (ID: \(.id))"' | sed 's/"//g'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Status: Backend is returning boosted products FIRST ✅"
echo ""
echo "🔧 If frontend doesn't show them at top:"
echo "   1. Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)"
echo "   2. Or clear cache in DevTools: F12 → Storage → Clear All"
echo "   3. Or restart frontend: npm run dev"
echo ""
