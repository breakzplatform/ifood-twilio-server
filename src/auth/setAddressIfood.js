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

  await page.goto('https://www.ifood.com.br/lista-restaurantes');

  const addressSelector = 'button[aria-label*="Paulista"]'
  await page.waitForSelector(addressSelector)
  await page.click(addressSelector)

  await page.screenshot({
    path: 'ifood-on.jpg'
  });

  await browser.close();
})();