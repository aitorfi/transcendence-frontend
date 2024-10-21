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



async function getOnlineStatus(userId) {
    const token = localStorage.getItem("accessToken");
    console.log("Access Token:", token);

    try {
          const response = await fetch(`http://localhost:50000/api/users/get_user_online_status/${userId}/`, {
        //const response = await fetch(`http://localhost:50000/api/users/get-online/${userId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log("Received data:", data);
        return data;  // Devuelve los datos recibidos
    } catch (error) {
        console.error('Error en getOnlineStatus:', error);
        return null;  // O cualquier otro valor que prefieras
    }
}


async function setOnline() {




    
    const token = localStorage.getItem("accessToken");
    const accessToken = localStorage.getItem("accessToken");
    //console.log("Access Token:", data.access);

    ///console.log("DATA.ACCESS:", accessToken);
    console.log("token:", token);
    //console.log("DATA.ACCESS:", data);
    //const dataaccess = localStorage.getItem("")
    try{
        const response = await fetch(`http://localhost:50000/api/users/${userId}/online-status/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // o twoFactorData.access, según corresponda
                'Content-Type': 'application/json',
            },
                body: JSON.stringify({ is_online: true }), // Aquí podrías omitirlo si solo cambias el estado a True
            });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log("Received data:", data);
        return ;  // Asegurarse de devolver un array, incluso si está vacío.
    } catch (error) {
        console.error('catch error de setOnline:', error);
        return ;
    }


    }
    

    async function getid() {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch('http://localhost:50000/api/test-token/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const user = await response.json();
            console.log("XXXXXXXXXX->", user);
            return user/* .user_id */;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return [];
        }  
    }

async function handleSignIn(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;


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
                        window.history.pushState({}, "", "/PrivateProfile");
                        window.dispatchEvent(new PopStateEvent('popstate'));
                    } else {
                        alert('Invalid 2FA code');
                    }
                }
            } else {
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);

               /*  console.log("EMPIEZA");
                ///////////
                const pepe = await getid()

                console.log("PEPE==", pepe.user_id); 
                 await setOnline();
                console.log("TERMINA");
                 await getOnlineStatus(pepe.user_id);
                window.history.pushState({}, "", "/PrivateProfile");
                window.dispatchEvent(new PopStateEvent('popstate'));
                window.dispatchEvent(new Event('locationchange')); */
            }
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
