var db = require('./db');
var socket = require('./socket');
var rest = require('./rest');
var auth = require('./auth');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



// Place login endpoint before the auth check token middleware
app.post('/login', function(req, res){
    auth.login(req, res);
});

// Handles static data
app.use(express.static(__dirname + '/public'));


app.use(auth.checkToken);

socket.interface(io);
rest.interface(app);

http.listen(3000, function () {
    console.log('listening on port 3000');
});

