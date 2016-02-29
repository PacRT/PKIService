const tls = require('tls');
const fs = require('fs');

const options = {
    pfx: fs.readFileSync('../pki/certs/pacrt.io.p12'),
    passphrase: 'pass',

    // This is necessary only if using the client certificate authentication.
    requestCert: true,
    rejectUnauthorized: true,
    ca: [fs.readFileSync('../pki/ca/root-ca.crt'), fs.readFileSync('../pki/ca/tls-ca.crt')]
};

var server = tls.createServer(options, function(socket) {
    //console.log('Protocol: ', socket);
        console.log('server connected',
        socket.authorized ? 'authorized' : 'unauthorized');
socket.write('welcome!\n');
socket.setEncoding('utf8');
socket.pipe(socket);
});
server.listen(8000, function()  {
    console.log('server bound');
});