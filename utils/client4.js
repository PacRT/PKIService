var tls = require('tls');
var fs = require('fs');

var options = {
  pfx: fs.readFileSync('/home/ubuntu/codes/pki-example-3/certs/device10.p12'),
  //key: fs.readFileSync('/home/ubuntu/codes/pki-example-3/certs/device02.key'),
  //cert: fs.readFileSync('/home/ubuntu/codes/pki-example-3/certs/device02.crt'), 
  //ca: [fs.readFileSync('/home/ubuntu/codes/pki-example-3/ca/tls-ca.crt'), fs.readFileSync('/home/ubuntu/codes/pki-example-3/ca/root-ca.crt')], 
  passphrase: 'pass',
  /**servers: [{
    host: 'secsrv.sensity.com', port: 8883
  }]**/
};

var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtts://secsrv.sensity.com', options);
//var client  = mqtt.connect(options);

client.on('connect', function () {
  client.subscribe('presence');
  client.publish('presence', 'Hello mqtt...');
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});
