const urlParams = new URLSearchParams(window.location.search);
const idPelicula = urlParams.get('id');
const api_key = '30fcb8c771c8b59de36e603d4eb75364';
const tmdbUrl = `https://api.themoviedb.org/3/movie/${idPelicula}?api_key=${api_key}&language=es-MX`;

fetch(tmdbUrl)
    .then(response => response.json())
    .then(data => {
        const titulo = data.title;
        document.getElementById('titulo').textContent = titulo;
        document.getElementById('imagen-contenido').src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

        // Cargar videos.json y buscar la URL correspondiente
        fetch('videos.json')
            .then(response => response.json())
            .then(videos => {
                const video = videos.find(video => video.title === titulo);
                if (video) {
                    document.getElementById('video-player').src = video.url; // Asigna la URL al iframe
                } else {
                    console.error('No se encontró el video para esta película.');
                }
            })
            .catch(error => console.error('Error al cargar videos.json:', error));
    })
    .catch(error => console.error('Error al obtener datos de TMDB:', error));