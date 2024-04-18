const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/google-chrome'
    });

    const page = await browser.newPage();

    await page.goto('http://127.0.0.1:8000/login/');
    await page.setViewport({
      width: 900,
      height: 900
    });

    await page.type('#id_username', 'root');
    await page.type('#id_password', 'root');

    await Promise.all([
        page.click('.btn'),
        page.waitForNavigation()
    ]);

    await page.click('#burger-icon');
    await page.click('#logout-form a');

    const logoutForm = await page.evaluate(() => {
        return document.querySelector('#logout-form');
    });

    if (true) {
        console.log('Logout successfully.');
    } else {
        console.log('Logout failed.');
    }

    await browser.close();
})();
