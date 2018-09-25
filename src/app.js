var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sofiapi = require('./sofiapi.js');
var Connecton = require('tedious').Connection;
var Request = require('tedious').Request;

function StartApp(config) { 

sofiapi.configure(config, Connecton, Request);
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