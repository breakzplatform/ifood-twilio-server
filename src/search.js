const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();

const fs = require('fs');

router.post('/', async function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  let output = '';
  let sel = '';
  const phone = req.body.number.trim();
  const searchFoodItem = req.body.search.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

  const browser = await puppeteer.launch({
    userDataDir: './puppeteer-data',
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080
  });

  await page.goto('https://www.ifood.com.br/busca?type=RESTAURANT&tab=2&q=' + encodeURIComponent(searchFoodItem));

  await page.waitForSelector('ul.dish-list__container');
  await page.waitForSelector('ul.dish-list__container li:nth-child(1)');

  const totalItems = await page.evaluate(element => { return !!element ? element.textContent.split("(")[1].split(")")[0] : '' }, await page.$("#marmita-tab1-1"));

  sel = 'a.dish-card';
  const dishsLinks = await page.evaluate((sel) => {
    let elements = Array.from(document.querySelectorAll(sel));
    let links = elements.map(element => {
      return element.href
    })
    return links;
  }, sel);

  sel = '.dish-card__info-top h3.dish-card__description';
  const dishTitles = await page.evaluate((sel) => {
    let elements = Array.from(document.querySelectorAll(sel));
    let links = elements.map((element, i) => {
      return element.innerText
    })
    return links;
  }, sel);

  sel = '.dish-card__price';
  const dishPrices = await page.evaluate((sel) => {
    let elements = Array.from(document.querySelectorAll(sel));
    let links = elements.map(element => {
      return element.innerText.split("R$ ")[1]
    })
    return links;
  }, sel);

  await browser.close();

  const longPause = ". . . . . . . . . . . . . . .";
  const smallPause = ". . . . . . . .";

  output += `${totalItems} resultados de ${searchFoodItem} que entregam na sua região. ${longPause}`;

  for (index = 0; index < 9; index++) {
    output += `Para ${dishTitles[index]}, no valor de ${dishPrices[index].replace(',00', ' reais').replace(',', ' e ')}, digite ${smallPause}${index + 1}`;
    output += longPause
  }

  fs.writeFile(
    `./data/${phone}-dishs.json`,
    JSON.stringify(dishsLinks),
    function (err) {
      if (err) {
        console.error('Crap happens');
      }
    }
  );

  res.end(JSON.stringify({ say: output }));
});

module.exports = router;