const apiKey = '30fcb8c771c8b59de36e603d4eb75364'; // Reemplaza con tu API Key de TMDB
const movieGrid = document.getElementById('movie-grid');
const resultadoBusqueda = document.getElementById('resultado-busqueda');
const busquedaInput = document.getElementById('busqueda-input');

async function fetchSeries() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=es-MX&page=1`);
        const data = await response.json();
        displaySeries(data.results); // Muestra las series obtenidas
    } catch (error) {
        console.error('Error al obtener las series:', error);
    }
}

function displaySeries(series) {
    movieGrid.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas series

    series.forEach(serie => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${serie.poster_path}`;
        img.alt = serie.name;

        const infoOverlay = document.createElement('div');
        infoOverlay.classList.add('info-overlay');
        infoOverlay.innerHTML = `
            <h3>${serie.name}</h3>
            <p>Calificación: ${serie.vote_average}</p>
        `;

        gridItem.appendChild(img);
        gridItem.appendChild(infoOverlay);
        movieGrid.appendChild(gridItem);

        infoOverlay.innerHTML += `
            <p>${serie.overview}</p>
            <div class="rating">
                <span class="stars">${getStars(serie.vote_average)}</span>
                <span class="score">${serie.vote_average}/10</span>
            </div>
            <button class="play-button" onclick="window.location.href='reproductor.html?id=${serie.id}'">▶</button>
        `;
    });
}

function getStars(vote_average) {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (vote_average >= (i + 1) * 2) {
            stars.push('&#9733;'); // Estrella llena
        } else {
            stars.push('&#9734;'); // Estrella vacía
        }
    }
    return stars.join('');
}

// Llama a la función para obtener las series al cargar la página
fetchSeries();

// BUSCADOR
busquedaInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') { // Verifica si la tecla presionada es "Enter"
        const query = busquedaInput.value.trim(); // Elimina espacios en blanco

        if (query.length > 2) { // Solo buscar si hay más de 2 caracteres
            try {
                const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}`); // Cambia 'movie' a 'tv'
                if (!response.ok) {
                    throw new Error('Error en la solicitud a la API');
                }
                const data = await response.json();
                mostrarResultados(data.results);
            } catch (error) {
                console.error('Error:', error);
                resultadoBusqueda.innerHTML = '<p>Error al buscar resultados.</p>';
                resultadoBusqueda.style.display = 'block'; // Mostrar el contenedor
            }
        } else {
            resultadoBusqueda.innerHTML = ''; // Limpiar resultados si hay menos de 3 caracteres
            resultadoBusqueda.style.display = 'none'; // Ocultar el contenedor
        }
    }
});

function mostrarResultados(series) { // Cambia 'peliculas' a 'series'
    resultadoBusqueda.innerHTML = ''; // Limpiar resultados anteriores

    if (series.length === 0) {
        resultadoBusqueda.innerHTML = '<p>No se encontraron resultados.</p>';
        resultadoBusqueda.style.display = 'block'; // Mostrar el contenedor
        return;
    }

    series.forEach(serie => { // Cambia 'pelicula' a 'serie'
        const div = document.createElement('div');
        div.classList.add('resultado-pelicula');

        // Crear la tarjeta con la imagen y la información
        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="${serie.name}"> <!-- Cambia 'pelicula.title' a 'serie.name' -->
            <h3>${serie.name}</h3> <!-- Cambia 'pelicula.title' a 'serie.name' -->
            <p>Fecha de lanzamiento: ${serie.first_air_date}</p> <!-- Cambia 'pelicula.release_date' a 'serie.first_air_date' -->
            <p>Calificación: ${serie.vote_average}</p>
            <p>${serie.overview}</p> <!-- Descripción de la serie -->
        `;

        resultadoBusqueda.appendChild(div);
    });

    resultadoBusqueda.style.display = 'flex'; // Mostrar el contenedor
}

// Llama a la función para obtener las series al cargar la página
fetchSeries();