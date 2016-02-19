#!/usr/bin/env node
var cli  = require('cli');
var http = require('http');
var fs   = require('fs');

var options_csr = {
  host: 'localhost',
  path: '/verifycsr',
  port: '4000',
  method: 'POST'
};

var options_sCRT = {
  host: 'localhost',
  path: '/signcsr',
  port: '4000',
  method: 'POST'
};

var options_gCRT = {
  host: 'localhost',
  path: '/getcert',
  port: '4000',
  method: 'POST'
};


//tls-client --sign --csr-in  <csrfile-location> --crt-out <crt-store-location> --host <host:port>
//--sign --csr-in  <csrfile-location> --crt-out <crt-store-location>

// verify CSR --verify --csr_in <csr input file> --result-out <filename>
// verify cert --verify --cert_in <cert input file> --result-out <filename>
// sign CSR
//// 1. --sign --csr_in <csr input file> --cert_out <cert file>
// genCert
//// 1. --gen_cert --pkcs <file> --pkcs_out <pkacs package name>
// genCSR 
cli.parse({
    "verify"   : [false, "verify the csr/cert"],
    "csr_in"   : [false, "Input CSR file", 'file'],
    "cert_in"  : [false, "Input Certificate file"],
    "isServer" : [false, "Request for Server Certs"],
    "isClient" : [false, "Request for Client Certs"],
    "gen_csr"  : [false, "generate CSR"],
    "gen_cert" : [false, "generate certificate"],
    "pkcs"     : [false, "PKCS 12 package file"],
    "pkcs_out" : [false, "PKCS 12 package file", 'file', 'mypkcs.p12'],
    "sign"     : [false, "sign CSR"],
    "cert_out" : [false, "output cert file",'file', 'mycert.crt'],
    "revoke"   : [false, "Revoke Certificate", 'file'],
    "host"     : [false, 'TLS server Host']
});

cli.main(function(args, options) {
    console.log("args :"+args)
    console.log("options :"+options)

    if (options.verify && options.csr_in) {
      console.log('Enabling verify '+options.verify);
      callback_verifyCSR = function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          console.log('Respose : '+str);
        });
      }
      var csr = fs.readFileSync(options.csr_in);
      var req = http.request(options_csr, callback_verifyCSR);
      //This is the data we are posting, it needs to be a string or a buffer
      req.write(csr);
      req.end();
    }
    if (options.sign && options.csr_in) {
      console.log('Enabling Sign '+options.sign);
      //console.log('Enabling sCRT args '+args[0]+" "+args[1]);
      callback_sCSR = function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          fs.writeFile(options.cert_out, str, function(err) {
          if(err) {
            return console.log(err);
          }    
          console.log("The Certificate was saved! - "+options.cert_out);
          });
        });
      }
      var csr = fs.readFileSync(options.csr_in);
      var req = http.request(options_sCRT, callback_sCSR);
      //This is the data we are posting, it needs to be a string or a buffer
      req.write(csr);
      req.end();
      return
    }
    if (options.gen_cert && options.pkcs) {
      console.log('Enabling get cert '+options.gen_cert);
      callback_gCRT = function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          fs.writeFile(options.pkcs_out, str, function(err) {
          if(err) {
            return console.log(err);
          }    
          console.log("The Certificate was saved! - "+options.pkcs_out);
          });
        });
      }
      var req = http.request(options_gCRT, callback_gCRT);
      //This is the data we are posting, it needs to be a string or a buffer
      //req.write('');
      req.end();
    }
    if (options.revoke) {
      console.log('Enabling revoke'+options.revoke);
      callback = function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });
        response.on('end', function () {
          console.log('Revoke :'+str);
        });
      }
      var req = http.request({host: 'localhost',path: '/revoke/'+options.revoke, port: '4000',method: 'POST'}, callback);
      //This is the data we are posting, it needs to be a string or a buffer
      //req.write('');
      req.end();
    }
});
