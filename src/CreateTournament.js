function initCreateTournament() {
    console.log("Initializing Create Tournament page");

    const form = document.getElementById('createTournamentForm');
/*     const tournamentsList = document.getElementById('tournamentsList');
    const tournamentDetailsModal = new bootstrap.Modal(document.getElementById('tournamentDetailsModal'));
    const tournamentDetailsBody = document.getElementById('tournamentDetailsBody'); */

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const formattedDateTime = now.toISOString().slice(0,16);
    document.getElementById('startDate').value = formattedDateTime;
    
/*     async function fetchUserTournaments(userId) {
        
        const userData = JSON.parse(localStorage.getItem('userData'));
        userId = userData.user_id;  // Usa este ID en lugar del pasado como parámetro
        console.log(`Fetching tournaments for user ID: ${userId}`);
      
        
//        console.log(`Fetching tournaments for user ID: ${userId}`);
        const token = localStorage.getItem("accessToken");
        try {
            console.log(`Making request to: http://localhost:60000/api/users/${userId}/tournaments/`);
            const response = await fetch(`http://localhost:60000/api/users/${userId}/tournaments/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            console.log(`Response status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Received data:', data);
    
            return {
                participated: data.participated_tournaments || [],
                created: data.created_tournaments || []
            };
        } catch (error) {
            console.error('Error al obtener torneos del usuario:', error);
            throw error;
        }
    } */
    
    async function createTournament(tournamentData) {
        const token = localStorage.getItem("accessToken");
        console.log("Access Token:", token);
    
        const dataToSend = {
            name: tournamentData.name,
            start_date: tournamentData.start_date,
            status: tournamentData.status || 'REGISTRATION',
            tournament_type: tournamentData.tournament_type || 'REGULAR',
            max_participants: parseInt(tournamentData.max_participants),
        };
        console.log("dataToSend:", dataToSend);
        try {
            const response = await fetch('http://localhost:60000/api/tournaments/create/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
    
            return await response.json();
        } catch (error) {
            console.error('Error al crear torneo:', error);
            throw error;
        }
    }

/*     async function fetchTournaments() {
        const token = localStorage.getItem("accessToken");
        
        try {
            const response = await fetch('http://localhost:60000/api/tournaments/user/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Fetched tournaments:', data.tournaments); // Para depuración
            return data.tournaments;
        } catch (error) {
            console.error('Error al obtener torneos:', error);
            return [];
        }
    } */

/*     async function fetchTournamentDetails(tournamentId) {
        const token = localStorage.getItem("accessToken");
        
        try {
            const response = await fetch(`http://localhost:60000/api/tournaments/${tournamentId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            console.error('Error al obtener detalles del torneo:', error);
            throw error;
        }
    } */

/*     function displayTournaments(tournaments) {
        tournamentsList.innerHTML = '';
        tournaments.forEach(tournament => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            
            const tournamentInfo = document.createElement('div');
            tournamentInfo.innerHTML = `
                <strong>${tournament.name}</strong><br>
                <small>Date: ${new Date(tournament.start_date).toLocaleString()}</small><br>
                <small>Status: ${tournament.status}</small><br>
                <small>Participants: ${tournament.participants.length}/${tournament.max_participants}</small>
            `;

            const buttonsDiv = document.createElement('div');
            
            const detailsButton = document.createElement('button');
            detailsButton.classList.add('btn', 'btn-info', 'btn-sm', 'me-2');
            detailsButton.textContent = 'Details';
            detailsButton.addEventListener('click', () => showTournamentDetails(tournament.id));
            
            const startButton = document.createElement('button');
            startButton.classList.add('btn', 'btn-success', 'btn-sm');
            startButton.textContent = 'Start Tournament';
            startButton.disabled = !tournament.can_start;
            startButton.addEventListener('click', () => startTournament(tournament.id));
            
            buttonsDiv.appendChild(detailsButton);
            buttonsDiv.appendChild(startButton);
            
            listItem.appendChild(tournamentInfo);
            listItem.appendChild(buttonsDiv);
            tournamentsList.appendChild(listItem);
        });
    } */


/*     async function showUserTournaments(userId) {
        const userData = JSON.parse(localStorage.getItem('userData'));
        UserId = userData.user_id;  // Usa este ID en lugar del pasado como parámetro
        console.log(`Showing tournaments for user ID: ${userId}`);
        try {
            const { participated, created } = await fetchUserTournaments(userId);
            console.log('Participated tournaments:', participated);
            console.log('Created tournaments:', created);
    
            const userTournamentsContainer = document.getElementById('userTournamentsContainer');
            
            let html = '';
    
            if (created.length > 0) {
                console.log(`User created ${created.length} tournaments`);
                html += `
                    <h6>Tournaments Created:</h6>
                    <ul>
                        ${created.map(tournament => `
                            <li>${tournament.name} - ${tournament.status}</li>
                        `).join('')}
                    </ul>
                `;
            } else {
                console.log('User has not created any tournaments');
            }
    
            if (participated.length > 0) {
                console.log(`User participated in ${participated.length} tournaments`);
                html += `
                    <h6>Tournaments Participated:</h6>
                    <ul>
                        ${participated.map(tournament => `
                            <li>${tournament.name} - ${tournament.status}</li>
                        `).join('')}
                    </ul>
                `;
            } else {
                console.log('User has not participated in any tournaments');
            }
    
            if (html === '') {
                console.log('No tournaments found for this user');
                html = `<p>This user has not created or participated in any tournaments yet.</p>`;
            }
    
            console.log('Setting innerHTML:', html);
            userTournamentsContainer.innerHTML = html;
        } catch (error) {
            console.error('Error fetching user tournaments:', error);
            const userTournamentsContainer = document.getElementById('userTournamentsContainer');
            userTournamentsContainer.innerHTML = `
                <p>Failed to fetch user tournaments. Please try again.</p>
            `;
        }
    }
    
    async function fetchCreatorInfo(creatorId) {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:60000/api/tournaments/creator/${creatorId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            console.error('Error fetching creator info:', error);
            return { username: 'Unknown', display_name: 'Unknown' };
        }
    } */

/*     async function showTournamentDetails(tournamentId) {
        try {
            const details = await fetchTournamentDetails(tournamentId);
            console.log("Tournament details:", JSON.stringify(details, null, 2));
    
            // Obtener la información del creador
            const creatorInfo = await fetchCreatorInfo(details.creator);
    
            tournamentDetailsBody.innerHTML = `
                <p><strong>Name:</strong> ${details.name}</p>
                <p><strong>Start Date:</strong> ${new Date(details.start_date).toLocaleString()}</p>
                <p><strong>Status:</strong> ${details.status}</p>
                <p><strong>Tournament Type:</strong> ${details.tournament_type}</p>
                <p><strong>Creator:</strong> ${creatorInfo.username}</p>
                <p><strong>Max Participants:</strong> ${details.max_participants}</p>
                <p><strong>Current Participants:</strong> ${details.current_participants}</p>
                <h6>Participants:</h6>
                <ul id="participantsList">
                    ${details.participants && details.participants.length > 0 ? 
                      details.participants.map(participant => `
                        <li>
                            <a href="#" class="participant-link" data-user-id="${participant.id}">
                                ${participant.display_name} (ID: ${participant.id})
                            </a>
                        </li>
                      `).join('') : 
                      '<li>No participants yet</li>'
                    }
                </ul>
                <div id="userTournamentsContainer"></div>
            `;
    
            // Añadir event listeners a los enlaces de participantes
            document.querySelectorAll('.participant-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const userId = e.target.dataset.userId;
                    showUserTournaments(userId);
                });
            });
    
            tournamentDetailsModal.show();
        } catch (error) {
            console.error('Error in showTournamentDetails:', error);
            alert('Failed to fetch tournament details. Please try again.');
        }
    } */

/*     async function startTournament(tournamentId) {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:60000/api/tournaments/${tournamentId}/start/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            alert(data.message);
            const tournaments = await fetchTournaments();
            displayTournaments(tournaments);
        } catch (error) {
            console.error('Error al iniciar el torneo:', error);
            alert('Failed to start the tournament. Please try again.');
        }
    } */

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const tournamentData = {
            name: document.getElementById('tournamentName').value,
            max_participants: document.getElementById('maxParticipants').value,
            start_date: document.getElementById('startDate').value
        };

        try {
            const createdTournament = await createTournament(tournamentData);
            alert(`Tournament "${createdTournament.name}" created successfully!`);
/*             const tournaments = await fetchTournaments();
            displayTournaments(tournaments); */
        } catch (error) {
            alert('Failed to create tournament. Please try again.');
        }
    });

    // Fetch and display tournaments on page load
    /* fetchTournaments().then(displayTournaments); */
}

// Exponer la función de inicialización globalmente
window.initCreateTournament = initCreateTournament;