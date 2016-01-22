var fs = require('fs');
var https = require('https');
var tls = require('tls');
var express = require('express');
var app = express();
//var conf = require('./config');

var bodyParser = require('body-parser')

app.use(express.static('views'));
app.use(express.static('bootstrap-3.3.6'));

app.use( bodyParser.json());       // to support JSON-encoded bodies
//app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  //extended: true
//})); 

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var csrupload = upload.single('csr')

app.post('/uploadcsr', function(req, res) {
  console.log('Calling csrupload')
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


app.listen(4000, function() {
  console.log('TLS Server is listening on port 4000')
});

