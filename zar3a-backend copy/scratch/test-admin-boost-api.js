import axios from 'axios';

const BASE_URL = 'http://localhost:5002';

async function runTest() {
  try {
    // 1. Log in as admin
    console.log('1. Attempting login as admin...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    const token = loginRes.data.accessToken;
    console.log('✅ Logged in successfully.');

    // 2. Create a test product
    console.log('\n2. Creating a test product for Admin Boost...');
    const createRes = await axios.post(`${BASE_URL}/marketplace/crop-products`, {
      title: 'Temp Product for Admin Boost Test',
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

    // 3. Admin boost product (1st time - default expiry)
    console.log(`\n3. Triggering default admin boost (1st time) for ID: ${productId}...`);
    const boostRes1 = await axios.post(`${BASE_URL}/admin/products/${productId}/boost`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const expiry1 = new Date(boostRes1.data.product.boostExpiryDate);
    console.log('✅ 1st Boost Expiry:', expiry1.toISOString());

    // 4. Admin boost product (2nd time - default cumulative expiry)
    console.log(`\n4. Triggering default admin boost (2nd time - cumulative) for ID: ${productId}...`);
    const boostRes2 = await axios.post(`${BASE_URL}/admin/products/${productId}/boost`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const expiry2 = new Date(boostRes2.data.product.boostExpiryDate);
    console.log('✅ 2nd Boost Expiry:', expiry2.toISOString());

    const diffMs = expiry2.getTime() - expiry1.getTime();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    const isCumulative = Math.abs(diffMs - oneYearMs) < 5000;
    if (isCumulative) {
      console.log('✅ SUCCESS: Admin boost default duration was extended by exactly 1 year!');
    } else {
      console.error('❌ FAILURE: Admin boost default duration was NOT extended by 1 year. Diff:', diffMs);
    }

    // 5. Admin boost with custom date
    const customDateString = '2030-05-15T12:00:00.000Z';
    console.log(`\n5. Setting explicit custom boost date: ${customDateString}...`);
    const boostRes3 = await axios.post(`${BASE_URL}/admin/products/${productId}/boost`, {
      boostExpiryDate: customDateString
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const expiry3 = new Date(boostRes3.data.product.boostExpiryDate);
    console.log('✅ Custom Boost Expiry set to:', expiry3.toISOString());
    if (Math.abs(expiry3.getTime() - new Date(customDateString).getTime()) < 1000) {
      console.log('✅ SUCCESS: Explicit boostExpiryDate was correctly set.');
    } else {
      console.error('❌ FAILURE: Explicit boostExpiryDate was NOT set correctly.');
    }

    // 6. Admin boost product (4th time - default cumulative on top of custom date)
    console.log(`\n6. Triggering default admin boost on top of custom date for ID: ${productId}...`);
    const boostRes4 = await axios.post(`${BASE_URL}/admin/products/${productId}/boost`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const expiry4 = new Date(boostRes4.data.product.boostExpiryDate);
    console.log('✅ Post-custom Cumulative Boost Expiry:', expiry4.toISOString());

    const diffMsCustom = expiry4.getTime() - expiry3.getTime();
    const isCumulativeCustom = Math.abs(diffMsCustom - oneYearMs) < 5000;
    if (isCumulativeCustom) {
      console.log('✅ SUCCESS: Admin boost successfully extended the custom date by exactly 1 year!');
    } else {
      console.error('❌ FAILURE: Admin boost did NOT extend the custom date cumulatively. Diff:', diffMsCustom);
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
