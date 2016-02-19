var tls    = require('tls');
var fs     = require('fs');
var aedes  = require('aedes')()
var aedes2 = require('aedes')()
var net    = require('net')
var conf   = require('config')

var options = {
  pfx: fs.readFileSync(conf.mqtts.cert),
  crl: [fs.readFileSync(conf.mqtts.tls_crl), fs.readFileSync(conf.mqtts.root_crl)],
  passphrase: 'pass',
  requestCert: true,
  rejectUnauthorized: true
};

//console.log('aedes.handle: ', aedes.handle);
//var server = require('net').createServer(aedes.handle)
var server = tls.createServer(options, aedes.handle)
var port = conf.mqtts.port

server.listen(port, function () {
  console.log('server listening on port', port)
})

var server2 = net.createServer(aedes2.handle)
var port2 = conf.mqtt.port
server2.listen(port2, function() {
  console.log('server listen on port: ', port2)
})

aedes.on('clientError', function (client, err) {
  console.log('client error', client.id, err.message)
})

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('message from client', client.id)
  }
})

aedes.on('client', function (client) {
  console.log('new client', client.id)
})

aedes2.on('clientError', function (client, err) {
  console.log('client error', client.id, err.message)
})

aedes2.on('publish', function (packet, client) {
  if (client) {
    console.log('message from client', client.id)
  }
})

aedes2.on('client', function (client) {
  console.log('new client', client.id)
})
