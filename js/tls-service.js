var fs      = require('fs');
var path      = require('path');
//var https   = require('https');
var tls     = require('tls');
var express = require('express');
//var conf    = require('../config')
var app     = express();
var execSync = require('child_process').exec;
var execS = require('child_process').execSync;
var fs      = require('fs');
var cors = require('cors')

//var conf = require('./config');
var bunyan    = require('bunyan');

var log = bunyan.createLogger({name: 'DewDropQ'});


var corsOptions = {
  origin  : ['http://localhost:7979','http://paperlessclub.org:7979'],
  methods : ['GET', 'PUT', 'POST']
};

var bodyParser = require('body-parser');

app.use(express.static('views'));
app.use(express.static('bootstrap-3.3.6'));
app.use(cors(corsOptions));
app.use( bodyParser.json());       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  //extended: true
//})); 

var multer    = require('multer');
//var upload    = multer({ dest: 'uploads/' });
//var csrupload = upload.single('csr');
//var verifyCSR = 'openssl req -text -in -noout';

//Config Data

var certInfoParse = {'Issuer:': 'Issuer' , 
                     'Subject:': 'Subject', 
                     'Subject Alternative Name:' : 'Alternative Name',
                     'Not Before:' : 'Issued Date',
                     'Not After :': 'Expiry Date'
                    }

/*var parsed_result = {Issuer: {[Country: 'value', Common_Name: 'value'] }, 
                     Subject: {[Country: 'value', Common_Name: 'value'] }, 
                     SAN: 'value',
                     Issue_Date: 'value',
                     Expiry_Date: 'value'
                    }*/



app.post('/uploadcsr', function(req, res) {
  log.info('Calling csrupload');
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
      data += chunk;
  });
  req.on('end', function() {
    log.info('uploadcsr data : '+data);
    res.end('{ csr: '+'Success'+ ' }');
  });
})

var _getAllCertFiles = function(dir) {
    var results = [];
    fs.readdirSync(dir).forEach(function(file) {
        file = dir+'/'+file;
        var stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllCertFiles(file))
        } else if ( path.extname(file) === '.crt') results.push(file);

    });
    return results;
};

var certParser = function(file) {
  console.log('Calling certParser')
  var decodeCert = 'openssl x509 -text -noout -in '+file
  var resultarray = {}
  var resultInfo =  execS(decodeCert, { encoding: 'utf8' });
  console.log(resultInfo)
    for (var key in certInfoParse) {
      console.log(key)
      var v = resultInfo.substring(resultInfo.indexOf(key))
      console.log(v.substring(key.length+1, v.indexOf('\n')))
      v = v.substring(key.length+1, v.indexOf('\n'))
      if (v.trim().length == 0) {
        var v = resultInfo.substring(resultInfo.indexOf(key))
        v = v.substring(v.indexOf('\n')+1, v.length)
        v = v.substring(0, v.indexOf('\n'))
        resultarray[certInfoParse[key]] = v.trim()
      }
      else {
        resultarray[certInfoParse[key]] = v.trim()
      }
    }
  resultarray["Cert Path"] = file
  console.log(resultarray)
  return resultarray
}

app.get('/api/v1/show/certificates', function(req, res) {
  console.log('Calling Show certificate')
  var certPath  = '../pki/certs'
  var certFiles = _getAllCertFiles(certPath)
  console.log(certFiles)
  var jsResult = []
  for ( var certFile in certFiles ) {
    console.log("cert file name : " + certFiles[certFile])
    jsResult.push(certParser(certFiles[certFile]))
  }
  console.log(jsResult)
  res.send(jsResult)
});

app.get('/api/v1/show/revokedcerts', function(req, res) {
  console.log('Calling Show revokedcerts')
  var certPath  = '../pki/revoked'
  var certFiles = _getAllCertFiles(certPath)
  console.log(certFiles)
  var jsResult = []
  for ( var certFile in certFiles ) {
    console.log("cert file name : " + certFiles[certFile])
    jsResult.push(certParser(certFiles[certFile]))
  }
  console.log(jsResult)
  res.send(jsResult)
});


app.post('/api/v1/login', function(req, res) {
  log.info('Calling login');
  var data = '';
  req.setEncoding('utf8');
  res.send({API_TOKEN : 'token', USER_NAME : 'Sudhakar'})
});

app.post('/verifycsr', function(req, res) {
  log.info('Calling verifycsr');
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
      data += chunk;
  });
  req.on('end', function() {
     log.info('Calling verifycsr data : '+data);
      
      fs.writeFile("../pki/certs/temp.csr", data, function(err) {
        if(err) {
            return log.info(err);
          }    
          log.info("The CSR file was saved!");
      });
      //execsync(verifyCSR+data, puts);
      //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {
      execSync('openssl req -text -in '+'../pki/certs/temp.csr'+' -noout', function (err, stdout, stderr) {
        if (err) {
            console.error(err);
            res.end('{ csr: '+err+ ' }');
            return;
          }
        log.info(stdout);
        if (stdout.indexOf("Certificate Request:") > -1) {
          log.info('Success');
          res.end('{ csr: '+stdout+ ' }');
        }
        else
          log.info('CSR verification failed');
          res.end('{ csr: '+stdout+ ' }');
      });
  });
})

// sign the csr
app.post('/signcsr', function(req, res) {
  log.info('Calling signcsr req : '+req.ip);
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
      data += chunk;
  });
  req.on('end', function() {
    log.info('Calling signcsr data :'+data);
      
    fs.writeFile("../pki/certs/device11_web.csr", data, function(err) {
      if(err) {
        return log.info(err);
      }    
        log.info("The file was saved!");
    });
    //execsync(verifyCSR+data, puts);
    //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {

    var verifyCSR = 'openssl req -text -in '+'../pki/certs/device11_web.csr'+' -noout'
    var signCSR   = 'openssl ca -batch -config ../pki/etc/tls-ca.conf -in ../pki/certs/device11_web.csr '
                     +'-out ../pki/certs/device11_web.crt -policy extern_pol -extensions client_ext '
                     +'-passin pass:pass'


    execSync(verifyCSR, function (err, stdout, stderr) {
      if (err) {
        console.error(err);
        return;
      }
      log.info(stdout);
      if (stdout.indexOf("Certificate Request:") > -1) {
        log.info('CSR verification Success');
        execSync(signCSR, function (err, stdout, stderr)  {
         if (err) {
           console.error(err);
           return;
         }

        var cert = fs.readFileSync('../pki/certs/device11_web.crt');  // cert + tls-chain -> pkcs package
        console.log("Client Certificate got signed");
        res.end(cert)

        });
      }
      else
        log.info('CSR verification failed');
    });
  });
});



// Get the certificate
app.post('/getcert', function(req, res) {
  log.info('Calling getcert req : '+req.ip);
    // key and csr
    var createCSR = 'openssl req -new -config ../pki/etc/client.conf -out ../pki/certs/device13_web.csr -keyout ../pki/certs/device13_web.key -subj "/C=US/O=Sensity/OU=Sensity Hardware/CN=Device 13" -passout pass:pass';
    var createCRT = 'openssl ca -batch -config ../pki/etc/tls-ca.conf -in ../pki/certs/device13_web.csr -out ../pki/certs/device13_web.crt -policy extern_pol -extensions client_ext -passin pass:pass';
    var pkcs12    = 'openssl pkcs12 -export '
                    +'-name "Device 13 (Network Access)" '
                    +'-caname "Sensity TLS CA" '
                    +'-caname "Sensity Root CA" '
                    +'-inkey ../pki/certs/device13_web.key '
                    +'-in ../pki/certs/device13_web.crt '
                    +'-certfile ../pki/ca/tls-ca-chain.pem '
                    +'-out ../pki/certs/device13_web.p12 '
                    +'-passin pass:pass -passout pass:pass';


    //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {

    execSync(createCSR, function(err, stdout, stderr) {
      if (err) {
          console.error(err);
          res.end("Error");
          return;
       }
      log.info(stdout);
      if (fs.existsSync('../pki/certs/device13_web.csr')) {
        //if (stdout.indexOf("Certificate Request:") > -1) {
        log.info('CSR Creation Success');
        // var csr = fs.readFileSync('pki/certs/device13_web.csr')
        execSync(createCRT, function(err, stdout, stderr)  {
          if (err) {
            console.error(err);
            log.info('CRT Creation failed');
            res.end("Error");
            return;
          }
          log.info("Client Certificate got signed");
          execSync(pkcs12, function(err, stdout, stderr) {
            if (err) {
              console.error(err);
              log.info('PKCS Creation failed');
              res.end("Error");
              return;
            }
            var pkcs = fs.readFileSync('../pki/certs/device13_web.p12');
            res.end(pkcs)
          });
        });
      }
      else
        log.info('CSR Creation failed')
  });
})

var revokeCertificate = function(certFile) {
    var revoke = 'openssl ca -config ../pki/etc/tls-ca.conf -revoke '+certFile+' '
                    +'-crl_reason affiliationChanged -passin pass:pass'
    var result = false
    execSync(revoke, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.end('Revoke Failed')
        return false;
       }
      console.log('CRT revoke Success '+stdout+"   stderr : "+stderr)
      execS('mv '+certFile+' ../pki/revoked/', { encoding: 'utf8' });
      result = true
    });
    return result
}
app.post('/api/v1/revoke', function(req, res) {
  console.log('Calling revoke')
  var result = ''
  var failed = ''
  console.log('data')
  console.log(req.body)
  req.body.map(function(certFile){
    console.log(certFile)
    if (revokeCertificate(certFile) ) result = result + certFile + ','
    else failed = failed + certFile + ','

  })
  console.log('data')
  res.send('Revocation Success : '+result+ ' \nFailed : '+failed)
})

app.post('/revoke/:fname', function(req, res) {
  log.info('Calling revoke');
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
      data += chunk;
  });
  req.on('end', function() {
     log.info('Calling revoke data : '+req.params.fname)
    
    var revoke = 'openssl ca -config ../pki/etc/tls-ca.conf -revoke ../pki/certs/'+req.params.fname+' '
                    +'-crl_reason affiliationChanged -passin pass:pass'
    execSync(revoke, function(err, stdout, stderr)  {
      if (err) {
        console.error(err);
        res.end('Revoke Failed');
        return;
       }

      console.log('CRT revoke Success '+stdout+"   stderr : "+stderr)
      res.send('Revocation Success : '+fname)

    });
  });
})

//app.post('/verifyCSR', function(req, res)
//app.post('/signCSR', function(req, res)

app.post('/savecsrtext', function(req,res) {
  log.info('Req body', req.body);
  res.end('Success\n');
})

app.listen('4000', function() {
  log.info('TLS Server is listening on port '+'4000');
});

