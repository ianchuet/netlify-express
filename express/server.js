'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors);

const router = express.Router();
router.get('/', cors(), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!!!</h1>');
  res.end();
});

router.post(/.*/, cors(), (req, res) => {
  res.redirect("https://quest-mock-api.requestcatcher.com/test");
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', cors(), router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
