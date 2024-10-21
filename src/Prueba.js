// script.js
document.addEventListener('DOMContentLoaded', () => {
    const readyButton = document.getElementById('readyButton');
    const statusMessage = document.getElementById('statusMessage');

    // Simulación: Comprobar si el jugador 2 está listo
    function checkPlayerStatus() {
        const player2Ready = localStorage.getItem('player2Ready');

        if (player2Ready === 'true') {
            statusMessage.innerText = "Jugador 2 está listo. ¡Comenzando el juego!";
            readyButton.style.display = 'none';
            // Aquí puedes redirigir a la página del juego
            setTimeout(() => {
                window.location.href = '/game'; // Cambia esto a tu página de juego
            }, 2000);
        }
    }

    // Jugador 1 entra a la sala de espera
    readyButton.style.display = 'block';

    readyButton.addEventListener('click', () => {
        // Simular que el jugador 1 está listo (puedes usar un botón real en el lado del jugador 2)
        localStorage.setItem('player1Ready', 'true');
        statusMessage.innerText = "Jugador 1 está listo. Esperando a Jugador 2...";
    });

    // Intervalo para comprobar el estado del jugador 2
    setInterval(checkPlayerStatus, 2000);
});

// En el lado del Jugador 2, este código se ejecutaría
// localStorage.setItem('player2Ready', 'true'); // Esto lo haría el jugador 2 al hacer clic en un botón
