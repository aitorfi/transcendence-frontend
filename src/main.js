'use strict'

import { initializeGame, terminateGame } from "./LocalMultiplayer.js"
import { initializeGameIA, terminateGameIA } from "./SinglePlayerIA.js"
import { initSignIn } from './SignIn.js';


async function getid() {
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
        
        const user = await response.json();
        console.log("XXXXXXXXXX->", user);
        return user/* .user_id */;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }  
}

async function getusername(id){
    return id.username;
}
    
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

function isUserHomeIn() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return false;
    }

    // Decodificar el token
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        return false; // Token inválido
    }

    try {
        const payload = JSON.parse(atob(tokenParts[1]));
        const expirationTime = payload.exp * 1000; // Convertir a milisegundos
        const currentTime = Date.now();

        if (currentTime >= expirationTime) {
            // Token expirado
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return false;
        }

        return true; // Token válido y no expirado
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return false;
    }
}

const DEFAULT_PAGE_TITLE = "JS SPA Router";

const ROUTES = {
    404: {
        template: "../templates/404.html",
        title: "404 | " + DEFAULT_PAGE_TITLE,
        description: "Page not found",
    },
    "/Chat": {
        template: "../templates/Chat.html",
        title: "Chat | " + DEFAULT_PAGE_TITLE,
        description: "This is the Chat page for the Pong Game",
    },
    "/ExecuteBlockFriend": {
        template: "../templates/ExecuteBlockFriend.html",
        title: "ExecuteBlockFriend | " + DEFAULT_PAGE_TITLE,
        description: "This is the ExecuteBlockFriend page ",
    },
    "/ExecuteDeleteFriend": {
        template: "../templates/ExecuteDeleteFriend.html",
        title: "ExecuteDeleteFriend | " + DEFAULT_PAGE_TITLE,
        description: "This is the ExecuteDeleteFriend Friends page for the Pong Game",
    },
    "/ExecuteFriendRequest": {
        template: "../templates/ExecuteFriendRequest.html",
        title: "ExecuteFriendRequest | " + DEFAULT_PAGE_TITLE,
        description: "This is the ExecuteFriendRequest page for the Pong Game",
    },
    "/ExecuteUnblockedFriend": {
        template: "../templates/ExecuteUnblockedFriend.html",
        title: "ExecuteUnblockedFriend | " + DEFAULT_PAGE_TITLE,
        description: "This is the ExecuteUnblockedFriend page ",
    },
    "/Friends": {
        template: "../templates/Friends.html",
        title: "Friends | " + DEFAULT_PAGE_TITLE,
        description: "This is the Friends page for the Pong Game",
        script: "./src/Friends.js"  // Añade esta línea
    },
    "/FriendsBlocked": {
        template: "../templates/FriendsBlocked.html",
        title: "Friends Blocked | " + DEFAULT_PAGE_TITLE,
        description: "This is the Friends Blocked page for the Pong Game",
        script: "./src/FriendsBlocked.js"  // Añade esta línea

    },    
    "/FriendsRequest": {
        template: "../templates/FriendsRequest.html",
        title: "Friends Request | " + DEFAULT_PAGE_TITLE,
        description: "This is the Friends request for the Pong Game",
        script: "./src/FriendsRequest.js"  // Añade esta línea

    },    
    "/FriendsWait": {
        template: "../templates/FriendsWait.html",
        title: "Friends Waiting | " + DEFAULT_PAGE_TITLE,
        description: "This is the Friends Waiting page for the Pong Game",
        script: "./src/FriendsWait.js"  // Añade esta línea

    },    
    "/Home": {
        template: "../templates/Home.html",
        title: "Home Home | " + DEFAULT_PAGE_TITLE,
        description: "This is the Home home page",
    },
    "/SinglePlayerIA": {
        template: "../templates/LocalGame.html",
        title: "Single Game | " + DEFAULT_PAGE_TITLE,
        description: "This is the Single Game page for the Pong Game",
    },
    "/Match4Management": {
        template: "../templates/Match4Management.html",
        title: "Match 4 | " + DEFAULT_PAGE_TITLE,
        description: "This is the Tournaments Match 4 page for the Pong Game",
    },
    "/Match2Management": {
        template: "../templates/Match2Management.html",
        title: "Match 4 | " + DEFAULT_PAGE_TITLE,
        description: "This is the Tournaments Match 2 page for the Pong Game",
    },
    "/LocalMultiplayer": {
        template: "../templates/LocalGame.html",
        title: "Local Game | " + DEFAULT_PAGE_TITLE,
        description: "This is the Pong Local Multiplayer Game",
    },
    "/Login": {
        template: "../templates/Login.html",
        title: "Sign In | " + DEFAULT_PAGE_TITLE,
        description: "This is the Sign In page",
    },
    "/MatchHistory": {
        template: "../templates/MatchHistory.html",
        title: "Match History | " + DEFAULT_PAGE_TITLE,
        description: "This is the Match History page for the Pong Game",
    },
    "/": {
        template: "../templates/NoLogHome.html",
        title: "Home | " + DEFAULT_PAGE_TITLE,
        description: "This is the home page",
    },
    "/PrivateProfile": {
        template: "../templates/PrivateProfile.html",
        title: "PrivateProfile | " + DEFAULT_PAGE_TITLE,
        description: "This is the PrivateProfile page",
        script: "./src/PrivateProfile.js"
    },
    "/PublicProfile": {
        template: "../templates/PublicProfile.html",
        title: "PublicProfile | " + DEFAULT_PAGE_TITLE,
        description: "This is the PublicProfile page",
        //script: "./src/Profile.js"
    },
    "/Register": {
        template: "../templates/Register.html",
        title: "Sign Up | " + DEFAULT_PAGE_TITLE,
        description: "This is the Sign Up page",
    },
    "/SignOut": {
        template: "../templates/SignOut.html",
        title: "Sign Out | " + DEFAULT_PAGE_TITLE,
        description: "This is the Sign Out page",
        script: "./src/SignOut.js"
    },
    "/SearchUser": {
        template: "../templates/SearchUser.html",
        title: "SearchUser | " + DEFAULT_PAGE_TITLE,
        description: "This is the SearchUser page for the Pong Game",
    },
    "/Tournament": {
        template: "../templates/Tournament.html",
        title: "Tournament | " + DEFAULT_PAGE_TITLE,
        description: "This is the Tournament page for the Pong Game",
    },
    "/TournamentAvailable": {
        template: "../templates/TournamentAvailable.html",
        title: "Tournaments Availabe | " + DEFAULT_PAGE_TITLE,
        description: "This is the Tournaments Available page for the Pong Game",
    },
    "/TournamentInterface": {
        template: "../templates/TournamentInterface.html",
        title: "Tournaments | " + DEFAULT_PAGE_TITLE,
        description: "This is the Tournaments page for the Pong Game",
    },
    "/TournamentReady": {
        template: "../templates/TournamentReady.html",
        title: "Tournaments Ready | " + DEFAULT_PAGE_TITLE,
        description: "This is the Tournaments Ready page for the Pong Game",
    },

};

window.onpopstate = () => {
    handleQueryParams();
    loadWindowLocation();
};

window.onload = () => {
    handleQueryParams();
    loadWindowLocation();
};
document.addEventListener("click", (event) => {
    if (!event.target.matches(".spa-route"))
        return;
    navigationEventHandler(event);
});


function navigationEventHandler(event) {
    event.preventDefault();
    const path = event.target.dataset.path || event.target.href;
    window.history.pushState({}, "", path);
    loadWindowLocation();
}

function handleOAuthRedirect() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access');
    const refreshToken = params.get('refresh');
    const userData = params.get('user');
    const oauth2fa = params.get('oauth2fa');

    if (oauth2fa) {
        showOAuth2FAVerification(oauth2fa);
    } else if (accessToken && refreshToken && userData) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', userData);
//        window.location.href = '/profile';
    } else {
//        console.error('Missing OAuth data in URL');
    }
}

function showOAuth2FAVerification(userId) {
    console.log("Showing 2FA verification for user:", userId);
    const verificationForm = `
        <div class="container mt-5">
            <div class="card mx-auto mb-4 border-dark" style="max-width: 500px;">
                <div class="card-header text-center bg-dark" style="color: #f6f8fa;">
                    <h5><b>Two-Factor Authentication</b></h5>
                </div>
                <div class="card-body">
                    <form id="oauth2faForm">
                        <div class="mb-3">
                            <label for="twoFACode" class="form-label">Enter 2FA Code</label>
                            <input type="text" class="form-control" id="twoFACode" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Verify</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.getElementById('spa-template-content').innerHTML = verificationForm;

    document.getElementById('oauth2faForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = document.getElementById('twoFACode').value;
        console.log("Submitting 2FA code:", code);
        try {
            const response = await fetch('http://localhost:50000/api/oauth-2fa-verify/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, user_id: userId }),
            });
            console.log("2FA verification response:", response);
            const data = await response.json();
            console.log("2FA verification data:", data);

            if (response.ok) {
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);

                // Almacenar la información del usuario
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirigir al usuario a la página principal o al dashboard
//                window.location.href = '/profile';
            } else {
                alert('Invalid 2FA code: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error during 2FA verification:', error);
            alert('An error occurred during 2FA verification');
        }
    });
}

// Asegúrate de que esta función se ejecute cuando la página se cargue
window.onload = function() {
    handleOAuthRedirect();
    loadWindowLocation();
};


async function makeAuthenticatedRequest(url, method = 'GET', body = null) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const response = await fetch(url, {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
    });

    if (response.status === 401) {
        // Token expirado, intentar refrescar
        const refreshed = await refreshToken();
        if (refreshed) {
            return makeAuthenticatedRequest(url, method, body);
        } else {
            window.location.href = '/login';
        }
    }

    return response;
}

async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    const response = await fetch('http://localhost:50000/api/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({refresh: refreshToken}),
    });

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        return true;
    }

    return false;
}

function handleQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const oauth2fa = urlParams.get('oauth2fa');
    
    // También revisar el hash por si el parámetro viene ahí
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const oauth2faHash = hashParams.get('oauth2fa');

    if (oauth2fa || oauth2faHash) {
        const userId = oauth2fa || oauth2faHash;
        console.log("2FA required for user:", userId);
        showOAuth2FAVerification(userId);
        // Limpiar los parámetros de la URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return true; // Indica que se manejó el 2FA
    }
    return false; // Indica que no se manejó el 2FA
}

window.addEventListener('load', handleQueryParams);
window.addEventListener('popstate', handleQueryParams);



async function loadWindowLocation() {

    if (handleQueryParams()) {
        return;
    }
    handleQueryParams();
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
    
        terminateGame();
        terminateGameIA();


        if (locationPath === "/") {
            if (isUserHomeIn()) {
                window.history.replaceState({}, "", "/Home");
                loadWindowLocation();
                return; // Importante: salir de la función después de la redirección
            } 
        }   
        if (locationPath === "/ExecuteBlockFriend") {
            const script = document.createElement('script');
            script.src = './src/ExecuteBlockFriend.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initBlockRequest === 'function') {
                    window.initBlockRequest();
                }
            };
            document.body.appendChild(script);
        }
        if (locationPath === "/ExecuteDeleteFriend") {
            const script = document.createElement('script');
            script.src = './src/ExecuteDeleteFriend.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initDeleteFriendScript === 'function') {
                    window.initDeleteFriendScript();
                }
            };
            document.body.appendChild(script);
        }
        if (locationPath === "/ExecuteFriendRequest") {
            const script = document.createElement('script');
            script.src = './src/ExecuteFriendRequest.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initScriptFriendRequest === 'function') {
                    window.initScriptFriendRequest();
                }
            };
            document.body.appendChild(script);
        }
        if (locationPath === "/ExecuteUnblockedFriend") {
            const script = document.createElement('script');
            script.src = './src/ExecuteUnblockedFriend.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initUnlockedFriendScript === 'function') {
                    window.initUnlockedFriendScript();
                }
            };
            document.body.appendChild(script);
        }
        if (locationPath === "/Friends") {
            const script = document.createElement('script');
            script.src = './src/Friends.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initFriends === 'function') {
                    window.initFriends();
                }
            };
            document.body.appendChild(script);
        }
        if (locationPath === "/FriendsBlocked") {
            const script = document.createElement('script');
            script.src = './src/FriendsBlocked.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initFriendsBlocked === 'function') {
                    window.initFriendsBlocked();
                }
            };
            document.body.appendChild(script);
        }
        if (locationPath === "/FriendsRequest") {
            const script = document.createElement('script');
            script.src = './src/FriendsRequest.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initFriendsRequest === 'function') {
                    window.initFriendsRequest();
                }
            };
            document.body.appendChild(script);
        }
        if (locationPath === "/FriendsWait") {
            const script = document.createElement('script');
            script.src = './src/FriendsWait.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initFriendsWait === 'function') {
                    window.initFriendsWait();
                }
            };
            document.body.appendChild(script);
        }
        if (locationPath === "/LocalMultiplayer") {
            initializeGame();
        }
        if (locationPath === "/Match2Management") {
            const script = document.createElement('script');
            script.src = './src/Match2Management.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initMatch2Management === 'function') {
                    window.initMatch2Management();
                }
            };
            document.body.appendChild(script);
        }
        if (locationPath === "/Match4Management") {
            const script = document.createElement('script');
            script.src = './src/Match4Management.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initMatch4Management === 'function') {
                    window.initMatch4Management();
                }
            };
            document.body.appendChild(script);
        } 
		if (locationPath === "/PrivateProfile") {
			const script = document.createElement('script');
			script.src = './src/PrivateProfile.js';
			script.onload = function() {
				if (typeof window.initProfile === 'function') {
					window.initProfile();
				} else {
					console.error('initProfile function not found');
				}
			};
			document.body.appendChild(script);
		}
        if (locationPath === "/PublicProfile") {
			const script = document.createElement('script');
			script.src = './src/PublicProfile.js';
			script.onload = function() {
				if (typeof window.initPublicProfile === 'function') {
					window.initPublicProfile();
				} else {
					console.error('initProfile function not found');
				}
			};
			document.body.appendChild(script);
		}	

        if (locationPath === "/Register") {
            const script = document.createElement('script');
            script.src = './src/Register.js';
            document.body.appendChild(script);
        }
        if (locationPath === "/Login") {
            initSignIn();
        }

        if (locationPath === "/SearchUser") {
            const script = document.createElement('script');
            script.src = './src/SearchUser.js';
            script.onload = function() {
                if (typeof window.initListSearch === 'function') {
                    window.initListSearch();
                }
            };
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
        if (locationPath === "/SinglePlayerIA") {
            initializeGameIA();
        }
        if (locationPath === "/TournamentAvailable") {
            const script = document.createElement('script');
            script.src = './src/TournamentAvailable.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initTournamentAvailable === 'function') {
                    window.initTournamentAvailable();
                }
            };
            document.body.appendChild(script);
        }
        if (locationPath === "/TournamentInterface") {
            const script = document.createElement('script');
            script.src = './src/TournamentInterface.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initCreateTournament === 'function') {
                    window.initCreateTournament();
                }
            };
            document.body.appendChild(script);
        }
        if (locationPath === "/TournamentReady") {
            const script = document.createElement('script');
            script.src = './src/TournamentReady.js';
            script.onload = function() {
                // Asegurarse de que la función de inicialización de friends se ejecuta
                if (typeof window.initTournamentReady === 'function') {
                    window.initTournamentReady();
                }
            };
            document.body.appendChild(script);
        }
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
        const loginLink = document.getElementById("login-link");
        const registerLink = document.getElementById("register-link");
        const profileLink = document.getElementById("Private-profile-link");
        const avatarlink = document.getElementById("id-avatar");
        const avatarName = document.getElementById("id-username");
        const signoutLink = document.getElementById("signout-link");
        const ListSearchLink = document.getElementById("SearchUser-link");
        const FriendMenu = document.getElementById("Friends-Menu");
        const TournamentsMenu = document.getElementById("Tournaments-Menu");
        

		const retrievedToken = localStorage.getItem("accessToken");


        // Lógica para mostrar u ocultar elementos del menú
        if (retrievedToken) {
            let id = await getid();

            let avatar = await getAvatar(id.user_id)
            document.getElementById('id-avatar').setAttribute("src", avatar);
            document.getElementById('id-username').textContent = id.username; // .innerHTML o .textContent valen las 2
            console.log("id.username-->", id.username);
            if (loginLink) loginLink.parentElement.style.display = 'none';
            if (registerLink) registerLink.parentElement.style.display = 'none';
            if (profileLink) profileLink.parentElement.style.display = '';
            if (signoutLink) signoutLink.parentElement.style.display = '';
            if (ListSearchLink) ListSearchLink.style.display = ''; 
            if (FriendMenu) FriendMenu.style.display = '';
            if (TournamentsMenu) TournamentsMenu.style.display = '';
            if (avatarlink) avatarlink.style.display = '';
            if (avatarName) avatarName.style.display = '';
        } else if (!retrievedToken) {
            
            if (loginLink) loginLink.parentElement.style.display = '';
            if (registerLink) registerLink.parentElement.style.display = '';
            if (profileLink) profileLink.parentElement.style.display = 'none';
            if (signoutLink) signoutLink.parentElement.style.display = 'none';
            if (ListSearchLink) ListSearchLink.style.display = 'none'; 
            if (FriendMenu) FriendMenu.style.display = 'none';
            if (TournamentsMenu) TournamentsMenu.style.display = 'none';
            if (avatarlink) avatarlink.style.display = 'none';
            if (avatarName) avatarName.style.display = 'none';
        }

    } catch (error) {
        console.error('Error fetching template:', error);
    }
    
}