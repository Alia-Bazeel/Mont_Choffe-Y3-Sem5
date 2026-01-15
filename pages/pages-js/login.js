let isLogin = true;

const form = document.getElementById("authForm");
const formTitle = document.getElementById("formTitle");
const authBtn = document.getElementById("authBtn");
const toggleText = document.getElementById("toggleText");
const toggleLink = document.getElementById("toggleLink");
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const statusMessage = document.getElementById("status-message");
const errorMessage = document.getElementById("errorMessage");

/* 🔁 TOGGLE LOGIN / SIGNUP */
toggleLink.addEventListener("click", function (e) {
    e.preventDefault();
    isLogin = !isLogin;

    if (isLogin) {
        formTitle.textContent = "Login";
        authBtn.textContent = "Login";
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = "Sign Up";
        nameField.style.display = "none";
    } else {
        formTitle.textContent = "Sign Up";
        authBtn.textContent = "Sign Up";
        toggleText.textContent = "Already have an account?";
        toggleLink.textContent = "Login";
        nameField.style.display = "block";
    }

    errorMessage.textContent = "";
    statusMessage.textContent = "";
});

/* 🧠 HANDLE FORM SUBMIT */
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const name = nameField.value.trim();

    // Validate fields
    if (isLogin) {
        // Login validation
        if (!email || !password) {
            errorMessage.textContent = "Please fill all required fields.";
            return;
        }
    } else {
        // Signup validation
        if (!email || !password || !name) {
            errorMessage.textContent = "Please fill all required fields.";
            return;
        }
    }

    errorMessage.textContent = "";

    if (isLogin) {
        // 🔹 LOGIN
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                errorMessage.textContent = data.message || "Login failed.";
                return;
            }

            // Save token and user info
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            statusMessage.textContent = "Login successful 🎉";

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1000);
        } catch (err) {
            errorMessage.textContent = "An error occurred. Please try again.";
            console.error(err);
        }
    } else {
        // 🔹 SIGNUP
        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password,
                })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                errorMessage.textContent = data.message || "Signup failed.";
                return;
            }

            // Store token and user in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            statusMessage.textContent = "Signup successful 🎉";

            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1000);

        } catch (err) {
            errorMessage.textContent = "An error occurred. Please try again.";
            console.error(err);
        }
    }

    form.reset();
});