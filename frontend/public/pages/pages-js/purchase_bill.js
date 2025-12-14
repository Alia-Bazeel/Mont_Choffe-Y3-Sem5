// ================================
// CHECKOUT PAGE SCRIPT (checkout.js)
// ================================

document.addEventListener("DOMContentLoaded", () => {

    const orderSection = document.getElementById("orderSection");
    const cart = JSON.parse(localStorage.getItem("montCart")) || [];

    // -----------------------------
    // RENDER CHECKOUT
    // -----------------------------
    function renderCheckout() {

        if (!cart.length) {
            orderSection.innerHTML = `
                <div class="empty-note">
                    <p>Your cart is empty.</p>
                    <p><a href="products.html">Go to Products</a></p>
                </div>`;
            return;
        }

        let subtotal = 0;

        let itemsHTML = cart.map(item => {
            subtotal += item.price * item.qty;
            return `
                <li>
                    <div>
                        <strong>${item.name}</strong><br>
                        Qty: ${item.qty}
                    </div>
                    <div>
                        ${(item.price * item.qty).toFixed(2)} د.إ
                    </div>
                </li>`;
        }).join("");

        const tax = subtotal * 0.05;
        const total = subtotal + tax;

        orderSection.innerHTML = `
            <ul class="order-items">${itemsHTML}</ul>

            <div class="customer-box">
                <h2>Customer Details</h2>

                <div class="form-row">
                    <input type="text" id="custName" placeholder="Full Name">
                    <input type="tel" id="custPhone" placeholder="Phone Number">
                </div>

                <input type="email" id="custEmail" placeholder="Email" style="margin-top:10px; width:100%;">

                <div class="address-choice">
                    <label>
                        <input type="radio" name="addressType" value="auto" checked>
                        Use my current location
                    </label>
                    <label>
                        <input type="radio" name="addressType" value="manual">
                        Enter manually
                    </label>
                </div>

                <button id="detectLocationBtn" class="loc-btn">📍 Detect My Location</button>

                <textarea id="autoAddress" placeholder="Detected address will appear here" readonly></textarea>

                <div id="manualAddress" style="display:none;">
                    <textarea id="manualAddrText" placeholder="Enter delivery address"></textarea>
                </div>
            </div>

            <div>
                <div class="bill-row">
                    <span>Subtotal</span><span>${subtotal.toFixed(2)} د.إ</span>
                </div>
                <div class="bill-row">
                    <span>Tax (5%)</span><span>${tax.toFixed(2)} د.إ</span>
                </div>
                <div class="bill-row">
                    <span>Total</span><span>${total.toFixed(2)} د.إ</span>
                </div>

                <button id="placeOrderBtn" class="place-order">
                    Place Order
                </button>
            </div>
        `;
    }

    // -----------------------------
    // EVENT DELEGATION (IMPORTANT)
    // -----------------------------
    orderSection.addEventListener("click", (e) => {

        // Place order
        if (e.target.id === "placeOrderBtn") {
            const name = document.getElementById("custName").value.trim();
            const phone = document.getElementById("custPhone").value.trim();

            if (!name || !phone) {
                alert("Please enter name and phone number.");
                return;
            }

            localStorage.removeItem("montCart");

            orderSection.innerHTML = `
                <div style="text-align:center; padding:25px;">
                    <h2>Order Placed Successfully 🎉</h2>
                    <p>We will contact you shortly.</p>
                    <a href="products.html">Continue Shopping</a>
                </div>`;
        }

        // Detect location
        if (e.target.id === "detectLocationBtn") {
            const autoBox = document.getElementById("autoAddress");
            autoBox.value = "Detecting location...";

            setTimeout(() => {
                autoBox.value = "Sharjah, UAE (sample detected address)";
            }, 1200);
        }
    });

    // -----------------------------
    // ADDRESS TOGGLE
    // -----------------------------
    orderSection.addEventListener("change", (e) => {

        if (e.target.name === "addressType") {
            const manualBox = document.getElementById("manualAddress");
            const autoBox = document.getElementById("autoAddress");
            const detectBtn = document.getElementById("detectLocationBtn");

            if (e.target.value === "manual") {
                manualBox.style.display = "block";
                autoBox.style.display = "none";
                detectBtn.style.display = "none";
            } else {
                manualBox.style.display = "none";
                autoBox.style.display = "block";
                detectBtn.style.display = "inline-block";
            }
        }
    });

    // -----------------------------
    // INIT
    // -----------------------------
    renderCheckout();

});
