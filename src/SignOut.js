console.log('SignOUT.js loaded');

window.initSignOut = function(loadWindowLocationFunc) {
    const signOutButton = document.getElementById('signOutButton');
    if (signOutButton) {
        signOutButton.addEventListener('click', function(event) {
            event.preventDefault();
            handleSignOut(loadWindowLocationFunc);
        });
    } else {
        console.error('Sign Out button not found');
    }
}

async function handleSignOut(loadWindowLocationFunc) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('No token found, user might already be logged out');
        alert('You are not logged in.');
        return;
    }

    try {
        const response = await fetch('http://localhost:50000/api/users/signout/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            alert('You have been successfully logged out.');
            window.history.pushState({}, "", "/SignIn");
            if (typeof loadWindowLocationFunc === 'function') {
                loadWindowLocationFunc();
            } else {
                console.error('loadWindowLocation function not available');
                window.location.reload(); // Fallback if loadWindowLocation is not available
            }
        } else {
            const errorData = await response.json();
            console.error('Signout failed:', errorData);
            alert('Sign out failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during signout:', error);
        alert('An error occurred during sign out. Please try again.');
    }
}

// Esperar a que el DOM esté completamente cargado antes de inicializar
document.addEventListener('DOMContentLoaded', function() {
    initSignOut(window.loadWindowLocation);
});

console.log('Signout end'); 