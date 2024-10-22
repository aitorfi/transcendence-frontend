
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
        console.log(response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const user = await response.json();
        console.log("XXXXXXXXXX->", user);
        return user.user_id;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }  
}

function initMatchHistory1v1() {
    console.log("Initializing Match Management");


    console.log (localStorage.getItem("tournament"));
    const matchList = document.getElementById('matchList');
    const matchDetailsModal = new bootstrap.Modal(document.getElementById('matchDetailsModal'));
    const matchDetailsBody = document.getElementById('matchDetailsBody');

    async function fetchMatches() {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch('http://localhost:60000/api/matches/' + await getid() + "/", {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            console.log("xx---XXX->", response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching matches:', error);
            return [];
        }
    }


    function displayMatches(matches) {
        matchList.innerHTML = '';
        matches.forEach(match => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            
            listItem.innerHTML = `
                <div>
                    <strong>Match ${match.id}</strong><br>
                    <small>Tournament: ${match.match_type_display}</small><br>
                    <small>${match.player1_display_name} ( ${match.player1_score}  ) -- ( ${match.player2_score}  ) ${match.player2_display_name}:  </small><br>
                    <small>Fecha: ${match.date}</small>
                </div>
                <div>
                    <img src="http://localhost:50000/api/users/avatar/${match.winner_id}/" height=80 width=80>
                    
                </div>
            `;
            
            matchList.appendChild(listItem);
        });

        // Add event listeners
        document.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', () => showMatchDetails(btn.dataset.id));
        });

        document.querySelectorAll('.start-btn').forEach(btn => {
            btn.addEventListener('click', () => startMatch(btn.dataset.id));
        });
    }

    async function showMatchDetails(matchId) {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://localhost:60000/api/matches2/${matchId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const match = await response.json();
            
            matchDetailsBody.innerHTML = `
                <p><strong>Match ID:</strong> ${match.id}</p>
                <p><strong>Tournament:</strong> ${match.tournament.name}</p>
                <p><strong>Round:</strong> ${match.round}</p>
                <p><strong>Status:</strong> ${match.status}</p>
                <h6>Players:</h6>
                <ul>
                    <li>${match.player1.display_name}: ${match.player1_score} points</li>
                    <li>${match.player2.display_name}: ${match.player2_score} points</li>
                </ul>
                ${match.winner ? `<p><strong>Winner:</strong> ${match.winner.display_name}</p>` : ''}
            `;
    
            matchDetailsModal.show();
        } catch (error) {
            console.error('Error fetching match details:', error);
            alert('Error fetching match details. Please try again.');
        }
    }

    async function startMatch(matchId) {
        try {
            const token = localStorage.getItem("accessToken");
 

            const response = await fetch(`http://localhost:60000/api/matches2/${matchId}/start/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('Match started successfully!');
            const matches = await fetchMatches();
            displayMatches(matches);
        } catch (error) {
            console.error('Error starting match:', error);
            alert('Error starting match. Please try again.');
        }
    }

    // Fetch and display matches on page load
    fetchMatches().then(displayMatches);
}

// Expose the initialization function globally
window.initMatchHistory1v1 = initMatchHistory1v1;