'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const faker = require('faker');
const app = express();

app.use(methodOverride());
app.use(bodyParser.json());
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(express.static('dist'));

app.get('/api/selling', getSelling);
app.get('*', (request, response) => response.sendFile(__dirname + '/dist/index.html'));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));


app.listen(4200, 'localhost', () => console.log(`Listening on port 4200`));

/**********************
 * *** Middleware *** *
 **********************/

function getSelling (req, res) {

  let from = req.query.from ? `${req.query.from}-01-01` : '2014-01-01';
  let to = req.query.from ? `${req.query.to}-11-31` : '2016-11-31';

  let selling = [];
  let lastIndex = getRandom(500);

  for (let i = 0; i < lastIndex; i++) {
    selling.push({
      orders: getOrders(),
      total: getRandom(1000),
      formProfile: {
        promoCode: faker.lorem.word(),
        address: getAddress(),
        payment: getKeyPayment(getRandom(5)),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
      addressOrder: getAddress(),
      date: new Date(faker.date.between(from, to))
    });
  }

  res.json(selling);
}


/*******************
 * *** Common *** *
 *******************/

function getRandom (max) {
  return Math.floor(Math.random() * (max + 1));
}

function getKeyType (key) {
  let type = ['music', 'game', 'movie'];
  return type[key];
}

function getKeyPayment (key) {
  let payment = ['PayPal', 'CreditCard', 'Cash', 'WebMoney', 'QIWI', 'Bitcoin'];
  return payment[key];
}

function getAddress () {
  return {
    streetAddress: faker.address.streetAddress(),
    addressLine2: faker.address.secondaryAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zip: faker.address.zipCode(),
    country: faker.address.country()
  }
}

function getOrders () {
  let orders = [];
  let lastIndex = 2 + getRandom(10);

  for (let i = 0; i < lastIndex; i++) {
    orders.push({
      id: faker.random.number(),
      type: getKeyType(getRandom(3)),
      name: faker.lorem.words(),
      cover: faker.image.imageUrl(),
      description: faker.lorem.paragraph(),
      price: getRandom(100)
    })
  }
  return orders;
}
