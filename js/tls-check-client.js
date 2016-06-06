const tls = require('tls');
const fs = require('fs');

var h = 'pacrt.io';

const options = {
    host: h,
    pfx: fs.readFileSync('../pki/certs/C=US_O=PACRT_DOT_IO_OU=Pacrt_Austin_CN=Device_1.p12'),
    ca: [fs.readFileSync('../pki/ca/root-ca.crt'), fs.readFileSync('../pki/ca/tls-ca.crt')],
    crl: [fs.readFileSync('../pki/crl/tls-ca.crl'), fs.readFileSync('../pki/crl/root-ca.crl')],
    rejectUnauthorized: true,
    requestCert: true,
    passphrase: 'pass'
};


/*const options = {
    host: 'pacrt.io',
    pfx: fs.readFileSync('../pki/certs/C=US_O=PACRT_DOT_IO_OU=Pacrt_Austin_CN=Device_1.crt'),
    ca: [fs.readFileSync('../pki/ca/root-ca.crt'), fs.readFileSync('../pki/ca/tls-ca.crt')],
    crl: [fs.readFileSync('../pki/crl/tls-ca.crl'), fs.readFileSync('../pki/crl/root-ca.crl')],
    key: 
    rejectUnauthorized: true,
    requestCert: true,
    passphrase: 'pass'
};*/

var socket = tls.connect(8000, options, function()  {
        console.log('client connected',
        socket.authorized ? 'authorized' : 'unauthorized');
process.stdin.pipe(socket);
process.stdin.resume();
});
socket.setEncoding('utf8');

var js = {}
js['info'] = "test"
socket.write('welcome! from client\n');
socket.write(JSON.stringify(js));
//socket.pipe(socket);


socket.on('data', function(data)  {
    console.log(data);
    socket.end();
});
socket.on('end', function()  {
    console.log('socket on end');
});


