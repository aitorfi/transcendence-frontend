// Friends.js

function initFriendsBlocked() {
    console.log("Initializing Friends Wait page");

    // Usar let en lugar de const para permitir reasignación
    let resultsContainer = document.getElementById('results-list');

    async function fetchFriends() {
        const token = localStorage.getItem("accessToken");
        console.log("Access Token:", token); // Log the token
        
        try {
            const response = await fetch('http://localhost:50000/api/friends/get_friends_blocked/', {
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
            console.log("Received data:", data); // Log the received data
            return data.friends;
        } catch (error) {
            console.error('Error al obtener amigos:', error);
            return [];
        }
    }


    function SetToUnblockFriend(friendid, usernameid) {
        localStorage.setItem("block-friendId",friendid);
        localStorage.setItem("block-username",usernameid);
    }

    function displayResults(friends) {
        if (!resultsContainer) {
            console.error("Results container not found");
            return;
        }
        resultsContainer.innerHTML = '';

        friends.forEach(friend => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

            // Parte izquierda con el botón de eliminar y el nombre del amigo
            const leftDiv = document.createElement('div');
            leftDiv.classList.add('d-flex', 'align-items-center');

            const friendName = document.createElement('p');
            friendName.classList.add('mb-0');
            friendName.textContent = friend.username;

            leftDiv.appendChild(friendName);

            // Parte derecha con los botones de "Chat" y "Match"
            const rightDiv = document.createElement('div');
            rightDiv.classList.add('d-flex', 'justify-content-end');


            const unblockButton = document.createElement('button');
            unblockButton.classList.add('btn', 'btn-danger', 'btn-sm', 'text-white', 'spa-route');
            unblockButton.setAttribute('data-path', '/ExecuteUnblockedFriend');
            unblockButton.style.border = 'solid black';
            unblockButton.innerHTML = '<b class="spa-route" data-path="/ExecuteUnblockedFriend">Unblock</b>';

            rightDiv.appendChild(unblockButton);
            unblockButton.addEventListener('click', () => SetToUnblockFriend(friend.id, friend.username));

            // Añadir las dos partes al list item
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
window.initFriendsBlocked = initFriendsBlocked;