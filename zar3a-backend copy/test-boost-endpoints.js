import 'dotenv/config';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  try {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🧪 TESTING PREMIUM BOOST DISPLAY');
    console.log('═══════════════════════════════════════════════════════════\n');

    // Test 1: /market/products endpoint
    console.log('📡 Test 1: GET /market/products\n');
    try {
      const response = await axios.get(`${BASE_URL}/market/products`);
      const products = response.data.slice(0, 10);
      
      console.log('First 10 products (should show boosted first):\n');
      products.forEach((product, idx) => {
        const boosted = product.isBoosted ? '⭐ BOOSTED' : '  regular';
        console.log(`${idx + 1}. [${boosted}] "${product.title}" (ID: ${product.id})`);
      });
      
      const boostedCount = products.filter(p => p.isBoosted).length;
      console.log(`\n✅ Found ${boostedCount} boosted products in top 10\n`);
    } catch (err) {
      console.error('❌ Error:', err.response?.status, err.response?.data || err.message);
    }

    // Test 2: /marketplace/crop-products endpoint
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📡 Test 2: GET /marketplace/crop-products\n');
    try {
      const response = await axios.get(`${BASE_URL}/marketplace/crop-products`);
      const products = response.data.slice(0, 10);
      
      console.log('First 10 Crop Market products (should show boosted first):\n');
      products.forEach((product, idx) => {
        const boosted = product.isBoosted ? '⭐ BOOSTED' : '  regular';
        console.log(`${idx + 1}. [${boosted}] "${product.title}" (ID: ${product.id})`);
      });
      
      const boostedCount = products.filter(p => p.isBoosted).length;
      console.log(`\n✅ Found ${boostedCount} boosted products in top 10\n`);
    } catch (err) {
      console.error('❌ Error:', err.response?.status, err.response?.data || err.message);
    }

    // Test 3: /marketplace/agri-products endpoint
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📡 Test 3: GET /marketplace/agri-products\n');
    try {
      const response = await axios.get(`${BASE_URL}/marketplace/agri-products`);
      const products = response.data.slice(0, 10);
      
      console.log('First 10 Agri Shop products (should show boosted first):\n');
      products.forEach((product, idx) => {
        const boosted = product.isBoosted ? '⭐ BOOSTED' : '  regular';
        console.log(`${idx + 1}. [${boosted}] "${product.title}" (ID: ${product.id})`);
      });
      
      const boostedCount = products.filter(p => p.isBoosted).length;
      console.log(`\n✅ Found ${boostedCount} boosted products in top 10\n`);
    } catch (err) {
      console.error('❌ Error:', err.response?.status, err.response?.data || err.message);
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ TESTS COMPLETE');
    console.log('═══════════════════════════════════════════════════════════\n');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

testEndpoints();
