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

// Handles static data
app.use(express.static(__dirname + '/public'));


// Place login endpoint before the auth check token middleware
app.post('/api/login', function(req, res){
    auth.login(req, res);
});
app.get('*', function(req, res, next) {
    if(req.url.includes('/api')) return next();
    // call all routes and return the index.html file here
    res.sendFile(__dirname + '/public/index.html');
});

app.use(auth.checkToken);

socket.interface(io);
rest.interface(app);

http.listen(3000, function () {
    console.log('listening on port 3000');
});

