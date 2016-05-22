var fs      = require('fs');
var path      = require('path');
var tls     = require('tls');
var express = require('express');
var app     = express();
var execSync = require('child_process').exec;
var execS = require('child_process').execSync;
var fs      = require('fs');
var cors = require('cors');
var readline = require('readline');
var stream = require('stream');

var corsOptions = {
  origin  : ['http://localhost:7979','http://paperlessclub.org:7979'],
  methods : ['GET', 'PUT', 'POST']
};

var msgpack = require('msgpack5')()
  , encode  = msgpack.encode
  , decode  = msgpack.decode

var bunyan = require('bunyan');
var log = bunyan.createLogger({
    name: 'tls-server',
    level: 'debug',
    streams: [{
        type: 'rotating-file',
        path: '../log/server.log',
        period: '1d',   
        count: 90
    }],
    serializers: bunyan.stdSerializers,
    src: false
  });
var randomInt = parseInt((Math.random() * (1000 - 100 + 1)), 10) + 100;

var bodyParser = require('body-parser')

app.use(express.static('views'));
app.use(express.static('bootstrap-3.3.6'));
app.use(cors(corsOptions));
app.use( bodyParser.json());       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  //extended: true
//})); 

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

var dateformat = function(d) {
    var result = new Date (d.slice(6, 8)+':'+d.slice(8, 10)+':'+d.slice(10, 12)+' '+d.slice(2, 4)+"/"+d.slice(4, 6)+"/"+d.slice(0, 2)+" Z") 
    log.debug(result)
    return result.toString()
}

var readDBCerts = function() {
  var cert_db = fs.readFileSync('../pki/ca/tls-ca/db/tls-ca.db', 'utf8');
   var certsDBArray = cert_db.split('\n')
   //log.debug(certsDBArray)
   var certs = []
   for (var line in certsDBArray) {
    //log.debug(line)
    if ( certsDBArray[line] != '') {
      var certInfo = {}
      var cArray = certsDBArray[line].split('\t')
      //log.debug(cArray)
      if ( cArray[0] != 'R' ) {
      certInfo['Status'] = cArray[0] == 'V' ? "Valid" : cArray[0] == 'E' ? "Expired" : "Unknown";
      certInfo['Expiry Date'] = dateformat(cArray[1])
      certInfo['File Name'] = cArray[4];
      certInfo['Subject'] = cArray[5];
      //log.debug(certInfo)
      certs.push(certInfo)
      //log.debug(" XXXXXXXXXXX    Certs")
      //log.debug(certs)
   }  } }
  //log.debug(certs)
  return certs
};


var readDBRevokedCerts = function() {
  var cert_db = fs.readFileSync('../pki/ca/tls-ca/db/tls-ca.db', 'utf8');
   var certsDBArray = cert_db.split('\n')
   //log.debug(certsDBArray)
   var certs = []
   for (var line in certsDBArray) {
    //log.debug(line)
    if ( certsDBArray[line] != '') {
      var certInfo = {}
      var cArray = certsDBArray[line].split('\t')
      //log.debug(cArray)
      if ( cArray[0] == 'R' ) {
      certInfo['Status'] = cArray[0] == 'R' ? "Revoked" : "Unknown";
      certInfo['Expiry Date'] = dateformat(cArray[1])
      certInfo['Revoked Date'] = cArray[2] == '' ? '' : dateformat(cArray[2].substring(0, cArray[2].indexOf(',')));
      certInfo['Revoked Reason'] = cArray[2] == '' ? '' : cArray[2].substring(cArray[2].indexOf(',')+1);
      certInfo['File Name'] = cArray[4];
      certInfo['Subject'] = cArray[5];
      //log.debug(certInfo)
      certs.push(certInfo)
   }  } }
  //log.debug(certs)
  return certs
};

var certParser = function(file) {
  log.debug('Calling certParser')
  var decodeCert = 'openssl x509 -text -noout -in '+file
  var resultarray = {}
  var resultInfo =  execS(decodeCert, { encoding: 'utf8' });
  log.debug(resultInfo)
    for (var key in certInfoParse) {
      log.debug(key)
      var v = resultInfo.substring(resultInfo.indexOf(key))
      log.debug(v.substring(key.length+1, v.indexOf('\n')))
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
  log.debug(resultarray)
  return resultarray
}

app.get('/api/v1/show/certificates', function(req, res) {
  log.debug('Calling Show certificate')
  res.send(readDBCerts())
});

app.get('/api/v1/show/revokedcerts', function(req, res) {
  log.debug('Calling Show revokedcerts')
  res.send(readDBRevokedCerts())
});

app.post('/api/v1/login', function(req, res) {
  log.debug('Calling login')
  var data = '';
  req.setEncoding('utf8');
  res.send({API_TOKEN : 'token', USER_NAME : 'Sudhakar'})
});


app.post('/api/v1/verifycsr', function(req, res) {
  log.debug('Calling verifycsr')
  var data = '';
  req.setEncoding('utf8');
  log.debug(req.body.csr)
  req.on('data', function(chunk) {
      data += chunk;
  });
  data = req.body.csr
  log.debug('Calling verifycsr data : '+data)
      
      fs.writeFile("../pki/certs/temp.csr", data, function(err) {
        if(err) {
            return log.debug(err);
          }    
          log.debug("The CSR file was saved!");
      });
      //execsync(verifyCSR+data, puts);
      //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {
      execSync('openssl req -text -in '+'../pki/certs/temp.csr'+' -noout', function (err, stdout, stderr) {
        if (err) {
            console.error(err);
            res.end('CSR Verification failed : '+err)
            return;
          }
        log.debug(stdout);
        if (stdout.indexOf("Certificate Request:") > -1) {
          log.debug('Success')
          res.end('CSR verification Success')
        }
        else
          log.debug('CSR verification failed')
          res.end('CSR Verification failed')
      });
})


app.post('/verifycsr', function(req, res) {
  log.debug('Calling verifycsr')
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
      data += chunk;
  });
  req.on('end', function() {
     log.debug('Calling verifycsr data : '+data)
      
      fs.writeFile("../pki/certs/temp.csr", data, function(err) {
        if(err) {
            return log.debug(err);
          }    
          log.debug("The CSR file was saved!");
      });
      //execsync(verifyCSR+data, puts);
      //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {
      execSync('openssl req -text -in '+'../pki/certs/temp.csr'+' -noout', function (err, stdout, stderr) {
        if (err) {
            console.error(err);
            res.end('{ csr: '+err+ ' }')
            return;
          }
        log.debug(stdout);
        if (stdout.indexOf("Certificate Request:") > -1) {
          log.debug('Success')
          res.end('{ csr: '+stdout+ ' }')
        }
        else
          log.debug('CSR verification failed')
          res.end('{ csr: '+stdout+ ' }')
      });
  });
})

app.get('/api/v1/getcert/:fname', function(req, res) {
  log.debug('Calling get cert req ')
  var certFile = req.params.fname
  log.debug(certFile)
  certFile = '/../pki/certs/'+certFile
  res.setHeader('Content-disposition', 'attachment; filename=' +certFile);
  res.download(__dirname+certFile)
});

//read the tls client conf file
var readClientConf = function(path) {
  var clientConf = fs.readFileSync(path, 'utf8');
   var clientConfArray = clientConf.split('\n')
   var section = []
   var certInfo = {}
   var section_name = ""
   for (var line in clientConfArray) {
    var confline = clientConfArray[line]
    if ( confline != '' && confline.indexOf("[") != -1 ) {
      if ( section.length != 0 ) {
        log.debug("inside section update")
        certInfo[section_name] = section
        log.debug(certInfo)
        section = []
      }
      section_name = confline.substring(confline.indexOf("[")+1, confline.indexOf("]")).trim()
      log.debug(" section name : "+section_name)
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
        section.push(confItem)
    }  
   }
   certInfo[section_name] = section
   log.debug(certInfo)
   return certInfo
}

var addSpace = function(msg, len) {
   for (i=0; msg.length <= len;) { msg =  msg + ' '; log.debug(msg)}
  return msg
}

var writeTLSConf = function(config, filepath) {
      fs.writeFile(filepath, config, function(err) {
      if(err) { return log.debug(err); }
      log.debug("The file was saved! "+filepath);
    });
}

var createclientTLSconf =  function(clientInfo) {
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
  log.debug(clientConfFile)
  writeTLSConf(clientConfFile, '../pki/etc/client.conf')
  res.send(clientConfFile)
}

var getBasicClientTLSConfig = function(path) {
  var clientTLSConfigInfo = readClientConf(path)
  var result = {}
  clientTLSConfigInfo['client_dn'].forEach(function(item) {
    log.debug(item)
     result[Object.keys(item)[0]] = item[Object.keys(item)[0]][0]
  })
  log.debug(result)
  return result
}

//push client conf 
app.get('/api/v1/getadvancedclientTLSconf', function(req, res) {
  log.debug('Calling getClientTLSConf req ')
  var clientInfo = readClientConf('../pki/etc/client.conf')
  log.debug(clientInfo)
  res.send(clientInfo)
});

app.get('/api/v1/getbasicclientTLSconf', function(req, res) {
  log.debug('Calling getClientTLSConf req ')
  res.send(getBasicClientTLSConfig('../pki/etc/client.conf'))
});

// sign the csr
app.post('/api/v1/signcsr', function(req, res) {
  log.debug('Calling signcsr req : '+req.ip)
    
    var data = req.body.csr
    var randomInt = parseInt((Math.random() * (1000 - 100 + 1)), 10) + 100;
    var timemillies =  Date.now()
    var csrFile = 'CSR_'+randomInt+'_'+timemillies+'.csr'

    fs.writeFile("../pki/certs/"+csrFile, data, function(err) {
      if(err) {
        return log.debug(err);
      }    
        log.debug("The file was saved! "+csrFile);
    });
    var verifyCSR = 'openssl req -text -in '+'../pki/certs/'+csrFile+' -noout'
    execSync(verifyCSR, function (err, stdout, stderr) {
      if (err) {
        console.error(err);
        return;
      }
      //log.debug(stdout);
      if (stdout.indexOf("Certificate Request:") > -1) {
        log.debug('CSR verification Success')
        //log.debug(stdout.substring(stdout.indexOf("Subject:")+8))
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
        log.debug("Client Certificate got signed : "+certFile);
        res.send(certFile)
        //res.setHeader('Content-disposition', 'attachment; filename=' +certFile);
        //readStream.pipe(res)
        //res.download('../pki/certs/'+certFile)
        });
      }
      else
        log.debug('CSR verification failed')
        //res.end("Certificate Creation Failed, Invalid CSR Request")
    });
})


// sign the csr
app.post('/signcsr', function(req, res) {
  log.debug('Calling signcsr req : '+req.ip)

  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
      data += chunk;
  });
  req.on('end', function() {
    log.debug('Calling signcsr data :'+data)
    
    var randomInt = parseInt((Math.random() * (1000 - 100 + 1)), 10) + 100;
    var timemillies =  Date.now()
    var csrFile = 'CSR_'+randomInt+'_'+timemillies+'.csr'

    fs.writeFile("../pki/certs/"+csrFile, data, function(err) {
      if(err) {
        return log.debug(err);
      }    
        log.debug("The file was saved! "+csrFile);
    });
    //execsync(verifyCSR+data, puts);
    //exec('openssl req -text -in '+'/tmp/test.csr'+' -noout', (err, stdout, stderr) => {

    var verifyCSR = 'openssl req -text -in '+'../pki/certs/'+csrFile+' -noout'


    execSync(verifyCSR, function (err, stdout, stderr) {
      if (err) {
        console.error(err);
        return;
      }
      log.debug(stdout);
      if (stdout.indexOf("Certificate Request:") > -1) {
        log.debug('CSR verification Success')
        // get Subject 
        //if ( stdout has "Subject:" then get the full line ..)

        log.debug(stdout.indexOf("Subject:"))
        log.debug(stdout.substring(stdout.indexOf("Subject:")+8))
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
        log.debug("Client Certificate got signed");
        res.end(cert)
        });
      }
      else
        log.debug('CSR verification failed')
    });
  });
})

// Get the certificate
app.post('/api/v1/gencertadavanced', function(req, res) {
  log.debug('Calling getcert req ')

  //get the current client conf
  var clientInfo = getBasicClientTLSConfig('../pki/etc/client.conf')
  var subject = '"'+'/C='+clientInfo.countryName
                   +'/O='+clientInfo.organizationName
                   +'/OU='+clientInfo.organizationalUnitName
                   +'/CN='+clientInfo.commonName+ '"'
  //"/C=US/O=Sensity/OU=Sensity Hardware/CN=Device 3434343434"
  //C=US_O=Sensity_OU=Sensity_Hardware_CN=Device_3434343434.crt
  log.debug(subject)
  console.log(subject)
  var fileNamePrefix = subject.substring(subject.indexOf('/C=')+1, subject.length-1)
  fileNamePrefix = fileNamePrefix.replace(/\//g,'_').replace(/ /g,'_').trim()
  console.log(fileNamePrefix)

  var csrFile = fileNamePrefix+'.csr'+'.tmp'
  var keyFile = fileNamePrefix+'.key'+'.tmp'
  var certFile = fileNamePrefix+'.crt'+'.tmp'
  var pkcsFile = fileNamePrefix+'.p12'+'.tmp'

  // key and csr
  var verifyCSR = 'openssl req -text -in '+'../pki/certs/'+csrFile+' -noout'
  var createCSR = 'openssl req -new -config '
                     +'../pki/etc/client.conf -out ../pki/certs/'+csrFile+' '
                     +'-keyout ../pki/certs/'+keyFile+' '
                     +'-subj '+subject+' -passout pass:pass'

  try {
    execS(createCSR, { encoding: 'utf8' });
  }
  catch (ex) {
    log.error(ex)
    res.send("CSR Creation Failed: "+csrFile)
    var remove_file = 'rm ../pki/certs/'+csrFile+' ../pki/certs/'+keyFile
    execS(remove_file, { encoding: 'utf8' });
    return
  }
  if (fs.existsSync('../pki/certs/'+csrFile)) {
    log.debug('CSR Creation Success')
    try { stdout =  execS(verifyCSR, { encoding: 'utf8' }); } 
    catch (ex) {
      log.error(ex)
      res.send("verify CSR Failed: "+csrFile)
      var remove_file = 'rm ../pki/certs/'+csrFile+' ../pki/certs/'+keyFile
      execS(remove_file, { encoding: 'utf8' });
      return
    }
    log.debug(stdout.indexOf("Subject:"))

    /*var temp = stdout.substring(stdout.indexOf("Subject:")+8)
    temp = temp.substring(0, temp.indexOf("\n"))
    temp = temp.replace(/, /g,'_').trim()
    var certsubject = temp.replace(/ /g,'_').trim()*/

    var createCRT = 'openssl ca -batch -config ../pki/etc/tls-ca.conf -in ../pki/certs/'+csrFile
                        +' -out ../pki/certs/'+certFile
                        +' -policy extern_pol -extensions client_ext -passin pass:pass'
    var pkcs12  = 'openssl pkcs12 -export '
                    +'-name "Device 13 (Network Access)" '
                    +'-caname "Sensity TLS CA" '
                    +'-caname "Sensity Root CA" '
                    +'-inkey ../pki/certs/'+keyFile+' '
                    +'-in ../pki/certs/'+certFile+'  '
                    +'-certfile ../pki/ca/tls-ca-chain.pem '
                    +'-out ../pki/certs/'+pkcsFile+' '
                    +'-passin pass:pass -passout pass:pass'
    try {
      execS(createCRT, { encoding: 'utf8' });
    }
    catch (ex) {
      log.error(ex)
      var remove_file = 'rm ../pki/certs/'+csrFile+' ../pki/certs/'+keyFile+' ../pki/certs/'+certFile
      execS(remove_file, { encoding: 'utf8' });
      res.send("Certification Creation Failed: "+certFile)
      return
    }
    log.debug("Client Certificate got signed");
    try {
      execS(pkcs12, { encoding: 'utf8' });
    }
    catch (ex) {
      log.error(ex)
      var remove_file = 'rm ../pki/certs/'+csrFile+' ../pki/certs/'+keyFile+' ../pki/certs/'+certFile+' ../pki/certs/'+pkcsFile
      execS(remove_file, { encoding: 'utf8' });
      res.send("PKCS Creation Failed: "+pkcsFile)
      return
    }
    try {
      var csr_mv = 'mv ../pki/certs/'+csrFile+' ../pki/certs/'+fileNamePrefix+'.csr'
      var key_mv = 'mv ../pki/certs/'+keyFile+' ../pki/certs/'+fileNamePrefix+'.key'
      var crt_mv = 'mv ../pki/certs/'+certFile+' ../pki/certs/'+fileNamePrefix+'.crt'
      var pkcs_mv = 'mv ../pki/certs/'+pkcsFile+' ../pki/certs/'+fileNamePrefix+'.p12'
      execS(csr_mv, { encoding: 'utf8' });
      execS(key_mv, { encoding: 'utf8' });
      execS(crt_mv, { encoding: 'utf8' });
      execS(pkcs_mv, { encoding: 'utf8' });
    }
    catch (ex) {
      log.error(ex)
      res.send("File Creation Failed")
      return
    }
    pkcsFile = fileNamePrefix+'.p12'
    res.send(pkcsFile)
  }
  else {
    log.debug('CSR Creation failed');
    var remove_file = 'rm ../pki/certs/'+csrFile+' ../pki/certs/'+keyFile
    execS(remove_file, { encoding: 'utf8' });
    res.send("CSR File Not Found")
  }
})


// Get the certificate
app.post('/api/v1/gencertbasic', function(req, res) {
  log.debug('Calling gencertbasic req ')
  log.debug(req.body)
  
  var subject = '"'+'/C='+req.body.C+'/O='+req.body.O+'/OU='+req.body.OU+'/CN='+req.body.CN+ '"'
  log.debug(subject)

  //"/C=US/O=Sensity/OU=Sensity Hardware/CN=Device 3434343434"
  //C=US_O=Sensity_OU=Sensity_Hardware_CN=Device_3434343434.crt

  var fileNamePrefix = subject.substring(subject.indexOf('/C=')+1, subject.length-1)
  fileNamePrefix = fileNamePrefix.replace(/\//g,'_').replace(/ /g,'_').trim()

  var csrFile = fileNamePrefix+'.csr'+'.tmp'
  var keyFile = fileNamePrefix+'.key'+'.tmp'
  var certFile = fileNamePrefix+'.crt'+'.tmp'
  var pkcsFile = fileNamePrefix+'.p12'+'.tmp'

  // key and csr
  var verifyCSR = 'openssl req -text -in '+'../pki/certs/'+csrFile+' -noout'
  var createCSR = 'openssl req -new -config '
                     +'../pki/etc/client.conf -out ../pki/certs/'+csrFile+' '
                     +'-keyout ../pki/certs/'+keyFile+' '
                     +'-subj '+subject+' -passout '+req.body.PA

  try {
    execS(createCSR, { encoding: 'utf8' });
  }
  catch (ex) {
    log.error(ex)
    res.send("CSR Creation Failed: "+csrFile)
    var remove_file = 'rm ../pki/certs/'+csrFile+' ../pki/certs/'+keyFile
    execS(remove_file, { encoding: 'utf8' });
    return
  }
  if (fs.existsSync('../pki/certs/'+csrFile)) {
    log.debug('CSR Creation Success')
    try { stdout =  execS(verifyCSR, { encoding: 'utf8' }); } 
    catch (ex) {
      log.error(ex)
      res.send("verify CSR Failed: "+csrFile)
      var remove_file = 'rm ../pki/certs/'+csrFile+' ../pki/certs/'+keyFile
      execS(remove_file, { encoding: 'utf8' });
      return
    }
    log.debug(stdout.indexOf("Subject:"))
    var createCRT = 'openssl ca -batch -config ../pki/etc/tls-ca.conf -in ../pki/certs/'+csrFile
                        +' -out ../pki/certs/'+certFile
                        +' -policy extern_pol -extensions client_ext -passin '+req.body.PA
    var pkcs12  = 'openssl pkcs12 -export '
                    +'-name "Device 13 (Network Access)" '
                    +'-caname "Sensity TLS CA" '
                    +'-caname "Sensity Root CA" '
                    +'-inkey ../pki/certs/'+keyFile+' '
                    +'-in ../pki/certs/'+certFile+'  '
                    +'-certfile ../pki/ca/tls-ca-chain.pem '
                    +'-out ../pki/certs/'+pkcsFile+' '
                    +'-passin pass:pass -passout '+req.body.PA
    try {
      execS(createCRT, { encoding: 'utf8' });
    }
    catch (ex) {
      log.error(ex)
      var remove_file = 'rm ../pki/certs/'+csrFile+' ../pki/certs/'+keyFile+' ../pki/certs/'+certFile
      execS(remove_file, { encoding: 'utf8' });
      res.send("Certification Creation Failed: "+certFile)
      return
    }
    log.debug("Client Certificate got signed");
    try {
      execS(pkcs12, { encoding: 'utf8' });
    }
    catch (ex) {
      log.error(ex)
      var remove_file = 'rm ../pki/certs/'+csrFile+' ../pki/certs/'+keyFile+' ../pki/certs/'+certFile+' ../pki/certs/'+pkcsFile
      execS(remove_file, { encoding: 'utf8' });
      res.send("PKCS Creation Failed: "+pkcsFile)
      return
    }
    try {
      var csr_mv = 'mv ../pki/certs/'+csrFile+' ../pki/certs/'+fileNamePrefix+'.csr'
      var key_mv = 'mv ../pki/certs/'+keyFile+' ../pki/certs/'+fileNamePrefix+'.key'
      var crt_mv = 'mv ../pki/certs/'+certFile+' ../pki/certs/'+fileNamePrefix+'.crt'
      var pkcs_mv = 'mv ../pki/certs/'+pkcsFile+' ../pki/certs/'+fileNamePrefix+'.p12'
      execS(csr_mv, { encoding: 'utf8' });
      execS(key_mv, { encoding: 'utf8' });
      execS(crt_mv, { encoding: 'utf8' });
      execS(pkcs_mv, { encoding: 'utf8' });
    }
    catch (ex) {
      log.error(ex)
      res.send("File Creation Failed")
      return
    }
    pkcsFile = fileNamePrefix+'.p12'
    res.send(pkcsFile)
  }
  else {
    log.debug('CSR Creation failed');
    var remove_file = 'rm ../pki/certs/'+csrFile+' ../pki/certs/'+keyFile
    execS(remove_file, { encoding: 'utf8' });
    res.send("CSR File Not Found")
  }
})


// Get the certificate TODO - remove ramdon file name generation
app.post('/getcert', function(req, res) {
  log.debug('Calling getcert req : '+req.ip)
  log.debug(req.headers)
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
      log.debug(stdout);
      if (fs.existsSync('../pki/certs/'+csrFile)) {
        //if (stdout.indexOf("Certificate Request:") > -1) {
        log.debug('CSR Creation Success')
        stdout =  execS(verifyCSR, { encoding: 'utf8' });
        log.debug(stdout)

        log.debug(stdout.indexOf("Subject:"))
        log.debug(stdout.substring(stdout.indexOf("Subject:")+8))
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
            log.debug('CRT Creation failed')
            res.end("Error")
            return;
          }
          log.debug("Client Certificate got signed");
          execSync(pkcs12, function(err, stdout, stderr) {
            if (err) {
              console.error(err);
              log.debug('PKCS Creation failed')
              res.end("Error")
              return;
            }
            var pkcs = fs.readFileSync('../pki/certs/'+pkcsFile);
            res.end(pkcs)
          });
        });
      }
      else
        log.debug('CSR Creation failed')
  });
})

var revokeCertificate = function(certFile, reason) {
    var revoke        = 'openssl ca -config ../pki/etc/tls-ca.conf -revoke '+certFile+' '
                         +'-crl_reason '+reason+' -passin pass:pass'
    var updateTLSCrl  = 'openssl ca -gencrl -config ../pki/etc/tls-ca.conf -out ../pki/crl/tls-ca.crl -passin pass:pass'
    var updateRootCrl = 'openssl ca -gencrl -config ../pki/etc/root-ca.conf -out ../pki/crl/root-ca.crl -passin pass:pass'
    
    var result = execS(revoke, { encoding: 'utf8' });
    log.debug(result)
    result = execS(updateTLSCrl, { encoding: 'utf8' });
    log.debug(result)
    result = execS(updateRootCrl, { encoding: 'utf8' });
    log.debug(result)
    //execS('mv '+certFile+' ../pki/revoked/', { encoding: 'utf8' });
    return true
   /* execS(revoke, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.end('Revoke Failed')
        return false;
       }
      log.debug('CRT revoke Success '+stdout+"   stderr : "+stderr)
      execS('mv '+certFile+' ../pki/revoked/', { encoding: 'utf8' });
      return true
    });*/
}
app.post('/api/v1/revoke', function(req, res) {
  log.debug('Calling revoke')
  var result = ''
  var failed = ''
  log.debug('data')
  log.debug(req.body)
  req.body.certpaths.map(function(certFile){
    log.debug(certFile)
    certFile = "../pki/certs/"+certFile.substring(certFile.indexOf("/")+1).replace(/\//g,'_').replace(/ /g,'_').trim()+".crt"
    log.debug(certFile)
    if (revokeCertificate(certFile, req.body.revocationresaon) ) result = result + certFile + ','
    else failed = failed + certFile + ','

  });
  log.debug('data');
  res.send('Revocation Success : '+result+ ' \nFailed : '+failed);
})

app.post('/revoke/:fname', function(req, res) {
  log.debug('Calling revoke');
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
      data += chunk;
  });
  req.on('end', function() {
     log.debug('Calling revoke data : '+req.params.fname);
    
    var revoke = 'openssl ca -config ../pki/etc/tls-ca.conf -revoke ../pki/certs/'+req.params.fname+' '
                    +'-crl_reason affiliationChanged -passin pass:pass'
    execSync(revoke, function(err, stdout, stderr)  {
      if (err) {
        console.error(err);
        res.end('Revoke Failed');
        return;
       }
      log.debug('CRT revoke Success '+stdout+"   stderr : "+stderr)
      res.send('Revocation Success : '+fname);
    });
  });
})


app.listen('4000', function() {
  log.debug('TLS Server is listening on port '+'4000');
});

