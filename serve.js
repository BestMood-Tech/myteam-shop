'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const proxy = require('http-proxy-middleware');
const app = express();

app.use(methodOverride());
app.use(bodyParser.json());
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(proxy('/games_api', {
  target: 'https://api-2445582011268.apicast.io',
  changeOrigin: true,
  pathRewrite: {
    '^/games_api': ''
  }
}));

app.use(express.static('dist'));

app.get('*', (request, response) => response.sendFile(__dirname + '/dist/index.html'));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));


app.listen(4200, 'localhost', () => console.log(`Listening on port 4200`));
