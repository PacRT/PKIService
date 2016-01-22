var tls = require('tls');
var fs = require('fs');

var options = {
  pfx: fs.readFileSync('/Users/schokkal/Documents/sfw_workspace/workspace/pki_certs/certs/sensity.com.p12'),
  crl: [fs.readFileSync('/Users/schokkal/Documents/sfw_workspace/workspace/pki_certs/crl/tls-ca.crl'), 
  fs.readFileSync('/Users/schokkal/Documents/sfw_workspace/workspace/pki_certs/crl/root-ca.crl')],
  passphrase: 'pass',
  requestCert: true,
  rejectUnauthorized: true

  // This is necessary only if the client uses the self-signed certificate.
  //ca: [ fs.readFileSync('keys-certs/client.crt') ]
};

var server = tls.createServer(options, function(socket) {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  console.log(socket.getPeerCertificate());
  socket.write("welcome!\n");
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000,'0.0.0.0', function() {
  console.log('server bound');
});
