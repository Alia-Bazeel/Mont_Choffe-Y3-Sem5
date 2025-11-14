/* ------------------------------
    1. SELECT ELEMENTS
------------------------------ */
const toggleLink = document.getElementById('toggleLink');       // link to toggle login/signup
const toggleText = document.getElementById('toggleText');       // text before toggle link
const formTitle = document.getElementById('formTitle');         // form heading (Login / Sign Up)
const authBtn = document.getElementById('authBtn');             // submit button
const nameInput = document.getElementById('name');              // name field (for signup)
const authForm = document.getElementById('authForm');           // login/signup form
const errorMessage = document.getElementById('errorMessage');   // error message display

let isLogin = true; // true = login mode, false = signup mode

/* ------------------------------
    2. TOGGLE LOGIN / SIGNUP FORM
------------------------------ */
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();          // prevent default anchor behavior
    isLogin = !isLogin;          // toggle mode

    if(isLogin){
        // --- SWITCH TO LOGIN ---
        formTitle.textContent = 'Login';
        authBtn.textContent = 'Login';
        nameInput.style.display = 'none';
        toggleText.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign Up';
    } else {
        // --- SWITCH TO SIGN UP ---
        formTitle.textContent = 'Sign Up';
        authBtn.textContent = 'Sign Up';
        nameInput.style.display = 'block';
        toggleText.textContent = "Already have an account?";
        toggleLink.textContent = 'Login';
    }

    errorMessage.textContent = ''; // clear any previous errors
});

/* ------------------------------
    3. LOCAL STORAGE MOCK USERS
------------------------------ */
// get users from localStorage (or empty array if none)
function getUsers(){
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// save new user to localStorage
function saveUser(user){
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

/* ------------------------------
    4. FORM SUBMIT HANDLER
------------------------------ */
authForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const name = document.getElementById('name').value.trim();

    if(isLogin){
        // --- LOGIN FLOW ---
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if(user){
            alert('Login successful!');
            window.location.href = 'products.html'; // redirect after login
        } else {
            errorMessage.textContent = 'Invalid email or password.';
        }

    } else {
        // --- SIGN UP FLOW ---
        const users = getUsers();
        const exists = users.some(u => u.email === email);

        if(exists){
            errorMessage.textContent = 'User already exists.';
            return;
        }

        saveUser({name, email, password});  // save new user
        alert('Sign Up successful! Please login.');
        toggleLink.click(); // automatically switch back to login
    }
});
