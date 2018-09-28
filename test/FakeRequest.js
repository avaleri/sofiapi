
var callbacks = [];
var doneCallback = function() {};
var _ranDoneCallback = false;
var procParams = [];
var error = {};

function getProcTestRows(procName) {

    var rows = [];
    if(procName == 'usp_Routes_SelByPath') {
        var path = procParams['RoutePath'];
        if(path === '/api/routes/getall') {
           var firstRowSet = JSON.parse('[[{"value":2,"metadata":{"userType":0,"flags":16,"type":{"id":56,"type":"INT4","name":"Int"},"colName":"RouteID"}},{"value":"sofiapi","metadata":{"userType":0,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"AppName","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":65535}},{"value":"/api/routes/getall","metadata":{"userType":0,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"RoutePath","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":4096}},{"value":"usp_Routes_SelAll","metadata":{"userType":0,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"RouteCommand","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":65535}},{"value":true,"metadata":{"userType":0,"flags":8,"type":{"id":50,"type":"BIT","name":"Bit"},"colName":"AllowNoParameters"}},{"value":true,"metadata":{"userType":0,"flags":8,"type":{"id":50,"type":"BIT","name":"Bit"},"colName":"PublicRoute"}},{"value":"","metadata":{"userType":0,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PermissionList","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":65535}},{"value":"2018-09-18T03:40:01.197Z","metadata":{"userType":0,"flags":8,"type":{"id":61,"type":"DATETIME","name":"DateTime"},"colName":"CreateDt"}},{"value":"SYSTEM","metadata":{"userType":0,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"CreatedBy","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":65535}},{"value":"2018-09-18T23:29:05.250Z","metadata":{"userType":0,"flags":9,"type":{"id":111,"type":"DATETIMN","name":"DateTimeN","dataLengthLength":1},"colName":"ModifiedDt","dataLength":8}},{"value":"avaleri@gmail.com","metadata":{"userType":0,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ModifiedBy","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":65535}}]]');
           var secondRowSet = JSON.parse('[[{"value":"usp_Routes_SelAll","metadata":{"userType":256,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ROUTINE_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":1,"metadata":{"userType":0,"flags":9,"type":{"id":38,"type":"INTN","name":"IntN","dataLengthLength":1},"colName":"ORDINAL_POSITION","dataLength":4}},{"value":"IN","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_MODE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":20}},{"value":"@SearchValue","metadata":{"userType":256,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":"nvarchar","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"DATA_TYPE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}}],[{"value":"usp_Routes_SelAll","metadata":{"userType":256,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ROUTINE_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":2,"metadata":{"userType":0,"flags":9,"type":{"id":38,"type":"INTN","name":"IntN","dataLengthLength":1},"colName":"ORDINAL_POSITION","dataLength":4}},{"value":"IN","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_MODE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":20}},{"value":"@PageNo","metadata":{"userType":256,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":"int","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"DATA_TYPE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}}],[{"value":"usp_Routes_SelAll","metadata":{"userType":256,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ROUTINE_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":3,"metadata":{"userType":0,"flags":9,"type":{"id":38,"type":"INTN","name":"IntN","dataLengthLength":1},"colName":"ORDINAL_POSITION","dataLength":4}},{"value":"IN","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_MODE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":20}},{"value":"@PageSize","metadata":{"userType":256,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":"int","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"DATA_TYPE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}}],[{"value":"usp_Routes_SelAll","metadata":{"userType":256,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ROUTINE_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":4,"metadata":{"userType":0,"flags":9,"type":{"id":38,"type":"INTN","name":"IntN","dataLengthLength":1},"colName":"ORDINAL_POSITION","dataLength":4}},{"value":"IN","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_MODE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":20}},{"value":"@SortColumn","metadata":{"userType":256,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":"nvarchar","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"DATA_TYPE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}}],[{"value":"usp_Routes_SelAll","metadata":{"userType":256,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ROUTINE_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":5,"metadata":{"userType":0,"flags":9,"type":{"id":38,"type":"INTN","name":"IntN","dataLengthLength":1},"colName":"ORDINAL_POSITION","dataLength":4}},{"value":"IN","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_MODE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":20}},{"value":"@SortOrder","metadata":{"userType":256,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":"nvarchar","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"DATA_TYPE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}}]]');
           // stored output from console.log in executeRoute method
           rows.push(firstRowSet);
           rows.push(secondRowSet);
        }
        else if(path == '/api/bad-path') {
            error.error = 16;
            error.state = 1;
            error.class = 20;
            error.message = 'Fake error in procedure.';
            error.procName = 'usp_Routes_SelByPath';
            error.lineNumber = 5;
        }
    }
    else if(procName == 'usp_Routes_SelAll') {
        var firstRowSet = JSON.parse('[[{"value":2,"metadata":{"userType":0,"flags":16,"type":{"id":56,"type":"INT4","name":"Int"},"colName":"RouteID"}},{"value":"sofiapi","metadata":{"userType":0,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"AppName","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":65535}},{"value":"/api/routes/getall","metadata":{"userType":0,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"RoutePath","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":4096}},{"value":"usp_Routes_SelAll","metadata":{"userType":0,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"RouteCommand","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":65535}},{"value":true,"metadata":{"userType":0,"flags":8,"type":{"id":50,"type":"BIT","name":"Bit"},"colName":"AllowNoParameters"}},{"value":true,"metadata":{"userType":0,"flags":8,"type":{"id":50,"type":"BIT","name":"Bit"},"colName":"PublicRoute"}},{"value":"","metadata":{"userType":0,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PermissionList","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":65535}},{"value":"2018-09-18T03:40:01.197Z","metadata":{"userType":0,"flags":8,"type":{"id":61,"type":"DATETIME","name":"DateTime"},"colName":"CreateDt"}},{"value":"SYSTEM","metadata":{"userType":0,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"CreatedBy","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":65535}},{"value":"2018-09-18T23:29:05.250Z","metadata":{"userType":0,"flags":9,"type":{"id":111,"type":"DATETIMN","name":"DateTimeN","dataLengthLength":1},"colName":"ModifiedDt","dataLength":8}},{"value":"avaleri@gmail.com","metadata":{"userType":0,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ModifiedBy","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":65535}}]]');
        var secondRowSet = JSON.parse('[[{"value":"usp_Routes_SelAll","metadata":{"userType":256,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ROUTINE_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":1,"metadata":{"userType":0,"flags":9,"type":{"id":38,"type":"INTN","name":"IntN","dataLengthLength":1},"colName":"ORDINAL_POSITION","dataLength":4}},{"value":"IN","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_MODE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":20}},{"value":"@SearchValue","metadata":{"userType":256,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":"nvarchar","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"DATA_TYPE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}}],[{"value":"usp_Routes_SelAll","metadata":{"userType":256,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ROUTINE_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":2,"metadata":{"userType":0,"flags":9,"type":{"id":38,"type":"INTN","name":"IntN","dataLengthLength":1},"colName":"ORDINAL_POSITION","dataLength":4}},{"value":"IN","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_MODE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":20}},{"value":"@PageNo","metadata":{"userType":256,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":"int","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"DATA_TYPE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}}],[{"value":"usp_Routes_SelAll","metadata":{"userType":256,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ROUTINE_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":3,"metadata":{"userType":0,"flags":9,"type":{"id":38,"type":"INTN","name":"IntN","dataLengthLength":1},"colName":"ORDINAL_POSITION","dataLength":4}},{"value":"IN","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_MODE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":20}},{"value":"@PageSize","metadata":{"userType":256,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":"int","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"DATA_TYPE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}}],[{"value":"usp_Routes_SelAll","metadata":{"userType":256,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ROUTINE_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":4,"metadata":{"userType":0,"flags":9,"type":{"id":38,"type":"INTN","name":"IntN","dataLengthLength":1},"colName":"ORDINAL_POSITION","dataLength":4}},{"value":"IN","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_MODE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":20}},{"value":"@SortColumn","metadata":{"userType":256,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":"nvarchar","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"DATA_TYPE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}}],[{"value":"usp_Routes_SelAll","metadata":{"userType":256,"flags":8,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"ROUTINE_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":5,"metadata":{"userType":0,"flags":9,"type":{"id":38,"type":"INTN","name":"IntN","dataLengthLength":1},"colName":"ORDINAL_POSITION","dataLength":4}},{"value":"IN","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_MODE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":20}},{"value":"@SortOrder","metadata":{"userType":256,"flags":9,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"PARAMETER_NAME","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}},{"value":"nvarchar","metadata":{"userType":0,"flags":33,"type":{"id":231,"type":"NVARCHAR","name":"NVarChar","hasCollation":true,"dataLengthLength":2,"maximumLength":4000},"colName":"DATA_TYPE","collation":{"lcid":1033,"flags":208,"version":0,"sortId":52,"codepage":"CP1252"},"dataLength":256}}]]');
        // stored output from console.log in executeRoute method
        rows.push(firstRowSet);
        rows.push(secondRowSet);        
    }


    return rows;
}

Request.prototype.finish = function() {

    if(callbacks && callbacks['doneInProc']) {
       //console.log('calling doneInProc');
       callbacks['doneInProc']();
    }

    if(callbacks && callbacks['doneProc']) {
        callbacks['doneProc']();
    }
    
    if(_ranDoneCallback === false) {
        _ranDoneCallback = true;
        if(error) {
            doneCallback(error,0);
        }
        else {
            doneCallback();
        }
        
    }
    
}

function Request(procName, callback) {

    var _procName = procName;
    doneCallback = callback;
    this.on = function(event, _callback) {
    
        if(event == 'connect') {
            //console.log('connect event called.');
            if(callback) {
                callbacks[event] = _callback;
            }
            
        }

        if(event == 'doneInProc') {
            //console.log('doneInProc call scheduled.');
            if(_callback) {
                callbacks[event] = (function() { 
                    var rows = getProcTestRows(_procName);
                    if(rows && rows.length > 0) {
                        var firstRowSet = rows[0];
                        var secondRowSet = rows[1];
                        //console.log('doneInProc fired.'); 
                        _callback(firstRowSet.length,true, firstRowSet);
                        _callback(secondRowSet.length,false, secondRowSet);
                    }
                    else {
                        _callback(0,false,[]);
                    }

                });
            }
        }

        if(event == 'doneProc') {
            //console.log('doneProc call scheduled.');
            if(_callback) {
                callbacks[event] = (function() { 
                   // console.log('doneProc fired.'); 
                    _callback()
                });
            }
        }
    };
    

    this.addParameter = function(paramName, type, paramValue) {
        procParams[paramName] = paramValue;
    }

    }
    
    module.exports = Request;