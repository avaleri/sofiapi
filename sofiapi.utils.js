function runCmd(cmd, args) {
const
    { spawn } = require( 'child_process' ),
    ls = spawn( cmd, args );

ls.stdout.on( 'data', data => {
    console.log( `stdout: ${data}` );
} );

ls.stderr.on( 'data', data => {
    console.log( `stderr: ${data}` );
} );

ls.on( 'close', code => {
    console.log( `child process exited with code ${code}` );
} );

}

module.exports = {
   runCmd : runCmd
}