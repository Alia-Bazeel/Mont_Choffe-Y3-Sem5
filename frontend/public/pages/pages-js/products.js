// Wait until DOM loads
document.addEventListener("DOMContentLoaded", () => {
    
    // --- ELEMENTS ---
    const productsGrid = document.getElementById("productsGrid");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const headerSearch = document.getElementById("headerSearch");
    const headerSearchBtn = document.getElementById("headerSearchBtn");
    
    // Cart elements
    const cartPanel = document.getElementById("cartPanel");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const closeCartBtn = document.getElementById("closeCart");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const headerCartBtn = document.getElementById("headerCartBtn");
    const headerCartCount = document.getElementById("headerCartCount");
    
    // State
    let cart = JSON.parse(localStorage.getItem("montCart")) || [];

    /* =========================================
        1) API: LOAD PRODUCTS (CRUD - Read)
    ========================================== */
    async function loadProducts() {
        try {
            // Ensure this matches your backend URL
            const response = await fetch('http://localhost:3000/api/products');
            const products = await response.json();
            
            if (!productsGrid) return;
            productsGrid.innerHTML = ""; 

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = "product-card";
                card.dataset.category = product.category;
                
                card.innerHTML = `
                    <div class="product-img">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <h3>${product.name}</h3>
                    <p class="product-desc">${product.description || ''}</p>
                    <p class="product-price">${product.price.toFixed(2)} د.إ</p>
                    <button class="add-cart" data-name="${product.name}" data-price="${product.price}">
                        Add to Cart
                    </button>
                    
                    ${checkIfAdmin() ? `
                        <div class="admin-controls" style="margin-top:10px; border-top:1px solid #eee; padding-top:10px; display:flex; gap:5px; justify-content:center;">
                            <button onclick="deleteProduct(${product.id})" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-weight:bold; flex:1;">Delete</button>
                        </div>
                    ` : ''}
                `;
                productsGrid.appendChild(card);
            });

            // Re-bind listeners for the newly created buttons
            initAddToCartButtons();
        } catch (err) {
            console.error("Backend Error:", err);
            if(productsGrid) {
                productsGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align:center; padding: 50px;">
                        <p>Unable to connect to the server.</p>
                        <p><small>Make sure your backend is running at http://localhost:3000</small></p>
                    </div>`;
            }
        }
    }

    // Helper to check user role from localStorage
    function checkIfAdmin() {
        const userData = localStorage.getItem('user');
        if (!userData) return false;
        const user = JSON.parse(userData);
        return user.role === 'admin'; 
    }

    /* =========================================
        2) SEARCH & FILTER
    ========================================== */
    function initSearchAndFilter() {
        // Category Filter Logic
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const category = btn.dataset.filter;
                
                document.querySelectorAll(".product-card").forEach(card => {
                    const cardCat = card.dataset.category;
                    card.style.display = (category === "all" || cardCat === category) ? "flex" : "none";
                });
            });
        });

        // Search Execution
        const executeSearch = () => {
            const query = headerSearch.value.toLowerCase().trim();
            document.querySelectorAll(".product-card").forEach(card => {
                const name = card.querySelector("h3").textContent.toLowerCase();
                const desc = card.querySelector(".product-desc").textContent.toLowerCase();
                card.style.display = (name.includes(query) || desc.includes(query)) ? "flex" : "none";
            });
        };

        if (headerSearch) headerSearch.addEventListener("input", executeSearch);
        if (headerSearchBtn) headerSearchBtn.addEventListener("click", executeSearch);
    }

    /* =========================================
        3) CART PANEL UI
    ========================================== */
    function openCart() {
        cartPanel.classList.add("open");
        cartOverlay.classList.add("active");
        renderCart();
    }
    
    function closeCart() {
        cartPanel.classList.remove("open");
        cartOverlay.classList.remove("active");
    }

    if (headerCartBtn) headerCartBtn.addEventListener("click", openCart);
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

    /* =========================================
        4) CART LOGIC
    ========================================== */
    function initAddToCartButtons() {
        const addBtns = document.querySelectorAll(".add-cart");
        addBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                addToCart(name, price);
                
                // Visual Feedback
                const originalText = btn.textContent;
                btn.textContent = "Added!";
                btn.style.backgroundColor = "#4CAF50";
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = "";
                }, 1000);
            });
        });
    }

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ name, price, qty: 1 });
        }
        saveCart();
        renderCart();
        updateHeaderBadge();
    }

    function saveCart() {
        localStorage.setItem("montCart", JSON.stringify(cart));
    }

    function renderCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = "";
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<li style="text-align:center; padding:20px;">Your cart is empty</li>';
        }

        cart.forEach((item, index) => {
            total += (item.price * item.qty);
            const li = document.createElement("li");
            li.className = "cart-item";
            li.style.borderBottom = "1px solid #eee";
            li.style.padding = "10px 0";
            li.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${item.qty} × ${item.price.toFixed(2)} د.إ</small>
                    </div>
                    <div style="text-align:right">
                        <div style="font-weight:bold;">${(item.price * item.qty).toFixed(2)} د.إ</div>
                        <div style="display:flex; gap:10px; margin-top:5px; justify-content: flex-end;">
                             <button onclick="changeQty(${index}, -1)" style="cursor:pointer; padding:2px 6px;">-</button>
                             <button onclick="changeQty(${index}, 1)" style="cursor:pointer; padding:2px 6px;">+</button>
                             <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer; font-size:12px; margin-left:5px;">Remove</button>
                        </div>
                    </div>
                </div>`;
            cartItemsContainer.appendChild(li);
        });
        if (cartTotal) cartTotal.innerText = total.toFixed(2);
    }

    function updateHeaderBadge() {
        if (!headerCartCount) return;
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        headerCartCount.textContent = count;
        headerCartCount.style.display = count > 0 ? "inline-block" : "none";
    }

    /* =========================================
        5) GLOBAL CART FUNCTIONS (Attached to window)
    ========================================== */
    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        saveAndRefresh();
    };

    window.changeQty = (index, delta) => {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        saveAndRefresh();
    };

    function saveAndRefresh() {
        saveCart();
        renderCart();
        updateHeaderBadge();
    }

    /* =========================================
        6) CHECKOUT
    ========================================== */
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            if (cart.length === 0) return alert("Your cart is empty!");
            window.location.href = "purchase_bill.html";
        });
    }

    // --- INITIALIZE PAGE ---
    async function init() {
        await loadProducts(); 
        initSearchAndFilter();
        updateHeaderBadge();
        renderCart();
    }
    init();
});

/* =========================================
    7) DELETE PRODUCT (CRUD - Delete)
========================================= */
async function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
        try {
            const res = await fetch(`http://localhost:3000/api/products/${id}`, { 
                method: 'DELETE',
                headers: {
                    // Include token if your backend requires it
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                alert("Product deleted successfully.");
                window.location.reload();
            } else {
                alert("Failed to delete product. Check your permissions.");
            }
        } catch (err) {
            alert("Error connecting to server. Is the backend running?");
        }
    }
}