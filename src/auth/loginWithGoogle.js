const puppeteer = require('puppeteer');
const sleep = require("sleep-promise");
// const rimraf = require('rimraf');

(async function main() {
  const browser = await puppeteer.launch({
    // executablePath: 'chrome.exe',
    userDataDir: './puppeteer_user_data',
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080
  });

  const navigationPromise = page.waitForNavigation()

  await page.goto('https://accounts.google.com/')

  await navigationPromise

  await page.waitForSelector('input[type="email"]')
  await page.click('input[type="email"]')

  await navigationPromise

  //TODO : change to your email 
  await page.type('input[type="email"]', 'noreply@joselitojunior.com')

  await page.waitForSelector('#identifierNext')
  await page.click('#identifierNext')

  await sleep(1000);

  await page.waitForSelector('input[type="password"]')
  await page.click('input[type="email"]')
  await sleep(1000);

  //TODO : change to your password
  await page.type('input[type="password"]', 'ylsDtmA\\22pvhctiox')

  await page.waitForSelector('#passwordNext')
  await page.click('#passwordNext')

  await navigationPromise

  await page.screenshot({
    path: 'login.jpg'
  });

  await browser.close();
})();