// Friends.js

function initFriendsRequest() {
    console.log("Initializing Friends Wait page");

    // Usar let en lugar de const para permitir reasignación
    let resultsContainer = document.getElementById('results-list');

    async function fetchFriends() {
        const token = localStorage.getItem("accessToken");
        console.log("Access Token:", token); // Log the token
        
        try {
            const response = await fetch('http://localhost:50000/api/friends/get_friends_request/', {
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

    async function Add_Friend_Final(userId) {

        const token = localStorage.getItem("accessToken");
        
        try {
            const response = await fetch('http://localhost:50000/api/friends/add_final/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friend_id: userId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result_do = await response.json();
            console.log("result_do", result_do);
            alert(result_do.message);
        } catch (error) {
            console.error('Error al añadir amigo:', error);
            alert('No se pudo añadir el amigo');
        }
        delete_friend_from_requestList(userId);
        
    }
///////////////////////////////////////////////////////////////
// friends.js
async function delete_friend_from_FriendsWaiting(userId) {
    console.log("user id:", userId);
    const token = localStorage.getItem("accessToken");
    
    // Verificamos si el token existe antes de hacer la solicitud
    if (!token) {
        alert('No se encontró un token de acceso. Por favor, inicia sesión.');
        return;
    }

    try {
        // Log para verificar la URL correcta
        const url = `http://localhost:50000/api/friends/remove-from-waiting/${userId}/`;
        console.log(`Requesting DELETE to URL: ${url}`);
        console.log("user id3=", userId);
        const response = await fetch(url, { ////
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Manejo de errores según el código de estado
            const errorData = await response.json();
            console.error(`Error: ${response.status}`, errorData); ////

            // Mostrar mensajes de error específicos si el backend retorna detalles
            if (response.status === 400) {
                alert(errorData.error || 'No estás en la lista de espera de este usuario.');
            } else if (response.status === 500) {
                alert('Ocurrió un error en el servidor. Inténtalo nuevamente más tarde.');
            } else {
                alert(`Error: ${response.status}`);
            }
            return;
        }

        const result_do = await response.json();
        console.log("result_do", result_do);
        alert(result_do.message);

    } catch (error) {
        console.error('Error al eliminar amigo:', error);
        alert('No se pudo eliminar el amigo. Intenta nuevamente más tarde.');
    }
}


    async function delete_friend_from_requestList(userId)
    {
        console.log("user id:", userId);
        const  token = localStorage.getItem("accessToken");
        try
        {
            const response = await fetch(`http://localhost:50000/api/friends/remove-request/${userId}/`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) 
                throw new Error(`HTTP error! status: ${response.status}`);
            const result_do = await response.json();
            console.log("result_do", result_do);
            alert(result_do.message);
        } 
        catch (error) 
        {
            console.error('Error al añadir amigo:', error);
            alert('No se pudo añadir el amigo');
        }
        //delete_friend_from_requestList(userId);
        delete_friend_from_FriendsWaiting(userId);
            
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

            const yesButton = document.createElement('button');
            yesButton.classList.add('btn', 'btn-success', 'btn-sm', 'me-2', 'spa-route');
            yesButton.setAttribute('data-path', '/Friends');
            yesButton.style.border = 'solid black';
            yesButton.style.width = '60px';
            yesButton.innerHTML = '<b class="spa-route" data-path="/Friends">Yes</b>';

            const noButton = document.createElement('button');
            noButton.classList.add('btn', 'btn-danger', 'btn-sm', 'text-white', 'spa-route');
            noButton.setAttribute('data-path', '/Friends');
            noButton.style.border = 'solid black';
            noButton.style.width = '60px';
            noButton.innerHTML = '<b class="spa-route" data-path="/Friends">No</b>';

            rightDiv.appendChild(yesButton);
            rightDiv.appendChild(noButton);

            yesButton.addEventListener('click', () => Add_Friend_Final(friend.id));
            noButton.addEventListener('click',() => delete_friend_from_requestList(friend.id));

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
window.initFriendsRequest = initFriendsRequest;