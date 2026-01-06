import { authAPI, productsAPI, ordersAPI } from './api.js';

// Check if user is admin
async function checkAdmin() {
    try {
        const user = await authAPI.getCurrentUser();
        if (user.role !== 'admin') {
            window.location.href = 'index.html';
        }
        return user;
    } catch (error) {
        window.location.href = 'login.html?redirect=admin.html';
        throw error;
    }
}

// DOM Elements
const productsList = document.getElementById('productsList');
const ordersList = document.getElementById('ordersList');
const messagesList = document.getElementById('messagesList');
const applicationsList = document.getElementById('applicationsList');
const addProductBtn = document.getElementById('addProductBtn');
const refreshProductsBtn = document.getElementById('refreshProductsBtn');
const orderFilter = document.getElementById('orderFilter');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const closeModal = document.querySelector('.close-modal');

let currentAdmin = null;

// Initialize
async function init() {
    try {
        currentAdmin = await checkAdmin();
        loadProducts();
        loadOrders();
        // loadMessages(); // To be implemented
        // loadApplications(); // To be implemented
    } catch (error) {
        console.error('Admin initialization failed:', error);
    }
}

// Product Management
async function loadProducts() {
    try {
        const products = await productsAPI.getAll();
        renderProducts(products);
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

function renderProducts(products) {
    productsList.innerHTML = products.map(product => `
        <div class="admin-item" data-id="${product._id}">
            <div class="admin-item-header">
                <h4>${product.name} - ${product.price.toFixed(2)} د.إ</h4>
                <div class="admin-item-actions">
                    <button class="action-btn edit-product" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-product" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p>${product.description}</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <span class="status-badge">${product.category}</span>
                <span class="status-badge">Stock: ${product.stock}</span>
                ${product.featured ? '<span class="status-badge" style="background: #ff6f61;">Featured</span>' : ''}
            </div>
        </div>
    `).join('');

    // Attach event listeners
    document.querySelectorAll('.edit-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('.admin-item').dataset.id;
            editProduct(productId);
        });
    });

    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('.admin-item').dataset.id;
            deleteProduct(productId);
        });
    });
}

async function editProduct(productId) {
    try {
        const product = await productsAPI.getById(productId);
        
        document.getElementById('productId').value = product._id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productImage').value = product.image || '';
        document.getElementById('productFeatured').checked = product.featured;
        
        document.getElementById('modalTitle').textContent = 'Edit Product';
        productModal.style.display = 'flex';
    } catch (error) {
        console.error('Failed to load product:', error);
        alert('Failed to load product details');
    }
}

async function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await productsAPI.delete(productId);
            loadProducts();
            alert('Product deleted successfully');
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product');
        }
    }
}

// Order Management
async function loadOrders() {
    try {
        const orders = await ordersAPI.getAll();
        renderOrders(orders);
    } catch (error) {
        console.error('Failed to load orders:', error);
    }
}

function renderOrders(orders) {
    const filterValue = orderFilter.value;
    const filteredOrders = filterValue === 'all' 
        ? orders 
        : orders.filter(order => order.status === filterValue);

    ordersList.innerHTML = filteredOrders.map(order => `
        <div class="admin-item" data-id="${order._id}">
            <div class="admin-item-header">
                <h4>Order #${order._id.slice(-8)} - ${order.user?.name || 'Guest'}</h4>
                <div class="admin-item-actions">
                    <select class="status-select" data-order-id="${order._id}">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </div>
            </div>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)} د.إ</p>
            <p><strong>Items:</strong> ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}</p>
            <p><strong>Shipping:</strong> ${order.shippingAddress?.address || 'N/A'}</p>
            <span class="status-badge status-${order.status}">${order.status}</span>
        </div>
    `).join('');

    // Attach status change listeners
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const orderId = e.target.dataset.orderId;
            const newStatus = e.target.value;
            
            try {
                await ordersAPI.updateStatus(orderId, newStatus);
                alert('Order status updated');
                loadOrders();
            } catch (error) {
                console.error('Failed to update order status:', error);
                alert('Failed to update order status');
                e.target.value = orders.find(o => o._id === orderId)?.status || 'pending';
            }
        });
    });
}

// Product Form
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value) || 100,
        image: document.getElementById('productImage').value || undefined,
        featured: document.getElementById('productFeatured').checked
    };

    const productId = document.getElementById('productId').value;

    try {
        if (productId) {
            // Update existing product
            await productsAPI.update(productId, productData);
            alert('Product updated successfully');
        } else {
            // Create new product
            await productsAPI.create(productData);
            alert('Product created successfully');
        }
        
        productModal.style.display = 'none';
        productForm.reset();
        loadProducts();
    } catch (error) {
        console.error('Failed to save product:', error);
        alert('Failed to save product');
    }
});

// Event Listeners
addProductBtn.addEventListener('click', () => {
    document.getElementById('productId').value = '';
    document.getElementById('modalTitle').textContent = 'Add New Product';
    productForm.reset();
    productModal.style.display = 'flex';
});

refreshProductsBtn.addEventListener('click', loadProducts);
orderFilter.addEventListener('change', loadOrders);

closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});

// Initialize admin panel
init();