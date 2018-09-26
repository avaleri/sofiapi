var assert = require('assert');
var sofiapi = require('../src/sofiapi.js');
var Connection = require('./FakeConnection.js');
var Request = require('./FakeRequest.js');
var consoleLogger = {};
consoleLogger.log = function(level, msg) {
    //console.log(level + ': ' + msg);
};

sofiapi.configure({}, Connection, Request, consoleLogger);

describe('Sofiapi Utilitiy Methods', function() {

    describe('buildParams', function() {

        it('should return array with parameters populated from source object.', function() {

            var paramObj = {};
            paramObj.SearchValue = 'get';
            paramObj.PageNo = 1;
            paramObj.PageSize = 10;

            var procedureParams = {};
            procedureParams.parameters = [
            {ROUTINE_NAME : 'usp_Routes_SelAll', ORDINAL_POSITION: 1, PARAMETER_MODE: 'IN', PARAMETER_NAME : '@SearchValue', DATA_TYPE: 'nvarchar'},
            {ROUTINE_NAME : 'usp_Routes_SelAll', ORDINAL_POSITION: 2, PARAMETER_MODE: 'IN', PARAMETER_NAME : '@PageNo', DATA_TYPE: 'int'},
            {ROUTINE_NAME : 'usp_Routes_SelAll', ORDINAL_POSITION: 3, PARAMETER_MODE: 'IN', PARAMETER_NAME : '@PageSize', DATA_TYPE: 'int'},
            {ROUTINE_NAME : 'usp_Routes_SelAll', ORDINAL_POSITION: 4, PARAMETER_MODE: 'IN', PARAMETER_NAME : '@SortColumn', DATA_TYPE: 'nvarchar'},
            {ROUTINE_NAME : 'usp_Routes_SelAll', ORDINAL_POSITION: 5, PARAMETER_MODE: 'IN', PARAMETER_NAME : '@SortOrder', DATA_TYPE: 'nvarchar'}
            ];

            var expected = [
            {ROUTINE_NAME : 'usp_Routes_SelAll', ORDINAL_POSITION: 1, PARAMETER_MODE: 'IN', PARAMETER_NAME : 'SearchValue', DATA_TYPE: 'nvarchar', VALUE : 'get' },
            {ROUTINE_NAME : 'usp_Routes_SelAll', ORDINAL_POSITION: 2, PARAMETER_MODE: 'IN', PARAMETER_NAME : 'PageNo', DATA_TYPE: 'int', VALUE: 1,},
            {ROUTINE_NAME : 'usp_Routes_SelAll', ORDINAL_POSITION: 3, PARAMETER_MODE: 'IN', PARAMETER_NAME : 'PageSize', DATA_TYPE: 'int', VALUE: 10}
            ];

            var keys = Object.keys(paramObj);
            var result = sofiapi.buildParams(keys, paramObj, procedureParams);
            assert.deepStrictEqual(result, expected);
        });
    });

    describe('buildParamsFromObj', function() {

        it('should return empty array for empty object.', function() {
            var obj = {};
            var result = sofiapi.buildParamsFromObj(obj);
            assert.equal(result.length, 0);            
        });

        it('should transform object into array with PARAMETER_NAME and VALUE set.', function() {

            var obj = {};
            obj.Param1 = 'a';
            obj.Param2 = 3;
            obj.Param3 = null;
            obj.Param4 = undefined;
            obj.Param5 = { 'test' : '123'};

            var expected = [];
            expected.push({ PARAMETER_NAME: 'Param1', VALUE:  'a'});
            expected.push({ PARAMETER_NAME: 'Param2', VALUE:  3});
            expected.push({ PARAMETER_NAME: 'Param3', VALUE:  null});
            expected.push({ PARAMETER_NAME: 'Param4', VALUE:  undefined});
            expected.push({ PARAMETER_NAME: 'Param5', VALUE:  { 'test' : '123'} });

            var result = sofiapi.buildParamsFromObj(obj);
            assert.deepStrictEqual(result,expected);
        });
    });


    describe('getParams', function() {

        it('should properly populate parameters from querystring', function() {

            var paramMetadata = { metadata:
                { RouteID: 2,
                  AppName: 'sofiapi',
                  RoutePath: '/api/routes/getall',
                  RouteCommand: 'usp_Routes_SelAll',
                  AllowNoParameters: true,
                  PublicRoute: true,
                  PermissionList: '',
                  CreateDt: '2018-09-18T03:40:01.197Z',
                  CreatedBy: 'SYSTEM',
                  ModifiedDt: '2018-09-18T23:29:05.250Z',
                  ModifiedBy: 'avaleri@gmail.com' },
               parameters:
                [ { ROUTINE_NAME: 'usp_Routes_SelAll',
                    ORDINAL_POSITION: 1,
                    PARAMETER_MODE: 'IN',
                    PARAMETER_NAME: '@SearchValue',
                    DATA_TYPE: 'nvarchar' },
                  { ROUTINE_NAME: 'usp_Routes_SelAll',
                    ORDINAL_POSITION: 2,
                    PARAMETER_MODE: 'IN',
                    PARAMETER_NAME: '@PageNo',
                    DATA_TYPE: 'int' },
                  { ROUTINE_NAME: 'usp_Routes_SelAll',
                    ORDINAL_POSITION: 3,
                    PARAMETER_MODE: 'IN',
                    PARAMETER_NAME: '@PageSize',
                    DATA_TYPE: 'int' },
                  { ROUTINE_NAME: 'usp_Routes_SelAll',
                    ORDINAL_POSITION: 4,
                    PARAMETER_MODE: 'IN',
                    PARAMETER_NAME: '@SortColumn',
                    DATA_TYPE: 'nvarchar' },
                  { ROUTINE_NAME: 'usp_Routes_SelAll',
                    ORDINAL_POSITION: 5,
                    PARAMETER_MODE: 'IN',
                    PARAMETER_NAME: '@SortOrder',
                    DATA_TYPE: 'nvarchar' } ] };

                var req = {};
                req.query = { PageNo: '1' };

                var expected = [
                    { ROUTINE_NAME: 'usp_Routes_SelAll',
                    ORDINAL_POSITION: 2,
                    PARAMETER_MODE: 'IN',
                    PARAMETER_NAME: 'PageNo',
                    DATA_TYPE: 'int',
                    VALUE: '1'
                    }
                ];
                var result = sofiapi.getParams(req, paramMetadata);
                assert.deepStrictEqual(result, expected);
        });


        it('should properly populate parameters from request body', function() {
            
            var req = {};
            req.query = {};
            req.body = { RouteID: '6',
            AppName: 'sofiapi',
            RoutePath: '/api/routes/errortest',
            RouteCommand: 'p_throwerror',
            AllowNoParameters: false,
            UserName: 'avaleri@gmail.com',
            PublicRoute: true,
            PermissionList: '' };

            var paramMetadata = { metadata:
                { RouteID: 4,
                  AppName: 'sofiapi',
                  RoutePath: '/api/routes/update',
                  RouteCommand: 'usp_Routes_Upd',
                  AllowNoParameters: false,
                  PublicRoute: true,
                  PermissionList: null,
                  CreateDt: '2018-09-18T03:40:01.463Z',
                  CreatedBy: 'SYSTEM',
                  ModifiedDt: null,
                  ModifiedBy: null },
               parameters:
                [ { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 1, PARAMETER_MODE: 'IN', PARAMETER_NAME: '@RouteID', DATA_TYPE: 'int' },
                  { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 2, PARAMETER_MODE: 'IN', PARAMETER_NAME: '@AppName', DATA_TYPE: 'nvarchar' },
                  { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 3, PARAMETER_MODE: 'IN', PARAMETER_NAME: '@RoutePath', DATA_TYPE: 'nvarchar' },
                  { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 4, PARAMETER_MODE: 'IN', PARAMETER_NAME: '@RouteCommand', DATA_TYPE: 'nvarchar' },
                  { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 5, PARAMETER_MODE: 'IN', PARAMETER_NAME: '@AllowNoParameters', DATA_TYPE: 'bit' },
                  { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 6, PARAMETER_MODE: 'IN', PARAMETER_NAME: '@PublicRoute', DATA_TYPE: 'bit' },
                  { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 7, PARAMETER_MODE: 'IN', PARAMETER_NAME: '@PermissionList', DATA_TYPE: 'nvarchar' },
                  { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 8, PARAMETER_MODE: 'IN', PARAMETER_NAME: '@UserName', DATA_TYPE: 'nvarchar' } ] };


            var expected = [
                 { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 1, PARAMETER_MODE: 'IN', PARAMETER_NAME: 'RouteID', DATA_TYPE: 'int', VALUE: '6' },
                 { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 2, PARAMETER_MODE: 'IN', PARAMETER_NAME: 'AppName', DATA_TYPE: 'nvarchar', VALUE: 'sofiapi' },
                 { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 3, PARAMETER_MODE: 'IN', PARAMETER_NAME: 'RoutePath', DATA_TYPE: 'nvarchar', VALUE: '/api/routes/errortest' },
                 { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 4, PARAMETER_MODE: 'IN', PARAMETER_NAME: 'RouteCommand', DATA_TYPE: 'nvarchar', VALUE: 'p_throwerror' },
                 { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 5, PARAMETER_MODE: 'IN', PARAMETER_NAME: 'AllowNoParameters', DATA_TYPE: 'bit', VALUE: false },
                 { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 8, PARAMETER_MODE: 'IN', PARAMETER_NAME: 'UserName', DATA_TYPE: 'nvarchar', VALUE: 'avaleri@gmail.com' },
                 { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 6, PARAMETER_MODE: 'IN', PARAMETER_NAME: 'PublicRoute', DATA_TYPE: 'bit', VALUE: true },
                 { ROUTINE_NAME: 'usp_Routes_Upd', ORDINAL_POSITION: 7, PARAMETER_MODE: 'IN', PARAMETER_NAME: 'PermissionList', DATA_TYPE: 'nvarchar', VALUE: '' } 
                ];

            var result = sofiapi.getParams(req, paramMetadata);
            assert.deepStrictEqual(result, expected);                
        });
    });

    describe('routeMiddleware', function() {

        it('should route a valid request', function() {

                function next(err) {
                    if(err) {
                        console.log('Err: ' + err);
                    }
                    console.log('next called.');
                }

                var req = {};
                
                req.path = '/api/routes/getall';

                var res = {};

                res.status = function status(code) {
                    assert.equal(code,200);
                    return res;
                };

                res.end = function end(result) {
                    var _routeData = JSON.parse(result);
                    var pathObj = _routeData[0];
                    assert.equal(pathObj.RoutePath,req.path);
                    // should return the matching route
                };

                sofiapi.routeMiddleware(req, res, next);
        });
    });


});