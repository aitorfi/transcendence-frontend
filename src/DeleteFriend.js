
function initDeleteFriendScript() {
    console.log("Initializing Delete Friends script");
    const selectedUserId = localStorage.getItem('delete-friend-id');
    const selectedUserName = localStorage.getItem('delete-friend-username');
    document.getElementById('delete-friend-name').textContent = selectedUserName;

    const boton = document.getElementById('delete-yes-botton');

    boton.addEventListener('click', function() {
      removeFriend(selectedUserId);
    });
    
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


