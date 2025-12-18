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

/* 1a. GET REDIRECT PARAM */
const urlParams = new URLSearchParams(window.location.search);
const redirectTo = urlParams.get('redirect') || localStorage.getItem('previousPage') || 'index.html';

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

    try {
        let res, data;

        if (isLogin) {
            res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
        } else {
            res = await fetch('/api/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
        }

        data = await res.json();

        if (res.ok) {
            if (isLogin) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                alert('Login successful!');
            } else {
                alert('Sign Up successful! Please login.');
                toggleLink.click();
                return;
            }
            // Redirect to the page specified in query param or previous page
            window.location.href = redirectTo;
        } else {
            errorMessage.textContent = data.error || 'Something went wrong';
        }

    } catch (err) {
        console.error(err);
        errorMessage.textContent = 'Server error. Try again later.';
    }
});

/* 4. GOOGLE LOGIN */
function handleCredentialResponse(response) {
    const idToken = response.credential;

    statusMessage.innerHTML = 'Verifying Google token...';
    statusMessage.style.color = 'blue';

    fetch('/api/users/google-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken })
    })
    .then(res => res.json())
    .then(data => {
        if (data.jwt) {
            localStorage.setItem('token', data.jwt);
            localStorage.setItem('user', JSON.stringify(data.user));
            statusMessage.innerHTML = 'Google login successful!';
            statusMessage.style.color = 'green';
            window.location.href = redirectTo;
        } else {
            statusMessage.innerHTML = data.error || 'Google login failed';
            statusMessage.style.color = 'red';
        }
    })
    .catch(err => {
        console.error(err);
        statusMessage.innerHTML = 'Server error. Try again later.';
        statusMessage.style.color = 'red';
    });
}

/* 5. REGISTER GOOGLE CALLBACK */
window.handleCredentialResponse = handleCredentialResponse;
