// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// API Helper Functions
const API = {
    // Generic request function
    async request(endpoint, method = 'GET', data = null) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = getToken();
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            
            // Handle response
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = 'login.html';
                }
                const error = await response.json();
                throw new Error(error.message || `Request failed with status ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    },

    // Auth endpoints
    async login(email, password) {
        return this.request('/auth/login', 'POST', { email, password });
    },

    async register(name, email, password) {
        return this.request('/auth/register', 'POST', { name, email, password });
    },

    async getCurrentUser() {
        return this.request('/auth/me');
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../index.html';
    },

    // Product endpoints
    async getProducts(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return this.request(`/products?${params}`);
    },

    async getProductById(id) {
        return this.request(`/products/${id}`);
    },

    // Order endpoints
    async createOrder(orderData) {
        return this.request('/orders', 'POST', orderData);
    },

    async getMyOrders() {
        return this.request('/orders/my-orders');
    },

    // Contact endpoints
    async sendContactMessage(contactData) {
        return this.request('/contact', 'POST', contactData);
    },

    // Career endpoints (special handling for file upload)
    async submitCareerApplication(formData) {
        const token = getToken();
        const headers = {};
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/career/apply`, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Application failed');
        }

        return await response.json();
    }
};

// Export API
window.API = API;