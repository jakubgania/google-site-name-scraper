const puppeteer = require('puppeteer');

const siteName = 'pclab.pl';

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

    let stringResult = await page.evaluate(element => element.innerText, element);

    await browser.close();

    let numberResult = getNumberOfResults(stringResult);
    let clearNumberResult = clearingFromCommas(numberResult);

    console.log('raw result : ' + stringResult);
    console.log('extracted number : ' + numberResult);
    console.log('cleared and parsed number : ' + parseInt(clearNumberResult))
})();

// function works correctly for english language
function getNumberOfResults(stringResult) {
    let indexStart = 6; // About 10000 => about_ first letter starts at hte 6th position
    let indexEnd = stringResult.search('result');

    let numberResult = stringResult.slice(indexStart, indexEnd);
    numberResult = numberResult.trim();

    return numberResult;
}

function clearingFromCommas(text) {
    return text.replace(/,/g, '');
}