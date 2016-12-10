"use strict";

var express = require('express');
var faker = require('faker');
var app = express();

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
};


app.get('/api/selling', function (req, res) {
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
      data: faker.date.between()
    });
  }

  res.json(selling);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
