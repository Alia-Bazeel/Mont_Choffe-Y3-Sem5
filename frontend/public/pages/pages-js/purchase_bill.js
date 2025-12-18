// ================================
// CHECKOUT PAGE SCRIPT (checkout.js)
// ================================

document.addEventListener("DOMContentLoaded", () => {

    const orderSection = document.getElementById("orderSection");
    const cart = JSON.parse(localStorage.getItem("montCart")) || [];

    // -----------------------------
    // LOGIN CHECK
    // -----------------------------
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        // Redirect to login if not logged in, with return to checkout
        window.location.href = `login.html?redirect=${encodeURIComponent(window.location.href)}`;
        return; // stop further execution
    }

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

        const itemsHTML = cart.map(item => {
            subtotal += item.price * item.qty;
            return `
                <li>
                    <div>
                        <strong>${item.name}</strong><br>
                        Qty: ${item.qty}
                    </div>
                    <div>${(item.price * item.qty).toFixed(2)} د.إ</div>
                </li>`;
        }).join("");

        const tax = subtotal * 0.05;
        const total = subtotal + tax;

        orderSection.innerHTML = `
            <ul class="order-items">${itemsHTML}</ul>

            <div class="customer-box">
                <h2>Customer Details</h2>

                <div class="form-row">
                    <input type="text" id="custName" placeholder="Full Name" value="${user.name || ''}">
                    <input type="tel" id="custPhone" placeholder="Phone Number">
                </div>

                <input type="email" id="custEmail" placeholder="Email" style="margin-top:10px;width:100%;" value="${user.email || ''}">

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

                <button id="detectLocationBtn" class="loc-btn">Detect My Location</button>

                <textarea id="autoAddress" placeholder="Detected address will appear here" readonly></textarea>

                <div id="mapPreview" style="display:none;margin-top:12px;border-radius:10px;overflow:hidden;border:1px solid #ddd;">
                    <iframe id="mapFrame" width="100%" height="180" style="border:0" loading="lazy"></iframe>
                </div>

                <div id="manualAddress" style="display:none;">
                    <textarea id="manualAddrText" placeholder="Enter delivery address"></textarea>
                </div>
            </div>

            <div>
                <div class="bill-row"><span>Subtotal</span><span>${subtotal.toFixed(2)} د.إ</span></div>
                <div class="bill-row"><span>Tax (5%)</span><span>${tax.toFixed(2)} د.إ</span></div>
                <div class="bill-row"><span>Total</span><span>${total.toFixed(2)} د.إ</span></div>

                <button id="placeOrderBtn" class="place-order">Place Order</button>
            </div>
        `;
    }

    // -----------------------------
    // EVENT DELEGATION
    // -----------------------------
    orderSection.addEventListener("click", (e) => {

        // PLACE ORDER
        if (e.target.id === "placeOrderBtn") {
            const name = document.getElementById("custName").value.trim();
            const phone = document.getElementById("custPhone").value.trim();

            if (!name || !phone) {
                alert("Please enter name and phone number.");
                return;
            }

            localStorage.removeItem("montCart");

            orderSection.innerHTML = `
                <div style="text-align:center;padding:25px;">
                    <h2>Order Placed Successfully</h2>
                    <p>We will contact you shortly.</p>
                    <a href="products.html">Continue Shopping</a>
                </div>`;
            emailjs.send("SERVICE_ID", "TEMPLATE_ID", {
                customer_name: name,
                customer_phone: phone,
                customer_email: document.getElementById("custEmail").value,
                order_total: total.toFixed(2),
                delivery_address: selectedAddress
            });
        }

        // DETECT LOCATION
        if (e.target.id === "detectLocationBtn") {

            const autoBox = document.getElementById("autoAddress");
            const mapPreview = document.getElementById("mapPreview");
            const mapFrame = document.getElementById("mapFrame");

            autoBox.value = "Requesting location permission...";

            if (!navigator.geolocation) {
                autoBox.value = "Geolocation not supported by browser.";
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    // Map preview
                    mapFrame.src =
                        `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01}%2C${lat-0.01}%2C${lon+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lon}`;
                    mapPreview.style.display = "block";

                    autoBox.value = "Detecting address...";

                    // Reverse Geocoding (OpenStreetMap – FREE)
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                        .then(res => res.json())
                        .then(data => {
                            const addr = data.address || {};
                            autoBox.value = `
${addr.road || ""} ${addr.house_number || ""}
${addr.suburb || ""}
${addr.city || addr.town || addr.village || ""}
${addr.state || ""}
${addr.postcode || ""}
${addr.country || ""}
                            `.replace(/\n+/g, ", ").replace(/,\s*,/g, ",").trim();
                        })
                        .catch(() => {
                            autoBox.value = "Unable to fetch address.";
                        });
                },
                () => {
                    autoBox.value = "Location permission denied.";
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    });

    // -----------------------------
    // ADDRESS TOGGLE
    // -----------------------------
    orderSection.addEventListener("change", (e) => {
        if (e.target.name === "addressType") {
            document.getElementById("manualAddress").style.display =
                e.target.value === "manual" ? "block" : "none";

            document.getElementById("autoAddress").style.display =
                e.target.value === "auto" ? "block" : "none";

            document.getElementById("detectLocationBtn").style.display =
                e.target.value === "auto" ? "inline-block" : "none";
        }
    });

    // -----------------------------
    // INIT
    // -----------------------------
    renderCheckout();

});
