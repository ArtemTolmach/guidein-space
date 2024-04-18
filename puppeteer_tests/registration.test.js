const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/usr/bin/google-chrome'
    });

    const page = await browser.newPage();

    await page.goto('https://guidein.site/register/');

    await page.type('#id_username', 'testingUser' + Math.random());
    await page.type('#id_email', 'testingmail.com');
    await page.type('#id_password1', 'TOP_TiGAR_ONE_111');
    await page.type('#id_password2', 'TOP_TiGAR_ONE_111');

    try {
        await Promise.all([
            page.click('.btn'),
            page.waitForNavigation({ timeout: 5000 })
        ]);
        console.log('Registration was completed successfully!');
    } catch (err) {
        console.log('Registration failed with error. ' + err);
    }

    await browser.close();
})();
