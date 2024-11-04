const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                alert('Registration successful!');
                window.location.href = 'login.html';
            } else {
                alert('Registration failed.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem('user', JSON.stringify(userData));
                alert('Login successful!');
                window.location.href = 'profile.html';
            } else {
                alert('Login failed.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const profileInfo = document.getElementById('profileInfo');
    const logoutButton = document.getElementById('logoutButton');
    
    if (profileInfo) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            profileInfo.innerHTML = `
                <p>Username: ${user.username}</p>
                <p>Joined: ${new Date(user.createdAt).toLocaleDateString()}</p>
            `;
        } else {
            window.location.href = 'login.html';
        }
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
});
