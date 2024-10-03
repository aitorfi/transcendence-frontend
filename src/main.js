'use strict';

import { initializeGame, terminateGame } from "./LocalMultiplayer.js";
import { initializeGameIA, terminateGameIA } from "./SinglePlayerIA.js";


function isUserLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

const DEFAULT_PAGE_TITLE = "JS SPA Router";

const ROUTES = {
    404: {
        template: "../templates/404.html",
        title: "404 | " + DEFAULT_PAGE_TITLE,
        description: "Page not found",
    },
    "/Login": {
        template: "../templates/Login.html",
        title: "Sign In | " + DEFAULT_PAGE_TITLE,
        description: "This is the Sign In page",
    },
    "/Logged": {
        template: "../templates/home.html",
        title: "Home logged | " + DEFAULT_PAGE_TITLE,
        description: "This is the logged home page",
    },
    "/Register": {
        template: "../templates/Register.html",
        title: "Sign Up | " + DEFAULT_PAGE_TITLE,
        description: "This is the Sign Up page",
    },
    "/": {
        template: "../templates/NoLogHome.html",
        title: "Home | " + DEFAULT_PAGE_TITLE,
        description: "This is the home page",
    },
    "/Profile": {
        template: "../templates/Profile.html",
        title: "Profile | " + DEFAULT_PAGE_TITLE,
        description: "This is the Profile page",
        script: "./src/Profile.js"  // Añade esta línea
    },
    "/SignOut": {
        template: "../templates/SignOut.html",
        title: "Sign Out | " + DEFAULT_PAGE_TITLE,
        description: "This is the Sign Out page",
        script: "./src/SignOut.js"
    },
    "/LocalMultiplayer": {
        template: "../templates/localGame.html",
        title: "Local Game | " + DEFAULT_PAGE_TITLE,
        description: "This is the Pong Local Multiplayer Game",
    },
    "/Tournament": {
        template: "../templates/Tournament.html",
        title: "Tournament | " + DEFAULT_PAGE_TITLE,
        description: "This is the Tournament page for the Pong Game",
    },
    "/TournamentInterface": {
        template: "../templates/TournamentInterface.html",
        title: "Tournaments | " + DEFAULT_PAGE_TITLE,
        description: "This is the Tournaments page for the Pong Game",
    },
    "/SinglePlayerIA": {
        template: "../templates/localGame.html",
        title: "Single Game | " + DEFAULT_PAGE_TITLE,
        description: "This is the Single Game page for the Pong Game",
    },
    "/Friends": {
        template: "../templates/Friends.html",
        title: "Friends | " + DEFAULT_PAGE_TITLE,
        description: "This is the Friends page for the Pong Game",
    },
    "/Delete": {
        template: "../templates/Delete.html",
        title: "Delete Friends | " + DEFAULT_PAGE_TITLE,
        description: "This is the Delete Friends page for the Pong Game",
    },
    "/FriendRequest": {
        template: "../templates/FriendRequest.html",
        title: "FriendRequest | " + DEFAULT_PAGE_TITLE,
        description: "This is the FriendRequest page for the Pong Game",
    },
    "/ListSearch": {
        template: "../templates/ListSearch.html",
        title: "ListSearch | " + DEFAULT_PAGE_TITLE,
        description: "This is the ListSearch page for the Pong Game",
    },
    "/Chat": {
        template: "../templates/Chat.html",
        title: "Chat | " + DEFAULT_PAGE_TITLE,
        description: "This is the Chat page for the Pong Game",
    },
    "/MatchHistory": {
        template: "../templates/MatchHistory.html",
        title: "Match History | " + DEFAULT_PAGE_TITLE,
        description: "This is the Match History page for the Pong Game",
    }

};

window.onpopstate = loadWindowLocation; // Event listener for url changes
window.onload = loadWindowLocation; // Handle the initial url

// Custom navigation event for links with the class spa-route
document.addEventListener("click", (event) => {
    if (!event.target.matches(".spa-route"))
        return;
    navigationEventHandler(event);
});

// Handles navigation events by setting the new window location and calling loadWindowLocation
function navigationEventHandler(event) {
    event.preventDefault();
    const path = event.target.dataset.path || event.target.href;
    window.history.pushState({}, "", path); // Set window location
    loadWindowLocation();
}

// Load the template html for the current window location
async function loadWindowLocation() {
    const location = window.location;
    const locationPath = (location.length === 0) ? "/" : location.pathname;
    const route = ROUTES[locationPath] || ROUTES["404"];
    
    try {
        const response = await fetch(route.template);
        if (!response.ok) throw new Error('Network response was not ok');
        const html = await response.text();

        document.getElementById("spa-template-content").innerHTML = html;
        document.title = route.title;
        document.querySelector('meta[name="description"]').setAttribute("content", route.description);

        // Manejo de scripts
        terminateGame();
        terminateGameIA();
        if (locationPath === "/LocalMultiplayer") {
            initializeGame();
        }

        if (locationPath === "/") {
            if (isUserLoggedIn()) {
                window.history.replaceState({}, "", "/Logged");
                loadWindowLocation();
                return; // Importante: salir de la función después de la redirección
            } 
        }
        if (locationPath === "/Profile") {
            const script = document.createElement('script');
            script.src = './src/Profile.js';
            document.body.appendChild(script);
        }        

        if (locationPath === "/Register") {
            const script = document.createElement('script');
            script.src = './src/Register.js'; // Ruta a tu archivo Register.js
            document.body.appendChild(script);
        }

        if (locationPath === "/Login") {
            const script = document.createElement('script');
            script.src = './src/SignIn.js';
            document.body.appendChild(script);
        }

        if (locationPath === "/SignOut") {
            const script = document.createElement('script');
            script.src = './src/SignOut.js';
            script.onload = function() {
                if (typeof window.initSignOut === 'function') {
                    window.initSignOut(loadWindowLocation);
                }
            };
            document.body.appendChild(script);
        }

        // Cargar script específico si existe
        if (route.script) {
            const script = document.createElement('script');
            script.src = route.script;
            script.onload = function() {
                if (typeof window.initProfile === 'function') {
                    window.initProfile();
                }
                else if (typeof window[`init${route.title.split(' | ')[0]}`] === 'function') {
                    window[`init${route.title.split(' | ')[0]}`]();
                }
            };
            document.body.appendChild(script);
        }
		
		if (locationPath === "/SinglePlayerIA") {
			initializeGameIA();
		}
        // Ocultar/mostrar enlaces en el menú según el estado de Navbar
        const loginLink = document.getElementById("login-link");
        const registerLink = document.getElementById("register-link");
        const profileLink = document.getElementById("profile-link");
        const signoutLink = document.getElementById("signout-link");
        const friendsLink = document.getElementById("friends-link"); // Añadido
        const ListSearchLink = document.getElementById("ListSearch-link"); // Añadido

		const retrievedToken = localStorage.getItem("authToken");
        // Lógica para mostrar u ocultar elementos del menú
        if (/*Navbar === 1*/ retrievedToken) {
            // Mostrar Login y Register, ocultar Profile y Sign Out
            if (loginLink) loginLink.parentElement.style.display = 'none';
            if (registerLink) registerLink.parentElement.style.display = 'none';
            if (profileLink) profileLink.parentElement.style.display = '';
            if (signoutLink) signoutLink.parentElement.style.display = '';
            if (friendsLink) friendsLink.style.display = ''; // Añadido
            if (ListSearchLink) ListSearchLink.style.display = ''; // Añadido
/*                         // Manejar la búsqueda de usuarios // Añadido
                        const searchUserForm = document.getElementById("search-user-form");
                        searchUserForm.addEventListener("submit", async (e) => {
                            e.preventDefault();
                            const username = document.getElementById("search-username").value;
                    
                            try {
                                const response = await fetch(`/api/searchUser?username=${encodeURIComponent(username)}`, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': `Bearer ${retrievedToken}`
                                    }
                                });
                                const data = await response.json();
                                
                                if (data.success) {
                                    alert(`User found: ${data.user.username}`);
                                } else {
                                    alert('User not found');
                                }
                            } catch (error) {
                                console.error('Error searching user:', error);
                            }
                        });
            
                        // Cargar la lista de amigos online // Añadido
                        async function loadFriendsOnline() {
                            try {
                                const response = await fetch(`/api/getFriendsOnline`, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': `Bearer ${retrievedToken}`
                                    }
                                });
                                const friends = await response.json();
                                
                                const friendsList = document.getElementById("friends-online-list");
                                friendsList.innerHTML = '';
            
                                if (friends.length > 0) {
                                    friends.forEach(friend => {
                                        const friendItem = document.createElement("li");
                                        friendItem.classList.add("dropdown-item");
                                        friendItem.innerHTML = `
                                            ${friend.username}
                                            <button class="btn btn-sm btn-success" onclick="startMatch('${friend.id}')">Match</button>
                                            <button class="btn btn-sm btn-danger" onclick="deleteFriend('${friend.id}')">Delete</button>
                                        `;
                                        friendsList.appendChild(friendItem);
                                    });
                                } else {
                                    friendsList.innerHTML = '<li class="dropdown-item">No friends online</li>';
                                }
                            } catch (error) {
                                console.error('Error loading friends online:', error);
                            }
                        }
            
                        loadFriendsOnline(); // Llamar a la función para cargar amigos online // Añadido
            
                        // Función para iniciar una partida // Añadido
                        function startMatch(friendId) {
                            alert(`Starting match with friend ID: ${friendId}`);
                        }
            
                        // Función para eliminar a un amigo // Añadido
                        async function deleteFriend(friendId) {
                            try {
                                const response = await fetch(`/api/deleteFriend`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${retrievedToken}`
                                    },
                                    body: JSON.stringify({ friendId })
                                });
                                const result = await response.json();
            
                                if (result.success) {
                                    alert('Friend deleted successfully');
                                    loadFriendsOnline();
                                } else {
                                    alert('Error deleting friend');
                                }
                            } catch (error) {
                                console.error('Error deleting friend:', error);
                            }
                        } */
        } else if (/*Navbar === 0*/!retrievedToken) {
            // Mostrar Profile y Sign Out, ocultar Login y Register
            if (loginLink) loginLink.parentElement.style.display = '';
            if (registerLink) registerLink.parentElement.style.display = '';
            if (profileLink) profileLink.parentElement.style.display = 'none';
            if (signoutLink) signoutLink.parentElement.style.display = 'none';
            if (friendsLink) friendsLink.style.display = 'none'; // Añadido
            if (ListSearchLink) ListSearchLink.style.display = 'none'; // Añadido
        }

    } catch (error) {
        console.error('Error fetching template:', error);
    }
}







