const puppeteer = require('puppeteer');

const siteName = 'github.com';

(async () => {
    const browser = await puppeteer.launch({
        args: ['--lang=en-GB']
    });
    const page = await browser.newPage();

    await page.setViewport({ width: 1600, height: 900 });

    await page.goto(`https://www.google.com/search?q=site%3A${siteName}`);
    await page.waitFor(2000);

    await page.waitForXPath('/html/body/div[6]/div[2]/div[6]/div/div/div');

    let [element] = await page.$x('/html/body/div[6]/div[2]/div[6]/div/div/div/div/div');

    let result = await page.evaluate(element => element.innerText, element);

    await browser.close();

    console.log(result)
})();