
var sys = require('util')
var execsync = require('child_process').execSync;
var format = require("string-template");
var mqtt    = require('mqtt');
var fs = require('fs');

var msgpack = require('msgpack5')()
  , encode  = msgpack.encode
  , decode  = msgpack.decode

function puts(error, stderr, stdout) {
  if(error)
    console.log('error: ', error);
  if(stdout)
    console.log('stdout: ', stdout)
  if(stderr)
    console.log('stderr: ', stderr)
}

var options = {
  // keyPath: KEY,
  // certPath: CERT,
  rejectUnauthorized : false,
  //The CA list will be used to determine if server is authorized
  //ca: '/home/ubuntu/codes/pki-example-3/ca/tls-ca-chain.pem'
};
var client  = mqtt.connect('mqtts://secsrv.sensity.com', options);

client.subscribe('/strmv1/certreq');

client.on('message', function(topic, message, packet) {
    var profile = decode(message);
    console.log('Message on topic certreq: ', profile);
    gencert(profile, function(err, res) {
      if(!err) {
        client.publish('/strmv1/gencert/cert/' + profile.nodeid, res);
      }else { //handle error
        console.log('Error genereting certificate');
      }
    });
});

client.publish('/strmv1/certreq', encode({nodeid: 'mynodeid', pass: 'pass'}));

var csrcmdtmpl = 'openssl req -new -config etc/client.conf -out certs/{nodeid}.csr -keyout certs/{nodeid}.key -subj "/C=US/O=Sensity/OU=Sensity Hardware/CN={nodeid}" -passout pass:pass';

var certcmdtmpl = 'openssl ca -batch -config etc/tls-ca.conf -in certs/{nodeid}.csr -out certs/{nodeid}.crt -policy extern_pol -extensions client_ext -passin pass:pass';

var certcmdtmpl2 = 'openssl ca -batch -config etc/tls-ca.conf -in <(echo "{csr}") -out certs/{nodeid}.crt -policy extern_pol -extensions client_ext -passin pass:pass';

var gencert = function(profile, callback) {
  if(profile.csr != null) {
    var certcmd2 = format(certcmdtmpl2, profile);
    execsync(certcmd2, puts);
    var certpath = format('certs/{nodeid}.crt', profile);
    var cert = fs.readFileSync(certpath);
    var pkiobj = {
      cert: cert
    };
    callback(null, encode(pkiobj));
  }
  var csrcmd = format(csrcmdtmpl, profile);
  var certcmd = format(certcmdtmpl, profile);
  execsync(csrcmd, puts);
  execsync(certcmd, puts);
  var keypath = format('certs/{nodeid}.key', profile);
  var certpath = format('certs/{nodeid}.crt', profile);
  var key = fs.readFileSync(keypath);
  var pass = format('{pass}', profile);
  console.log('key: ', key)
  var cert = fs.readFileSync(certpath);
  console.log('cert: ', cert)
  var pkiobj = {
    key: key,
    cert: cert,
    pass: pass
  };
  callback(null, encode(pkiobj));
}
