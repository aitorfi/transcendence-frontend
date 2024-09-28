console.log('SignIn.js loaded');

// Función para manejar el inicio de sesión estándar
async function handleSignIn(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    const signInData = { username, password };

    try {
        const response = await fetch('http://localhost:50000/api/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signInData),
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Sign in successful:', result);
            
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userToken', result.token);
            localStorage.setItem('userData', JSON.stringify(result));

            window.history.pushState({}, "", "/Profile");
            window.dispatchEvent(new PopStateEvent('popstate'));
        } else {
            const error = await response.json();
            alert('Error: ' + (error.message || 'Invalid credentials'));
            console.error('Error response from API:', error);
        }
    } catch (error) {
        console.error('Error sending data:', error);
        alert('Error connecting to the server');
    }
}

// Función para manejar el inicio de sesión con 42
function handle42Login(event) {
    event.preventDefault();
    console.log('Login with 42 button clicked');
    window.location.href = 'http://localhost:50000/api/oauth/login/';
}

// Función de inicialización
function initSignIn() {
    console.log('Initializing SignIn');
    const signInForm = document.getElementById('signInForm');
    const login42Button = document.getElementById('login42Button');

    if (signInForm) {
        console.log('Sign in form found, adding event listener');
        signInForm.addEventListener('submit', handleSignIn);
    } else {
        console.error('Sign in form not found');
    }

    if (login42Button) {
        console.log('Login 42 button found, adding event listener');
        login42Button.addEventListener('click', handle42Login);
    } else {
        console.error('Login 42 button not found');
    }
}

// Ejecutar la inicialización cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSignIn);
} else {
    initSignIn();
}

// Exponer las funciones globalmente si es necesario
window.handleSignIn = handleSignIn;
window.handle42Login = handle42Login;
window.initSignIn = initSignIn;