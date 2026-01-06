// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    
    // Select elements
    const orderSection = document.getElementById("orderSection");
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem("montCart")) || [];
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    
    /* =========================================
        CHECK LOGIN STATUS
    ========================================== */
    if (!user) {
        // Redirect to login
        const currentPath = window.location.pathname;
        window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
        return;
    }
    
    /* =========================================
        RENDER ORDER SUMMARY
    ========================================== */
    function renderOrderSummary() {
        if (!cart.length) {
            orderSection.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Add some products to your cart first!</p>
                    <a href="products.html" class="back-to-shop">← Back to Products</a>
                </div>
            `;
            return;
        }
        
        // Calculate totals
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.qty;
        });
        
        const tax = subtotal * 0.05; // 5% tax
        const shipping = subtotal > 200 ? 0 : 25; // Free shipping over 200 AED
        const total = subtotal + tax + shipping;
        
        // Create order items HTML
        const itemsHTML = cart.map(item => `
            <li class="order-item">
                <span class="item-name">${item.name} × ${item.qty}</span>
                <span class="item-price">${(item.price * item.qty).toFixed(2)} د.إ</span>
            </li>
        `).join("");
        
        // Render complete order summary
        orderSection.innerHTML = `
            <div class="order-summary">
                <h2>Order Summary</h2>
                
                <div class="customer-info">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${user.name || 'Not provided'}</p>
                    <p><strong>Email:</strong> ${user.email || 'Not provided'}</p>
                    
                    <div class="address-form">
                        <h4>Shipping Address</h4>
                        <input type="text" id="shippingName" placeholder="Full Name" value="${user.name || ''}">
                        <input type="tel" id="shippingPhone" placeholder="Phone Number" required>
                        <textarea id="shippingAddress" placeholder="Full Address" rows="3" required></textarea>
                        <input type="text" id="shippingCity" placeholder="City" required>
                        <input type="text" id="shippingCountry" placeholder="Country" value="UAE" required>
                    </div>
                </div>
                
                <div class="order-items">
                    <h3>Order Items</h3>
                    <ul>${itemsHTML}</ul>
                </div>
                
                <div class="order-totals">
                    <div class="total-row">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)} د.إ</span>
                    </div>
                    <div class="total-row">
                        <span>Tax (5%)</span>
                        <span>${tax.toFixed(2)} د.إ</span>
                    </div>
                    <div class="total-row">
                        <span>Shipping</span>
                        <span>${shipping === 0 ? 'FREE' : shipping.toFixed(2) + ' د.إ'}</span>
                    </div>
                    <div class="total-row total">
                        <span>Total</span>
                        <span>${total.toFixed(2)} د.إ</span>
                    </div>
                </div>
                
                <div class="payment-methods">
                    <h3>Payment Method</h3>
                    <div class="payment-options">
                        <label>
                            <input type="radio" name="payment" value="cash" checked>
                            Cash on Delivery
                        </label>
                        <label>
                            <input type="radio" name="payment" value="card">
                            Credit/Debit Card
                        </label>
                    </div>
                </div>
                
                <button id="confirmOrderBtn" class="confirm-order-btn">
                    Confirm Order
                </button>
                
                <a href="products.html" class="back-to-shop">← Continue Shopping</a>
            </div>
        `;
        
        // Add event listener to confirm button
        const confirmBtn = document.getElementById("confirmOrderBtn");
        if (confirmBtn) {
            confirmBtn.addEventListener("click", processOrder);
        }
    }
    
    /* =========================================
        PROCESS ORDER
    ========================================== */
    async function processOrder() {
        // Get form values
        const shippingName = document.getElementById("shippingName")?.value.trim();
        const shippingPhone = document.getElementById("shippingPhone")?.value.trim();
        const shippingAddress = document.getElementById("shippingAddress")?.value.trim();
        const shippingCity = document.getElementById("shippingCity")?.value.trim();
        const shippingCountry = document.getElementById("shippingCountry")?.value.trim();
        const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
        
        // Validate shipping info
        if (!shippingName || !shippingPhone || !shippingAddress || !shippingCity || !shippingCountry) {
            alert("Please fill in all shipping information.");
            return;
        }
        
        // Calculate totals again
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.qty;
        });
        
        const tax = subtotal * 0.05;
        const shipping = subtotal > 200 ? 0 : 25;
        const total = subtotal + tax + shipping;
        
        try {
            // Prepare order data
            const orderData = {
                items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.qty
                })),
                totalAmount: total,
                shippingAddress: {
                    name: shippingName,
                    phone: shippingPhone,
                    email: user.email,
                    address: shippingAddress,
                    city: shippingCity,
                    country: shippingCountry
                },
                paymentMethod: paymentMethod || 'cash'
            };
            
            // Show loading
            const confirmBtn = document.getElementById("confirmOrderBtn");
            if (confirmBtn) {
                confirmBtn.textContent = "Processing...";
                confirmBtn.disabled = true;
            }
            
            // In a real app, you would call API here:
            // const result = await API.createOrder(orderData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Clear cart
            localStorage.removeItem("montCart");
            
            // Show success message
            orderSection.innerHTML = `
                <div class="order-success">
                    <div class="success-icon">✓</div>
                    <h2>Order Confirmed!</h2>
                    <p>Thank you for your order, ${user.name}!</p>
                    <p>Your order has been received and is being processed.</p>
                    <p>Order Total: <strong>${total.toFixed(2)} د.إ</strong></p>
                    <p>A confirmation email has been sent to ${user.email}</p>
                    <div class="success-actions">
                        <a href="products.html" class="btn">Continue Shopping</a>
                        <a href="../index.html" class="btn">Back to Home</a>
                    </div>
                </div>
            `;
            
        } catch (error) {
            console.error("Order processing error:", error);
            alert("Failed to process order. Please try again.");
            
            // Reset button
            const confirmBtn = document.getElementById("confirmOrderBtn");
            if (confirmBtn) {
                confirmBtn.textContent = "Confirm Order";
                confirmBtn.disabled = false;
            }
        }
    }
    
    /* =========================================
        INITIALIZE
    ========================================== */
    renderOrderSummary();
    
    // Add CSS for this page
    const style = document.createElement('style');
    style.textContent = `
        .order-summary {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .order-summary h2 {
            color: #4B2E2E;
            margin-bottom: 30px;
            font-family: 'Josefin Sans', sans-serif;
        }
        
        .customer-info, .order-items, .order-totals, .payment-methods {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        
        .customer-info h3, .order-items h3, .payment-methods h3 {
            color: #4B2E2E;
            margin-bottom: 15px;
        }
        
        .address-form {
            margin-top: 20px;
        }
        
        .address-form input,
        .address-form textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-family: inherit;
        }
        
        .order-items ul {
            list-style: none;
            padding: 0;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .total-row.total {
            font-weight: bold;
            font-size: 1.2em;
            color: #4B2E2E;
            border-bottom: none;
        }
        
        .payment-options label {
            display: block;
            margin-bottom: 10px;
            cursor: pointer;
        }
        
        .confirm-order-btn {
            width: 100%;
            padding: 15px;
            background: #C48A2A;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .confirm-order-btn:hover {
            background: #a56e1f;
        }
        
        .back-to-shop {
            display: inline-block;
            margin-top: 20px;
            color: #4B2E2E;
            text-decoration: none;
        }
        
        .empty-cart, .order-success {
            text-align: center;
            padding: 50px 20px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .success-icon {
            font-size: 60px;
            color: #4CAF50;
            margin-bottom: 20px;
        }
        
        .order-success h2 {
            color: #4B2E2E;
            margin-bottom: 20px;
        }
        
        .success-actions {
            margin-top: 30px;
        }
        
        .success-actions .btn {
            display: inline-block;
            margin: 10px;
            padding: 10px 20px;
            background: #4B2E2E;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
    `;
    
    document.head.appendChild(style);
});