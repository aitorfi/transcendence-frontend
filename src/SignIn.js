console.log('SignIn.js loaded');

// Función de inicialización
function initSignIn() {
    console.log('Initializing SignIn');
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        console.log('Sign in form found, adding event listener');
        signInForm.addEventListener('submit', handleSignIn);
    } else {
        console.error('Sign in form not found. DOM structure:', document.body.innerHTML);
    }
}

async function handleSignIn(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const signInData = {
        username: username,
        password: password
    };

    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }



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
            
            // Guardar el token de autenticación en el almacenamiento local
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userToken', result.token);
            localStorage.setItem('userData', JSON.stringify(result));

            // Usar el sistema de enrutamiento SPA para navegar al perfil
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

// Ejecutar la inicialización inmediatamente
initSignIn();