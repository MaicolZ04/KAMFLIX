// Reemplaza con tu propia API Key de TMDB
const apiKey = '30fcb8c771c8b59de36e603d4eb75364'; 
const movieGrid = document.getElementById('movie-grid');

// Función para obtener las películas populares
async function fetchMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-MX&page=1`);
        const data = await response.json();
        displayMovies(data.results); // Llama a la función para mostrar las películas
    } catch (error) {
        console.error('Error al obtener las películas:', error);
    }
}

// Función para mostrar las películas en el grid
function displayMovies(movies) {
    movieGrid.innerHTML = ''; // Limpia el contenedor antes de agregar nuevas películas

    movies.forEach(movie => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`; // URL de la imagen
        img.alt = movie.title; // Texto alternativo para la imagen

        const title = document.createElement('h3');
        title.textContent = movie.title; // Título de la película

        const overview = document.createElement('p');
        overview.textContent = movie.overview; // Descripción de la película

        // Agrega la imagen y el título al grid item
        gridItem.appendChild(img);
        gridItem.appendChild(title);
        gridItem.appendChild(overview);

        // Agrega el grid item al contenedor
        movieGrid.appendChild(gridItem);
    });
}

// Llama a la función para obtener las películas al cargar la página
fetchMovies();

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