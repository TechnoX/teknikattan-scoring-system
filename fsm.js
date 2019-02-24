

// Simulate the full competition to create the slideshow (so that we can go forward and backward in it)
exports.create_slideshow = function(questions){
    var slideshow = [];
    console.log("Create slideshow");

    var currentState = "start";
    var questionIndex = -1;
    
    do {
        var question = questions[questionIndex];

        switch(currentState){
        case "start":
            slideshow.push(createStart());
            questionIndex = 0;
            currentState = "image";
            break;
        case "image":
            slideshow.push(createImage(questionIndex, question));
            currentState = "slides";
            break;
        case "slides":
            for(let i = 0; i < question.slides.length; i++){
                slideshow.push(createNormalSlide(questionIndex, question, question.slides[i]));
            }
            if(question.type == "truefalse"){
                currentState = "statements";
            }else if(question.type == "hints"){
                currentState = "hints";
            }else if(question.type == "quiz"){
                currentState = "quiz";
            }else if(question.type == "normal"){
                if(question.answer.show){
                    currentState = "before answer";
                }else{
                    questionIndex++;
                    currentState = afterSlides(questionIndex, questions);
                }
            }else{
                console.error("Missing question type in FSM")
            }
            break;
        case "hints":
            for(let i = 0; i < question.hints.length; i++){
                slideshow.push(createHintSlide(questionIndex, question, question.slides[0], question.hints[i]));
            }
            if(question.answer.show){
                currentState = "before answer";
            }else{
                questionIndex++;
                currentState = afterSlides(questionIndex, questions);
            }
            break;
        case "statements":
            for(let i = 0; i < question.statements.length; i++){
                slideshow.push(createStatementSlide(questionIndex, question, question.slides[0], question.statements[i]));
            }
            if(question.answer.show){
                currentState = "before answer";
            }else{
                questionIndex++;
                currentState = afterSlides(questionIndex, questions);
            }
            break;
        case "quiz":
            for(let q = 0; i < question.quiz.length; i++){
                slideshow.push(createQuizSlide(questionIndex, question, question.slides[0], question.quiz[i]));
            }
            if(question.answer.show){
                currentState = "before answer";
            }else{
                questionIndex++;
                currentState = afterSlides(questionIndex, questions);
            }
            break;
        case "before answer":
            slideshow.push(createBeforeAnswer(questionIndex, question))
            currentState = "answer";
            break;
        case "answer":
            slideshow.push(createAnswer(questionIndex, question));
            questionIndex++;
            currentState = afterSlides(questionIndex, questions);
            break;
        }
    } while (currentState != "end");
    
    slideshow.push(createEnd());
    return slideshow;
}

function afterSlides(index, questions){
    if(index >= questions.length){
        return "end";
    }else{
        return "image";
    }
}



function createStart(){
    var slide = {
        state: 'start'
    };
    return slide;
}


function createImage(index, q){
    var slide = {
        state: 'image',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText
    };
    return slide;
}


function createNormalSlide(index, q, s){
    var slide = {
        state: 'question',
        type: 'normal',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
        textProjector: s.textProjector,
        textLeft: s.textLeft,
        textRight: s.textRight,
        time: s.time
    };
    return slide;
}

function createHintSlide(index, q, s, hint){
    var slide = {
        state: 'question',
        type: 'hints',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
        textProjector: s.textProjector,
        textLeft: s.textLeft,
        time: s.time,
        hint: hint
    };
    return slide;
}

function createStatementSlide(index, q, s, statement){
    var slide = {
        state: 'question',
        type: 'truefalse',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
        textProjector: s.textProjector,
        textLeft: s.textLeft,
        time: s.time,
        statement: statement
    };
    return slide;
}

function createQuizSlide(index, q, s, quiz){
    var slide = {
        state: 'question',
        type: 'quiz',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
        textProjector: s.textProjector,
        textLeft: s.textLeft,
        time: s.time,
        quiz: quiz
    };
    return slide;
}


function createBeforeAnswer(index, q){
    var slide = {
        state: 'beforeanswer',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
    };
    return slide;
}

function createAnswer(index, q){
    var slide = {
        state: 'answer',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
        answer: q.answer.text
    };
    return slide;
}

function createEnd(){
    var slide = {
        state: 'end'
    };
    return slide;
}
