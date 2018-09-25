var os = require('os');
var Connection = null;
var Request = null
var TYPES = require('tedious').TYPES;
var config = {};

function buildParams(keys, sourceObj, output) {
    var result = [];
    if(keys && keys.length > 0) {
       for(var i = 0; i < keys.length; i++) {
           var param = {};
            for(var j = 0; j < output.parameters.length; j++) {
                if(output.parameters[j].PARAMETER_NAME == '@' + keys[i])
                {
                    var newParam = {};
                    newParam.ROUTINE_NAME = output.parameters[j].ROUTINE_NAME;
                    newParam.ORDINAL_POSITION = output.parameters[j].ORDINAL_POSITION;
                    newParam.PARAMETER_MODE = output.parameters[j].PARAMETER_MODE;
                    newParam.PARAMETER_NAME = keys[i];
                    newParam.DATA_TYPE = output.parameters[j].DATA_TYPE;
                    newParam.VALUE = sourceObj[keys[i]];
                    result.push(newParam);
                }
            }
       }
   }
   return result;
 }

function buildParamsFromObj(obj) {
    var params = [];
    var keys = [];
    if(obj) {
        keys = Object.keys(obj);
        if(keys && keys.length > 0) {
            for(var i = 0; i < keys.length; i++) {
                var param = {};
                param.PARAMETER_NAME = keys[i];
                param.VALUE = obj[keys[i]];
                params.push(param);
            }
        }
    }
    return params;
}

function getParams(req, output) {
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
        console.log('Reading from body');
        var bodyObj = req.body;
        if(bodyObj) {
            var keys = Object.keys(bodyObj);
            result = buildParams(keys, bodyObj, output);
        }
    }
    return result;
}

function executeProc(procName, params, res, next) {
    var request = new Request(procName, function(err, rowCount) {
        console.log('done callback called.');
        if(err) {
            console.log(err);
            if(next) {
                next(new Error(err));
            }
            
        } else {
            if(res) {
                res.status(200).end(JSON.stringify(results));
            }
        }
    });

    var results = [];
    request.on('doneInProc', function(rowCount, more, rows) {
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
            if(next) {
                next();
            }
        }
        else {
            connection.callProcedure(request);
        }
    })
};

function executeRoute(req, output, res, next) {
   // console.log(JSON.stringify(output)); 
   // used to store results for testing purposes

   var params = getParams(req, output);
   if(params && params.length > 0) {
       console.log(params);
      var contextInfo = {};
      contextInfo.ProcName = params[0].ROUTINE_NAME;
      contextInfo.Paraneters = JSON.stringify(params);
      req.AppContext = contextInfo;   
      executeProc(params[0].ROUTINE_NAME,params,res,next);
   }
   else {
       if(output.metadata.AllowNoParameters == 1) {
        params = null;
        executeProc(output.metadata.RouteCommand, params,  res, next);
       }
       else {
          next();
       }
   }
};

function getRoute(req, res, next) {
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

function logError(err, req) {
    try {
        var errObj = {};
        errObj.Application = config.appName;
        errObj.TimeUtc = new Date().toISOString().slice(0, 19).replace('T', ' ');;
        errObj.Host = os.hostname();
        errObj.LogType = 'Exception';
        errObj.Source = req.path;
        errObj.Message = err;
        errObj.UserName = req.user ? req.user : '';
        errObj.StatusCode = err.status || 500;
        errObj.Headers = JSON.stringify(req.headers);
        errObj.Cookies = req.cookies ? JSON.stringify(req.cookies) : '';
        errObj.QueryString = req.query ? JSON.stringify(req.query) : '';
        errObj.Body = JSON.stringify(req.body)
        errObj.Context = req.AppContext ? JSON.stringify(req.AppContext) : '';
        var errParams = buildParamsFromObj(errObj);
        executeProc('usp_Logs_Ins',errParams, null, null);
    }
    catch(e) {
        console.log('An error occured while trying to log the error.');
        console.log(e);    
    }

}

function routeMiddleware(req, res, next) {
    console.log('Route middleware called.');
    getRoute(req, res, next);
}


function configure(_config, _Connection, _Request) {
    config = _config;
    Connection = _Connection;
    Request = _Request;
}

module.exports = {
    buildParams : buildParams,
    buildParamsFromObj : buildParamsFromObj,
    configure : configure,
    getParams : getParams,
    executeRoute : executeRoute,
    executeProc : executeProc,
    logError : logError,
    routeMiddleware: routeMiddleware
 }