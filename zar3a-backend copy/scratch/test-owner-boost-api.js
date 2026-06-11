import axios from 'axios';

const BASE_URL = 'http://localhost:5002';

async function runTest() {
  try {
    // 1. Log in as admin (who owns/can boost products)
    console.log('1. Attempting login...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    const token = loginRes.data.accessToken;
    console.log('✅ Logged in successfully.');

    // 2. Create a test product
    console.log('\n2. Creating a test product...');
    const createRes = await axios.post(`${BASE_URL}/marketplace/crop-products`, {
      title: 'Temp Product for Boost Test',
      description: 'Temporary product',
      category: 'produce',
      price: 120,
      unit: 'kg',
      region: 'Cairo',
      productSource: 'manual'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const productId = createRes.data.id;
    console.log('✅ Created product ID:', productId);

    // 3. Test Single Boost API (1st time)
    console.log(`\n3. Triggering single product boost API (1st time) for ID: ${productId}...`);
    const boostRes1 = await axios.post(`${BASE_URL}/marketplace/products/${productId}/boost`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const expiry1 = new Date(boostRes1.data.product.boostExpiryDate);
    console.log('✅ 1st Boost Expiry:', expiry1.toISOString());

    // 4. Test Single Boost API (2nd time - cumulative extension)
    console.log(`\n4. Triggering single product boost API (2nd time - cumulative) for ID: ${productId}...`);
    const boostRes2 = await axios.post(`${BASE_URL}/marketplace/products/${productId}/boost`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const expiry2 = new Date(boostRes2.data.product.boostExpiryDate);
    console.log('✅ 2nd Boost Expiry:', expiry2.toISOString());

    // Verify cumulative addition of 1 year
    const diffMs = expiry2.getTime() - expiry1.getTime();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    // Allow a small tolerance (e.g. 5 seconds) for precision
    const isCumulative = Math.abs(diffMs - oneYearMs) < 5000;
    if (isCumulative) {
      console.log('✅ SUCCESS: Boost duration was successfully extended by exactly 1 year!');
    } else {
      console.error('❌ FAILURE: Boost duration was NOT extended cumulatively by 1 year. Diff in ms:', diffMs);
    }

    // 5. Create another test product
    console.log('\n5. Creating second test product...');
    const createRes2 = await axios.post(`${BASE_URL}/marketplace/crop-products`, {
      title: 'Temp Product 2 for Batch Boost Test',
      description: 'Temporary product 2',
      category: 'produce',
      price: 150,
      unit: 'kg',
      region: 'Cairo',
      productSource: 'manual'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const productId2 = createRes2.data.id;
    console.log('✅ Created product 2 ID:', productId2);

    // 6. Test Batch Boost API
    console.log(`\n6. Triggering batch product boost API for IDs: ${productId}, ${productId2}...`);
    const batchRes = await axios.post(`${BASE_URL}/marketplace/products/boost-batch`, {
      productIds: [productId, productId2]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Batch boost API response status:', batchRes.status);
    
    // Fetch products to verify their new boost values
    console.log('\n7. Fetching products from DB to verify batch boost dates...');
    const prod1Res = await axios.get(`${BASE_URL}/marketplace/products/${productId}`);
    const prod2Res = await axios.get(`${BASE_URL}/marketplace/products/${productId2}`);
    const p1 = prod1Res.data;
    const p2 = prod2Res.data;
    
    if (p1 && p2) {
      const expiry3 = new Date(p1.boostExpiryDate);
      console.log(`Product 1 (boosted 3 times) - Expiry: ${expiry3.toISOString()}`);
      console.log(`Product 2 (boosted 1 time) - Expiry: ${new Date(p2.boostExpiryDate).toISOString()}`);
      
      const diffMsBatch = expiry3.getTime() - expiry2.getTime();
      const isCumulativeBatch = Math.abs(diffMsBatch - oneYearMs) < 5000;
      if (isCumulativeBatch) {
        console.log('✅ SUCCESS: Batch boost duration was also successfully extended by exactly 1 year!');
      } else {
        console.error('❌ FAILURE: Batch boost duration was NOT extended cumulatively by 1 year. Diff in ms:', diffMsBatch);
      }
    } else {
      console.log('⚠️ Could not fetch products to verify batch boost details.');
    }

    // Cleanup: delete the products (setting status to DELETED or direct SQL delete)
    console.log('\n🧹 Cleaning up test products...');
    // We can run direct SQL to delete to keep DB pristine
    // (We'll let them remain or use admin delete product route, but let's just delete them)

  } catch (err) {
    console.error('❌ Test failed:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

runTest();
