var fs = require('fs');
var https = require('https');
var tls = require('tls');
var express = require('express');
var app = express();

var bodyParser = require('body-parser')

app.use(express.static('views'));
app.use(express.static('bootstrap-3.3.6'));

app.use( bodyParser.json());       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  //extended: true
//})); 

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var options = {
  pfx: fs.readFileSync('/home/ubuntu/codes/pki-example-3/certs/pacrt.io.p12'),
  passphrase: 'pass',
  requestCert: true
};

var csrupload = upload.single('csr')

app.post('/uploadcsr', function(req, res) {
  csrupload(req, res, function(err) {
    if(err) {
      // some error 
      console.log('Error happened', err)
    } else {
      console.log('Success')
      res.end('Success\n')
    }
  })
})

app.post('/savecsrtext', function(req,res) {
  console.log('Req body', req.body)
  res.end('Success\n')
})

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/welcome', function(req, res) {
  res.render('index.html')
})

// HTTPS to the local browser
var secserver = https.createServer(options, app);

secserver.listen(3000, '0.0.0.0', function() {
  console.log('Server is listening on port 3000')
});

app.listen(4000, '0.0.0.0', function() {
  console.log('Server is listening on port 4000')
});

// Creates a TLS connection to Server 
var clientOptions = {
  pfx: fs.readFileSync('/home/ubuntu/codes/pki-example-3/certs/device01.p12'),
  passphrase: 'pass'
};

var socket = tls.connect(8000, 'secsrv.sensity.com', clientOptions, function() {
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
  server.close();
});
