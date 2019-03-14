

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
            slideshow.push(createStart(question.competition));
            questionIndex = 0;
            currentState = "image";
            break;
        case "image":
            slideshow.push(createImage(question.competition, questionIndex, question));
            currentState = "slides";
            break;
        case "slides":
            for(let i = 0; i < question.slides.length; i++){
                slideshow.push(createNormalSlide(question.competition, questionIndex, question, question.slides[i], i));
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
                slideshow.push(createHintSlide(question.competition, questionIndex, question, question.slides[question.slides.length-1], question.hints, i+1));
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
                slideshow.push(createStatementSlide(question.competition, questionIndex, question, question.slides[question.slides.length-1], question.statements[i], i));
            }
            if(question.answer.show){
                currentState = "before answer";
            }else{
                questionIndex++;
                currentState = afterSlides(questionIndex, questions);
            }
            break;
        case "quiz":
            for(let i = 0; i < question.quiz.length; i++){
                slideshow.push(createQuizSlide(question.competition, questionIndex, question, question.slides[question.slides.length-1], question.quiz, i));
            }
            if(question.answer.show){
                currentState = "before answer";
            }else{
                questionIndex++;
                currentState = afterSlides(questionIndex, questions);
            }
            break;
        case "before answer":
            slideshow.push(createBeforeAnswer(question.competition, questionIndex, question))
            currentState = "answer";
            break;
        case "answer":
            slideshow.push(createAnswer(question.competition, questionIndex, question));
            questionIndex++;
            currentState = afterSlides(questionIndex, questions);
            break;
        }
    } while (currentState != "end");
    
    slideshow.push(createEnd(question.competition));
    return slideshow;
}

function afterSlides(index, questions){
    if(index >= questions.length){
        return "end";
    }else{
        return "image";
    }
}



function createStart(competition_id){
    var slide = {
        competition: competition_id,
        state: 'start'
    };
    return slide;
}


function createImage(competition_id, index, q){
    var slide = {
        competition: competition_id,
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


function createNormalSlide(competition, index, q, s, slideIndex){
    var slide = {
        competition: competition_id,
        state: 'question',
        title: q.title,
        image: q.image,
        number: index,
        slideIndex: slideIndex, // For answer fields that should only be visible on certain slides
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
        textProjector: s.textProjector,
        textLeft: s.textLeft,
        textRight: s.textRight,
        hasTimer: s.hasTimer && q.type == 'normal',
        time: s.time,
        answer: q.answer
    };
    return slide;
}

function createHintSlide(competition_id, index, q, s, all_hints, numberOfHints){
    var slide = {
        competition: competition_id,
        state: 'hints',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
        textProjector: s.textProjector,
        textLeft: s.textLeft,
        time: s.time,
        hasTimer: s.hasTimer,
        hints: all_hints.slice(0, numberOfHints),
        numberOfHints: all_hints.length,
        answer: q.answer
    };
    return slide;
}

function createStatementSlide(competition_id, index, q, s, statement, statementIndex){
    var slide = {
        competition: competition_id,
        state: 'statements',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
        textProjector: s.textProjector,
        textLeft: s.textLeft,
        time: s.time,
        hasTimer: s.hasTimer,
        statement: statement,
        statementIndex: statementIndex,
        answer: q.answer
    };
    return slide;
}

function createQuizSlide(competition_id, index, q, s, quiz, quizIndex){
    var slide = {
        competition: competition_id,
        state: 'quiz',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
        textProjector: s.textProjector,
        textLeft: s.textLeft,
        time: s.time,
        hasTimer: s.hasTimer,
        quiz: quiz,
        quizIndex: quizIndex,
        answer: q.answer
    };
    return slide;
}


function createBeforeAnswer(competition_id, index, q){
    var slide = {
        competition: competition_id,
        state: 'beforeanswer',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
        answer: q.answer
    };
    return slide;
}

function createAnswer(competition_id, index, q){
    var slide = {
        competition: competition_id,
        state: 'answer',
        title: q.title,
        image: q.image,
        number: index,
        timeText: q.timeText,
        scoringText: q.scoringText,
        maxScoringText: q.maxScoringText,
        answer: q.answer
    };
    return slide;
}

function createEnd(competition_id){
    var slide = {
        competition: competition_id,
        state: 'end'
    };
    return slide;
}
