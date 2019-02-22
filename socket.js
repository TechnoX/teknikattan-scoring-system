var db = require('./db');

var io_;

exports.interface = function(io) {

    io_ = io;

    io.on('connection', function(socket) {
        console.log('a user connected, timer: ')
        if(currentTimer == null && startedTimer){
            publishTimesUp();
        }
        socket.on('disconnect', function(){
            console.log('user disconnected')
        });
        socket.on('next', function(msg){
            nextPressed();
        });

    });

};

exports.change_state = function(state) {
    io_.emit('stateChange', state);
};

exports.send_time = function(time) {
    io_.emit('time', time);
};

exports.send_times_up = function(msg) {
    io_.emit('timesUp', msg);
};

exports.publish_answer = function(msg) {
    io_.emit('answer', msg);
};
exports.publish_team_info = function(team) {
    io_.emit('scoring', team);
};