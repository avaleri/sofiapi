var os = require('os');
var Connection = null;
var Request = null
var TYPES = require('tedious').TYPES;
var config = {};
var logger = {};

var authenticate = function(req) { 
    if(req.isAuthenticated && typeof req.isAuthenticated === 'function') {
        return req.isAuthenticated();
    }
    return true;
}
// if no implementation specified, check for passport style authentication, othewrwise default to authenticated.

var authorize = function(authString, req) 
{ 
    if (authString && authString.length > 0) {
        if (!req.user) {
            fail();
        }
        else if (req.user) {
            var roles = req.user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (roles && roles.length > 0) {
                var allowed = false;
                var allowedRoles = authString.split(',');
                for (var i = 0; i < allowedRoles.length; i++) {
                    for (var j = 0; j < roles.length; j++) {
                        if (allowedRoles[i] == roles[j]) {
                            return true;
                        }
                    }
                }

                if (allowed == false) {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    } // only do check if valid authString is passed.
    return false;
}
// if no implementation specified, allow all the requests.

var accessDenied = function(req, res) {
    res.status(401).end(); // send access denied
}
// default access denied (send 401 response)

logger.log = function(level,msg) {}; // default to no-op.

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

function handleError(err, next) {

    if(err) {
        logger.log('Error',err);
        if(next) {
            next(new Error(err));
        }
    }
}

function callProc(request, next) {
    var connection = new Connection(config);
    // Attempt to connect and execute queries if connection goes through
    connection.on('connect', function(err) {
        if(err) {
            handleError(err, next);
        }
        else {
            connection.callProcedure(request);
        }
    });
}

function getParams(req, output) {
    var queryParams = req.query;
    var result = [];
    var keys = [];
    logger.log('debug','Getting parameters.');
    if(queryParams) {
        keys = Object.keys(queryParams);
    }

    if(keys && keys.length > 0) {
        logger.log('debug','Reading from querystring.');
        result = buildParams(keys,queryParams,output);
    }
    else {
        logger.log('debug','Reading from body');
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
        logger.log('debug','done callback called.');
        if(err) {
            handleError(err, next);
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
        logger.log('info','Finished executing proc: ' + procName);   
    });

    if(params && params.length > 0) {
        for(var i = 0; i < params.length; i++) {
            request.addParameter(params[i].PARAMETER_NAME, TYPES.NVarChar, params[i].VALUE);
        }
    }

    callProc(request, next);
};

function executeRoute(req, output, res, next) {
    // console.log(JSON.stringify(output)); 
    // used to store results for testing purposes

   var isAuthorized = true;
   if(output.metadata.PublicRoute == false) {
        if (!authenticate(req)) {
            return next();
        }
        // if the route is not anonymous, ensure that the request is authenticated

        if(output.metadata.PermissionList && output.metadata.PermissionList.length > 0) {
            // this route has a list of allowed roles specified.
            isAuthorized = authorize(output.metadata.PermissionList, req, res, next);
            if(isAuthorized == false) {
                accessDenied(req,res);
            }
        }
   }

   if(isAuthorized) {
   var params = getParams(req, output);
    if(params && params.length > 0) {
        logger.log('debug',params);
        var contextInfo = {};
        contextInfo.ProcName = params[0].ROUTINE_NAME;
        contextInfo.Paraneters = JSON.stringify(params);
        req.AppContext = contextInfo;   
        executeProc(params[0].ROUTINE_NAME, params, res, next);
    }
    else {
        if(output.metadata.AllowNoParameters == 1) {
            params = null;
            executeProc(output.metadata.RouteCommand, params, res, next);
        }
        else {
            return next();
        }
    }
   }
};

function getRoute(req, res, next) {
    var RoutePath = req.path;
    var request = new Request('usp_Routes_SelByPath', function(err, rowCount) {
            if(err) {
                handleError(err, next);
            }
        });

    request.addParameter('RoutePath', TYPES.NVarChar, RoutePath); 

    var results = [];

    // doneInProc gets called multiple times (one per result set in the called procedure)
    // aggregate each result set into an array in results.
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
            return next();
        }
    });

    callProc(request, next);
}

function logError(err, req) {
    var result = false;
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
        result = true; // indicate logging statement reached.
    }
    catch(e) {
        logger.log('error','An error occured while trying to log the error.');
        logger.log('error',e);    
    }

    return result;
}

function routeMiddleware(req, res, next) {
    logger.log('info','Route middleware called.');
    getRoute(req, res, next);
}


function configure(_config, _Connection, _Request, _logger, _authenticate, _authorize, _accessDenied) {
    config = _config;
    Connection = _Connection;
    Request = _Request;
    logger = _logger;

    if(_authenticate) {
        authenticate = _authenticate;
    }

    if(_authorize) {
        authorize = _authorize;
    }

    if(_accessDenied) {
        accessDenied = _accessDenied;
    }
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