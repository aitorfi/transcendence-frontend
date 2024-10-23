
function formatDate(dateCreated)
{
    const date = new Date(dateCreated);
    const formattedDate = date.toLocaleString();
    return formattedDate;
}

function initMatchHistoryTournamentPublic() {
    console.log("Initializing Match Management public");
    const matchList = document.getElementById('matchList');
    const matchDetailsModal = new bootstrap.Modal(document.getElementById('matchDetailsModal'));
    const matchDetailsBody = document.getElementById('matchDetailsBody');
    const tournamentPlayed = document.getElementById('public-tournament-played');
    const tournamentWin = document.getElementById('public-tournament-wins');
    const tournamentLosses = document.getElementById('public-tournament-losses');
    const tournamentWinRate = document.getElementById('public-tournament-winRate');
    const userName = localStorage.getItem('profile-friend-username');
    document.getElementById('stats-tournament-name').innerHTML = userName;
    document.getElementById('history-tournament-name').innerHTML = userName;

    async function fetchStats() {

        const userId = localStorage.getItem('profile-friend-id');
        console.log("friend id", userId);
        try {
            const response = await fetch(`http://localhost:60000/api/matches2/stats_view/${userId}/`, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("public response", response);
            return await response.json();
        } catch (error) {
            console.error('Error fetching matches:', error);
            return [];
        }
    }

    function displayStats(stats) {
        tournamentPlayed.innerHTML = stats.tournaments.played;
        tournamentWin.innerHTML = stats.tournaments.won;
        tournamentLosses.innerHTML = stats.tournaments.played - stats.tournaments.won;
        if (stats.tournaments.played > 0) {
            // Calcula la tasa de victorias
            const winRate = (stats.tournaments.won / stats.tournaments.played) * 100;
            tournamentWinRate.innerHTML = winRate.toFixed(2) + "%"; // Formatea el valor como porcentaje con dos decimales
        } else {
            tournamentWinRate.innerHTML = "0%"; // Si no se han jugado partidas
        }
    }

    async function fetchMatches() {

        const userId = localStorage.getItem('profile-friend-id');
        try {
            const response = await fetch(`http://localhost:60000/api/matches4/${userId}/`, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
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
            const Date = formatDate(match.date);
            listItem.innerHTML = `
                <div>
                    <strong>Match ${match.id}</strong><br>
                    <small>Tournament: ${match.match_type_display}</small><br>
                    <small>${match.player1_display_name} ( ${match.player1_score}  ) -- ( ${match.player2_score}  ) ${match.player2_display_name}:  </small><br>
                    <small>Fecha: ${Date}</small>
                </div>
                <div>
                    <img src="http://localhost:50000/api/users/avatar/${match.winner_id}/" height=80 width=80 class="rounded-circle" style="border: 2px solid black;">
                    
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
    fetchStats().then(displayStats);
    fetchMatches().then(displayMatches);
}

// Expose the initialization function globally
window.initMatchHistoryTournamentPublic = initMatchHistoryTournamentPublic;