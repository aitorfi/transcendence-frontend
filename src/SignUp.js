
document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const username = document.getElementById('username').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return; // en vez de alert que mande de nuevo a la pagina de signup con aviso de que error en contraseña
    }

const SignUPdata = {
    email: email,
    password: password,
    userName: username,
}

if (!email || !password || !username) {
    alert('Please fill in all required fields');
    return;
}

console.log("hola");

const dataJSON = JSON.stringify(SignUPdata);

try {
    // Hacer el POST request usando fetch
        const response = await fetch('http://localhost:50000/api/users/create/', 
        {
            method: 'POST', // Método POST
            headers: 
            {
                'Content-Type': 'application/json',
            },
            body: dataJSON, // El JSON generado del formulario
        });
        if (response.ok) 
        {
            const result = await response.json();
            alert('Sign up successful!'); // Manejo de éxito
            console.log(result);
        }   
        else 
        {
        // Si la respuesta no es OK, manejar el error
            const error = await response.json();
            alert('Error: ' + error.message);
            console.error('Error response from API:', error);
        }
    } 
catch (error)
{
    console.error('Error sending data:', error);
    alert('Error connecting to the server');
}

});


