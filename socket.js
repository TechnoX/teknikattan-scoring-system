var db = require('./db');
//var fsm = require('./fsm');
var io_;

var timers = {};

class Timer {
    constructor(competition_id, duration) {
        this.competition_id = competition_id;
        this.duration = duration;
        this.end = new Date();
        this.end.setSeconds(this.end.getSeconds() + duration);
        this.started = false;
        this.timesup = false;
    }

    timeTick(){
        var msg = {};
        msg.competition = this.competition_id;
        msg.time = Math.round((this.end - new Date()) / 1000);
        io_.emit('time', msg);
        if(msg.time <= 0){
            this.stop();
            this.timesup = true;
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
    }
    reset() {
        this.started = false;
        this.timesup = false;
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
        console.log('a user connected');
        
        socket.on('disconnect', function(){
            console.log('user disconnected')
        });
        socket.on('next', function(msg){
            console.log("Next pressed! ", msg);
            nextPressed(msg.competition);

        });
        socket.on('prev', function(msg){
            console.log("Previous pressed!", msg);
            previousPressed(msg.competition);
        });

    });

};

exports.get_timesup = function(competition_id){
    return timers[competition_id] && timers[competition_id].timesup;
}

function previousPressed(competition_id){
    db.get_slide(competition_id, 0, function(err, slide){
        if (err){
            console.error(err);
        }else{
            if(slide.hasTimer && timers[competition_id] && timers[competition_id].started){
                console.log("Had timer started, reset it");
                timers[competition_id].stop();
                timers[competition_id].setDuration(slide.time);
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
                if(!timers[competition_id]){
                    timers[competition_id] = new Timer(competition_id, slide.time);
                }else{
                    timers[competition_id].setDuration(slide.time);
                }
                timers[competition_id].start();
                console.log("Start timer");
            }else{
                console.log("Goto new slide");
                // Stop timer when moving to next slide, if it is started. 
                if(timers[competition_id] && timers[competition_id].started){
                    timers[competition_id].stop();
                    timers[competition_id].started = false;
                    timers[competition_id].timesup = false;
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



exports.publish_answer = function(msg) {
    io_.emit('answer', msg);
};

exports.publish_team_info = function(team) {
    io_.emit('scoring', team);
};
