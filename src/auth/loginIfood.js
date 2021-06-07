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

  await page.goto('https://www.ifood.com.br/entrar');
  const navigationPromise = page.waitForNavigation()

  await sleep(600)

  const googleLoginButtonSelector = 'button[label*="Google"]'
  await page.waitForSelector(googleLoginButtonSelector)
  await page.click(googleLoginButtonSelector)

  const googleOAuthTarget = await browser.waitForTarget(target => {
    console.log(target.url()); // debugging
    return target.url().indexOf('https://accounts.google.com/signin/oauth/identifier') !== -1
  })

  const googleOAuthPage = await googleOAuthTarget.page()

  await googleOAuthPage.waitForSelector('#identifierId')
  // await googleOAuthPage.type('#identifierId', CRED.user, { delay: 5 })
  await googleOAuthPage.click('#identifierNext')

  await navigationPromise;

  await browser.close();
})();