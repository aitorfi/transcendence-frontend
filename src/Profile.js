function initProfile() {
    async function loadProfileData() {
        const token = localStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (!token || !userData) {
            console.error('No token or user data found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:50000/api/users/profile/${userData.user_id}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (response.ok) {
                const profileData = await response.json();
                console.log('Profile data:', profileData);

                // Rellenar los campos del formulario
                const usernameField = document.getElementById('username');

                if (usernameField) {
                    usernameField.textContent = profileData.username;
                } else {
                    console.error('Username field not found');
                }


                const joinedField = document.getElementById('date_joined');
                if (joinedField) {
                    joinedField.textContent = profileData.date_joined || ''; // Usa '' si age es null o undefined
                } else {
                    console.error('date_joined field not found');
                }


                /*              const ageField = document.getElementById('age');
                if (ageField) {
                    ageField.value = profileData.age || ''; // Usa '' si age es null o undefined
                } else {
                    console.error('Age field not found');
                } */
                // Añade más campos aquí según tu formulario
            } else {
                console.error('Failed to fetch profile data');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    }

    // Intentar cargar los datos inmediatamente
    loadProfileData();


    // Cambia el avatar cuando se selecciona una imagen
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');
    const avatarImage = document.getElementById('avatarImage');

    // Agregar un listener al botón para abrir el input de archivo
    changeAvatarBtn.addEventListener('click', function () {
        avatarInput.click();
    });

    // Agregar un listener al input de archivo para cargar la imagen
    avatarInput.addEventListener('change', function () {
        const file = avatarInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                avatarImage.src = e.target.result; // Cambiar la imagen del avatar
            };
            reader.readAsDataURL(file);
        }
    });

    // Toggle color picker
    const toggleColorPicker = document.getElementById('toggleColorPicker');
    const colorPickerContainer = document.getElementById('colorPickerContainer');
    const colorPickerCanvas = document.getElementById('colorPicker');

    toggleColorPicker.addEventListener('click', function () {
        colorPickerContainer.style.display = colorPickerContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Setup color picker
    const ctx = colorPickerCanvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 300, 150);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.5, 'green');
    gradient.addColorStop(1, 'blue');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 150);

    colorPickerCanvas.addEventListener('click', function (event) {
        const rect = colorPickerCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        document.body.style.backgroundColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
    });

    // Function to simulate a match
    function playMatch(opponent) {
        alert(`Starting a match against ${opponent}`);
    }

    // Manejadores para mostrar/ocultar formularios de cambio de contraseña y correo electrónico
    document.getElementById('changePasswordBtn').addEventListener('click', function() {
        const changePasswordForm = document.getElementById('changePasswordForm');
        changePasswordForm.classList.toggle('collapse');
    });

    document.getElementById('changeEmailBtn').addEventListener('click', function() {
        const changeEmailForm = document.getElementById('changeEmailForm');
        changeEmailForm.classList.toggle('collapse');
    });

    // Manejar el evento de envío del formulario de cambio de contraseña
    document.getElementById('submitPasswordChange').addEventListener('click', function() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        // Validar contraseñas
        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match!');
            return;
        }

        alert('Password changed successfully!'); // Simular un cambio exitoso
        // Aquí puedes agregar la lógica para enviar los datos al servidor si es necesario
    });

    // Manejar el evento de envío del formulario de cambio de correo electrónico
    document.getElementById('submitEmailChange').addEventListener('click', function() {
        const currentEmail = document.getElementById('currentEmail').value;
        const newEmail = document.getElementById('newEmail').value;
        const confirmNewEmail = document.getElementById('confirmNewEmail').value;

        // Validar correos electrónicos
        if (newEmail !== confirmNewEmail) {
            alert('New emails do not match!');
            return;
        }

        alert('Email changed successfully!'); // Simular un cambio exitoso
        // Aquí puedes agregar la lógica para enviar los datos al servidor si es necesario
    });

    // También añadir el listener por si acaso
    document.addEventListener('DOMContentLoaded', loadProfileData);
}

// Exponer la función de inicialización globalmente
window.initProfile = initProfile;

console.log('Profile script loaded');