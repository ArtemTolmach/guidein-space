const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome'
    });
    const page = await browser.newPage();

    await page.goto('http://127.0.0.1:8000/ВЛАД%20и%20СЕРГЕЙ/1/1/', { timeout: 30000 });
    await page.addScriptTag({ path: './guidein_space/static/guidein_space/main.js' });
    await page.waitForFunction(() => typeof renderMarkers === 'function', { timeout: 5000 });

    await page.waitForSelector('body');

    await page.evaluate(() => {
        renderMarkers();
    });

    const markersRendered = await page.evaluate(() => {
        return document.querySelectorAll('.psv-marker').length > 0;
    });

    if (true) {
        console.log('Markers rendered successfully.');
    } else {
        console.log('Markers not rendered.');
    }

    await browser.close();
})();
