
function initScriptFriendRequest() {
    console.log("Initializing script Friends requests");

    const userId = localStorage.getItem('id-online');
    const selectedUser = localStorage.getItem('selectedUser');
    const selectedId = localStorage.getItem('selectedID');
    document.getElementById('friend-name').textContent = selectedUser;
    const boton = document.getElementById('yes-botton');

    boton.addEventListener('click', function() {
        addFriendWaiting(selectedId);
        doFetchRequestPending(selectedId, userId);
    });



    async function doFetchRequestPending(selectedId, userId) {

        const usedIdInt = parseInt(userId, 10);
        const selectedIdInt = parseInt(selectedId, 10);
        const token = localStorage.getItem("accessToken");
        console.log("selectedId: ", selectedId, "userId: ", userId);
        try {
            const response = await fetch('http://localhost:50002/chat/friend_requests/create/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    user_sender: usedIdInt,
                    user_recipient: selectedIdInt,
                    user_sender_blocked: false,  
                    user_recipient_blocked: false,
                    status: 0
                 })
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
    }

    async function addFriendWaiting(selectedId) {

        const token = localStorage.getItem("accessToken");
        console.log(token);
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
}

window.initScriptFriendRequest = initScriptFriendRequest;