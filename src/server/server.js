"use strict";

const express = require('express');
const faker = require('faker');
const app = express();

/*******************
 * *** Routes *** *
 *******************/

app.get('/api/selling', getSelling);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});


/**********************
 * *** Middleware *** *
 **********************/

function getSelling(req, res) {
  let selling = [];
  let lastIndex = getRandom(5);

  for(let i = 0;i < lastIndex; i++) {
    selling.push({
      orders: getOrders(),
      total: getRandom(1000),
      formProfile: {
        promoCode: faker.lorem.word(),
        address: getAddress(),
        payment: getKeyPayment(getRandom(6))
      },
      addressOrder: getAddress(),
      data: new Date(faker.date.past())
    });
  }

  res.json(selling);
}


function getRandom(max) {
  return Math.floor(Math.random()*(max));
}

function getKeyType(key) {
  let type = ["music","game","movie"];
  return type[key];
}

function getKeyPayment(key) {
  let payment = ["PayPal", "CreditCard", "Cash", "WebMoney", "QIWI", "Bitcoin"];
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

function getOrders() {
  let orders = [];
  let lastIndex = getRandom(10);

  for(let i = 0; i<lastIndex; i++) {
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
