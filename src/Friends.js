function initFriends() {
    console.log("Initializing Friends page");

    let resultsContainer = document.getElementById('results-list');

    // Función para obtener amigos bloqueados
    async function fetchBlockedFriends() {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch('http://localhost:50000/api/friends/get_friends_blocked/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.friends || [];  // Asegurarse de devolver un array, incluso si está vacío.
        } catch (error) {
            console.error('Error al obtener amigos bloqueados:', error);
            return [];
        }
    }

    // Función para obtener amigos
    async function fetchFriends() {
        const token = localStorage.getItem("accessToken");
        console.log("Access Token:", token);

        try {
            const response = await fetch('http://localhost:50000/api/friends/get_user_friends/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log("Received data:", data);
            return data.friends || [];  // Asegurarse de devolver un array, incluso si está vacío.
        } catch (error) {
            console.error('Error al obtener amigos:', error);
            return [];
        }
    }

    // Función para bloquear a un amigo
    function setBlockFriend(friendId, username) {
        localStorage.setItem('block-friend-id', friendId);
        localStorage.setItem('block-username-id', username);
    }

    // Función para eliminar a un amigo
    function removeFriend(friendId, username) {
        localStorage.setItem('delete-friend-id', friendId);
        localStorage.setItem('delete-friend-username', username);
    }

    // Función para mostrar los resultados en la página
    async function displayResults(friends) {
        const blockedFriends = await fetchBlockedFriends();

        if (!resultsContainer) {
            console.error("Results container not found");
            return;
        }

        resultsContainer.innerHTML = '';  // Limpiar el contenedor de resultados

        friends.forEach(friend => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

            // Parte izquierda: botón de eliminar y nombre del amigo
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('d-flex', 'align-items-center');

            const removeButton = document.createElement('button');
            removeButton.classList.add('btn', 'btn-danger', 'spa-route', 'me-2');
            removeButton.setAttribute('aria-label', 'Remove');
            removeButton.setAttribute('data-path', '/ExecuteDeleteFriend');
            removeButton.style.padding = '2px 6px';
            removeButton.style.border = '1px solid black';
            removeButton.style.borderRadius = '50%';
            removeButton.style.fontSize = '0.875rem';

            const removeIcon = document.createElement('i');
            removeIcon.classList.add('bi', 'bi-x', 'text-white', 'spa-route');
            removeIcon.setAttribute('data-path', '/ExecuteDeleteFriend');
            removeButton.appendChild(removeIcon);

            removeButton.addEventListener('click', () => removeFriend(friend.id, friend.username));

            const friendName = document.createElement('p');
            friendName.classList.add('mb-0');
            friendName.style.fontWeight = 'bold';
            friendName.textContent = friend.username;

            leftDiv.appendChild(removeButton);
            leftDiv.appendChild(friendName);

            // Parte derecha: botones de "Chat", "Match", y "Block"
            const rightDiv = document.createElement('div');
            rightDiv.classList.add('d-flex', 'justify-content-end');

            // Comprobar si el amigo está bloqueado
            const isBlocked = blockedFriends.some(blocked => blocked.id === friend.id);

            // Botón Block (mostrar solo si no está bloqueado)
            if (!isBlocked) {
                const blockButton = document.createElement('button');
                blockButton.classList.add('btn', 'btn-danger', 'btn-sm', 'me-2', 'spa-route');
                blockButton.setAttribute('data-path', '/ExecuteBlockFriend');
                blockButton.style.border = 'solid black';
                blockButton.style.width = '65px';
                blockButton.innerHTML = '<b class="spa-route" data-path="/ExecuteBlockFriend">Block</b>';

                blockButton.addEventListener('click', () => setBlockFriend(friend.id, friend.username));
                rightDiv.appendChild(blockButton);
                
                // Botón Chat
                const chatButton = document.createElement('button');
                chatButton.classList.add('btn', 'btn-success', 'btn-sm', 'me-2', 'spa-route');
                chatButton.setAttribute('data-path', '/Chat');
                chatButton.style.border = 'solid black';
                chatButton.style.width = '65px';
                chatButton.innerHTML = '<b class="spa-route" data-path="/Chat">Chat</b>';
                
                // Botón Match
                const matchButton = document.createElement('button');
                matchButton.classList.add('btn', 'btn-warning', 'btn-sm', 'me-2', 'text-white', 'spa-route');
                matchButton.setAttribute('data-path', '/LocalMultiplayer');
                matchButton.style.border = 'solid black';
                matchButton.style.width = '65px';
                matchButton.innerHTML = '<b class="spa-route" data-path="/Chat">Match</b>';
                
                // Botón Profile
                const ProfileButton = document.createElement('button');
                ProfileButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2', 'spa-route');
                ProfileButton.setAttribute('data-path', '/PublicProfile');
                ProfileButton.style.border = 'solid black';
                ProfileButton.style.width = '65px';
                ProfileButton.innerHTML = '<b class="spa-route" data-path="/PublicProfile">Profile</b>';


                // Añadir los botones a la parte derecha
                rightDiv.appendChild(chatButton);
                rightDiv.appendChild(matchButton);
                rightDiv.appendChild(ProfileButton);
            }
            else
            {
                const ProfileButton = document.createElement('button');
                ProfileButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2', 'spa-route');
                ProfileButton.setAttribute('data-path', '/PublicProfile');
                ProfileButton.style.border = 'solid black';
                ProfileButton.style.width = '65px';
                ProfileButton.innerHTML = '<b class="spa-route" data-path="/PublicProfile">Profile</b>';

                rightDiv.appendChild(ProfileButton);
            }

            // Añadir ambas partes al list item
            listItem.appendChild(leftDiv);
            listItem.appendChild(rightDiv);

            // Añadir el list item al contenedor de resultados
            resultsContainer.appendChild(listItem);
        });
    }

    // Cargar amigos inmediatamente
    fetchFriends().then(friends => {
        console.log("Friends fetched:", friends);
        displayResults(friends);
    });
}

// Exponer la función de inicialización globalmente
window.initFriends = initFriends;
