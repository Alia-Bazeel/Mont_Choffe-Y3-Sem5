// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    console.log("Purchase Bill page loaded");

    // Select elements
    const orderSection = document.getElementById("orderSection");

    // Debug: Check if element exists
    if (!orderSection) {
        console.error("orderSection element not found!");
        return;
    }

    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem("montCart")) || [];
    console.log("Cart items:", cart.length, cart);

    // Get logged-in user token & info
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    console.log("User:", user);
    console.log("Token:", token ? "Exists" : "Missing");

    /* =========================================
        CHECK LOGIN STATUS
    ========================================== */
    if (!user || !token) {
        console.log("User not logged in, redirecting...");
        // Redirect to login page
        const currentPath = window.location.pathname;
        window.location.href = `login.html?redirect=${encodeURIComponent(currentPath)}`;
        return;
    }

    /* =========================================
        RENDER ORDER SUMMARY
    ========================================== */
    function renderOrderSummary() {
        console.log("Rendering order summary...");

        if (!cart.length) {
            orderSection.innerHTML = `
                <div class="empty-note">
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
            subtotal += (item.price || 0) * (item.qty || 1);
        });
        const tax = subtotal * 0.05;
        const shipping = subtotal > 200 ? 0 : 25;
        const total = subtotal + tax + shipping;

        // Create items HTML
        const itemsHTML = cart.map(item => `
            <li>
                <span>${item.name || 'Unknown Product'} × ${item.qty || 1}</span>
                <span>${((item.price || 0) * (item.qty || 1)).toFixed(2)} د.إ</span>
            </li>
        `).join("");

        // Create order summary HTML
        orderSection.innerHTML = `
            <!-- Customer Information -->
            <div class="customer-box">
                <h3>Customer Information</h3>
                <div class="address-choice">
                    <button class="loc-btn" onclick="useCurrentLocation()">
                        <i class="fas fa-location-dot"></i> Use Current Location
                    </button>
                    <button class="loc-btn" onclick="fillSavedAddress()">
                        <i class="fas fa-bookmark"></i> Use Saved Address
                    </button>
                </div>
                <div class="form-row">
                    <input type="text" id="shippingName" placeholder="Full Name" 
                        value="${user.name || ''}" required>
                    <input type="tel" id="shippingPhone" placeholder="Phone Number" 
                        value="${user.phone || ''}" required>
                </div>
                <textarea id="shippingAddress" placeholder="Full Address (Street, Building, Apartment)" 
                    rows="3" required></textarea>
                <div class="form-row">
                    <input type="text" id="shippingCity" placeholder="City" required>
                    <input type="text" id="shippingCountry" placeholder="Emirate" value="UAE" required>
                    <input type="text" id="shippingPostal" placeholder="Postal Code">
                </div>
            </div>

            <!-- Order Items -->
            <div class="order-items-box">
                <h3>Order Items (${cart.length})</h3>
                <ul class="order-items">${itemsHTML}</ul>
            </div>

            <!-- Order Totals -->
            <div class="bill-totals">
                <div class="bill-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)} د.إ</span>
                </div>
                <div class="bill-row">
                    <span>Tax (5%)</span>
                    <span>${tax.toFixed(2)} د.إ</span>
                </div>
                <div class="bill-row">
                    <span>Shipping</span>
                    <span>${shipping === 0 ? 'FREE' : shipping.toFixed(2) + ' د.إ'}</span>
                </div>
                <div class="bill-row" style="border-top: 2px solid #C48A2A; font-size: 1.2em;">
                    <span>Total</span>
                    <span>${total.toFixed(2)} د.إ</span>
                </div>
            </div>

            <!-- Payment Method -->
            <div class="payment-box">
                <h3>Payment Method</h3>
                <div class="address-choice">
                    <label style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                        <input type="radio" name="payment" value="cash" checked> 
                        <div>
                            <strong>Cash on Delivery</strong>
                            <div style="font-size: 0.9em; color: #666;">Pay when you receive your order</div>
                        </div>
                    </label>
                    <label style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                        <input type="radio" name="payment" value="card"> 
                        <div>
                            <strong>Credit/Debit Card</strong>
                            <div style="font-size: 0.9em; color: #666;">Pay securely online</div>
                        </div>
                    </label>
                </div>
            </div>

            <!-- Confirm Order Button -->
            <button id="confirmOrderBtn" class="place-order">
                <i class="fas fa-check-circle"></i> Confirm Order
            </button>

            <div style="text-align: center; margin-top: 20px;">
                <a href="products.html" style="color: #4B2E2E; text-decoration: none;">
                    ← Continue Shopping
                </a>
            </div>
        `;

        // Add event listener to confirm button
        const confirmBtn = document.getElementById("confirmOrderBtn");
        if (confirmBtn) {
            confirmBtn.addEventListener("click", processOrder);
        }

        // Try to fill saved address if exists
        fillSavedAddress();
    }

    // Helper function to fill saved address
    function fillSavedAddress() {
        const savedAddress = localStorage.getItem("userAddress");
        if (savedAddress) {
            try {
                const address = JSON.parse(savedAddress);
                document.getElementById("shippingAddress").value = address.fullAddress || "";
                document.getElementById("shippingCity").value = address.city || "";
                document.getElementById("shippingCountry").value = address.emirate || "UAE";
                document.getElementById("shippingPostal").value = address.postalCode || "";
            } catch (e) {
                console.log("No saved address found");
            }
        }
    }

    // Helper function to use current location
    function useCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    alert("Location fetched! Please enter your address details.");
                    // You could reverse geocode here or just inform the user
                },
                (error) => {
                    alert("Unable to get location. Please enter manually.");
                }
            );
        } else {
            alert("Geolocation not supported by your browser");
        }
    }

    // Make functions globally available for onclick events
    window.useCurrentLocation = useCurrentLocation;
    window.fillSavedAddress = fillSavedAddress;

    async function processOrder() {
        try {
            console.log("Processing order...");

            // Get values from form
            const shippingName = document.getElementById("shippingName")?.value.trim();
            const shippingPhone = document.getElementById("shippingPhone")?.value.trim();
            const shippingAddress = document.getElementById("shippingAddress")?.value.trim();
            const shippingCity = document.getElementById("shippingCity")?.value.trim();
            const shippingEmirate = document.getElementById("shippingCountry")?.value.trim();
            const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cash';

            // Validate required fields
            if (!shippingName || !shippingPhone || !shippingAddress || !shippingCity || !shippingEmirate) {
                alert("Please fill in all shipping information.");
                return;
            }

            if (!cart.length) {
                alert("Your cart is empty.");
                return;
            }

            console.log("Cart items:", cart);

            // Calculate totals
            let totalAmount = 0;
            const items = cart.map(item => {
                const itemTotal = (item.price || 0) * (item.qty || 1);
                totalAmount += itemTotal;

                // IMPORTANT: Match backend schema exactly
                return {
                    name: item.name,  // Required by backend
                    price: item.price, // Required by backend
                    quantity: item.qty, // Required by backend
                    // Optional fields - only include if they exist in your cart items
                    ...(item._id && { product: item._id }),
                    ...(item.image && { image: item.image }),
                    ...(item.message && { cardMessage: item.message })
                };
            });

            // Build order object EXACTLY as backend expects
            const orderData = {
                items: items,
                totalAmount: totalAmount, // Just the number, no .toFixed()
                customerInfo: {
                    fullName: shippingName,
                    email: user.email || "customer@example.com",
                    phone: shippingPhone
                },
                deliveryInfo: {
                    address: shippingAddress,
                    city: shippingCity,
                    emirate: shippingEmirate,
                    deliveryDate: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
                    deliveryTime: "2-4 Business Days" // Fixed string
                },
                paymentMethod: paymentMethod === 'cash' ? 'cod' : paymentMethod
                // Note: 'user' field is added by backend from token
            };

            console.log("Sending order data:", orderData);

            // Disable button while processing
            const confirmBtn = document.getElementById("confirmOrderBtn");
            if (confirmBtn) {
                confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                confirmBtn.disabled = true;
            }

            // Get fresh token from localStorage
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found. Please login again.");
            }

            // Make the request
            const response = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const responseText = await response.text();
            console.log("Response status:", response.status);
            console.log("Response text:", responseText);

            if (!response.ok) {
                let errorMsg = `Server error: ${response.status}`;
                try {
                    const errorData = JSON.parse(responseText);
                    errorMsg = errorData.message || errorMsg;
                } catch (e) {
                    // Not JSON response
                }
                throw new Error(errorMsg);
            }

            const result = JSON.parse(responseText);
            console.log("✅ Order success:", result);

            // Clear cart from localStorage
            localStorage.removeItem("montCart");

            // Update cart count in header
            const headerCartCount = document.getElementById("headerCartCount");
            if (headerCartCount) {
                headerCartCount.style.display = 'none';
                headerCartCount.textContent = '0';
            }

            // Store order in localStorage for history
            const userOrders = JSON.parse(localStorage.getItem("userOrders") || "[]");
            userOrders.push({
                ...orderData,
                orderNumber: result.order?.orderNumber,
                _id: result.order?._id,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem("userOrders", JSON.stringify(userOrders));

            // Redirect to success page
            const orderNumber = result.order?.orderNumber || result.orderNumber;
            alert(`✅ Order placed successfully!\nOrder Number: ${orderNumber}`);
            window.location.href = `order-confirmation.html?orderNumber=${orderNumber}`;

        } catch (error) {
            console.error("❌ Order processing error:", error);

            if (error.message.includes("401") || error.message.includes("token")) {
                alert("Session expired. Please login again.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "login.html";
                return;
            }

            alert(`Error: ${error.message}`);

            // Re-enable button
            const confirmBtn = document.getElementById("confirmOrderBtn");
            if (confirmBtn) {
                confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm Order';
                confirmBtn.disabled = false;
            }
        }
    }

    /* =========================================
        ADDITIONAL STYLES
    ========================================== */
    function addAdditionalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .order-items-box {
                background: #fafafa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            
            .order-items-box h3 {
                margin-bottom: 15px;
                color: #4B2E2E;
            }
            
            .bill-totals {
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                border: 1px solid #eee;
                margin: 20px 0;
            }
            
            .payment-box {
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                border: 1px solid #eee;
                margin: 20px 0;
            }
            
            .payment-box h3 {
                margin-bottom: 15px;
                color: #4B2E2E;
            }
            
            .place-order {
                width: 100%;
                padding: 16px;
                border-radius: 12px;
                border: none;
                background: linear-gradient(135deg, #C48A2A, #a56e1f);
                color: white;
                font-weight: 800;
                cursor: pointer;
                font-size: 1.1rem;
                margin-top: 20px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .place-order:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(196, 138, 42, 0.3);
            }
            
            .place-order:disabled {
                background: #ccc;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            
            .loc-btn {
                padding: 10px 16px;
                border-radius: 8px;
                border: none;
                background: #4B2E2E;
                color: #fff;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background 0.3s;
            }
            
            .loc-btn:hover {
                background: #3a231f;
            }
            
            input[type="radio"] {
                margin-right: 8px;
            }
        `;
        document.head.appendChild(style);
    }

    /* =========================================
        INITIALIZE
    ========================================== */
    renderOrderSummary();
    addAdditionalStyles();

    // Add event listener for page visibility change (in case user comes back)
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            // Check if cart was modified
            const currentCart = JSON.parse(localStorage.getItem("montCart")) || [];
            if (currentCart.length !== cart.length) {
                location.reload(); // Reload to reflect changes
            }
        }
    });

});