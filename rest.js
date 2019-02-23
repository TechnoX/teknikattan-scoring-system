var db = require('./db');
var fsm = require('./fsm');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './public/uploads' });


exports.interface = function (app) {
    //app.use(multipart({uploadDir: config.tmp }));

    app.put('/competition/:id/questions', function(req, res){
        console.log(req.body);
        db.replace_questions(req.body, function (err) {
            if (err) res.sendStatus(500);
            else {
                res.status(200).json({'success': true});
            }
        });
    });

    app.get('/competition/:id/questions', function(req, res){
        db.get_questions(function(err, result){
            if (err) throw err;
            res.status(200).json(result);
        });
    });

    app.get('/competition/:id/currentState', function(req, res){
        res.status(200).json(fsm.getState());
    });

    app.post('/competition/:id/answer/:team', function(req, res){    
        var teamId = parseInt(req.params.team)
        if(!teamId){
            console.log("Team ID " + req.params.team + " is not an integer");
            res.status(400).json();
            return;
        }
        publishAnswer(req.body);
        db.save_answer(teamId, fsm.get_question_index(req.params.id), req.body.answers, function(err){
            if (err) return console.log(err);
            console.log("Saved answer to database: " + JSON.stringify(req.body));
            res.status(200).json({'success': true});
        })
    });

    app.get('/competition/:id/answer/:team', function(req, res){
        var teamId = parseInt(req.params.team)
        if(!teamId){
            console.log("Team ID " + req.params.team + " is not an integer");
            res.status(400).json();
            return;
        }
        db.get_answer(teamId, fsm.get_question_index(req.params.id), function(err, result){
            if (err) throw err;
            console.log("Got response from answer database: ");
            console.log(result);
            res.status(200).json(result[0]);
        });
    });


    app.post('/competition/:id/scores/:team', function(req, res){
        console.log('Update score for team '+req.body.team+' with: ' + req.body.scores);

        // TODO: Save to database
        for(var t = 0; t < teams.length; t++){
            if(teams[t].id == req.body.team){
                teams[t].scores = req.body.scores;
                publishScoresJudge(teams[t]);
                res.status(200).json({'success': true});
                return;
            }
        }
        console.log("Couldn't find a team with ID: " + req.body.team);
        res.status(400).json({'success': false});
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
