function initListSearch() {
    const searchInput = document.getElementById('search-username');
    const buttonInput = document.getElementById('search-user-form');
    const resultsContainer = document.getElementById('results-list');

    async function fetchUsers() {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch('http://localhost:50000/api/users/list/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const users = await response.json();
            return users;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return [];
        }
    }

    async function fetchUserId() {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch('http://localhost:50000/api/test-token/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userNameId = await response.json();
            return userNameId;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return [];
        }
    }

    async function fetchFriends() {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch('http://localhost:50000/api/friends/get_user_friends/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const friends = await response.json();
            return friends;
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return [];
        }
    }

    async function searchUsers(query) {

        const myUsernameId = await fetchUserId();
        console.log("my username id", myUsernameId);
        const myFriends = await fetchFriends();
        console.log("my friends", myFriends);
        const users = await fetchUsers();
        const matches = users.filter(user => 
            user.user__username.toLowerCase().includes(query.toLowerCase())
        );
        displayResults(matches, myUsernameId, myFriends);
    }


   function setFriend(userId, user__username) {

        localStorage.setItem('selectedUser', user__username);
        localStorage.setItem('selectedID', userId);
    }


    function displayResults(matches, myUsernameId, myFriends) {
        resultsContainer.innerHTML = '';
    
        // Access the friends array from the myFriends object
        const friendsArray = myFriends.friends || [];
    
        matches.forEach(match => {
            // Skip if the match is the user themselves
            if (match.user__id === myUsernameId.user_id) {
                return; // Continue to the next match
            }
    
            const item = document.createElement('li');
            item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            item.textContent = match.user__username;
    
            // Check if the match is already a friend
            const isFriend = friendsArray.some(friend => friend.id === match.user__id);
            
            // Only add the 'ADD' button if the user is not already a friend
            if (!isFriend) {
                const addButton = document.createElement('button');
                addButton.classList.add('btn', 'btn-success', 'btn-sm', 'spa-route');
                addButton.setAttribute('data-path', '/ExecuteFriendRequest');
                addButton.style.border = '2px solid black';
                addButton.style.fontWeight = 'bold';
                addButton.textContent = 'ADD';
    
                addButton.addEventListener('click', () => setFriend(match.user__id, match.user__username));
    
                item.appendChild(addButton);
            }
            //si quitamos el comentario si eres amigo no sale en searchUser
/*             else
                return; */
    
            resultsContainer.appendChild(item);
        });
    }
    
    
    buttonInput.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query.length > 1) {
            searchUsers(query);
        } else {
            resultsContainer.innerHTML = '';
        }
    });

    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        if (query.length > 1) {
            searchUsers(query);
        } else {
            resultsContainer.innerHTML = '';
        }
    });
}

// Asegurarse de que la función de inicialización se ejecute cuando se cargue la página
window.initListSearch = initListSearch;
