var db = require('./db');

exports.interface = function (app) {

    app.put('/questions', function(req, res){
        console.log(req.body);
        db.replace_questions(req.body, function (err) {
            if (err) res.sendStatus(500);
            else {
                res.status(200).json({'success': true});
            }
        });
    });

    app.get('/questions', function(req, res){
        db.get_questions(function(err, result){
            if (err) throw err;
            res.status(200).json(result);
        }
                        });

            app.get('/currentState', function(req, res){
                res.status(200).json(getState());
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

            app.post('/answer/:team', function(req, res){    
                var teamId = parseInt(req.params.team)
                if(!teamId){
                    console.log("Team ID " + req.params.team + " is not an integer");
                    res.status(400).json();
                    return;
                }
                publishAnswer(req.body);
                db.save_answer(teamId, questionIndex, req.body.answers, function(err){
                    if (err) return console.log(err);
                    console.log("Saved answer to database: " + JSON.stringify(req.body));
                    res.status(200).json({'success': true});
                })
            });

            app.get('/answer/:team', function(req, res){
                var teamId = parseInt(req.params.team)
                if(!teamId){
                    console.log("Team ID " + req.params.team + " is not an integer");
                    res.status(400).json();
                    return;
                }
                db.get_answer(teamId, questionIndex, function(err, result){
                    if (err) throw err;
                    console.log("Got response from answer database: ");
                    console.log(result);
                    res.status(200).json(result[0]);
                });
            });

            app.get('/team/:team', function(req, res){
                var teamId = parseInt(req.params.team)
                if(!teamId){
                    console.log("Team ID " + req.params.team + " is not an integer");
                    res.status(400).json();
                    return;
                }
                
                for(var t = 0; t < teams.length; t++){
                    if(teams[t].id == teamId){
                        res.status(200).json(teams[t]);
                        return;
                    }
                }
                
                console.log("Couldn't find team with ID: " + teamId);
                res.status(400).json();
            });


            app.post('/scores/:team', function(req, res){
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

};