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
var cors = require('cors');

var readline = require('readline');
var stream = require('stream');

//var conf = require('./config');

var msgpack = require('msgpack5')()
  , encode  = msgpack.encode
  , decode  = msgpack.decode

var corsOptions = {
  origin  : ['http://localhost:7979','http://paperlessclub.org:7979'],
  methods : ['GET', 'PUT', 'POST']
};

var bodyParser = require('body-parser')

app.use(express.static('views'));
app.use(express.static('bootstrap-3.3.6'));
app.use(cors(corsOptions));
app.use( bodyParser.json());       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  //extended: true
//})); 

var multer    = require('multer');
var upload    = multer({ dest: 'uploads/' });
var csrupload = upload.single('csr')
var verifyCSR = 'openssl req -text -in -noout'

//Config Data

var certInfoParse = {'Issuer:': 'Issuer' , 
                     'Subject:': 'Subject', 
                     'Subject Alternative Name:' : 'Alternative Name',
                     'Not Before:' : 'Issued Date',
                     'Not After :': 'Expiry Date'
                    }

var certDBInfo =    {'Status': 'Status' ,
                     'Subject': 'Subject',
                     'Revoked Date': 'Revoked Date',
                     'Revoked Reason': 'Revoked Reason',
                     'File Name': 'File Name',
                     'Expiry Date': 'Expiry Date'
                    }

/*var parsed_result = {Issuer: {[Country: 'value', Common_Name: 'value'] }, 
                     Subject: {[Country: 'value', Common_Name: 'value'] }, 
                     SAN: 'value',
                     Issue_Date: 'value',
                     Expiry_Date: 'value'
                    }*/



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

var dateformat = function(d) {
    var result = new Date (d.slice(6, 8)+':'+d.slice(8, 10)+':'+d.slice(10, 12)+' '+d.slice(2, 4)+"/"+d.slice(4, 6)+"/"+d.slice(0, 2)+" Z") 
    console.log(result)
    return result.toString()
}

var readDBCerts = function() {
  var cert_db = fs.readFileSync('../pki/ca/tls-ca/db/tls-ca.db', 'utf8');
   var certsDBArray = cert_db.split('\n')
   //console.log(certsDBArray)
   var certs = []
   for (var line in certsDBArray) {
    //console.log(line)
    if ( certsDBArray[line] != '') {
      var certInfo = {}
      var cArray = certsDBArray[line].split('\t')
      //console.log(cArray)
      if ( cArray[0] != 'R' ) {
      certInfo['Status'] = cArray[0] == 'V' ? "Valid" : cArray[0] == 'E' ? "Expired" : "Unknown";
      certInfo['Expiry Date'] = dateformat(cArray[1])
      certInfo['File Name'] = cArray[4];
      certInfo['Subject'] = cArray[5];
      //console.log(certInfo)
      certs.push(certInfo)
      //console.log(" XXXXXXXXXXX    Certs")
      //console.log(certs)
   }  } }
  //console.log(certs)
  return certs
};


var readDBRevokedCerts = function() {
  var cert_db = fs.readFileSync('../pki/ca/tls-ca/db/tls-ca.db', 'utf8');
   var certsDBArray = cert_db.split('\n')
   //console.log(certsDBArray)
   var certs = []
   for (var line in certsDBArray) {
    //console.log(line)
    if ( certsDBArray[line] != '') {
      var certInfo = {}
      var cArray = certsDBArray[line].split('\t')
      //console.log(cArray)
      if ( cArray[0] == 'R' ) {
      certInfo['Status'] = cArray[0] == 'R' ? "Revoked" : "Unknown";
      certInfo['Expiry Date'] = dateformat(cArray[1])
      certInfo['Revoked Date'] = cArray[2] == '' ? '' : dateformat(cArray[2].substring(0, cArray[2].indexOf(',')));
      certInfo['Revoked Reason'] = cArray[2] == '' ? '' : cArray[2].substring(cArray[2].indexOf(',')+1);
      certInfo['File Name'] = cArray[4];
      certInfo['Subject'] = cArray[5];
      //console.log(certInfo)
      certs.push(certInfo)
   }  } }
  //console.log(certs)
  return certs
};

var readCertsDB = function() {
  var cert_db = fs.readFileSync('../pki/ca/tls-ca/db/tls-ca.db', 'utf8');
   var certsDBArray = cert_db.split('\n')
   //console.log(certsDBArray)
   var certInfo = {}
   var certs = []
   for (var line in certsDBArray) {
    //console.log(line)
    if ( certsDBArray[line] != '') {
      var cArray = certsDBArray[line].split('\t')
      certInfo['Status'] = cArray[0] == 'V' ? "Valid" : cArray[0] == 'E' ? "Expired" : cArray[0] == 'R' ? "Revoked" : "Unknown";
      certInfo['Expiry Date'] = dateformat(cArray[1])
      certInfo['Revoked Date'] = cArray[2] == '' ? '' : dateformat(cArray[2].substring(0, cArray[2].indexOf(',')));
      certInfo['Revoked Reason'] = cArray[2] == '' ? '' : cArray[2].substring(cArray[2].indexOf(',')+1);
      certInfo['File Name'] = cArray[4];
      certInfo['Subject'] = cArray[5];
      certs.push(certInfo)
   }  }
  //console.log(certs)
  return certs
};

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
  res.send(readDBCerts())
});

app.get('/api/v1/show/revokedcerts', function(req, res) {
  console.log('Calling Show revokedcerts')
  res.send(readDBRevokedCerts())
});

app.post('/api/v1/login', function(req, res) {
  console.log('Calling login')
  var data = '';
  req.setEncoding('utf8');
  res.send({API_TOKEN : 'token', USER_NAME : 'Sudhakar'})
});


app.post('/api/v1/verifycsr', function(req, res) {
  console.log('Calling verifycsr')
  var data = '';
  req.setEncoding('utf8');
  console.log(req.body.csr)
  req.on('data', function(chunk) {
      data += chunk;
  });

  data = req.body.csr


     console.log('Calling verifycsr data : '+data)
      
      fs.writeFile("../pki/certs/temp.csr", data, function(err) {
        if(err) {
            return console.log(err);
          }    
          console.log("The CSR file was saved!");
      });
      //execsync(verifyCSR+data, puts);
      //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {
      execSync('openssl req -text -in '+'../pki/certs/temp.csr'+' -noout', function (err, stdout, stderr) {
        if (err) {
            console.error(err);
            res.end('CSR Verification failed : '+err)
            return;
          }
        console.log(stdout);
        if (stdout.indexOf("Certificate Request:") > -1) {
          console.log('Success')
          res.end('CSR verification Success')
        }
        else
          console.log('CSR verification failed')
          res.end('CSR Verification failed')
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
      
      fs.writeFile("../pki/certs/temp.csr", data, function(err) {
        if(err) {
            return console.log(err);
          }    
          console.log("The CSR file was saved!");
      });
      //execsync(verifyCSR+data, puts);
      //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {
      execSync('openssl req -text -in '+'../pki/certs/temp.csr'+' -noout', function (err, stdout, stderr) {
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

app.get('/api/v1/getcert/:fname', function(req, res) {
  console.log('Calling get cert req ')
  var certFile = req.params.fname
  console.log(certFile)
  certFile = '/../pki/certs/'+certFile
  res.setHeader('Content-disposition', 'attachment; filename=' +certFile);
  res.download(__dirname+certFile)
});

//read the tls client conf file

var readClientConf = function(path) {
    var clientConf = fs.readFileSync(path, 'utf8');

   var clientConfArray = clientConf.split('\n')
   //console.log(certsDBArray)
   var section = []
   var certInfo = {}
   var section_name = ""
   for (var line in clientConfArray) {

    var confline = clientConfArray[line]
    if ( confline != '' && confline.indexOf("[") != -1 ) {
      if ( section.length != 0 ) {
        console.log("inside section update")
        console.log(section)
        certInfo[section_name] = section
        console.log(certInfo)
        section = []
      }
      section_name = confline.substring(confline.indexOf("[")+1, confline.indexOf("]")).trim()
      console.log(" section name : "+section_name)
     }
    if ( confline != ''  && confline.indexOf("=") != -1) {
        var confItem = {}
        var name = confline.substring(0, confline.indexOf("=")).trim()
        var val = []
        if ( confline.indexOf('#') != -1 ) {
         val.push(confline.substring(confline.indexOf("=")+1,  confline.indexOf("#")).trim())
         val.push(confline.substring(confline.indexOf("#")+1, confline.length).trim())
        } else {
         val.push(confline.substring(confline.indexOf("=")+1, confline.length).trim())
        }
        confItem[name] = val
        //console.log(confItem)
        section.push(confItem)
        //console.log(section)
    }  
    //console.log(section)
   }
   certInfo[section_name] = section
   console.log(certInfo)
   return certInfo
}

var addSpace = function(msg, len) {
   for (i=0; msg.length <= len;) { msg =  msg + ' '; console.log(msg)}
  return msg
}

var writeTLSConf = function(config, filepath) {
      fs.writeFile(filepath, config, function(err) {
      if(err) {
        return console.log(err);
      }    
        console.log("The file was saved! "+filepath);
    });
}
//push client conf 
app.get('/api/v1/getClientTLSConf', function(req, res) {
  console.log('Calling getClientTLSConf req ')
  var clientInfo = readClientConf('../pki/etc/client.conf')
  var clientConfFile = ''
  Object.keys(clientInfo).forEach(function(key) {
       clientConfFile =  clientConfFile + '[ '+key+' ]\n'
       clientInfo[key].forEach(function(item) {
        clientConfFile = clientConfFile + addSpace(Object.keys(item)[0], 28) +' = '+ addSpace(item[Object.keys(item)[0]][0], 35)
        if (item[Object.keys(item)[0]].length > 1 ) 
          clientConfFile = clientConfFile + '     #'+item[Object.keys(item)[0]][1] + '\n'
        else 
          clientConfFile = clientConfFile + '\n'
       });
       clientConfFile = clientConfFile + '\n'
   });
  console.log(clientConfFile)
  writeTLSConf(clientConfFile, '../pki/etc/client.conf')
  res.send(clientConfFile)
});


//push client conf 
app.post('/api/v1/pushClientTLSConf', function(req, res) {
  console.log('Calling getClientTLSConf req ')
  res.send(readClientConf('../pki/etc/client.conf'))
});

// sign the csr
app.post('/api/v1/signcsr', function(req, res) {
  console.log('Calling signcsr req : '+req.ip)
    
    var data = req.body.csr
    var randomInt = parseInt((Math.random() * (1000 - 100 + 1)), 10) + 100;
    var timemillies =  Date.now()
    var csrFile = 'CSR_'+randomInt+'_'+timemillies+'.csr'
    var keyFile = 'KEY_'+randomInt+'_'+timemillies+'.key'
    var certFile = 'CERT_'+randomInt+'_'+timemillies+'.crt'
    var pkcsFile = 'PKCS_'+randomInt+'_'+timemillies+'.p12'

    fs.writeFile("../pki/certs/"+csrFile, data, function(err) {
      if(err) {
        return console.log(err);
      }    
        console.log("The file was saved! "+csrFile);
    });
    var verifyCSR = 'openssl req -text -in '+'../pki/certs/'+csrFile+' -noout'
    execSync(verifyCSR, function (err, stdout, stderr) {
      if (err) {
        console.error(err);
        return;
      }
      //console.log(stdout);
      if (stdout.indexOf("Certificate Request:") > -1) {
        console.log('CSR verification Success')
        //console.log(stdout.substring(stdout.indexOf("Subject:")+8))
        var temp = stdout.substring(stdout.indexOf("Subject:")+8)
        temp = temp.substring(0, temp.indexOf("\n"))
        temp = temp.replace(/, /g,'_').trim()

        //TODO check the file exists, if it is then ? delete and sign again or pass on the existing one 
        var certsubject = temp.replace(/ /g,'_').trim()
        var certFile = certsubject+'.crt'
        var signCSR  = 'openssl ca -batch -config ../pki/etc/tls-ca.conf -in ../pki/certs/'+csrFile+' '
                     +'-out ../pki/certs/'+certFile+' -policy extern_pol -extensions client_ext '
                     +'-passin pass:pass'
        execSync(signCSR, function (err, stdout, stderr)  {
         if (err) {
           console.error(err);
           res.end("Certificate Creation Failed  : "+err )
           return;
         }
        //var cert = fs.readFileSync('../pki/certs/'+certFile);
        //var readStream = fs.createReadStream('../pki/certs/'+certFile)
        console.log("Client Certificate got signed : "+certFile);
        res.send(certFile)
        //res.setHeader('Content-disposition', 'attachment; filename=' +certFile);
        //readStream.pipe(res)
        //res.download('../pki/certs/'+certFile)
        });
      }
      else
        console.log('CSR verification failed')
        //res.end("Certificate Creation Failed, Invalid CSR Request")
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
    
    var randomInt = parseInt((Math.random() * (1000 - 100 + 1)), 10) + 100;
    var timemillies =  Date.now()
    var csrFile = 'CSR_'+randomInt+'_'+timemillies+'.csr'
    var keyFile = 'KEY_'+randomInt+'_'+timemillies+'.key'
    var certFile = 'CERT_'+randomInt+'_'+timemillies+'.crt'
    var pkcsFile = 'PKCS_'+randomInt+'_'+timemillies+'.p12'

    fs.writeFile("../pki/certs/"+csrFile, data, function(err) {
      if(err) {
        return console.log(err);
      }    
        console.log("The file was saved! "+csrFile);
    });
    //execsync(verifyCSR+data, puts);
    //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {

    var verifyCSR = 'openssl req -text -in '+'../pki/certs/'+csrFile+' -noout'


    execSync(verifyCSR, function (err, stdout, stderr) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
      if (stdout.indexOf("Certificate Request:") > -1) {
        console.log('CSR verification Success')
        // get Subject 
        //if ( stdout has "Subject:" then get the full line ..)

        console.log(stdout.indexOf("Subject:"))
        console.log(stdout.substring(stdout.indexOf("Subject:")+8))
        var temp = stdout.substring(stdout.indexOf("Subject:")+8)
        temp = temp.substring(0, temp.indexOf("\n"))
        temp = temp.replace(/, /g,'_').trim()

        //TODO check the file exists, if it is then ? delete and sign again or pass on the existing one 
        var certsubject = temp.replace(/ /g,'_').trim()
        var certFile = certsubject+'.crt'
        var signCSR  = 'openssl ca -batch -config ../pki/etc/tls-ca.conf -in ../pki/certs/'+csrFile+' '
                     +'-out ../pki/certs/'+certFile+' -policy extern_pol -extensions client_ext '
                     +'-passin pass:pass'
        execSync(signCSR, function (err, stdout, stderr)  {
         if (err) {
           console.error(err);
           res.end("cert creation failed")
           return;
         }
        var cert = fs.readFileSync('../pki/certs/'+certFile);  // cert + tls-chain -> pkcs package
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
app.post('/api/v1/gencertdefault', function(req, res) {
  console.log('Calling getcert req ')

  var randomInt = parseInt((Math.random() * (1000 - 100 + 1)), 10) + 100;
  var timemillies =  Date.now()
  var csrFile = 'CSR_'+randomInt+'_'+timemillies+'.csr'
  var keyFile = 'KEY_'+randomInt+'_'+timemillies+'.key'
  var certFile = 'CERT_'+randomInt+'_'+timemillies+'.crt'
  
    // key and csr
    var verifyCSR = 'openssl req -text -in '+'../pki/certs/'+csrFile+' -noout'
    var createCSR = 'openssl req -new -config '
                     +'../pki/etc/client.conf -out ../pki/certs/'+csrFile+' '
                     +'-keyout ../pki/certs/'+keyFile+' '
                     +'-subj "/C=US/O=Sensity/OU=Sensity Hardware/CN=Device '+randomInt+'" -passout pass:pass'

    //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {

    execSync(createCSR, function(err, stdout, stderr) {
      if (err) {
          console.error(err);
          res.end("Error")
          return;
       }
      //console.log(stdout);
      if (fs.existsSync('../pki/certs/'+csrFile)) {
        //if (stdout.indexOf("Certificate Request:") > -1) {
        console.log('CSR Creation Success')
        stdout =  execS(verifyCSR, { encoding: 'utf8' });
        //console.log(stdout)

        console.log(stdout.indexOf("Subject:"))
        //console.log(stdout.substring(stdout.indexOf("Subject:")+8))
        var temp = stdout.substring(stdout.indexOf("Subject:")+8)
        temp = temp.substring(0, temp.indexOf("\n"))
        temp = temp.replace(/, /g,'_').trim()
        var certsubject = temp.replace(/ /g,'_').trim()
        var certFile = certsubject+'.crt'
        var pkcsFile = certsubject+'.p12'
        var createCRT = 'openssl ca -batch -config ../pki/etc/tls-ca.conf -in ../pki/certs/'+csrFile+' -out ../pki/certs/'+certFile+' -policy extern_pol -extensions client_ext -passin pass:pass'
        var pkcs12    = 'openssl pkcs12 -export '
                    +'-name "Device 13 (Network Access)" '
                    +'-caname "Sensity TLS CA" '
                    +'-caname "Sensity Root CA" '
                    +'-inkey ../pki/certs/'+keyFile+' '
                    +'-in ../pki/certs/'+certFile+'  '
                    +'-certfile ../pki/ca/tls-ca-chain.pem '
                    +'-out ../pki/certs/'+pkcsFile+' '
                    +'-passin pass:pass -passout pass:pass'

        // var csr = fs.readFileSync('pki/certs/device13_web.csr')
        execSync(createCRT, function (err, stdout, stderr)  {
          if (err) {
            console.error(err);
            console.log('CRT Creation failed')
            res.end("Error")
            return;
          }
          console.log("Client Certificate got signed");
          execSync(pkcs12, function(err, stdout, stderr) {
            if (err) {
              console.error(err);
              console.log('PKCS Creation failed')
              res.end("Error")
              return;
            }
            res.send(pkcsFile)
          });
        });
      }
      else
        console.log('CSR Creation failed')
  });
})


// Get the certificate
app.post('/api/v1/gencertadavanced', function(req, res) {
  console.log('Calling getcert req ')

  var randomInt = parseInt((Math.random() * (1000 - 100 + 1)), 10) + 100;
  var timemillies =  Date.now()
  var csrFile = 'CSR_'+randomInt+'_'+timemillies+'.csr'
  var keyFile = 'KEY_'+randomInt+'_'+timemillies+'.key'
  var certFile = 'CERT_'+randomInt+'_'+timemillies+'.crt'
  
    // key and csr
    var verifyCSR = 'openssl req -text -in '+'../pki/certs/'+csrFile+' -noout'
    var createCSR = 'openssl req -new -config '
                     +'../pki/etc/client.conf -out ../pki/certs/'+csrFile+' '
                     +'-keyout ../pki/certs/'+keyFile+' '
                     +'-subj "/C=US/O=Sensity/OU=Sensity Hardware/CN=Device '+randomInt+'" -passout pass:pass'

    //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {

    execSync(createCSR, function(err, stdout, stderr) {
      if (err) {
          console.error(err);
          res.end("Error")
          return;
       }
      //console.log(stdout);
      if (fs.existsSync('../pki/certs/'+csrFile)) {
        //if (stdout.indexOf("Certificate Request:") > -1) {
        console.log('CSR Creation Success')
        stdout =  execS(verifyCSR, { encoding: 'utf8' });
        //console.log(stdout)

        console.log(stdout.indexOf("Subject:"))
        //console.log(stdout.substring(stdout.indexOf("Subject:")+8))
        var temp = stdout.substring(stdout.indexOf("Subject:")+8)
        temp = temp.substring(0, temp.indexOf("\n"))
        temp = temp.replace(/, /g,'_').trim()
        var certsubject = temp.replace(/ /g,'_').trim()
        var certFile = certsubject+'.crt'
        var pkcsFile = certsubject+'.p12'
        var createCRT = 'openssl ca -batch -config ../pki/etc/tls-ca.conf -in ../pki/certs/'+csrFile+' -out ../pki/certs/'+certFile+' -policy extern_pol -extensions client_ext -passin pass:pass'
        var pkcs12    = 'openssl pkcs12 -export '
                    +'-name "Device 13 (Network Access)" '
                    +'-caname "Sensity TLS CA" '
                    +'-caname "Sensity Root CA" '
                    +'-inkey ../pki/certs/'+keyFile+' '
                    +'-in ../pki/certs/'+certFile+'  '
                    +'-certfile ../pki/ca/tls-ca-chain.pem '
                    +'-out ../pki/certs/'+pkcsFile+' '
                    +'-passin pass:pass -passout pass:pass'

        // var csr = fs.readFileSync('pki/certs/device13_web.csr')
        execSync(createCRT, function (err, stdout, stderr)  {
          if (err) {
            console.error(err);
            console.log('CRT Creation failed')
            res.end("Error")
            return;
          }
          console.log("Client Certificate got signed");
          execSync(pkcs12, function(err, stdout, stderr) {
            if (err) {
              console.error(err);
              console.log('PKCS Creation failed')
              res.end("Error")
              return;
            }
            res.send(pkcsFile)
          });
        });
      }
      else
        console.log('CSR Creation failed')
  });
})


// Get the certificate
app.post('/api/v1/gencertcustom', function(req, res) {
  console.log('Calling gencertbasic req ')
  console.log(req.body)

 /* var body = { C: 'US',
               O: 'Sensity',
               OU: 'Sensity Hardware',
               CN: 'Device 2045',
               PA: 'pass:pass' }*/
  
  var subject = '"'+'/C='+req.body.C+'/O='+req.body.O+'/OU='+req.body.OU+'/CN='+req.body.CN+ '" -passout '+req.body.PA
  console.log(subject)

  var randomInt = parseInt((Math.random() * (1000 - 100 + 1)), 10) + 100;
  var timemillies =  Date.now()
  var csrFile = 'CSR_'+randomInt+'_'+timemillies+'.csr'
  var keyFile = 'KEY_'+randomInt+'_'+timemillies+'.key'
  var certFile = 'CERT_'+randomInt+'_'+timemillies+'.crt'
  
    // key and csr
    var verifyCSR = 'openssl req -text -in '+'../pki/certs/'+csrFile+' -noout'
    var createCSR = 'openssl req -new -config '
                     +'../pki/etc/client.conf -out ../pki/certs/'+csrFile+' '
                     +'-keyout ../pki/certs/'+keyFile+' '
                     +'-subj '+subject

    //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {

    execSync(createCSR, function(err, stdout, stderr) {
      if (err) {
          console.error(err);
          res.end("Error")
          return;
       }
      //console.log(stdout);
      if (fs.existsSync('../pki/certs/'+csrFile)) {
        //if (stdout.indexOf("Certificate Request:") > -1) {
        console.log('CSR Creation Success')
        stdout =  execS(verifyCSR, { encoding: 'utf8' });
        //console.log(stdout)

        console.log(stdout.indexOf("Subject:"))
        //console.log(stdout.substring(stdout.indexOf("Subject:")+8))
        var temp = stdout.substring(stdout.indexOf("Subject:")+8)
        temp = temp.substring(0, temp.indexOf("\n"))
        temp = temp.replace(/, /g,'_').trim()
        var certsubject = temp.replace(/ /g,'_').trim()
        var certFile = certsubject+'.crt'
        var pkcsFile = certsubject+'.p12'
        var createCRT = 'openssl ca -batch -config ../pki/etc/tls-ca.conf -in ../pki/certs/'+csrFile+' -out ../pki/certs/'+certFile+' -policy extern_pol -extensions client_ext -passin pass:pass'
        var pkcs12    = 'openssl pkcs12 -export '
                    +'-name "Device 13 (Network Access)" '
                    +'-caname "Sensity TLS CA" '
                    +'-caname "Sensity Root CA" '
                    +'-inkey ../pki/certs/'+keyFile+' '
                    +'-in ../pki/certs/'+certFile+'  '
                    +'-certfile ../pki/ca/tls-ca-chain.pem '
                    +'-out ../pki/certs/'+pkcsFile+' '
                    +'-passin pass:pass -passout pass:pass'

        // var csr = fs.readFileSync('pki/certs/device13_web.csr')
        execSync(createCRT, function (err, stdout, stderr)  {
          if (err) {
            console.error(err);
            console.log('CRT Creation failed')
            res.end("Error")
            return;
          }
          console.log("Client Certificate got signed");
          execSync(pkcs12, function(err, stdout, stderr) {
            if (err) {
              console.error(err);
              console.log('PKCS Creation failed')
              res.end("Error")
              return;
            }
            res.send(pkcsFile)
          });
        });
      }
      else
        console.log('CSR Creation failed')
  });
})


// Get the certificate
app.post('/getcert', function(req, res) {
  console.log('Calling getcert req : '+req.ip)
  console.log(req.headers)
  var randomInt = parseInt((Math.random() * (1000 - 100 + 1)), 10) + 100;
  var timemillies =  Date.now()
  var csrFile = 'CSR_'+randomInt+'_'+timemillies+'.csr'
  var keyFile = 'KEY_'+randomInt+'_'+timemillies+'.key'
  var certFile = 'CERT_'+randomInt+'_'+timemillies+'.crt'
  
    // key and csr
    var verifyCSR = 'openssl req -text -in '+'../pki/certs/'+csrFile+' -noout'
    var createCSR = 'openssl req -new -config ../pki/etc/client.conf -out ../pki/certs/'+csrFile+' -keyout ../pki/certs/'+keyFile+' -subj "/C=US/O=Sensity/OU=Sensity Hardware/CN=Device '+randomInt+'" -passout pass:pass'

    //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {

    execSync(createCSR, function(err, stdout, stderr) {
      if (err) {
          console.error(err);
          res.end("Error")
          return;
       }
      console.log(stdout);
      if (fs.existsSync('../pki/certs/'+csrFile)) {
        //if (stdout.indexOf("Certificate Request:") > -1) {
        console.log('CSR Creation Success')
        stdout =  execS(verifyCSR, { encoding: 'utf8' });
        console.log(stdout)

        console.log(stdout.indexOf("Subject:"))
        console.log(stdout.substring(stdout.indexOf("Subject:")+8))
        var temp = stdout.substring(stdout.indexOf("Subject:")+8)
        temp = temp.substring(0, temp.indexOf("\n"))
        temp = temp.replace(/, /g,'_').trim()
        var certsubject = temp.replace(/ /g,'_').trim()
        var certFile = certsubject+'.crt'
        var pkcsFile = certsubject+'.p12'
        var createCRT = 'openssl ca -batch -config ../pki/etc/tls-ca.conf -in ../pki/certs/'+csrFile+' -out ../pki/certs/'+certFile+' -policy extern_pol -extensions client_ext -passin pass:pass'
        var pkcs12    = 'openssl pkcs12 -export '
                    +'-name "Device 13 (Network Access)" '
                    +'-caname "Sensity TLS CA" '
                    +'-caname "Sensity Root CA" '
                    +'-inkey ../pki/certs/'+keyFile+' '
                    +'-in ../pki/certs/'+certFile+'  '
                    +'-certfile ../pki/ca/tls-ca-chain.pem '
                    +'-out ../pki/certs/'+pkcsFile+' '
                    +'-passin pass:pass -passout pass:pass'

        // var csr = fs.readFileSync('pki/certs/device13_web.csr')
        execSync(createCRT, function (err, stdout, stderr)  {
          if (err) {
            console.error(err);
            console.log('CRT Creation failed')
            res.end("Error")
            return;
          }
          console.log("Client Certificate got signed");
          execSync(pkcs12, function(err, stdout, stderr) {
            if (err) {
              console.error(err);
              console.log('PKCS Creation failed')
              res.end("Error")
              return;
            }
            var pkcs = fs.readFileSync('../pki/certs/'+pkcsFile);
            res.end(pkcs)
          });
        });
      }
      else
        console.log('CSR Creation failed')
  });
})

var revokeCertificate = function(certFile, reason) {
    var revoke        = 'openssl ca -config ../pki/etc/tls-ca.conf -revoke '+certFile+' '
                         +'-crl_reason '+reason+' -passin pass:pass'
    var updateTLSCrl  = 'openssl ca -gencrl -config ../pki/etc/tls-ca.conf -out ../pki/crl/tls-ca.crl -passin pass:pass'
    var updateRootCrl = 'openssl ca -gencrl -config ../pki/etc/root-ca.conf -out ../pki/crl/root-ca.crl -passin pass:pass'
    
    var result = execS(revoke, { encoding: 'utf8' });
    console.log(result)
    result = execS(updateTLSCrl, { encoding: 'utf8' });
    console.log(result)
    result = execS(updateRootCrl, { encoding: 'utf8' });
    console.log(result)
    //execS('mv '+certFile+' ../pki/revoked/', { encoding: 'utf8' });
    return true
   /* execS(revoke, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.end('Revoke Failed')
        return false;
       }
      console.log('CRT revoke Success '+stdout+"   stderr : "+stderr)
      execS('mv '+certFile+' ../pki/revoked/', { encoding: 'utf8' });
      return true
    });*/
}
app.post('/api/v1/revoke', function(req, res) {
  console.log('Calling revoke')
  var result = ''
  var failed = ''
  console.log('data')
  console.log(req.body)
  req.body.certpaths.map(function(certFile){
    console.log(certFile)
    certFile = "../pki/certs/"+certFile.substring(certFile.indexOf("/")+1).replace(/\//g,'_').replace(/ /g,'_').trim()+".crt"
    console.log(certFile)
    if (revokeCertificate(certFile, req.body.revocationresaon) ) result = result + certFile + ','
    else failed = failed + certFile + ','

  });
  console.log('data');
  res.send('Revocation Success : '+result+ ' \nFailed : '+failed);
})

app.post('/revoke/:fname', function(req, res) {
  console.log('Calling revoke');
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
      data += chunk;
  });
  req.on('end', function() {
     console.log('Calling revoke data : '+req.params.fname);
    
    var revoke = 'openssl ca -config ../pki/etc/tls-ca.conf -revoke ../pki/certs/'+req.params.fname+' '
                    +'-crl_reason affiliationChanged -passin pass:pass'
    execSync(revoke, function(err, stdout, stderr)  {
      if (err) {
        console.error(err);
        res.end('Revoke Failed');
        return;
       }
      console.log('CRT revoke Success '+stdout+"   stderr : "+stderr)
      res.send('Revocation Success : '+fname);
    });
  });
})

//app.post('/verifyCSR', function(req, res)
//app.post('/signCSR', function(req, res)

app.post('/savecsrtext', function(req,res) {
  console.log('Req body', req.body);
  res.end('Success\n');
})

app.listen('4000', function() {
  console.log('TLS Server is listening on port '+'4000');
});

