function runCmd(cmd, args, doneCallback) {

    var _data = '';
const
    { spawn } = require( 'child_process' ),
    ls = spawn( cmd, args );

ls.stdout.on( 'data', data => {
    console.log(`${data}`);
    _data += data; // collect data
} );

ls.stderr.on( 'data', data => {
    console.log( `stderr: ${data}` );
} );

ls.on( 'close', code => {
    //console.log( `child process exited with code ${code}` );
} );

ls.on('exit', function(code, signal) {
    if(doneCallback) {
        doneCallback(_data);
    }
});

}

module.exports = {
   runCmd : runCmd
}