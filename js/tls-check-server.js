const tls = require('tls');
const fs = require('fs');

const options = {
    pfx: fs.readFileSync('../pki/certs/pacrt.io.p12'),
    passphrase: 'pass',

    // This is necessary only if using the client certificate authentication.
    requestCert: true,
    rejectUnauthorized: true,
    ca: [fs.readFileSync('../pki/ca/root-ca.crt'), fs.readFileSync('../pki/ca/tls-ca.crt')],

    //added crl
    crl: [fs.readFileSync('../pki/crl/tls-ca.crl'), fs.readFileSync('../pki/crl/root-ca.crl')]
};

var server = tls.createServer(options, function(socket) {
    //console.log('Protocol: ', socket);
        console.log('server connected',
        socket.authorized ? 'authorized' : 'unauthorized');
socket.write('welcome!\n');
socket.setEncoding('utf8');
//socket.pipe(socket);


socket.on('data', function(data)  {
    console.log(data);
});
socket.on('end', function()  {
    console.log('socket on end');
});


});


server.listen(8000, function()  {
    console.log('server bound');
});