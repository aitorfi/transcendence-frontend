function initUnlockedFriendScript() {
    console.log("Initializing initUnlockedFriendScrip");
    const userId = localStorage.getItem('block-friendId');
    console.log("userId unblock", userId);
    const userName = localStorage.getItem('block-username');
    console.log("usernameunblock", userName);
    document.getElementById('unblock-friend-name').textContent = userName; // Obtiene el ID del amigo desde la URL

    const unblockBotton = document.getElementById('Unblock-button');
    unblockBotton.addEventListener('click', function() {
        removeFriendBlocked(userId);
      });

    async function removeFriendBlocked(userId) {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:50000/api/friends/remove-blocked/${userId}/`, {
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
}

window.initUnlockedFriendScript = initUnlockedFriendScript;
