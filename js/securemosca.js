var mosca = require('mosca');
var fs = require('fs');

var SECURE_KEY = '/home/ubuntu/codes/pki-example-3/certs/sensity.com.key'
var SECURE_CERT= '/home/ubuntu/codes/pki-example-3/certs/sensity.com.crt'
var SECURE_PFX= '/home/ubuntu/codes/pki-example-3/certs/sensity.com.p12'
var SECURE_CA = ['/home/ubuntu/codes/pki-example-3/ca/tls-ca-chain.pem','/home/ubuntu/codes/pki-example-3/ca/root-ca.crt']
var CRL = [fs.readFileSync('/home/ubuntu/codes/pki-example-3/crl/tls-ca.crl'), fs.readFileSync('/home/ubuntu/codes/pki-example-3/crl/root-ca.crl')]

var settings = {
  port: 8443,
  logger: {
    name: "secureExample",
    level: 40,
  },
  secure : {
    keyPath: SECURE_KEY,
    certPath: SECURE_CERT,
    //pfx: SECURE_PFX,
    ca: SECURE_CA,
    crl: CRL,
    passphrase: 'pass',
    requestCert: true,
    rejectUnauthorized: true
  }
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}
