const apiKey = '30fcb8c771c8b59de36e603d4eb75364'; // Reemplaza con tu API Key de TMDB
    const movieGrid = document.getElementById('movie-grid');
    const carruselItem = document.getElementById('carrusel-item');
    let currentIndex = 0;
    let movies = [];

    async function fetchMovies() {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-MX&page=1`);
        const data = await response.json();
        movies = data.results; // Almacena las películas en una variable global
        displayMovies(movies);
        displayCarrusel(movies);
    }

    function displayMovies(movies) {
        movies.forEach(movie => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');

            const img = document.createElement('img');
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            img.alt = movie.title;

            const infoOverlay = document.createElement('div');
            infoOverlay.classList.add('info-overlay');
            infoOverlay.innerHTML = `
                <h3>${movie.title}</h3>
                <p>Calificación: ${movie.vote_average}</p>
            `;

            gridItem.appendChild(img);
            gridItem.appendChild(infoOverlay);
            movieGrid.appendChild(gridItem);

            infoOverlay.innerHTML = `
            <h3>${movie.title}</h3>
            <p>${movie.overview}</p>
            <div class="rating">
                <span class="stars">${getStars(movie.vote_average)}</span>
                <span class="score">${movie.vote_average}/10</span>
            </div>
            <button class="play-button" onclick="window.location.href='reproductor.html?id=${movie.id}'">▶</button>
            `;
        });
    }

    function displayCarrusel(movies) {
        if (movies.length > 0) {
            updateCarrusel(movies[currentIndex]); // Muestra la primera película en el carrusel
            setInterval(() => {
                currentIndex = (currentIndex + 1) % movies.length; // Incrementa el índice y vuelve al inicio si es necesario
                updateCarrusel(movies[currentIndex]);
            }, 30000); // Cambia cada 3 segundos
        }
    }

    function updateCarrusel(movie) {
        carruselItem.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`;
        carruselItem.innerHTML = `
            <h2>${movie.title}</h2>
            <p>Calificación: ${movie.vote_average}</p>
        `;
    }

    function updateCarrusel(movie) {
        carruselItem.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`; // Cambia 'w500' a 'original'
        carruselItem.innerHTML = `
            <h2>${movie.title}</h2>
            <p>Calificación: ${movie.vote_average}</p>
        `;
    }

    function updateCarrusel(movie) {
        const carruselItem = document.getElementById('carrusel-item');
        carruselItem.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`; // Usa la imagen de mayor calidad
        document.getElementById('carrusel-title').innerText = movie.title; // Actualiza el título
        document.getElementById('carrusel-rating').innerText = `Calificación: ${movie.vote_average}`; // Actualiza la calificación
    }

    document.getElementById('menu-toggle').addEventListener('click', function() {
        const menuContainer = document.getElementById('menu-container');
        menuContainer.classList.toggle('active'); // Alternar la clase 'active' para mostrar/ocultar el menú
    });

    // Llama a la función para obtener las películas al cargar la página
    fetchMovies();

    // BUSCADOR
    const resultadoBusqueda = document.getElementById('resultado-busqueda');
const busquedaInput = document.getElementById('busqueda-input');

busquedaInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') { // Verifica si la tecla presionada es "Enter"
        const query = busquedaInput.value.trim(); // Elimina espacios en blanco

        if (query.length > 2) { // Solo buscar si hay más de 2 caracteres
            try {
                const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
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

function mostrarResultados(peliculas) {
    resultadoBusqueda.innerHTML = ''; // Limpiar resultados anteriores

    if (peliculas.length === 0) {
        resultadoBusqueda.innerHTML = '<p>No se encontraron resultados.</p>';
        resultadoBusqueda.style.display = 'block'; // Mostrar el contenedor
        return;
    }

    peliculas.forEach(pelicula => {
        const div = document.createElement('div');
        div.classList.add('resultado-pelicula');

        // Crear la tarjeta con la imagen y la información
        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
            <h3>${pelicula.title}</h3>
            <p>Fecha de lanzamiento: ${pelicula.release_date}</p>
            <p>Calificación: ${pelicula.vote_average}</p>
            <p>${pelicula.overview}</p> <!-- Descripción de la película -->
        `;

        resultadoBusqueda.appendChild(div);
    });

    resultadoBusqueda.style.display = 'flex'; // Mostrar el contenedor
}

function getStars(vote_average) {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (vote_average >= (i + 1) * 2) {
        stars.push('&#9733;');
      } else {
        stars.push('&#9734;');
      }
    }
    return stars.join('');
  }

  const playButton = infoOverlay.querySelector('.play-button');
playButton.addEventListener('click', () => {
  window.location.href = `reproductor.html?id=${movie.id}`;
});


