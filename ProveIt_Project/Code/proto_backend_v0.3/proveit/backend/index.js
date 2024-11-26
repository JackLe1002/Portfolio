var express = require('express');
const cors = require('cors');   //deal with CORS problem when communicating front end and back end
require('dotenv').config();     //for import token from .env file

var app = express();
app.use(cors());
const routesHandler = require('./routes/handler.js');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routesHandler);

var server = app.listen(5000, function () {
    console.log('Node server is running..');
});