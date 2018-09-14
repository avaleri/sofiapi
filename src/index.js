var express = require('express');
var app = express();
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
const dotenvConfig = require('dotenv').config();
var bodyParser = require('body-parser');

if (dotenvConfig.error) {
  throw dotenvConfig.error
}

// Create connection to database
var config = {
    userName: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    server: process.env.DB_HOST,
    options: {
        database: process.env.DB_NAME,
        encrypt: true,
        rowCollectionOnDone: true,
        rowCollectionOnRequestCompletion: true
    }
  }

  var buildParams = function(keys,sourceObj, output) {
     var result = [];
     if(keys && keys.length > 0) {
        for(var i = 0; i < keys.length; i++) {
            var param = {};
             for(var j = 0; j < output.parameters.length; j++) {
                 if(output.parameters[j].PARAMETER_NAME == '@' + keys[i])
                 {
                     var newParam = {};
                     newParam.PARAMETER_NAME = keys[i];
                     newParam.ROUTINE_NAME = output.parameters[j].ROUTINE_NAME;
                     newParam.ORDINAL_POSITION = output.parameters[j].ORDINAL_POSITION;
                     newParam.PARAMETER_MODE = output.parameters[j].PARAMETER_MODE;
                     newParam.DATA_TYPE = output.parameters[j].DATA_TYPE;
                     newParam.VALUE = sourceObj[keys[i]];
                     result.push(newParam);
                 }
             }
        }
    }
    return result;
  }

  var getParams = function(req, output) {

        var queryParams = req.query;
        var result = [];
        var keys = [];

        console.log('Getting parameters.');
        if(queryParams) {
            keys = Object.keys(queryParams);
        }

        if(keys && keys.length > 0) {
            console.log('Reading from querystring.');
            result = buildParams(keys,queryParams,output);
        }
        else {
            // 
            console.log('Reading from body');
            var bodyObj = req.body;
            if(bodyObj) {
                var keys = Object.keys(bodyObj);
                result = buildParams(keys,bodyObj,output);
            }
        }
        return result;
    }

    var executeProc = function(procName, params, output, res, next) {
        var request = new Request(procName, function(err, rowCount) {
            if(err) {
                console.log(err);
            }
        });

        var results = [];
        request.on('doneInProc', function(rowCount, more, rows) {

            var output = [];
            for(var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var obj = {};
                for(var j = 0; j < row.length; j++) {
                    var col = row[j];                   
                    obj[col.metadata.colName] = col.value;
                }
                results.push(obj);
            }
        });


        request.on('doneProc', function(rowCount, more, rows) {
            console.log('Finished executing proc: ' + procName);         
            res.status(200).end(JSON.stringify(results));
        });

        if(params && params.length > 0) {
            for(var i = 0; i < params.length; i++) {
                request.addParameter(params[i].PARAMETER_NAME, TYPES.NVarChar, params[i].VALUE);
            }
        }

        var connection = new Connection(config);
        connection.on('connect', function(err) {
            if(err) {
                console.log(err);
                next();
            }
            else {
                connection.callProcedure(request);
            }
        })
    };

    var executeRoute = function(req, output, res, next) {
       var params = getParams(req, output);
       if(params && params.length > 0) {
          console.log('Executing proc ' + params[0].ROUTINE_NAME);
          console.log('Parameters:');
          console.log(params);
          executeProc(params[0].ROUTINE_NAME,params,output,res,next);
       }
       else {
           if(output.metadata.AllowNoParameters == 1) {
            executeProc(output.metadata.RouteCommand, null, res, next);
           }
           else {
              next();
           }
       }
    };

  var getRoute = function(req, res, next) {
    var RoutePath = req.path;
    var request = new Request('usp_Routes_SelByPath', function(err, rowCount) {
            
            if(err) {
                console.log(err);
            }
            // log error
        });

        request.addParameter('RoutePath', TYPES.NVarChar, RoutePath); 

        var results = [];
        request.on('doneInProc', function (rowCount, more, rows) { 
            var output = [];
            for(var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var obj = {};
                for(var j = 0; j < row.length; j++) {
                    var col = row[j];                  
                    obj[col.metadata.colName] = col.value;
                }
                output.push(obj);
            }
            if(output.length > 0) {
               results.push(output);
            }
        });

        request.on('doneProc', function(rowCount, more, rows) {
            var routeData = {};
            if(results && results.length > 0) {
               routeData['metadata'] = results[0][0];
               routeData['parameters'] = results[1];
               executeRoute(req,routeData,res,next);
            }
            else {
                next();
            }
        });

    var connection = new Connection(config);
    // Attempt to connect and execute queries if connection goes through
    connection.on('connect', function(err) {
    if (err) {
        console.log(err);
    } else {
        connection.callProcedure(request);       
    }
    });

  }


var routeMiddleware = function (req, res, next) {
    console.log('Route middleware called.');
    getRoute(req, res, next);
}


app.use(express.json());
app.use(express.urlencoded());

  // static file handling
app.use("/admin", express.static(__dirname + '/admin'));
app.use(routeMiddleware);
app.use( bodyParser.json() );       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//  extended: true
//})); 

app.listen(3000);