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

var currentQuestion = -1;
var slideIndex = 0;
var hintIndex = 0;
var trueFalseIndex = 0;
var nextState = 'showImage';
var currentTimer; // The current timer that was started by setInterval


io.on('connection', function(socket){
    console.log('a user connected')
    publishScoresJudge(0)
    publishScoresJudge(1)
    publishScoresJudge(2)
    
    
    socket.on('disconnect', function(){
        console.log('user disconnected')
    })
    socket.on('next', function(msg){
        nextPressed();
    });
})


function nextPressed(){
    if(nextState == 'showImage'){
        currentQuestion++;
    }
    var question = questions[currentQuestion];
    if(!question){
        console.error("No questions left");
        nextState = "end";
    }
    switch(nextState){
    case 'showImage':
        resetCounters();
        console.log("Show title image for question " + currentQuestion);
        publishImage(question);
        break;
    case 'showQuestion':
        console.log("Show question " + currentQuestion);
        showQuestion(question);
        break;
    case 'startTimer':
        console.log("Start timer for question " + currentQuestion);
        startTimer(question.time);
        if(!question.answer.show){
            nextState = 'showImage';
        }else{
            nextState = "showBeforeAnswer";
        }
        break;
    case 'showHints':
        console.log('Handle hints for question ' + currentQuestion);
        if(showHints(question)){
            console.log("Change state to show before answer");
            nextState = 'showBeforeAnswer';
        }
        break;
    case 'showTrueFalse':
        console.log('Handle true/false statements for question ' + currentQuestion);
        if(showTrueFalse(question)){
            nextState = 'showImage';
        }
        break;
    case 'showBeforeAnswer':
        console.log("Show just before answer " + currentQuestion);
        publishBeforeAnswer();
        break;
    case 'showAnswer':
        console.log("Show answer for question " + currentQuestion);
        publishAnswer(question);
        break;
    case 'end':
        resetCounters();
        publishEnd();
        break;
    default:
        console.warn("No state handler for state: " + nextState);
    }
}

function publishImage(question){
    // Display image
    console.log("Publish title image");
    var msg = {};
    msg.image = question.image;
    msg.title = currentQuestion + ". " + question.title;

    msg.index = currentQuestion;
    msg.timeText = question.timeText;
    msg.scoringText = question.scoringText;
    msg.maxScoringText = question.maxScoringText;
    //msg.time = formatTime(question.time); // TODO: Time is per slide, not per question
    io.emit('image', msg);
    nextState = 'showQuestion';
}

function showQuestion(question){
        
    // Show the audience the first part of the question
    publishSlide(question, slideIndex);
    slideIndex++;// Maybe we have more parts?
    // If so, we should continue to show them: 
    if(slideIndex < question.slides.length){
        console.log("Has more slides to show");
        return;
    }console.log("Done with all slides for audience");
    
    // When no more parts of the question has to be shown we continue on:
    switch(question.type){
    case 'normal':
        nextState = 'startTimer';
        break;
    case 'hints':
        nextState = 'showHints';
        break;
    case 'truefalse':
        nextState = 'showTrueFalse';
        break;
    default:
        console.warn("No question handler for type: " + question.type);
        break;
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


function publishBeforeAnswer(){
    console.log("Publish before answer");
    var msg = {};
    io.emit('beforeAnswer', msg);
    nextState = "showAnswer";
}


function publishAnswer(question){
    console.log("Publish correct answer");
    var msg = {};
    msg.answer = question.answer;
    io.emit('answer', msg);
    nextState = "showImage";
}


function publishEnd(question){
    console.log("Publish end message");
    var msg = {};
    io.emit('end', msg);
    process.exit(1);
}




function resetCounters(){
    slideIndex = 0;
    hintIndex = 0;
    trueFalseIndex = 0;
    clearInterval(currentTimer);
}


function showHints(question){
    console.log('Show the hints, one after each other');
    if(hintIndex < question.hints.length){
        var time = 20;
        for(var i = 0; i < question.slides.length; i++){
            if(question.slides[i].time > 0){
                time = question.slides[i].time;
            }
        }
        publishHint(question.hints[hintIndex], hintIndex, time);
        hintIndex++;
    }
    // Are we done?!
    if(hintIndex < question.hints.length){
        console.log("Not done with all hints yet");
        return false;
    }
    console.log("Done with all hints");
    return true;
}

function showTrueFalse(question){
    console.log('Show the true false hints, one after each other');
    if(trueFalseIndex < question.statements.length){
        var time = 10;
        for(var i = 0; i < question.slides.length; i++){
            if(question.slides[i].time > 0){
                time = question.slides[i].time;
            }
        }
        publishTrueFalse(question.statements[trueFalseIndex], trueFalseIndex, time);
        trueFalseIndex++;
    }
    // Are we done?!
    if(trueFalseIndex >= question.statements.length){
        return true;
    }return false;
}

function publishTrueFalse(hint, index, time){
    console.log("Publish True/False statement " + index);
    var msg = {};
    msg.hint = hint;
    io.emit('truefalse', msg);
    startTimer(time)
}

function publishHint(hint, index, time){
    console.log("Publish hint " + index);
    var msg = {};
    msg.hint = hint;
    msg.index = index;
    io.emit('hint', msg);
    startTimer(time)
}

function publishSlide(question, slideIndex){
    console.log("Publish slide "+slideIndex);
    var msg = {};
    msg.image = question.image;
    msg.projector = question.slides[slideIndex].textProjector;
    msg.leftText = question.slides[slideIndex].textLeft;
    msg.rightText = question.slides[slideIndex].textRight;
    msg.answer_type = question.answer.type;
    msg.pairs = question.answer.pairs;
    io.emit('slide', msg);
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
