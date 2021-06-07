const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/', async function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  const foodItem = parseInt(req.body.item);
  const activeDish = JSON.parse(fs.readFileSync('./data/links.json'));

  let sel = '';
  let output = '';

  const browser = await puppeteer.launch({
    userDataDir: './puppeteer_user_data',
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1366,
    height: 768
  });

  await page.goto(activeDish[0]);

  await page.waitForSelector("button[aria-label*='Adicionar']");
  await page.click("button[aria-label*='Adicionar']");


  await page.goto("https://www.ifood.com.br/pedido/finalizar");

  // await browser.close();

  // fs.writeFile(
  //   './data/activeDish.json',
  //   JSON.stringify([foodLinks[foodItem - 1]]),
  //   function (err) {
  //     if (err) {
  //       console.error('Crap happens');
  //     }
  //   }
  // );

  res.end(JSON.stringify({ say: "dale" }));
});

module.exports = router;