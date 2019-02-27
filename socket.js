var db = require('./db');
//var fsm = require('./fsm');
var io_;

var timers = {};

class Timer {
    constructor(competition_id, duration) {
        console.log("Inside constructor");
        console.log(competition_id, duration);
        this.competition_id = competition_id;
        this.duration = duration;
        this.end = new Date();
        this.end.setSeconds(this.end.getSeconds() + duration);
        this.started = false;
    }

    timeTick(){
        var msg = {};
        msg.competition = this.competition_id;
        msg.time = Math.round((this.end - new Date()) / 1000);
        io_.emit('time', msg);
        if(msg.time <= 0){
            this.stop();
            io_.emit('timesUp', msg);
        }
    }
    start() {
        var o = this;
        this.timer = setInterval(function(){o.timeTick();}, 1000);
        this.started = true;
    }
    setDuration(duration) {
        this.duration = duration;
        this.reset()
    }
    stop() {
        clearInterval(this.timer);        
        this.started = false;
    }
    reset() {
        this.end = new Date();
        this.end.setSeconds(this.end.getSeconds() + this.duration);
        var msg = {};
        msg.competition = this.competition_id;
        msg.time = Math.round((this.end - new Date()) / 1000);
        io_.emit('time', msg);
    }
}


exports.interface = function(io) {

    io_ = io;

    io.on('connection', function(socket) {
        console.log('a user connected, timer: ')
        //fsm.user_connected();
        
        socket.on('disconnect', function(){
            console.log('user disconnected')
        });
        socket.on('next', function(msg){
            console.log("Next pressed!");
            nextPressed(msg.competition);

        });
        socket.on('prev', function(msg){
            console.log("Previous pressed!");
            previousPressed(msg.competition);
        });

    });

};

function previousPressed(competition_id){
    db.get_slide(competition_id, 0, function(err, slide){
        if (err){
            console.error(err);
        }else{
            if(slide.hasTimer && timers[competition_id] && timers[competition_id].started){
                console.log("Had timer started, reset it");
                timers[competition_id].stop();
                timers[competition_id].setDuration(slide.time);
                timers[competition_id].reset();
            }else{
                console.log("Goto previous slide");
                gotoPrevSlide(competition_id);
            }
        }
    });
}

function nextPressed(competition_id){
    db.get_slide(competition_id, 0, function(err, slide){
        if (err){
            console.error(err);
        }else{
            if(slide.hasTimer && (!timers[competition_id] || !timers[competition_id].started)){
                console.log("Slide has timer");
                if(!timers[competition_id]){
                    console.log("Outside");
                    console.log(competition_id, slide.time);
                    timers[competition_id] = new Timer(competition_id, slide.time);
                    console.log("Create new timer");
                }else{
                    timers[competition_id].setDuration(slide.time);
                    console.log("Update new duration");
                }
                timers[competition_id].start();
                console.log("Start timer");
            }else{
                console.log("Goto new slide");
                // Stop timer when moving to next slide, if it is started. 
                if(timers[competition_id] && timers[competition_id].started){
                    timers[competition_id].stop();
                }
                gotoNextSlide(competition_id);
            }
        }
    });
}



function gotoNextSlide(competition_id){
    db.increase_index(competition_id, function(err){
        if(err){
            console.error(err);
        }else{
            db.get_slide(competition_id, 0, function(err, slide){
                if (err){
                    console.error(err);
                }else{
                    io_.emit('view_changed', competition_id);//slide);
                }
            });
        }
    });
}

function gotoPrevSlide(competition_id){
    db.decrease_index(competition_id, function(err){
        if(err){
            console.error(err);
        }else{
            db.get_slide(competition_id, 0, function(err, slide){
                if (err){
                    console.error(err);
                }else{
                    io_.emit('view_changed', competition_id);//slide);
                }
            });
        }
    });
}



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
