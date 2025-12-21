const axios = require('axios');

const API_URL = 'http://localhost:5001';

async function runTest() {
    try {
        console.log('--- STARTING VERIFICATION ---');

        // 1. Register Users
        console.log('\n[1] Registering Users...');
        const adminRes = await axios.post(`${API_URL}/user/add`, { name: 'Admin', email: `admin+${Date.now()}@test.com`, password: 'password', role: 'admin' });
        const sellerRes = await axios.post(`${API_URL}/user/add`, { name: 'Seller', email: `seller+${Date.now()}@test.com`, password: 'password', role: 'seller' });
        const userRes = await axios.post(`${API_URL}/user/add`, { name: 'User', email: `user+${Date.now()}@test.com`, password: 'password', role: 'user' });

        console.log('Users Registered.');

        // 2. Login
        console.log('\n[2] Logging In...');
        const loginSeller = await axios.post(`${API_URL}/user/authenicate`, { email: sellerRes.data.email, password: 'password' });
        const sellerToken = loginSeller.data.token;
        const loginUser = await axios.post(`${API_URL}/user/authenicate`, { email: userRes.data.email, password: 'password' });
        const userToken = loginUser.data.token;

        console.log('Logged in.');

        // 3. Seller Adds Product
        console.log('\n[3] Seller Adding Product...');
        const productRes = await axios.post(`${API_URL}/product/add`, {
            name: 'Test Product',
            price: 100,
            stock: 10,
            category: 'Testing'
        }, { headers: { 'x-auth-token': sellerToken } });
        const productId = productRes.data._id;
        console.log('Product Added:', productId);

        // 4. User Searches Product
        console.log('\n[4] User Searching Product...');
        const searchRes = await axios.get(`${API_URL}/product/getall?search=Test`);
        console.log(`Found ${searchRes.data.products.length} products matching 'Test'`);

        // 5. User Adds Review
        console.log('\n[5] User Adding Review...');
        await axios.post(`${API_URL}/review/add`, {
            product: productId,
            rating: 5,
            comment: 'Great product!'
        }, { headers: { 'x-auth-token': userToken } });
        console.log('Review Added.');

        // 6. User Creates Order
        console.log('\n[6] User Creating Order...');
        await axios.post(`${API_URL}/order/create`, {
            products: [{ product: productId, quantity: 2 }],
            totalAmount: 200,
            shippingAddress: { city: 'Test City' }
        }, { headers: { 'x-auth-token': userToken } });
        console.log('Order Created.');

        console.log('\n--- VERIFICATION SUCCESSFUL ---');

    } catch (err) {
        console.error('--- VERIFICATION FAILED ---');
        if (err.response) {
            console.error(err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

runTest();
