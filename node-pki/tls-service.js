var fs      = require('fs');
//var https   = require('https');
var tls     = require('tls');
var express = require('express');
var conf    = require('config')
var app     = express();
var execSync = require('child_process').exec;
var fs      = require('fs');
//var conf = require('./config');

var bodyParser = require('body-parser')

app.use(express.static('views'));
app.use(express.static('bootstrap-3.3.6'));

app.use( bodyParser.json());       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  //extended: true
//})); 

var multer    = require('multer');
var upload    = multer({ dest: 'uploads/' });
var csrupload = upload.single('csr')
var verifyCSR = 'openssl req -text -in -noout'


app.post('/uploadcsr', function(req, res) {
  console.log('Calling csrupload')
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
      data += chunk;
  });
  req.on('end', function() {
    console.log('uploadcsr data : '+data)
    res.end('{ csr: '+'Success'+ ' }')
  });
})

app.post('/verifycsr', function(req, res) {
  console.log('Calling verifycsr')
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
      data += chunk;
  });
  req.on('end', function() {
     console.log('Calling verifycsr data : '+data)
      
      fs.writeFile("pki/certs/temp.csr", data, function(err) {
        if(err) {
            return console.log(err);
          }    
          console.log("The CSR file was saved!");
      });
      //execsync(verifyCSR+data, puts);
      //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {
      execSync('openssl req -text -in '+'pki/certs/temp.csr'+' -noout', function (err, stdout, stderr) {
        if (err) {
            console.error(err);
            res.end('{ csr: '+err+ ' }')
            return;
          }
        console.log(stdout);
        if (stdout.indexOf("Certificate Request:") > -1) {
          console.log('Success')
          res.end('{ csr: '+stdout+ ' }')
        }
        else
          console.log('CSR verification failed')
          res.end('{ csr: '+stdout+ ' }')
      });
  });
})

// sign the csr
app.post('/signcsr', function(req, res) {
  console.log('Calling signcsr req : '+req.ip)
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
      data += chunk;
  });
  req.on('end', function() {
    console.log('Calling signcsr data :'+data)
      
    fs.writeFile("pki/certs/device12_web.csr", data, function(err) {
      if(err) {
        return console.log(err);
      }    
        console.log("The file was saved!");
    });
    //execsync(verifyCSR+data, puts);
    //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {
    var verifyCSR = 'openssl req -text -in '+'pki/certs/device12_web.csr'+' -noout'
    var signCSR   = 'openssl ca -batch -config pki/etc/tls-ca.conf -in pki/certs/device12_web.csr '
                     +'-out pki/certs/device12_web.crt -policy extern_pol -extensions client_ext '
                     +'-passin pass:pass'
    var pkcs12    = 'openssl pkcs12 -export -name \"Device 10 (Network Access)\" '
                    +'-caname \"Sensity TLS CA\" -caname \"Sensity Root CA\" -inkey certs/device10.key ' 
                    +'-in pki/certs/device12_web.crt -certfile pki/ca/tls-ca-chain.pem '
                    +'-out certs/device10.p12 passin pass:pass -passout pass:pass'

    execSync(verifyCSR, function (err, stdout, stderr) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
      if (stdout.indexOf("Certificate Request:") > -1) {
        console.log('CSR verification Success')
        execSync(signCSR, function (err, stdout, stderr)  {
         if (err) {
           console.error(err);
           return;
         }
        var cert = fs.readFileSync('pki/certs/device12_web.crt');  // cert + tls-chain -> pkcs package
        console.log("Client Certificate got signed");
        res.end(cert)
        });
      }
      else
        console.log('CSR verification failed')
    });
  });
})

// Get the certificate
app.post('/getcert', function(req, res) {
  console.log('Calling getcert req : '+req.ip)
    // key and csr
    var createCSR = 'openssl req -new -config pki/etc/client.conf -out pki/certs/device13_web.csr -keyout pki/certs/device13_web.key -subj "/C=US/O=Sensity/OU=Sensity Hardware/CN=Device 13" -passout pass:pass'
    var createCRT = 'openssl ca -batch -config pki/etc/tls-ca.conf -in pki/certs/device13_web.csr -out pki/certs/device13_web.crt -policy extern_pol -extensions client_ext -passin pass:pass'
    //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {
    execSync(createCSR, function (err, stdout, stderr)  {
      if (err) {
          console.error(err);
          return;
       }
      console.log(stdout);
      if (fs.existsSync('pki/certs/device13_web.csr')) {
        //if (stdout.indexOf("Certificate Request:") > -1) {
        console.log('CSR Creation Success')
        // var csr = fs.readFileSync('pki/certs/device13_web.csr')
        execSync(createCRT, function (err, stdout, stderr)  {
          if (err) {
            console.error(err);
            console.log('CRT Creation failed')
            return;
          }
          console.log("Client Certificate got signed");
          var cert = fs.readFileSync('pki/certs/device13_web.crt');
          res.end(cert)
        });
      }
      else
        console.log('CSR Creation failed')
  });
})

//app.post('/verifyCSR', function(req, res)
//app.post('/signCSR', function(req, res)

app.post('/savecsrtext', function(req,res) {
  console.log('Req body', req.body)
  res.end('Success\n')
})


app.listen(conf.tls.port, function() {
  console.log('TLS Server is listening on port '+conf.tls.port)
});

