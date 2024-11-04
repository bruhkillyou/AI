// DOM Elements
const navBar = document.getElementById('nav-bar');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const profileSection = document.getElementById('profileSection');
const showLoginBtn = document.getElementById('showLogin');
const showRegisterBtn = document.getElementById('showRegister');
const showProfileBtn = document.getElementById('showProfile');
const logoutBtn = document.getElementById('logout');

// Show/Hide Functions
function showLogin() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    profileSection.style.display = 'none';
}

function showRegister() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    profileSection.style.display = 'none';
}

function showProfile() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    profileSection.style.display = 'block';
}

// Navigation Event Listeners
showLoginBtn.addEventListener('click', showLogin);
showRegisterBtn.addEventListener('click', showRegister);
showProfileBtn.addEventListener('click', showProfile);

// Check Authentication Status
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        showLoginBtn.style.display = 'none';
        showRegisterBtn.style.display = 'none';
        showProfileBtn.style.display = 'block';
        logoutBtn.style.display = 'block';
        loadProfile();
    } else {
        showLoginBtn.style.display = 'block';
        showRegisterBtn.style.display = 'block';
        showProfileBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
        showLogin();
    }
}

// API Functions
async function register(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            checkAuth();
            alert('Registrace úspěšná!');
        } else {
            alert(data.error || 'Chyba při registraci');
        }
    } catch (error) {
        alert('Chyba při komunikaci se serverem');
    }
}

async function login(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            checkAuth();
            alert('Přihlášení úspěšné!');
        } else {
            alert(data.error || 'Nesprávné přihlašovací údaje');
        }
    } catch (error) {
        alert('Chyba při komunikaci se serverem');
    }
}

async function loadProfile() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById('profileUsername').textContent = data.username;
            document.getElementById('profileEmail').textContent = data.email;
            showProfile();
        } else {
            localStorage.removeItem('token');
            checkAuth();
        }
    } catch (error) {
        alert('Chyba při načítání profilu');
    }
}

async function deleteAccount() {
    if (!confirm('Opravdu chcete smazat svůj účet? Tato akce je nevratná!')) {
        return;
    }

    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/users/delete-account', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            localStorage.removeItem('token');
            checkAuth();
            alert('Účet byl úspěšně smazán');
        } else {
            alert('Chyba při mazání účtu');
        }
    } catch (error) {
        alert('Chyba při komunikaci se serverem');
    }
}

function logout() {
    localStorage.removeItem('token');
    checkAuth();
}

// Event Listeners
document.getElementById('register').addEventListener('submit', register);
document.getElementById('login').addEventListener('submit', login);
document.getElementById('deleteAccount').addEventListener('click', deleteAccount);
logoutBtn.addEventListener('click', logout);

// Initial check
checkAuth();