var db = require('./db');
var fsm = require('./fsm');
var socket = require('./socket');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './public/uploads' });


function publishScoresJudge(team){
    console.log("Publish total score and name etc. for judges");
    socket.publish_team_info(team);
}


function publishAnswer(msg){
    console.log("Publish answer");
    socket.publish_answer(msg);
}


exports.interface = function (app) {
    //app.use(multipart({uploadDir: config.tmp }));

    app.put('/competition/:id/questions', function(req, res){
        
        db.replace_questions(req.params.id, req.body, function (err) {
            if (err) res.sendStatus(500);
            else {
                res.status(200).json({'success': true});
            }
        });
    });

    app.get('/competition/:id/questions', function(req, res){
        db.get_questions(req.params.id, function(err, result){
            if (err) throw err;
            res.status(200).json(result);
        });
    });

    app.get('/competition/:id/currentView', function(req, res){
        db.get_slide(req.params.id, 0, function(err, slide){
            if (err){
                console.error(err);
                res.status(500).send(err);
            }else{
                res.status(200).json(slide);
            }
        });
    });

    app.get('/competition/:id/nextView', function(req, res){
        db.get_slide(req.params.id, 1, function(err, slide){
            if (err){
                console.error(err);
                res.status(500).send(err);
            }else{
                res.status(200).json(slide);
            }
        });
    });

    app.get('/competition/:id/previousView', function(req, res){
        db.get_slide(req.params.id, -1, function(err, slide){
            if (err){
                console.error(err);
                res.status(500).send(err);
            }else{
                res.status(200).json(slide);
            }
        });
    });

    app.get('/competition/:id/timesup', function(req, res){
        res.status(200).json(socket.get_timesup(req.params.id));
    });

    app.post('/competition/:id/answer/:team', function(req, res){    
        var teamId = parseInt(req.params.team)
        if(!teamId){
            console.log("Team ID " + req.params.team + " is not an integer");
            res.status(400).json();
            return;
        }
        publishAnswer(req.body);
        db.get_slide(req.params.id, 0, function(err, slide){
            if (err) throw err;
            db.save_answer(teamId, slide.number, req.body.answers, function(err){
                if (err) return console.log(err);
                console.log("Saved answer to database: " + JSON.stringify(req.body));
                res.status(200).json({'success': true});
            })
        });
    });

    app.get('/competition/:id/answer/:team', function(req, res){
        var teamId = parseInt(req.params.team)
        if(!teamId){
            console.log("Team ID " + req.params.team + " is not an integer");
            res.status(400).json();
            return;
        }
        db.get_slide(req.params.id, 0, function(err, slide){
            if (err) throw err;
            db.get_answer(teamId, slide.number, function(err, result){
                if (err) throw err;
                console.log("Got response from answer database: ");
                console.log(result);
                res.status(200).json(result[0]);
            });
        });
    });


    app.post('/competition/:id/scores/:team', function(req, res){
        console.log('Update score for team '+req.body.team+' with: ' + req.body.scores);
        db.save_score(req.body.team, req.body.scores, function(err){
            if(err) {
                res.status(400).json({'success': false});
                throw err;
                return;
            }
            publishScoresJudge(req.body.scores);
            res.status(200).json({'success': true});
        });
    });


    app.get('/competition/:id/teams', function(req, res){
        db.get_teams(req.params.id, function(err, teams){
            if (err) throw err;
            console.log("Got response from teams database: ");
            console.log(teams);
            res.status(200).json(teams);
        });
    });



    app.get('/team/:team', function(req, res){
        var teamId = parseInt(req.params.team)
        if(!teamId){
            console.log("Team ID " + req.params.team + " is not an integer");
            res.status(400).json();
            return;
        }
        db.get_team(teamId, function(err, team){
            if(err){
                console.log("Couldn't find team with ID: " + teamId);
                res.status(400).json();
            }else{
                res.status(200).json(team);
            }
        });
        
    });
    
    app.post('/upload', multipartMiddleware, function(req, res) {
        console.log(req.body, req.files);
        if(req.body.file == 'null'){
            console.log("Failed to upload image")
            res.status(500).json({'success': false});
            return
        }
        // don't forget to delete all req.files when done
        var file = req.files.file;
        console.log(file.name);
        console.log(file.type);
        res.status(200).json({'success': true, 'path': file.path.substr(7)});
    });

};
