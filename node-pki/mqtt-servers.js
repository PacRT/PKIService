  
var tls = require('tls');
var fs = require('fs');
var aedes = require('aedes')();
var http = require('http');
var https = require('https');
var net = require('net');
var websocket = require('websocket-stream')

var ws = require('ws').Server

var options = {
  pfx: fs.readFileSync('/home/ubuntu/codes/pki-example-3/certs/sensity.com.p12'),
  crl: [fs.readFileSync('/home/ubuntu/codes/pki-example-3/crl/tls-ca.crl'), fs.readFileSync('/home/ubuntu/codes/pki-example-3/crl/root-ca.crl')],
  passphrase: 'pass',
  requestCert: true,
  rejectUnauthorized: true

  // This is necessary only if the client uses the self-signed certificate.
  //ca: [ fs.readFileSync('keys-certs/client.crt') ]
};

var mqtt_server = net.createServer({}, aedes.handle);

var mqtts_server = tls.createServer(options, aedes.handle);

var http_server = http.createServer();

var ws_server = websocket.createServer({server: http_server}, aedes.handle);

http_server.listen(8080, '0.0.0.0', function() {
  console.log('WS Server with Aedes service is listening on port 8080');
});

mqtt_server.listen(1883,'0.0.0.0', function() {
  console.log('MQTT server bound on port 1883');
});

mqtts_server.listen(8883, '0.0.0.0', function() {
  console.log('Secure aedes in running on port 8883');
});

aedes.on('client', function(client) {
  console.log('Client: ', client.id, ' connected..');
});

aedes.on('clientDisconnect', function(client) {
  console.log('Client: ', client.id, ' disconnected..');
});

aedes.on('clientError', function(client, error) {
  console.log('Client: ', client.id, ' has error: ', error);
});

aedes.on('publish', function(packet, client) {
  var clientid;
  if(client == null) clientid = null;
  console.log('Client: ', clientid, ' published packet: ', packet);
});

aedes.on('subscribe', function(subscriptions, client) {
  console.log('Client: ', client.id, ' subscribed: ', subscriptions);
});

aedes.on('unsubscribe', function(unsubscriptions, client) {
  console.log('Client: ', client.id, ' unsubscribed: ', unsubscriptions);
});

aedes.authenticate = function (client, username, password, callback) {
  //callback(null, username === 'matteo')
  console.log('authenticate method is called..');
  callback(null, true);
}
