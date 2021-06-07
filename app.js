const express = require('express')
const app = express()
const port = 5001

const search = require('./src/search');
const dish = require('./src/dish');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('webmaster@joseli.to')
})

app.use('/search', search);
app.use('/dish', dish);

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
