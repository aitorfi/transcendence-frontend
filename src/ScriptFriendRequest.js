
function initScriptFriendRequest() {
    console.log("Initializing script Friends requests");

    const selectedUser = localStorage.getItem('selectedUser');
    const selectedId = localStorage.getItem('selectedId');
    console.log(selectedUser);
    document.getElementById('friend-name').textContent = selectedUser;
    
    async function addFriend(selectedId) {

        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch('http://localhost:50000/api/friends/add_friends_wait/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friend_id: selectedId })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert(result.message);

        } catch (error) {
            console.error('Error al añadir amigo:', error);
            alert('No se pudo añadir el amigo');
        }
    }
    const boton = document.getElementById('yes-botton');

        boton.addEventListener('click', function() {
            addFriend(selectedId);
        });
    
}

window.initScriptFriendRequest = initScriptFriendRequest;