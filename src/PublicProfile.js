async function initPublicProfile(){
    console.log("PublicProfile script init");
    const userName = localStorage.getItem('profile-friend-username');
    const userId = localStorage.getItem('profile-friend-id');
    document.getElementById('PublicProfile-username').innerHTML = userName;
    const avatar = await getAvatar(userId);
    document.getElementById('PublicAvatarImage').setAttribute("src", avatar);


async function getAvatar(id) {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await fetch(`http://localhost:50000/api/users/avatar/${id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        //const userNameId = await response.json();
        console.log("XXXXXXXXXXXXXXX--->>>>",response.url);
        return response.url;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
    }
}

window.initPublicProfile = initPublicProfile;