const tls = require('tls');
const fs = require('fs');

const options = {
    host: 'pacrt.io',
    pfx: fs.readFileSync('../pki/certs/device10.p12'),
    ca: [fs.readFileSync('../pki/ca/root-ca.crt'), fs.readFileSync('../pki/ca/tls-ca.crt')],
    rejectUnauthorized: true,
    passphrase: 'pass'
};

var socket = tls.connect(8000, options, function()  {
        console.log('client connected',
        socket.authorized ? 'authorized' : 'unauthorized');
process.stdin.pipe(socket);
process.stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', function(data)  {
    console.log(data);
    socket.end();
});
socket.on('end', function()  {
    console.log('socket on end');
});