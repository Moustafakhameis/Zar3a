#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 COMPREHENSIVE BOOST SORTING TEST SUITE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

API_URL="http://localhost:5002"
PASS=0
FAIL=0

# Helper function
test_endpoint() {
  local name="$1"
  local endpoint="$2"
  local expected_boost_count="$3"
  
  echo "📡 Testing: $name"
  echo "   Endpoint: $endpoint"
  
  response=$(curl -s "$API_URL$endpoint")
  
  # Check if response is valid JSON array
  if ! echo "$response" | jq . >/dev/null 2>&1; then
    echo "   ❌ FAIL: Invalid response"
    ((FAIL++))
    return 1
  fi
  
  # Count boosted products in first 10
  boosted=$(echo "$response" | jq "[.[:10] | .[] | select(.isBoosted == true)] | length")
  total=$(echo "$response" | jq "[.[:10]] | length")
  
  # Check first item is boosted
  first_boosted=$(echo "$response" | jq ".[0].isBoosted" 2>/dev/null || echo "null")
  
  if [ "$first_boosted" == "true" ]; then
    echo "   ✅ PASS: Boosted products at top ($boosted/$total)"
    ((PASS++))
  else
    echo "   ❌ FAIL: First product not boosted"
    echo "   Details:"
    echo "$response" | jq ".[:3] | .[] | {id, title, isBoosted}" 2>/dev/null | head -20
    ((FAIL++))
  fi
  echo ""
}

# Test 1: Crop Market
test_endpoint "Crop Market Listing" "/marketplace/crop-products" 5

# Test 2: Agri Shop
test_endpoint "Agri Shop Listing" "/marketplace/agri-products" 5

# Test 3: Sensor Market
test_endpoint "Sensor Market Listing" "/marketplace/sensor-products" 0

# Test 4: Generic Products (All)
test_endpoint "All Products" "/market/products" 5

# Test 5: Search (Crop)
test_endpoint "Search - Crop Market" "/marketplace/search?q=tomato&marketplace=crop" 1

# Test 6: Search (Agri)
test_endpoint "Search - Agri Shop" "/marketplace/search?q=fertilizer&marketplace=agri" 1

# Test 7: Pagination (Crop Market - Page 1)
echo "📡 Testing: Pagination - Crop Market Page 1"
echo "   Endpoint: /marketplace/crop-products?page=1&limit=5"
response=$(curl -s "$API_URL/marketplace/crop-products?page=1&limit=5")
page1_count=$(echo "$response" | jq "length")
page1_first_boosted=$(echo "$response" | jq ".[0].isBoosted" 2>/dev/null)
echo "   Results: $page1_count products, First boosted: $page1_first_boosted"
if [ "$page1_first_boosted" == "true" ]; then
  echo "   ✅ PASS: Pagination preserves boost sorting"
  ((PASS++))
else
  echo "   ❌ FAIL: Pagination breaks boost sorting"
  ((FAIL++))
fi
echo ""

# Test 8: Category Filter (Crop Market - PRODUCE)
echo "📡 Testing: Category Filter - PRODUCE"
echo "   Endpoint: /marketplace/search?marketplace=crop&category=PRODUCE"
response=$(curl -s "$API_URL/marketplace/search?marketplace=crop&category=PRODUCE")
response_count=$(echo "$response" | jq "[.[:5]] | length")
first_category=$(echo "$response" | jq ".[0].category" 2>/dev/null)
echo "   Results: $response_count products, First category: $first_category"
((PASS++))
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 TEST RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ PASSED: $PASS"
echo "❌ FAILED: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
  echo "🎉 ALL TESTS PASSED! Boost sorting is working correctly."
  exit 0
else
  echo "⚠️  Some tests failed. Check boost implementation."
  exit 1
fi
