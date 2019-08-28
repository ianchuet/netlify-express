'use strict';

var applicationRoot = __dirname.replace(/\\/g,"/"),
  mockRoot = applicationRoot + '/api',
  mockFilePattern = '.json',
  mockRootPattern = mockRoot + '/**/*' + mockFilePattern,
  apiRoot = '/api';

var fs = require("fs");
var glob = require("glob");
var cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

var files = glob.sync(mockRootPattern);
if(files && files.length > 0) {
  files.forEach(function(filePathname) {
    var mapping = apiRoot + filePathname.replace(mockRoot, '').replace(mockFilePattern,'');
    var fileName = filePathname.split('/').pop();

    if (fileName === 'get.json') {
      mapping = mapping.substr(0, mapping.lastIndexOf("/"));
      app.get(mapping, function (req, res) {
        var data = fs.readFileSync(filePathname, 'utf8');
        let config = JSON.parse(data);
        var index = Math.floor(Math.random() * Math.floor(config.records.length));

        altFileName = config.records[index] + mockFilePattern;
        altFilePathname = filePathname.replace(/\/[^\/]*$/, '/' + altFileName)
        data = fs.readFileSync(altFilePathname, 'utf8');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(data);
        res.end();
      });
    } else {
      app.get(mapping, function (req, res) {
        var data = fs.readFileSync(filePathname, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(data);
        res.end();
      });
    }

    console.log('Registered mapping: %s -> %s', mapping, filePathname);
  })
} else {
  console.log('No mappings found! Please check the configuration.');
}


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
