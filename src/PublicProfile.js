

async function initPublicProfile(){

    console.log("PublicProfile script init");
    const userName = localStorage.getItem('profile-friend-username');
    const userId = localStorage.getItem('profile-friend-id');
    const avatar = await getAvatar(userId);
    const dateCreated = await getDateCreated(userId);
    document.getElementById('PublicProfile-username').innerHTML = userName;
    document.getElementById('public-title-name').innerHTML = userName;
    document.getElementById('PublicAvatarImage').setAttribute("src", avatar);
    document.getElementById('date_joined_public').innerHTML = formatDate(dateCreated);

    function formatDate(dateCreated)
    {
        const date = new Date(dateCreated);
        const formattedDate = date.toLocaleString();
        return formattedDate;
    }

    async function getDateCreated(id)
    {
        const token = localStorage.getItem("accessToken");
        try 
        {
            const response = await fetch(`http://localhost:50000/api/users/${id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
            });

            if (!response.ok)
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const userData = await response.json();
            return userData.date_joined;
        }
        catch (error) 
        {
            console.error('Error al obtener datos de usuario:', error);
            return [];
        }
    }

    async function getAvatar(id) 
    {
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
            return response.url;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return [];
        }
    }
}

window.initPublicProfile = initPublicProfile;