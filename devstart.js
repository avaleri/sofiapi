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


function pingSql(currentTime) {
  var timeOut = 15000;
  setTimeout(() => {
    utils.runCmd('docker',["exec", containerName , "/opt/mssql-tools/bin/sqlcmd",  "-S", "localhost", "-U", "sa", "-P", password, "-Q","select 'hello'"], 
      function(data) 
      { 
        if(data.indexOf('hello') != -1) { 
          console.log("DB is running.");
          console.log('Deploying Database...');
          utils.runCmd('docker',['cp', filename , containerName + ':/tmp/']);
          utils.runCmd('docker',["exec", containerName , "/opt/mssql-tools/bin/sqlcmd",  "-S", "localhost", "-U", "sa", "-P", password, "-i","/tmp/install.sql"], deployFinished);
        }
        else {
          currentTime+= 1000;
          if(currentTime > timeOut) {
            console.log('Timeout exceeded pinging SQL server.');
          }
          else {
            console.log('Pinging SQL (again)');
            pingSql(currentTime);
          }
          
        }
      }
      );
     }   
   , 1000);
}

var passwordParam = 'MSSQL_SA_PASSWORD=' + password;

function pullContainer() {
  utils.runCmd('docker',["pull","microsoft/mssql-server-linux:2017-latest"], killRunningContainer);
}

function killRunningContainer() {
  console.log('Kill running sofisql');
  utils.runCmd('docker',["kill","sofisql"], deleteContainer); 
}

function deleteContainer() {
  console.log('Delete running sofisql');
  utils.runCmd('docker',["rm","sofisql"], createContainer);
}

function createContainer() {
  utils.runCmd('docker', ["run", "-e", "ACCEPT_EULA=Y", "-e", passwordParam, "-p:1433:1433", "-d", "--name", containerName, "microsoft/mssql-server-linux:2017-latest"], deployDatabase);
}

function deployDatabase() {
  console.log('Waiting for 5 seconds (give services some time to start)...');
  sleep(5000, function() {
    console.log('Pinging SQL.');
  pingSql(0);
  });
}

function deployFinished() {
  console.log('Deployment Finished.');
}
pullContainer();

}

buildContainer();
