console.log('SignIn.js loaded');

export function initSignIn() {
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

    try {
        const response = await fetch('http://localhost:50000/api/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();

            if (data.require_2fa) {
                const twoFactorCode = prompt('Enter your 2FA code:');
                if (twoFactorCode) {
                    const twoFactorResponse = await fetch('http://localhost:50000/api/users/login/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, password, two_factor_code: twoFactorCode }),
                    });

                    if (twoFactorResponse.ok) {
                        const twoFactorData = await twoFactorResponse.json();
                        localStorage.setItem('accessToken', twoFactorData.access);
                        localStorage.setItem('refreshToken', twoFactorData.refresh);
                //        window.location.href = '/profile';
                    } else {
                        alert('Invalid 2FA code');
                    }
                }
            } else {
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);
//                window.location.href = '/profile';
            }
        } else {
            console.log("Received non-JSON response");
            alert('Login failed: Unexpected response from server');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login: ' + error.message);
    }
}
