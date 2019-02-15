var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './public/uploads' });
var MongoClient = require('mongodb').MongoClient


var database;
MongoClient.connect('mongodb://localhost:27017/', function (err, db) {
    if (err) throw err
    database = db.db('teknikattan');
    database.collection('questions').find().toArray(function(err, result) {
        if (err) throw err;
        questions = result;
    });
    
    http.listen(3000, function () {
        console.log('Magic is happening on port 3000!')
    })
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//app.use(multipart({uploadDir: config.tmp }));

// Handles static data
app.use(express.static('public'))


// --------------------------------------------------
// Static pages
// --------------------------------------------------
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
})

app.get('/users', function(req, res){
  res.sendFile(__dirname + '/views/users.html');
})

app.get('/cities', function(req, res){
  res.sendFile(__dirname + '/views/cities.html');
})

app.get('/competitors', function(req, res){
  res.sendFile(__dirname + '/views/competitors.html');
})

app.get('/projector', function(req, res){
  res.sendFile(__dirname + '/views/projector.html');
})

app.get('/tablet', function(req, res){
  res.sendFile(__dirname + '/views/answers.html');
})

app.get('/judges', function(req, res){
    res.sendFile(__dirname + '/views/judges.html');
})

app.get('/result', function(req, res){
    res.sendFile(__dirname + '/views/result.html');
})

app.get('/regionfinal', function(req, res){
    res.sendFile(__dirname + '/views/regionfinal.html');
})

app.get('/editor', function(req, res){
    res.sendFile(__dirname + '/views/editor.html');
})

app.get('/competitions', function(req, res){
    res.sendFile(__dirname + '/views/competitions.html');
})

app.get('/competition', function(req, res){
    res.sendFile(__dirname + '/views/competition.html');
})

app.get('/audience', function(req, res){
  res.sendFile(__dirname + '/views/audience.html');
})

// --------------------------------------------------
// Post responses
// --------------------------------------------------

app.put('/questions', function(req, res){
    console.log(req.body);
    database.collection('questions').remove({}, function(err, result) {
        if (err) return console.log(err);
        console.log('removed everything:');
        
        database.collection('questions').insertMany(req.body, function(err, result) {
            if (err) return console.log(err);
            console.log('saved data to database:');
            console.log(result);
            res.status(200).json({'success': true});
        });
    });
});

app.get('/questions', function(req, res){
    database.collection('questions').find().toArray(function(err, result) {
        if (err) throw err;
        res.status(200).json(result);
    });
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
    database.collection('answers').update({team: teamId, question: questionIndex}, {team: teamId, question: questionIndex, answers: req.body.answers}, {upsert: true}, function(err, result) {
        if (err) return console.log(err);
        console.log("Saved answer to database: " + JSON.stringify(req.body));
        res.status(200).json({'success': true});
    });
});

app.get('/answer/:team', function(req, res){
    var teamId = parseInt(req.params.team)
    if(!teamId){
        console.log("Team ID " + req.params.team + " is not an integer");
        res.status(400).json();
        return;
    }
    database.collection('answers').find({team: teamId, question: questionIndex}).toArray(function(err, result) {
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



// --------------------------------------------------
// Database
// --------------------------------------------------

var teams = [{id: 30, name: "Röde 2047", scores: [0,0,0,0,0,0,0,0]}, {id: 31, name: "Sami UU", scores: [0,0,0,0,0,0,0,0]}, {id: 32, name: "Peter LiU", scores: [0,0,0,0,0,0,0,0]}];



var questions = [];

// State could be: start, image, question (is active and visible), beforeanswer, answer, end
var currentState = "start";
var questionIndex = -1;
var slideIndex = 0;
var hintIndex = -1;
var statementIndex = -1;
var startedTimer = false;
//var nextState = 'showImage';
var currentTimer; // The current timer that was started by setInterval


io.on('connection', function(socket){
    console.log('a user connected, timer: ')
    if(currentTimer == null && startedTimer){
        publishTimesUp();
    }
    socket.on('disconnect', function(){
        console.log('user disconnected')
    })
    socket.on('next', function(msg){
        nextPressed();
    });
})



function nextPressed(){
    updateState();
    io.emit('stateChange', getState());
}

function getState(){
    console.log("---------------------");
    console.log("State: " + currentState);
    console.log("question: " + questionIndex + ", slide: " + slideIndex);
    console.log("hintIndex: " + hintIndex + ", statementIndex: " + statementIndex);

    var msg = {'state': currentState,
               'question': questions[questionIndex],
               'questionIndex': questionIndex,
               'slideIndex': slideIndex,
               'hintIndex': hintIndex,
               'statementIndex': statementIndex
              };
    return msg;
}

function updateState(){
    var oldState = currentState;
    var nextState = "";
    // State could be: start, image, question (is active and visible), beforeanswer, answer, end
    switch(oldState){
    case 'start':
        nextState = gotoNextQuestion();
        break;
    case 'image':
        nextState = 'question';
        break;
    case 'question':
    case 'hints':
    case 'statements':
        if(hasTimer() && !startedTimer && questions[questionIndex].type == 'normal'){
            startTimer(true);
            nextState = oldState;
        }else if(hasTimer() && !startedTimer && (oldState == 'hints' || oldState == 'statements')){
            startTimer();
            nextState = oldState;
        }else if(hasMoreSlides()){ // Go through all slides.
            stopTimer();
            startedTimer = false;
            nextSlide();
            nextState = oldState;
        }else if(hasMoreHints()){ // Go through all hints.
            stopTimer();
            startedTimer = false;
            nextHint();
            nextState = 'hints';
        }else if(hasMoreStatements()){ // Go through all statements.
            stopTimer();
            startedTimer = false;
            nextStatement();
            nextState = 'statements';
        }else{
            if(questions[questionIndex].answer.show){
                nextState = 'beforeanswer';
            }else{
                nextState = gotoNextQuestion();
            }
        }
        break;
    case 'beforeanswer':
        nextState = 'answer';
        break;
    case 'answer':
        nextState = gotoNextQuestion();
        break;
    case 'end':
        nextState = oldState;
        break;
    }
    currentState = nextState;
}

function hasMoreSlides(){
    return slideIndex + 1 < questions[questionIndex].slides.length;
}

function nextSlide(){
    slideIndex++;
}

function hasMoreHints(){
    return questions[questionIndex].type == 'hints' && hintIndex + 1 < questions[questionIndex].hints.length;
}

function nextHint(){
    hintIndex++;
}

function hasMoreStatements(){
    return questions[questionIndex].type == 'truefalse' && statementIndex + 1 < questions[questionIndex].statements.length;
}

function nextStatement(){
    statementIndex++;
}

function gotoNextQuestion(){
    questionIndex++;
    slideIndex = 0;
    hintIndex = -1;
    statementIndex = -1;
    stopTimer();
    startedTimer = false;
    if(questionIndex >= questions.length){
        return 'end';
    }else{
        return 'image';
    }
}


function hasTimer(){
    return questions[questionIndex].slides[slideIndex].hasTimer;
}

function stopTimer(){
    clearInterval(currentTimer);
    currentTimer = null;
}


// decreaseSlideTime is not set when publishing hints or statements or similar, because we need to keep the time intact between hints
function startTimer(decreaseSlideTime){
    var time = Math.round(questions[questionIndex].slides[slideIndex].time);
    if(decreaseSlideTime){
        questions[questionIndex].slides[slideIndex].time = time;
    }
    clearInterval(currentTimer);
    startedTimer = true;
    console.log("Start timer, with total time: " + time);
    currentTimer = setInterval(function(){
        time--;
        if(decreaseSlideTime){
            questions[questionIndex].slides[slideIndex].time = time;
        }
        io.emit('time', time);
        if(Math.round(time) == 0){
            clearInterval(currentTimer);
            currentTimer = null;
            publishTimesUp();
        }
    }, 1000);
}


function publishTimesUp(){
    console.log("Time's up!");
    var msg = {'hintIndex': hintIndex};
    io.emit('timesUp', msg);
}


function publishAnswer(msg){
    console.log("Publish answer");
    io.emit('answer', msg);
}

function publishScoresJudge(team){
    console.log("Publish total score and name etc. for judges");
    io.emit('scoring', team);
}
