/* 1. SELECT ELEMENTS */
const BACKEND_URL = 'http://localhost:3000';
const toggleLink = document.getElementById('toggleLink');       
const toggleText = document.getElementById('toggleText');       
const formTitle = document.getElementById('formTitle');         
const authBtn = document.getElementById('authBtn');             
const nameInput = document.getElementById('name');              
const authForm = document.getElementById('authForm');           
const errorMessage = document.getElementById('errorMessage');   
const statusMessage = document.getElementById('status-message'); 

let isLogin = true;

/* 1a. GET REDIRECT PARAM */
const urlParams = new URLSearchParams(window.location.search);
const redirectTo = urlParams.get('redirect') || localStorage.getItem('previousPage') || '../index.html';

/* 2. TOGGLE LOGIN / SIGNUP FORM */
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;

    if(isLogin){
        formTitle.textContent = 'Login';
        authBtn.textContent = 'Login';
        nameInput.style.display = 'none';
        nameInput.value = ''; // clear signup-only field
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
    
    // Validate inputs
    if (!email || !password) {
        errorMessage.textContent = 'Please fill in all fields';
        return;
    }
    
    if (!isLogin && !name) {
        errorMessage.textContent = 'Name is required for sign up';
        return;
    }

    try {
        let response;
        
        if (isLogin) {
            // Login request
            response = await API.login(email, password);
        } else {
            // Register request
            response = await API.register(name, email, password);
        }

        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Show success message
        if (isLogin) {
            alert('Login successful!');
        } else {
            alert('Sign Up successful! Please login.');
            toggleLink.click(); // Switch back to login
            return;
        }

        // Redirect
        window.location.href = redirectTo;
        
    } catch (error) {
        console.error('Auth error:', error);
        errorMessage.textContent = error.message || 'Authentication failed. Please try again.';
    }
});

/* 4. GOOGLE LOGIN */
function handleCredentialResponse(response) {
    const idToken = response.credential;
    
    statusMessage.innerHTML = 'Google login coming soon...';
    statusMessage.style.color = 'blue';
    
    // For now, just show a message
    alert('Google login will be implemented in future version. Please use email/password login.');
    
    // FOR Future USE --> send this to your backend:
    // fetch(`${API_BASE_URL}/api/auth/google-auth`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ token: idToken })
    // })
    // .then(res => res.json())
    // .then(data => {
    //     if (data.jwt) {
    //         localStorage.setItem('token', data.jwt);
    //         localStorage.setItem('user', JSON.stringify(data.user));
    //         window.location.href = redirectTo;
    //     }
    // })
    // .catch(err => console.error(err));
}

window.handleCredentialResponse = handleCredentialResponse;