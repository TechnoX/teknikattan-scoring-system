
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



exports.get_question_index = function(){
    return questionIndex;
}

exports.user_connected = function(){
    if(currentTimer == null && startedTimer){
        publishTimesUp();
    }
}

exports.nextPressed = function(){
    updateState();
    socket.change_state(getState())
}

exports.getState = function(){
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

exports.updateState = function(){
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

exports.hasMoreSlides = function(){
    return slideIndex + 1 < questions[questionIndex].slides.length;
}

exports.nextSlide = function(){
    slideIndex++;
}

exports.hasMoreHints = function(){
    return questions[questionIndex].type == 'hints' && hintIndex + 1 < questions[questionIndex].hints.length;
}

exports.nextHint = function(){
    hintIndex++;
}

exports.hasMoreStatements = function(){
    return questions[questionIndex].type == 'truefalse' && statementIndex + 1 < questions[questionIndex].statements.length;
}

exports.nextStatement = function(){
    statementIndex++;
}

exports.gotoNextQuestion = function(){
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


exports.hasTimer = function(){
    return questions[questionIndex].slides[slideIndex].hasTimer;
}

exports.stopTimer = function(){
    clearInterval(currentTimer);
    currentTimer = null;
}


// decreaseSlideTime is not set when publishing hints or statements or similar, because we need to keep the time intact between hints
exports.startTimer = function(decreaseSlideTime){
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
        socket.send_time(time);
        if(Math.round(time) == 0){
            clearInterval(currentTimer);
            currentTimer = null;
            publishTimesUp();
        }
    }, 1000);
}


exports.publishTimesUp = function(){
    console.log("Time's up!");
    var msg = {'hintIndex': hintIndex};
    socket.send_times_up(msg);
}


exports.publishAnswer = function(msg){
    console.log("Publish answer");
    socket.publish_answer(msg);
}

exports.publishScoresJudge = function(team){
    console.log("Publish total score and name etc. for judges");
    socket.publish_team_info(team);
}