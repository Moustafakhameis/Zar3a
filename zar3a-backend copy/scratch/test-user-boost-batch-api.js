import axios from 'axios';

const BASE_URL = 'http://localhost:5002';

async function runTest() {
  try {
    // 1. Log in
    console.log('1. Attempting login...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    const token = loginRes.data.accessToken;
    console.log('✅ Logged in successfully.');

    // 2. Create two test products
    console.log('\n2. Creating two test products...');
    const p1 = await axios.post(`${BASE_URL}/marketplace/crop-products`, {
      title: 'Batch Boost Test Product 1',
      description: 'Temporary product',
      category: 'produce',
      price: 150,
      unit: 'kg',
      region: 'Giza',
      productSource: 'manual'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const p2 = await axios.post(`${BASE_URL}/marketplace/crop-products`, {
      title: 'Batch Boost Test Product 2',
      description: 'Temporary product',
      category: 'produce',
      price: 200,
      unit: 'kg',
      region: 'Giza',
      productSource: 'manual'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const productIds = [p1.data.id, p2.data.id];
    console.log('✅ Created product IDs:', productIds);

    // 3. Trigger batch boost via /marketplace/products/boost-batch
    console.log(`\n3. Triggering batch boost for IDs: ${productIds}...`);
    const boostRes = await axios.post(`${BASE_URL}/marketplace/products/boost-batch`, { productIds }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Boost API Response:', boostRes.data);

    // 4. Verify in the database by fetching product details
    console.log(`\n4. Fetching product details to verify...`);
    const getRes1 = await axios.get(`${BASE_URL}/marketplace/products/${productIds[0]}`);
    const getRes2 = await axios.get(`${BASE_URL}/marketplace/products/${productIds[1]}`);

    console.log('Product 1 from DB:', {
      id: getRes1.data.id,
      isBoosted: getRes1.data.isBoosted,
      boostExpiryDate: getRes1.data.boostExpiryDate
    });
    console.log('Product 2 from DB:', {
      id: getRes2.data.id,
      isBoosted: getRes2.data.isBoosted,
      boostExpiryDate: getRes2.data.boostExpiryDate
    });

    if ((getRes1.data.isBoosted === true || getRes1.data.isBoosted === 1) && 
        (getRes2.data.isBoosted === true || getRes2.data.isBoosted === 1)) {
      console.log('✅ SUCCESS: Both products are correctly marked as boosted in the database!');
    } else {
      console.error('❌ FAILURE: Products are NOT marked as boosted in the database.');
    }

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
