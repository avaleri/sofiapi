var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sofiapi = require('./sofiapi.js');
var Connecton = require('tedious').Connection;
var Request = require('tedious').Request;
var winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

function StartApp(config) { 

sofiapi.configure(config, Connecton, Request, logger);
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

}

module.exports = {
    StartApp: StartApp
}