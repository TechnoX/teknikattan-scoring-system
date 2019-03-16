var db = require('./db');
var socket = require('./socket');
var rest = require('./rest');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

// Handles static data
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


socket.interface(io);
rest.interface(app);

http.listen(3000, function () {
    console.log('listening on port 3000');
});

