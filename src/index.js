var express = require('express');
var app = express();
const dotenvConfig = require('dotenv').config();
var bodyParser = require('body-parser');
var sofiapi = require('./sofiapi.js');

if (dotenvConfig.error) {
  throw dotenvConfig.error
}

/*
Parameters to configure in .env file:
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
APP_NAME=
DB_CONTAINER_NAME=
APP_PORT=
*/

// Create connection to database
var config = {
    userName: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    server: process.env.DB_HOST,
    appName: process.env.APP_NAME,
    appPort: process.env.APP_PORT,
    options: {
        database: process.env.DB_NAME,
        encrypt: true,
        rowCollectionOnDone: true,
        rowCollectionOnRequestCompletion: true
    }
  }
sofiapi.configure(config);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

  // static file handling
app.use("/admin", express.static(__dirname + '/admin'));
app.use(sofiapi.routeMiddleware);
app.use(bodyParser.json());       // to support JSON-encoded bodies


app.use("/testerror", function(req,res) {
    throw new Error('err0r!');
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    sofiapi.logError(err, req)
    res.status(err.status || 500);
    res.send('An error occured while processing your request.');
});

app.listen(config.appPort);