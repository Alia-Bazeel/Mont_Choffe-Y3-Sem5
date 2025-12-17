/* 1. SELECT ELEMENTS */
const toggleLink = document.getElementById('toggleLink');       // link to toggle login/signup
const toggleText = document.getElementById('toggleText');       // text before toggle link
const formTitle = document.getElementById('formTitle');         // form heading (Login / Sign Up)
const authBtn = document.getElementById('authBtn');             // submit button
const nameInput = document.getElementById('name');              // name field (for signup)
const authForm = document.getElementById('authForm');           // login/signup form
const errorMessage = document.getElementById('errorMessage');   // error message display
const statusMessage = document.getElementById('status-message'); // for Google login status

let isLogin = true; // true = login mode, false = signup mode

/* 2. TOGGLE LOGIN / SIGNUP FORM */
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();          
    isLogin = !isLogin;

    if(isLogin){
        formTitle.textContent = 'Login';
        authBtn.textContent = 'Login';
        nameInput.style.display = 'none';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign Up';
    } else {
        formTitle.textContent = 'Sign Up';
        authBtn.textContent = 'Sign Up';
        nameInput.style.display = 'block';
        toggleText.textContent = "Already have an account?";
        toggleLink.textContent = 'Login';
    }

    errorMessage.textContent = ''; 
});

/* 3. EMAIL/PASSWORD LOGIN & SIGNUP */
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const name = document.getElementById('name').value.trim();

    if (isLogin) {
        // --- LOGIN FLOW ---
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token); 
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('Login successful!');
                window.location.href = 'index.html';
            } else {
                errorMessage.textContent = data.error;
            }

        } catch (error) {
            console.error(error);
            errorMessage.textContent = 'Server error. Try again later.';
        }

    } else {
        // --- SIGN UP FLOW ---
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Sign Up successful! Please login.');
                toggleLink.click(); 
            } else {
                errorMessage.textContent = data.error;
            }

        } catch (error) {
            console.error(error);
            errorMessage.textContent = 'Server error. Try again later.';
        }
    }
});

/* 4. GOOGLE LOGIN */
function handleCredentialResponse(response) {
    const idToken = response.credential;

    statusMessage.innerHTML = 'Received Google token. Verifying...';
    statusMessage.style.color = 'blue';

    // Send Google ID token to backend to get your JWT
    fetch('/api/users/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
    })
    .then(res => res.json())
    .then(data => {
        if (data.jwt) {
            localStorage.setItem('token', data.jwt); // backend JWT
            localStorage.setItem('user', JSON.stringify(data.user));
            statusMessage.innerHTML = 'Google login successful!';
            statusMessage.style.color = 'green';
            window.location.href = 'index.html'; // redirect to dashboard
        } else {
            statusMessage.innerHTML = 'Google login failed.';
            statusMessage.style.color = 'red';
        }
    })
    .catch(err => {
        console.error(err);
        statusMessage.innerHTML = 'Server error. Try again later.';
        statusMessage.style.color = 'red';
    });
}

// Make sure Google button callback is registered
window.handleCredentialResponse = handleCredentialResponse;
