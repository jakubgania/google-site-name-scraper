const puppeteer = require('puppeteer');

const siteName = 'example.com';

// problem - if the result equals 1 problem with parsing the number

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
    let [pagination] = await page.$x('/html/body/div[6]/div[2]/div[9]/div[1]/div[2]/div/div[5]/div[2]/span[1]/div/table/tbody/tr');

    let stringResult = await page.evaluate(element => element.innerText, element);
    let paginationResult = await page.evaluate(pagination => pagination.childElementCount, pagination);

    paginationResult = paginationResult > 0 ? 'yes' : 'no';

    await browser.close();

    let numberResult = getNumberOfResults(stringResult);
    let clearNumberResult = clearingFromCommas(numberResult);

    console.log('raw result : ' + stringResult);
    console.log('pagination : ' + paginationResult);
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