var tls = require('tls');
var fs = require('fs');

var options = {
  pfx: fs.readFileSync('/home/ubuntu/codes/pki-example-3/certs/device10.p12'),
  passphrase: 'pass'
};

var socket = tls.connect(8000, 'secsrv.sensity.com', options, function(one, two, three) {
  console.log('client connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  process.stdin.pipe(socket);
  process.stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', function(data) {
  console.log(data);
});
socket.on('end', function() {
  //server.close();
  console.log('Socket closing')
});
