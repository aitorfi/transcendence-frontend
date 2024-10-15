
function initDeleteFriendScript() {
    console.log("Initializing Delete Friends script");
    const selectedUserId = localStorage.getItem('delete-friend-id');
    const selectedUserName = localStorage.getItem('delete-friend-username');
    document.getElementById('delete-friend-name').textContent = selectedUserName;

    const boton = document.getElementById('delete-yes-botton');

    boton.addEventListener('click', async function() {
        await removeFriendBlocked(selectedUserId);
        await removeFriend(selectedUserId);
    });
    
    async function removeFriendBlocked(selectedID) {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:50000/api/friends/remove-blocked/${selectedID}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error al eliminar amigo:', error);
            return false;
        }
    }

    async function removeFriend(selectedUserId) {
        const token = localStorage.getItem("accessToken");
        try 
        {
                const response = await fetch(`http://localhost:50000/api/friends/remove/${selectedUserId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }   
                return true;
        } 
        catch (error) 
        {
            console.error('Error al eliminar amigo:', error);
            return false;
        }
    }
}

window.initDeleteFriendScript = initDeleteFriendScript;


