const searchInput = document.getElementById('search-username');
const buttonInput = document.getElementById('search-user-form');
const resultsContainer = document.getElementById('results-list');

async function fetchMatches2(query) {

    const pepe = [
        { username: 'PAPA19' },
        { username: 'elpepe' },
        { username: 'pepegrande' }
    ];

    const token = localStorage.getItem("authToken");
    console.log('Token:', token); 

    const requestData = { query: query };
    const dataJSON = JSON.stringify(requestData);

    try {
        // Realiza la solicitud a la API con el término de búsqueda
        /*const response = await fetch(`http://localhost:50000/api/users/search/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`, // Añade tu token aquí
                'Content-Type': 'application/json'
            },
            body: dataJSON,
        });

        // Verifica que la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();*/
        
        // Muestra los resultados (aquí puedes personalizar el formato)
        displayResults(pepe);
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}


async function fetchMatches(query) {

    const simulatedResponse = [
        { username: 'pepe19' },
        { username: 'elpepe' },
        { username: 'pepegrande' }
    ];

    const token = localStorage.getItem("authToken");
    console.log('Token:', token); 

    const requestData = { query: query };
    const dataJSON = JSON.stringify(requestData);

    try {
        // Realiza la solicitud a la API con el término de búsqueda
        /*const response = await fetch(`http://localhost:50000/api/users/search/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`, // Añade tu token aquí
                'Content-Type': 'application/json'
            },
            body: dataJSON,
        });

        // Verifica que la respuesta fue exitosa
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();*/
        
        // Muestra los resultados (aquí puedes personalizar el formato)
        displayResults(simulatedResponse);
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

// Función para mostrar los resultados en el HTML
function displayResults(matches) {
    // Limpia el contenedor de resultados
    resultsContainer.innerHTML = '';

    // Itera sobre las coincidencias y crea un elemento HTML para cada una
    matches.forEach(match => {
        const item = document.createElement('li');
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = match.username; // Asumiendo que la API devuelve un campo 'username'

        // Añadir botón "ADD"
        const addButton = document.createElement('button');
        addButton.classList.add('btn', 'btn-success', 'btn-sm', 'spa-route');
        addButton.setAttribute('data-path', '/FriendRequest');
        addButton.style.border = '2px solid black'; 
        addButton.style.fontWeight = 'bold';  
        addButton.textContent = 'ADD';
        
        item.appendChild(addButton);
        resultsContainer.appendChild(item);
    });
}

// Añade un listener para el evento 'submit' en el formulario
buttonInput.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita que la página se recargue
    
    const query = searchInput.value.trim();

    // Solo hace la búsqueda si hay al menos 2 caracteres
    if (query.length > 1) {
        fetchMatches(query);
    } else {
        resultsContainer.innerHTML = ''; // Limpia si la entrada es muy corta
    }
});

searchInput.addEventListener('input', (event) => {
    const query = event.target.value.trim();

    // Solo hace la búsqueda si hay al menos 2 caracteres
    if (query.length > 1) {
        fetchMatches2(query);
    } else {
        resultsContainer.innerHTML = ''; // Limpia si la entrada es muy corta
    }
});