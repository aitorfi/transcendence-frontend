
function initBlockRequest() {
    console.log("Initializing Delete Friends script");
    const selectedUserId = localStorage.getItem('block-friend-id');
    const selectedUserName = localStorage.getItem('block-username-id');
    console.log("username", selectedUserName);
    document.getElementById('block-friend-name').textContent = selectedUserName;

    const Yesboton = document.getElementById('Block-yes-botton');

    Yesboton.addEventListener('click', function() {
      BlockFriend(selectedUserId);
    });
    
    async function BlockFriend(selectedUserId) {
        console.log(selectedUserId ," BLOCKED!");
        const token = localStorage.getItem("accessToken");
        try 
        {
                const response = await fetch(`http://localhost:50000/api/friends/friends_blocked/${selectedUserId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friend_id: selectedUserId })
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

window.initBlockRequest = initBlockRequest;