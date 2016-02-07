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

callback_verifyCSR = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log('Respose : '+str);
  });
}

cli.parse({
    vCSR: ['v', 'verify CSR', 'file'],
    sCSR: ['s', 'sign CSR request. args: <csr file> <cert file>'],
    gCRT: ['g', 'get certificat', 'file']
});

cli.main(function(args, options) {
    console.log("args :"+args)
    console.log("options :"+options)
    if (options.vCSR) {
      console.log('Enabling vCSR '+options.vCSR);
      var csr = fs.readFileSync(options.vCSR);
      var req = http.request(options_csr, callback_verifyCSR);
      //This is the data we are posting, it needs to be a string or a buffer
      req.write(csr);
      req.end();
    }
    if (options.sCSR) {
      //console.log('Enabling sCRT '+options.sCRT);
      //console.log('Enabling sCRT args '+args[0]+" "+args[1]);
      callback_sCSR = function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          fs.writeFile(args[1], str, function(err) {
          if(err) {
            return console.log(err);
          }    
          console.log("The Certificate was saved! - "+args[1]);
          });
        });
      }
      var csr = fs.readFileSync(args[0]);
      var req = http.request(options_sCRT, callback_sCSR);
      //This is the data we are posting, it needs to be a string or a buffer
      req.write(csr);
      req.end();
      return
    }
    if (options.gCRT) {
      console.log('Enabling gCRT '+options.gCRT);
      callback_gCRT = function(response) {
        var str = ''
        response.on('data', function (chunk) {
          str += chunk;
        });

        response.on('end', function () {
          fs.writeFile(options.gCRT, str, function(err) {
          if(err) {
            return console.log(err);
          }    
          console.log("The Certificate was saved! - "+options.gCRT);
          });
        });
      }
      var req = http.request(options_gCRT, callback_gCRT);
      //This is the data we are posting, it needs to be a string or a buffer
      //req.write('');
      req.end();
    }
});
