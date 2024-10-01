function loadAvatar(userId) {
    const avatarImage = document.getElementById('avatarImage');
    const avatarUrl = `http://localhost:50000/api/users/avatar/${userId}/?${new Date().getTime()}`;
    console.log('Loading avatar from:', avatarUrl);
    
    avatarImage.src = avatarUrl;
    avatarImage.onerror = function() {
        console.error('Error loading avatar, using default');
        this.src = 'img/avatar.jpg';
        this.onerror = null;  // Previene bucle infinito si la imagen por defecto también falla
    };
}
function initProfile() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.user_id) {
        loadAvatar(userData.user_id);
    }
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
            
            console.log('Response status:', response.status);
            console.log('Response OK:', response.ok);

            if (response.ok) {
                console.log(response);
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

                const friendField = document.getElementById('friends');
                if (friendField) {
                    friendField.value = profileData.friends || 0; // Usa '' si age es null o undefined
                } else {
                    console.error('Friend field not found');
                }

                const first_nameField = document.getElementById('first_name');
                if (first_nameField) {
                    first_nameField.value = profileData.first_name || 0; // Usa '' si age es null o undefined
                } else {
                    console.error('first_name field not found');
                }
                

                const last_name_nameField = document.getElementById('last_name');
                if (last_name_nameField) {
                    last_name_nameField.value = profileData.last_name || 0; // Usa '' si age es null o undefined
                } else {
                    console.error('last_name field not found');
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
    avatarInput.addEventListener('change', async function () {
        const file = avatarInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar_image', file);
    
            const token = localStorage.getItem('authToken');
            const userData = JSON.parse(localStorage.getItem('userData'));
    
            try {
                const response = await fetch('http://localhost:50000/api/users/upload-avatar/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`
                    },
                    body: formData
                });
    
                if (response.ok) {
                    console.log('Avatar uploaded successfully');
                    // Actualizar la imagen del avatar en la interfaz
                    loadAvatar(userData.user_id);
                } else {
                    console.error('Failed to upload avatar');
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
            }
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
        const changeProfileForm = document.getElementById('changeProfileForm');
        const changePasswordForm = document.getElementById('changePasswordForm');
        const changeProfileBtn = document.getElementById('changeProfilelBtn');
        
        // Si el formulario de contraseña ya está visible, lo ocultamos
        if (!changePasswordForm.classList.contains('collapse')) {
            changePasswordForm.classList.add('collapse');
            this.classList.remove('active');
        } else {
            // Si no, ocultamos el otro formulario y mostramos este
            changeProfileForm.classList.add('collapse');
            changePasswordForm.classList.remove('collapse');
            this.classList.add('active');
            changeProfileBtn.classList.remove('active');
        }
    });
    
    document.getElementById('changeProfilelBtn').addEventListener('click', function() {
        const changePasswordForm = document.getElementById('changePasswordForm');
        const changeProfileForm = document.getElementById('changeProfileForm');
        const changePasswordBtn = document.getElementById('changePasswordBtn');
        
        // Si el formulario de perfil ya está visible, lo ocultamos
        if (!changeProfileForm.classList.contains('collapse')) {
            changeProfileForm.classList.add('collapse');
            this.classList.remove('active');
        } else {
            // Si no, ocultamos el otro formulario y mostramos este
            changePasswordForm.classList.add('collapse');
            changeProfileForm.classList.remove('collapse');
            this.classList.add('active');
            changePasswordBtn.classList.remove('active');
        }
    });

    // Manejar el evento de envío del formulario de cambio de contraseña
    document.getElementById('submitPasswordChange').addEventListener('click', async function(event) {
        event.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
        // Validar contraseñas
        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match!');
            return;
        }
    
        const token = localStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('userData'));
    
        if (!token || !userData) {
            console.error('No token or user data found');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:50000/api/users/change-password/${userData.user_id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });
    
            if (response.ok) {
                alert('Password changed successfully!');
                // Limpiar los campos de contraseña
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmNewPassword').value = '';
            } else {
                const errorData = await response.json();
                alert(`Failed to change password: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('An error occurred while changing the password.');
        }
    });

    // Manejar el evento de envío del formulario de cambio de correo electrónico
    document.getElementById('submitProfileChange').addEventListener('click', async function(event) {
        event.preventDefault();
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const friends = document.getElementById('friends').value;
    
        const token = localStorage.getItem('authToken');
        const userData = JSON.parse(localStorage.getItem('userData'));
    
        if (!token || !userData) {
            console.error('No token or user data found');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:50000/api/users/update/${userData.user_id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    first_name,
                    last_name,
                    friends
                })
            });
    
            if (response.ok) {
                const updatedData = await response.json();
                console.log('Profile updated successfully:', updatedData);
                alert('Profile updated successfully!');
                // Actualizar los campos del formulario con los nuevos datos
                loadProfileData();
            } else {
                console.error('Failed to update profile');
                alert('Failed to update profile. Please try again.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        }
    });
    // También añadir el listener por si acaso
    document.addEventListener('DOMContentLoaded', loadProfileData);
}

// Exponer la función de inicialización globalmente
window.initProfile = initProfile;

