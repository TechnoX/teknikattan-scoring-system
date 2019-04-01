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
            if (err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json();
        });
    });

    app.get('/competition/:id/questions', function(req, res){
        db.get_questions(req.params.id, function(err, result){
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(result);
        });
    });

    app.get('/competition/:id/currentView', function(req, res){
        db.get_slide(req.params.id, 0, function(err, slide){
            if (err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(slide);
        });
    });

    app.get('/competition/:id/nextView', function(req, res){
        db.get_slide(req.params.id, 1, function(err, slide){
            if (err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(slide);
        });
    });

    app.get('/competition/:id/previousView', function(req, res){
        db.get_slide(req.params.id, -1, function(err, slide){
            if (err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(slide);
        });
    });

    app.get('/competition/:id/timesup', function(req, res){
        // To lock the answers view when refreshing page.
        return res.status(200).json(socket.get_timesup(req.params.id));
    });

    app.post('/competition/:id/answer/:team', function(req, res){    
        publishAnswer(req.body);
        db.get_slide(req.params.id, 0, function(err, slide){
            if (err){
                console.error(err);
                return res.status(500).send(err);
            }
            db.save_answer(req.params.team, slide.number, req.body.answers, function(err){
                if (err){
                    console.error(err);
                    return res.status(500).send(err);
                }
                console.log("Saved answer to database: " + JSON.stringify(req.body));
                return res.status(200).json();
            })
        });
    });

    app.post('/upload', multipartMiddleware, function(req, res) {
        console.log(req.body, req.files);
        if(req.body.file == 'null'){
            console.log("Failed to upload image")
            return res.status(500).send(err);
        }
        // don't forget to delete all req.files when done
        var file = req.files.file;
        console.log(file.name);
        console.log(file.type);
        return res.status(200).json({'path': file.path.substr(7)});
    });





    app.get('/users', function(req, res){
        db.get_users(req.decoded.city, function(err, users){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(users);
        });
    });
    app.get('/competitions', function(req, res){
        db.get_competitions(req.decoded.city, function(err, competitions){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(competitions);
        });
    });
    app.get('/cities', function(req, res){
        db.get_cities(req.decoded.city, function(err, cities){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(cities);
        });
    });
    app.get('/competition/:id/teams', function(req, res){
        db.get_teams(req.params.id, function(err, teams){
            if (err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(teams);
        });
    });
    app.get('/team/:team', function(req, res){
        db.get_team(req.params.team, function(err, team){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(team);
        });
    });

    
    app.put('/user', function(req, res){
        db.update_user(req.body, function(err){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json();
        });
    });
    app.put('/competition', function(req, res){
        db.update_competition(req.body, function(err){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json();
        });
    });
    app.put('/city', function(req, res){
        db.update_city(req.body, function(err){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json();
        });
    });
    app.put('/team', function(req, res){
        console.log('Update team '+req.body);
        db.update_team(req.body, function(err){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            publishScoresJudge(req.body); // TODO: Flag for when sending this info!?
            return res.status(200).json();
        });
    });   
    
    app.delete('/user/:id', function(req, res){
        console.log(req.params.id);
        db.delete_user(req.params.id, function(err){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json();
        });
    });
    app.delete('/competition/:id', function(req, res){
        db.delete_competition(req.params.id, function(err){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json();
        });
    });
    app.delete('/city/:id', function(req, res){
        db.delete_city(req.params.id, function(err){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json();
        });
    });
    app.delete('/team/:id', function(req, res){
        db.delete_team(req.params.id, function(err){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json();
        });
    });

    
    app.post('/user', function(req, res){
        db.add_user(req.body, function(err,id){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(id);
        });
    });
    app.post('/competition', function(req, res){
        db.add_competition(req.body.info, req.body.cloned_from, function(err,id){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(id);
        });
    });
    app.post('/city', function(req, res){
        db.add_city(req.body, function(err,id){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(id);
        });
    });
    app.post('/team', function(req, res){
        db.add_team(req.body, function(err, team){
            if(err){
                console.error(err);
                return res.status(500).send(err);
            }
            return res.status(200).json(team);
        });
    });
    
};

