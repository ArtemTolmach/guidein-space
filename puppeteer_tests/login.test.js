const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/google-chrome'
    });

    const page = await browser.newPage();

    await page.goto('http://127.0.0.1:8000/login/');

    await page.type('#id_username', 'root');
    await page.type('#id_password', 'root');

    await Promise.all([
        page.click('.btn'),
        page.waitForNavigation()
    ]);

    const currentUrl = page.url();

    if (currentUrl !== 'http://127.0.0.1:8000/login/') {
        console.log('The login was completed successfully!');
    } else {
        console.log('Failed to login.');
    }

    await browser.close();
})();
