function Connection(config) {

this.config = config;
this.on = function(event, callback) {

    if(event == 'connect') {
        //console.log('connect event called.');
        callback();
    }
};


this.callProcedure = function(request) {
    //console.log('callProcedure was called.');
    request.finish();
}
}
module.exports = Connection;