import axios from 'axios';

const BASE_URL = 'http://localhost:5002';

async function runTest() {
  try {
    // 1. Log in as admin or farmer
    console.log('1. Attempting login as farmer/owner...');
    // Let's log in as a farmer. We need a farmer user's credentials. Or we can login as admin since admin has permission too.
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    const token = loginRes.data.accessToken;
    console.log('✅ Logged in successfully.');

    // 2. Create a test product
    console.log('\n2. Creating a test product...');
    const createRes = await axios.post(`${BASE_URL}/marketplace/crop-products`, {
      title: 'User Boost Test Product',
      description: 'Temporary product',
      category: 'produce',
      price: 150,
      unit: 'kg',
      region: 'Giza',
      productSource: 'manual'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const productId = createRes.data.id;
    console.log('✅ Created product ID:', productId);

    // 3. Trigger user boost via /marketplace/products/:productId/boost
    console.log(`\n3. Triggering user boost for ID: ${productId}...`);
    const boostRes = await axios.post(`${BASE_URL}/marketplace/products/${productId}/boost`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Boost API Response:', boostRes.data);

    // 4. Verify in the database by fetching the product details
    console.log(`\n4. Fetching product details to verify...`);
    const getRes = await axios.get(`${BASE_URL}/marketplace/products/${productId}`);
    console.log('Product from DB:', {
      id: getRes.data.id,
      title: getRes.data.title,
      isBoosted: getRes.data.isBoosted,
      boostExpiryDate: getRes.data.boostExpiryDate
    });

    if (getRes.data.isBoosted === true || getRes.data.isBoosted === 1) {
      console.log('✅ SUCCESS: Product is correctly marked as boosted in the database!');
    } else {
      console.error('❌ FAILURE: Product is NOT marked as boosted in the database.');
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
