const puppeteer = require('puppeteer');

const mainUrl = 'https://ww3.pelisplus.to/search/'; // URL de la página principal
const searchQuery = 'IntensaMente 2'; // Cambia esto al nombre de la película que deseas buscar

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const scrapeVideoFromIframe = async () => {
    // Inicia el navegador en modo headless
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(mainUrl, { waitUntil: 'networkidle2' });

    // Busca la película
    await page.type('input#search', searchQuery); // Selector para el campo de búsqueda
    await page.keyboard.press('Enter'); // Simula presionar Enter para buscar

    // Espera a que se carguen los resultados
    await page.waitForSelector('img.lazyloaded');

    // Haz clic en el primer resultado
    const firstResultSelector = 'img.lazyloaded';
    await page.waitForSelector(firstResultSelector);
    const firstResult = await page.$(firstResultSelector);
    if (firstResult) {
        await firstResult.click();
    } else {
        console.log('No se encontró el primer resultado.');
        await browser.close();
        return;
    }

    // Espera a que se cargue la página de la película
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Espera a que el span del botón de "play" esté disponible
    const playButtonSelector = 'span.pab';
    await page.waitForSelector(playButtonSelector, { timeout: 10000 });

    // Haz clic en el span del botón de "play"
    await page.click(playButtonSelector);
    console.log('Se hizo clic en el botón de play.');

    // Espera 10 segundos para que el iframe se cargue
    await sleep(10000);

    // Espera a que el div que contiene el video esté disponible
    const videoDivSelector = '#video';
    await page.waitForSelector(videoDivSelector, { timeout: 10000 });

    // Extrae el iframe y su atributo data-src
    const iframe = await page.$(`${videoDivSelector} iframe`);
    if (iframe) {
        const videoSrc = await iframe.evaluate(iframe => iframe.getAttribute('data-src'));
        console.log('URL del video:', videoSrc);

        // Convertir la URL relativa en absoluta
        const absoluteVideoUrl = `https://ww3.pelisplus.to${videoSrc}`;
        console.log('URL del video absoluta:', absoluteVideoUrl);

        // Aquí puedes agregar el video a tu reproductor
        // En un entorno de servidor, puedes enviar esta URL al cliente
        return absoluteVideoUrl; // Devuelve la URL del video
    } else {
        console.log('No se encontró el iframe del video.');
    }

    await browser.close();
};
