function BadConnection(config) {

    this.config = config;
    this.on = function(event, callback) {
    
        if(event == 'connect') {
            //console.log('connect event called.');
            var err = 'An error occurred connection to the server.';
            callback(err);
        }
    };
    
    
    this.callProcedure = function(request) {
        request.finish();
    }
    }
    module.exports = BadConnection;