'use strict';
const config = require('dotenv').config();
 
if (config.error) {
  throw config.error
}

var generatePassword = require('password-generator');
var utils = require('./sofiapi.utils.js');
var fs = require('fs')
var filename = './SQL/sofiapi/install.sql';
	
function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

function buildContainer() {
const PasswordGenerator = require('strict-password-generator').default;
const passwordGenerator = new PasswordGenerator();
const options = {
  upperCaseAlpha   : true,
  lowerCaseAlpha   : true,
  number           : true,
  specialCharacter : false,
  minimumLength    : 10,
  maximumLength    : 20
}

let containerName = "sofisql";
let password = '';
if(process.env.DB_PASS) {
  console.log('Developer password is configured.');
  password = process.env.DB_PASS;
}
else {
  password = passwordGenerator.generatePassword(options);
  console.log('Dev password is: ' + password);
}


var passwordParam = 'MSSQL_SA_PASSWORD=' + password;
utils.runCmd('docker',["pull","microsoft/mssql-server-linux:2017-latest"]);

console.log('Kill running sofisql');
utils.runCmd('docker',["kill","sofisql"]);
sleep(1000, function() {
   console.log('Delete running sofisql');
   utils.runCmd('docker',["rm","sofisql"]);
});

sleep(1000, function() {
   utils.runCmd('docker', ["run", "-e", "ACCEPT_EULA=Y", "-e", passwordParam, "-p:1433:1433", "-d", "--name", containerName, "microsoft/mssql-server-linux:2017-latest"]);
});

   console.log('Waiting 10 seconds for container to start...');
   sleep(10000, function() {
   console.log('Deploying Database...');
   utils.runCmd('docker',['cp', filename , containerName + ':/tmp/']);
   utils.runCmd('docker',["exec", containerName , "/opt/mssql-tools/bin/sqlcmd",  "-S", "localhost", "-U", "sa", "-P", password, "-i","/tmp/install.sql"]);
});

}

buildContainer();
