const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();

const fs = require('fs');
const md5 = require('crypto').createHash('md5');

router.post('/', async function (req, res) {
  res.setHeader('Content-Type', 'application/json');

  let output = '';
  const phone = md5.update(req.body.number).digest('hex');
  const dishs = JSON.parse(fs.readFileSync(`./data/${phone}-dishs.json`));
  const selectedDishIndex = req.body.digits;

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

  await page.goto(dishs[selectedDishIndex - 1]);

  const details = await page.evaluate(element => { return !!element ? element.textContent : '' }, await page.$(".dish-content__details"));
  const price = await page.evaluate(element => { return !!element ? element.textContent.substring(element.textContent.indexOf("R$")) : '' }, await page.$(".dish-price"));
  const serves = await page.evaluate(element => { return !!element ? element.textContent : '' }, await page.$(".dish-info-serves__details"));
  const restaurantTitle = await page.evaluate(element => { return !!element ? element.textContent : '' }, await page.$(".dish-restaurant__title"));
  const restaurantStars = await page.evaluate(element => { return !!element ? element.textContent : '' }, await page.$(".dish-restaurant__evaluation-value"));
  const deliveryTime = await page.evaluate(element => { return !!element ? element.textContent : '' }, await page.$(".dish-restaurant__delivery-time"));
  const deliveryPrice = await page.evaluate(element => { return !!element ? element.textContent : '' }, await page.$(".dish-restaurant__delivery-price"));

  output += `O prato ${details} `;

  const splitPrice = price.split("R$");
  if (splitPrice.length > 2) {
    console.log(splitPrice);
    // promo
    output += ` está em promoção de ${splitPrice[2].replace(',00', ' reais').replace(',', ' e ')} por ${splitPrice[1].replace(',00', ' reais').replace(',', ' e ')} `
  } else {
    output += ` está no valor de ${splitPrice[1].replace(',00', ' reais').replace(',', ' e ')} `
  }

  if (!!serves) output += ` e ${serves} . . . . . .`

  output += `o restaurante ${restaurantTitle} possui ${restaurantStars} estrelas `;

  if (deliveryPrice === 'Grátis') {
    output += `O entrega é grátis `
  } else {
    output += `A entrega fica no valor de ${deliveryPrice.replace('R$ ', '').replace(',00', ' reais').replace(',', ' e ')} `
  }

  output += `e deve demorar entre ${deliveryTime.replace('-', ' e ').replace('min', 'minutos')} `

  await browser.close();

  fs.writeFile(
    `./data/${phone}-selected.json`,
    JSON.stringify([dishs[selectedDishIndex - 1]]),
    function (err) {
      if (err) {
        console.error('Crap happens');
      }
    }
  );

  res.end(JSON.stringify({ say: output.replace('\n', '. . . . . .') }));
});

module.exports = router;