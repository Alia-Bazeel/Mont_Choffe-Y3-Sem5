/* 1. SELECT ELEMENTS */
const toggleLink = document.getElementById('toggleLink');       
const toggleText = document.getElementById('toggleText');       
const formTitle = document.getElementById('formTitle');         
const authBtn = document.getElementById('authBtn');             
const nameInput = document.getElementById('name');              
const authForm = document.getElementById('authForm');           
const errorMessage = document.getElementById('errorMessage');   
const statusMessage = document.getElementById('status-message'); 

let isLogin = true;

// DEBUG
console.log('=== MONT CHOFFE LOGIN DEBUG ===');
console.log('API Base URL:', API_BASE_URL);

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
        nameInput.value = '';
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

/* 3. DIRECT AUTH REQUEST FUNCTION */
async function makeAuthRequest(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            throw new Error(responseData.message || `HTTP ${response.status}`);
        }
        
        return responseData;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

/* 4. EMAIL/PASSWORD LOGIN & SIGNUP */
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMITTED ===');
    console.log('Mode:', isLogin ? 'LOGIN' : 'SIGNUP');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const name = document.getElementById('name').value.trim();
    
    // Validate inputs
    if (!email || !password) {
        errorMessage.textContent = 'Please fill in all fields';
        errorMessage.style.color = 'red';
        return;
    }
    
    if (!isLogin && !name) {
        errorMessage.textContent = 'Name is required for sign up';
        errorMessage.style.color = 'red';
        return;
    }

    // Clear previous errors and show loading
    errorMessage.textContent = '';
    errorMessage.style.color = 'red';
    const originalBtnText = authBtn.textContent;
    authBtn.textContent = 'Processing...';
    authBtn.disabled = true;

    try {
        let response;
        
        if (isLogin) {
            // Login request
            console.log('Attempting login...');
            response = await API.login(email, password);
        } else {
            // Register request
            console.log('Attempting registration...');
            response = await API.register(name, email, password);
        }

        console.log('Auth response:', response);
        
        // Check if response has success property
        if (response.success === false) {
            throw new Error(response.message || 'Authentication failed');
        }
        
        // Store token and user data
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            console.log('Token stored successfully');
            console.log('User data stored:', response.user);
        } else {
            throw new Error('No authentication token received from server');
        }

        // Show success message
        errorMessage.textContent = isLogin ? 'Login successful! Redirecting...' : 'Account created successfully!';
        errorMessage.style.color = 'green';
        
        // Redirect or switch form
        if (isLogin) {
            setTimeout(() => {
                console.log('Redirecting to:', redirectTo);
                window.location.href = redirectTo;
            }, 1500);
        } else {
            // For signup, switch to login form
            setTimeout(() => {
                toggleLink.click();
                document.getElementById('email').value = email;
                document.getElementById('password').value = '';
                errorMessage.textContent = 'Account created! Please login with your new account';
                errorMessage.style.color = 'blue';
            }, 1500);
        }
        
    } catch (error) {
        console.error('Auth error:', error);
        
        // User-friendly error messages
        let userMessage = error.message;
        
        if (error.message.includes('Failed to fetch')) {
            userMessage = 'Cannot connect to server. Make sure: 1) Backend is running (check terminal) 2) MongoDB is running 3) Server is on http://localhost:3000';
        } else if (error.message.includes('already exists')) {
            userMessage = 'An account with this email already exists. Please login instead.';
        } else if (error.message.includes('Invalid credentials')) {
            userMessage = 'Invalid email or password. Please try again.';
        }
        
        errorMessage.textContent = userMessage;
        errorMessage.style.color = 'red';
        
    } finally {
        // Reset button
        authBtn.textContent = originalBtnText;
        authBtn.disabled = false;
    }
});

/* 5. TEST BACKEND CONNECTION ON LOAD */
window.addEventListener('load', async () => {
    console.log('Testing backend connection...');
    
    try {
        const response = await fetch('http://localhost:3000/api/health');
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Backend connection OK:', data);
        
        statusMessage.textContent = 'Connected to server ✓';
        statusMessage.style.color = 'green';
        
        // Pre-fill test credentials for development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            document.getElementById('email').value = 'test@example.com';
            document.getElementById('password').value = 'test123';
        }
        
    } catch (error) {
        console.error('Backend connection failed:', error);
        statusMessage.innerHTML = `
            <span style="color: red;">Cannot connect to backend server</span>
            <div style="font-size: 0.9rem; margin-top: 10px; text-align: left;">
                <strong>Troubleshooting steps:</strong>
                <ol style="margin-left: 20px;">
                    <li>Open terminal in <code>backend/</code> folder</li>
                    <li>Run <code>npm start</code></li>
                    <li>Check if MongoDB is running</li>
                    <li>Make sure .env file has JWT_SECRET</li>
                </ol>
            </div>
        `;
        
        // Create test account button
        const testBtn = document.createElement('button');
        testBtn.textContent = 'Create Test Account';
        testBtn.style.cssText = 'background: #C48A2A; color: white; border: none; padding: 10px; margin-top: 10px; border-radius: 5px; cursor: pointer; font-family: inherit;';
        testBtn.onclick = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: 'Test User',
                        email: 'test@montchoffe.com',
                        password: 'test123'
                    })
                });
                const data = await res.json();
                if (data.success) {
                    alert('Test account created! Use: test@montchoffe.com / test123');
                    document.getElementById('email').value = 'test@montchoffe.com';
                    document.getElementById('password').value = 'test123';
                } else {
                    alert('Failed: ' + data.message);
                }
            } catch (err) {
                alert('Failed to create test account: ' + err.message);
            }
        };
        
        statusMessage.appendChild(testBtn);
    }
});

/* 6. GOOGLE LOGIN - TEMPORARILY DISABLED */
function handleCredentialResponse(response) {
    alert('Google login coming soon. Please use email/password for now.');
}

window.handleCredentialResponse = handleCredentialResponse;

/* 7. CHECK IF USER IS ALREADY LOGGED IN */
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        console.log('User already logged in');
        // redirect to homepage
        // window.location.href = '../index.html';
    }
});