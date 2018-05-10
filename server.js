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

app.get('/competitors', function(req, res){
  res.sendFile(__dirname + '/views/competitors.html');
})

app.get('/projector', function(req, res){
  res.sendFile(__dirname + '/views/projector.html');
})

app.get('/answers', function(req, res){
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

app.get('/state', function(req, res){
    res.status(200).json({'state': nextState, 'questionIndex': currentQuestion, 'slideIndex': slideIndex});
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


app.post('/truefalse', function(req, res){
    console.log('value: ' + req.body.value);
    publishJudge("<span style='color: "+((req.body.value=='true')?"darkgreen":"darkred")+"'>"+((req.body.value=='true')?"Sant":"Falskt")+"</span>", trueFalseIndex);
    res.send('OK');
});

app.post('/text', function(req, res){
    console.log('value: ' + req.body.value + ", index: " + req.body.index);
    publishJudge(req.body.value, req.body.index);
    res.send('OK');
});

app.post('/drop', function(req, res){
    console.log('drag: ' + req.body.dragged + ", drop: " + req.body.dropped);
    var dragIndex = req.body.dragged.slice(4);
    var dropIndex = req.body.dropped.slice(4);
    var question = questions[currentQuestion];
    var part1, part2;
    if(question.pairs[0].length >= question.pairs[1].length){
        part1 = question.pairs[0][dragIndex];
        part2 = question.pairs[1][dropIndex];
    }else{
        part1 = question.pairs[0][dropIndex];
        part2 = question.pairs[1][dragIndex];
    }
    console.log(part1, part2);
    publishJudge(part1+" &hArr; "+part2, dropIndex);
    
    res.send('OK');
});

app.post('/scoring', function(req, res){
    console.log('Update score for team '+req.body.teamIndex+' with: ' + req.body.score);
   
    // Ignores the test question
/*    if(questions[req.body.questionIndex].title == 'Testfråga')
        return;*/
    teams[req.body.teamIndex].answers[req.body.questionIndex] = Number(req.body.score);
    var totalScore = 0;
    for(var i = 0; i < teams[req.body.teamIndex].answers.length; i++){
        if(teams[req.body.teamIndex].answers[i]){
            totalScore += teams[req.body.teamIndex].answers[i];
        }
    }
    teams[req.body.teamIndex].score = totalScore;
    publishScoresJudge(req.body.teamIndex);
    res.send('OK');
});



// --------------------------------------------------
// Database
// --------------------------------------------------

//var teams = [{name: 'Skolgårda skola', score: 0, answers: []},{name: 'Berzeliusskolan', score: 0, answers: []},{name: 'Södervärnsskolan', score: 0, answers: []}];
//var teams = [{name: 'Sjöängsskolan', score: 0, answers: []},{name: 'Malmlättsskolan', score: 0, answers: []},{name: 'Hultdalskolan', score: 0, answers: []}];
var teams = [{name: 'Sjöängsskolan', score: 0, answers: []},{name: 'Skolgårda skola', score: 0, answers: []},{name: 'Berzeliusskolan', score: 0, answers: []}];
var questions = [];

// State could be: start, image, question (is active and visible), beforeanswer, answer, end
var currentState = "start";
var questionIndex = -1;
var slideIndex = 0;
var hintIndex = -1;
var statementIndex = -1;
//var nextState = 'showImage';
var currentTimer; // The current timer that was started by setInterval


io.on('connection', function(socket){
    console.log('a user connected')
    /*publishScoresJudge(0)
    publishScoresJudge(1)
    publishScoresJudge(2)
    displayState();*/
    
    socket.on('disconnect', function(){
        console.log('user disconnected')
    })
    socket.on('next', function(msg){
        nextPressed();
    });
})



function nextPressed(){
    updateState();
    displayState();
}

function displayState(){
    console.log("---------------------");
    console.log("State: " + currentState);
    console.log("question: " + questionIndex + ", slide: " + slideIndex);
    console.log("hintIndex: " + hintIndex + ", statementIndex: " + statementIndex);
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
        if(hasMoreSlides()){ // Go through all slides.
            nextSlide();
            nextState = oldState;
        }else if(hasMoreHints()){ // Go through all hints.
            nextHint();
            nextState = 'hints';
        }else if(hasMoreStatements()){ // Go through all statements.
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
    if(questionIndex >= questions.length){
        return 'end';
    }else{
        return 'image';
    }
}


function startTimer(totalTime){
    var time = Math.round(totalTime);
    clearInterval(currentTimer);
    console.log("Current question: " + currentQuestion);
    console.log("Time: " + time);
    currentTimer = setInterval(function(){
        time--;
        io.emit('time', formatTime(time));
        if(Math.round(time) == 0){
            clearInterval(currentTimer);
            publishTimesUp();
        }
    }, 1000);
}


function publishTimesUp(){
    var msg = {'hintIndex': hintIndex};
    io.emit('timesUp', msg);
}


function formatTime(seconds){
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    if(minutes < 10){
        minutes = '0'+minutes;
    }
    if(seconds < 10){
        seconds = '0' + seconds;
    }
    return minutes + ":" + seconds;
}


function publishJudge(text, index){
    console.log("Publish answer for judges");
    var msg = {};
    msg.teamIndex = 1;
    msg.text = text;
    msg.index = index;
    io.emit('answerToJudges', msg);
}

function publishScoresJudge(teamIndex){
    console.log("Publish total score and name etc. for judges");
    var msg = {};
    msg.teamIndex = teamIndex;
    msg.team = teams[teamIndex];
    io.emit('generalToJudges', msg);
}
