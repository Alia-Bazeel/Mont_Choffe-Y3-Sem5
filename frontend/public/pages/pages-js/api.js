const API_BASE_URL = "http://localhost:3000/api";

/* =========================================
    USER AUTHENTICATION
========================================= */

// Register new user
async function registerUser(name, email, password) {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    } catch (err) {
        console.error('Register error:', err);
        throw err;
    }
}

// Login user
async function loginUser(email, password) {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    } catch (err) {
        console.error('Login error:', err);
        throw err;
    }
}

// Logout
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

/* =========================================
    PRODUCTS
========================================= */

// Get all products
async function getAllProducts() {
    try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Fetch products error:', err);
        throw err;
    }
}

// Get single product by ID
async function getProductById(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        return await res.json();
    } catch (err) {
        console.error('Fetch product error:', err);
        throw err;
    }
}

/* =========================================
    ORDERS
========================================= */

// Place a new order
async function placeOrder(orderData) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('You must be logged in');

    try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to place order');
        return data;
    } catch (err) {
        console.error('Place order error:', err);
        throw err;
    }
}

// Get orders of logged-in user
async function getUserOrders() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('You must be logged in');

    try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Fetch user orders error:', err);
        throw err;
    }
}

/* =========================================
    ADMIN FUNCTIONS
========================================= */

// Get all users (admin only)
async function getAllUsers() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('You must be logged in');

    try {
        const res = await fetch(`${API_BASE_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
        return data;
    } catch (err) {
        console.error('Fetch users error:', err);
        throw err;
    }
}

// Admin: create product
async function createProduct(productData) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('You must be logged in');

    try {
        const res = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create product');
        return data;
    } catch (err) {
        console.error('Create product error:', err);
        throw err;
    }
}

// Admin: update product
async function updateProduct(id, productData) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('You must be logged in');

    try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update product');
        return data;
    } catch (err) {
        console.error('Update product error:', err);
        throw err;
    }
}

// Admin: delete product
async function deleteProduct(id) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('You must be logged in');

    try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete product');
        return data;
    } catch (err) {
        console.error('Delete product error:', err);
        throw err;
    }
}
