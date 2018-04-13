var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

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



// --------------------------------------------------
// Post responses
// --------------------------------------------------
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
    if(questions[req.body.questionIndex].title == 'Testfråga')
        return;
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

var teams = [{name: 'Skolgårda skola', score: 0, answers: []},{name: 'Berzeliusskolan', score: 0, answers: []},{name: 'Sjöängsskolan', score: 0, answers: []}];
//var teams = [{name: 'Södervärnsskolan', score: 0, answers: []},{name: 'Malmlättsskolan', score: 0, answers: []},{name: 'Hultdalsskola', score: 0, answers: []}];

var questions = [{type: 'normal', title: 'Klassuppgift', no_number: true, answer_type: ['practical'], image: 'images/katapult.jpg', leftText: '<p>Klassuppgift</p>', rightText: '', timeText: '1 minut', scoringText: '4 poäng per träff', maxScoringText: '40 poäng', time: 10, slides: ['<p>Klassuppgift</p>'], answer: '<p></p>'},
                 {type: 'normal', title: 'Testfråga', no_number: true, answer_type: ['number'], image: 'images/spider.jpg', leftText: '<p>Hur många ben har en spindel?</p>', rightText: '', timeText: '10 sekunder', scoringText: '0 poäng per fråga', maxScoringText: '0 poäng', time: 10, slides: ['<p>Hur många ben har en spindel?</p>'], answer: '<p>En spindel har <strong>åtta</strong> ben!</p>'}
                ]


/*
var questions = [{type: 'normal', title: 'Förmörkelser', answer_type: [['Nymåne', 'Halvmåne', 'Fullmåne'],['Nymåne', 'Halvmåne', 'Fullmåne'],['Solförmörkelse', 'Månförmörkelse'],['Solförmörkelse', 'Månförmörkelse'], ['Ja','Nej'], ['Ja','Nej']], image: 'images/formorkelser.jpg', leftText: '<p>Trots att solen ligger mycket längre bort från jorden än vad månen gör ser de ungefär lika stora ut på himlen eftersom solen är mycket större. En följd av detta är att månen ibland täcker för solen &ndash; en så kallad solförmörkelse &ndash; och att jorden ibland skuggar för månen, vilket kallas månförmörkelse. Nu följer några frågor kring hur sol- och månförmörkelser beter sig sett från en plats på jorden.</p><p>Använd bilderna för att svara på frågorna. (Obs! Bilderna är ej skalenliga.)</p><ol type="a"><li>I vilken månfas kan det bli en solförmörkelse?</li><li>I vilken månfas kan det bli en månförmörkelse?</li><li>Vilken typ av förmörkelse kan vara längst tid?</li><li>Vilken typ av förmörkelse kan ses från störst del av jorden?</li><li>Är det sant att månförmörkelser bara kan ses kring midnatt?</li><li>Stämmer det att solförmörkelser bara kan uppstå på sommarhalvåret?</li></ol>', rightText: '<p><img src="images/solformorkelse.jpg" width="100%" /></p><p><img src="images/manformorkelse.jpg" width="100%" /></p>', timeText: '3 minuter', scoringText: '1 poäng per rätt svar', maxScoringText: '6 poäng', time: 3*60, slides: ['<p>Trots att solen ligger mycket längre bort från jorden än vad månen gör ser de ungefär lika stora ut på himlen eftersom solen är mycket större. En följd av detta är att månen ibland täcker för solen &ndash; en så kallad solförmörkelse &ndash; och att jorden ibland skuggar för månen, vilket kallas månförmörkelse.</p><ol type="a"><li>I vilken månfas kan det bli en solförmörkelse?</li><li>I vilken månfas kan det bli en månförmörkelse?</li><li>Vilken typ av förmörkelse kan vara längst tid?</li><li>Vilkentyp av förmörkelse kan ses från störst del av jorden?</li><li>Är det sant att månförmörkelser bara kan ses kring midnatt?</li><li>Stämmer det att solförmörkelser bara kan uppstå på sommarhalvåret?</li></ol>'], answer: '<ol type="a"><li>Det kan bli solförmörkelse vid <strong>nymåne</strong>.</li><li>Det kan bli månförmörkelse vid <strong>fullmåne</strong>.</li><li><strong>Månförmörkelser</strong> kan vara längst tid.</li><li><strong>Månförmörkelser</strong> kan ses från störst del av jorden.</li><li>Det är <strong>falskt</strong> att månförmörkelser bara kan ses kring midnatt.</li><li>Det är <strong>falskt</strong> att solförmörkelser bara kan uppstå på sommaren.</li></ol>'},
                 {type: 'normal', title: 'Arbetsfördelning', answer_type: 'pairing', pairs: [['Mitokondrie ...', 'Cellkärna med kromosomer ...', 'Golgiapparat ...', 'Lysosomer ...', 'Cellmembran ...', 'Ribosomer ...'],['... styr arbetet i cellen', '... bildar proteiner', '... håller rent i cellen', '... utvinner energi ur näringsämnen']], image: 'images/arbetsfordelning.jpg', leftText: '<p>Kroppen hos en vuxen person innehåller ungefär 100 000 miljarder celler. För att cellerna skall kunna fungera behöver en mängd olika arbeten utföras. Olika delar av cellerna utför olika arbetsuppgifter. Er uppgift är att para ihop celldelarna med de arbetsuppgifter som de utför.</p><p>Markera vilka som hör ihop genom att dra celldelen till arbetsuppgiften som den utför. Eftersom det finns fler celldelar än arbetsuppgifter kommer det att bli celldelar som inte kan paras ihop med någon arbetsuppgift.</p>', timeText: '2 minuter', scoringText: '1 poäng per rätt svar', maxScoringText: '4 poäng', time: 3*60, slides: ['<p>Kroppen hos en vuxen person innehåller ungefär 100 000 miljarder celler.</p><p>För att cellerna skall kunna fungera behöver en mängd olika arbeten utföras. Olika delar av cellerna utför olika arbetsuppgifter.</p><p>Para ihop celldelarna med de arbetsuppgifter som de utför.</p>','<p>Para ihop celldelarna med de arbetsuppgifter som de utför.</p><table><tr><th>Celldelar</th><th>Arbetsuppgifter</th></tr><tr><td><ol type="1"><li>Mitokondrie</li><li>Cellkärna med kromosomer</li><li>Golgiapparat</li><li>Lysosomer</li><li>Cellmembran</li><li>Ribosomer</li></ol></td><td><ol type="A"><li>Styr arbetet i cellen</li><li>Bildar proteiner</li><li>Håller rent i cellen</li><li>Utvinner energi ur näringsämnen</li></ol></td></tr></table>'], answer: '<p>Mitokondire utvinner energi ur näringsämnen</p><p>Cellkärna med kromosomer styr arbetet i cellen</p><p>Lysosomer håller rent i cellen</p><p>Ribosomer bildar proteiner</p>'},
                 {type: 'hints', title: 'Ledtråden', answer_type: 'hints', image: 'images/ledtrad.jpg', leftText: '<p>I uppgiften kommer ni att få fem ledtrådar som alla leder fram till ett och samma ord.</p><p>Ledtrådarna kommer att läsas upp en och en. Ni har 15 sekunder på er att skriva ned ert svar efter det att en ledtråd lästs klart.</p><p>Skriv svaret på samma radnummer som den ledtråd som lästes upp.</p><p>Ni får inga minuspoäng om ni gissar på ett felaktigt svar, så ni förlorar inget på att chansa.</p><p>Varje rad med rätt svar ger en poäng.</p><p><strong>Kom ihåg att alla ledtrådar leder till ett och samma ord.</strong></p>', timeText: '15 sekunder per ledtråd', scoringText: '1 poäng per rätt svar', maxScoringText: '5 poäng', time: 15, slides: ['Fem ledtrådar som leder till samma ord'], hints: ['Konserveringsmedel som också fungerar som näring till jästsvampar.', 'Ursprunget kan vara från rör. Finns i förädlad form som bitar.', 'Är energirikt och kan bidra till många livsstilssjukdomar.', 'Kolhydrat som bland annat finns i leverpastej och fruktyoghurt.', 'Finns i brun eller vit kristallform. Ett annat namn är sackaros.'], answer: '<p><img src="images/sugar.jpg" width="30%"></p><p><h2>Socker</h2></p>'},
                 {type: 'normal', title: 'Morse', answer_type: ['text','text','text','text','text'], image: 'images/morse.jpg', leftText: '<p>En välkänd metod för att föra över information är med hjälp av morsekod. Morsekod består av korta och långa signaler. Framför er har ni ett morsealfabet. Som exempel får ni först höra bokstäverna A, B, C och orden ABC, GUL, VIT och SVART.</p><p>Efter övningsexemplen ska ni identifiera fem meddelanden och skriva ned dem på ert svarspapper. Varje meddelande spelas upp två gånger. Det är tillåtet att föra anteckningar under tiden meddelandena spelas upp.</p><p>Ni har en minuts betänketid efter att det sista meddelandet har spelats upp.</p>', rightText: '<p><img src="morse.png" width="70%"></p>', timeText: '1 minuts betänketid', scoringText: '1 poäng per rätt meddelande', maxScoringText: '5 poäng', time: 60, slides: ['<p>En välkänd metod för att föra över information är med hjälp av morsekod. Morsekod består av korta och långa signaler.</p><p>Först kommer några övningsexempel.</p><table><tr><td>A<br>B<br>C<br>ABC<br>GUL<br>VIT<br>SVART</td><td><img src="morse.png"></td></tr></table>','<p>Identifiera följande fem meddelanden.<br><img src="morse.png"></p>'], answer: '<table><tr><td><img src="images/lifebelt.png"><br>SOS</td><td><img src="images/woman.jpg"><br>UTE</td><td><img src="images/logo.png"><br>T8</td></tr><tr><td><img src="images/cat.jpg"><br>KATT</td><td><img src="images/marie_curie.jpg"><br>CURIE</td><td></td></tr></table>'},
                 {type: 'normal', title: 'Enheter', answer_type: ['number','number','number'], image: 'images/units.png', leftText: '<p>Förut användes en mängd olika måttenheter i olika länder för att exempelvis mäta längd eller vikt. I Sverige har vi bland annat använt längdenheter som aln och famn och massenheten skålpund.</p><p>Nu använder vi i Sverige liksom de flesta andra länderna i världen de så kallade SI-enheterna, där längd mäts i meter och massa i kilogram. I vissa länder som t. ex USA används dock fortfarande andra enheter. Om man glömmer att räkna om kan det ställa till med problem. Det kan hända att man råkar köra med fel hastighet om man inte räknar om från miles per hour (mph) till km/h.</p><p>I denna uppgift ska ni räkna om mellan olika enheter. Använd bilden på hastighetsmätaren. Gör noggranna avläsningar och redovisa era uträkningar!</p><ol type="a"><li>Hur många miles går det på en mil?</li><li>Hur många kilometer går det på en mile?</li><li>Flyghöjden av passagerarplan anges ofta i enheten feet.<br>På en mile går det 1760 yard och på en yard går det 3 feet.<br>Ett flygplan flyger på en höjd på 35 000 feet. Hur många meter är det?</li></ol>', rightText: '<p><img src="enheter.jpg" width="70%"/></p>', timeText: '3 minuter', scoringText: '2 poäng per korrekt redovisat svar', maxScoringText: '6 poäng', time: 3*60, slides: ['<p>Förut användes en mängd olika måttenheter i olika länder för att exempelvis mäta längd eller vikt.</p><p>Nu använder vi i Sverige liksom de flesta andra länderna i världen de så kallade SI-enheterna, där längd mäts i meter och massa i kilogram. I vissa länder som t. ex USA används dock fortfarande andra enheter.</p><p>I denna uppgift ska ni räkna om mellan olika enheter. Använd bilden på hastighetsmätaren. Gör noggranna avläsningar och redovisa era uträkningar!</p>', '<ol type="a"><li>Hur många miles går det på en mil?</li><li>Hur många kilometer går det på en mile?</li><li>Ett flygplan flyger på en höjd på 35&nbsp;000 feet. Hur många meter är det?<br><br>På en mile går det 1760 yard och på en yard går det 3 feet.</li></ol>'], answer: '<ol type="a"><li>Det går <strong>6,2 miles</strong> på en mil</li><li>Det går <strong>1,6 km</strong> på en mile</li><li>35&nbsp;000 feet är <strong>10&nbsp;600 m</strong></li></ol>'},
                 {type: 'truefalse', title: 'Sant eller falskt', answer_type: 'truefalse', image: 'images/sant_eller_falskt.png', leftText: '<p>Genom åren har det förekommit en mängd olika sätt att kommunicera. Här kommer några frågor med anknytning till olika sätt att kommunicera.</p><p>Vilka påståenden är sanna och vilka är falska?</p><p>Tryck på den gröna området om det frågeledaren läser upp är sant och det röda området om det är falskt.</p><p>Betänketiden är endast 10 sekunder per påstående. Era svar går inte att ändra efter att tiden gått ut.</p><p>Ni kommer inte få dessa frågor på skärmen, utan det gäller att lyssna noga på vad som sägs.</p>', timeText: '10 sekunder per påstående', scoringText: '1 poäng per rätt svar', maxScoringText: '6 poäng', time: 10, slides: ['<p>Genom åren har det förekommit en mängd olika sätt att kommunicera. Här kommer några frågor med anknytning till olika sätt att kommunicera. </p><p>Vilka påståenden är sanna och vilka är falska?</p><p>Håll upp en grön skylt om det är sant och en röd skylt om det är falskt.</p>'], hints: ['Den första iPaden någonsin introducerades 2010.', 'Futharken, eller runalfabetet, hade 365 olika runor och varje runa symboliserade en särskild dag på året.', 'Radiovågor fortplantar sig genom svängningar i luftmolekylerna.', 'Brevduvor användes för att transportera meddelanden under andra världskriget.', 'Varje dag sänds mer än 10 miljarder e-postmeddelanden.', 'Sveriges första telefonnät byggdes 1920 i Göteborg.']},
                 {type: 'normal', title: 'Lampor', answer_type: 'pairing', pairs: [['Brytare D stängd, brytare E öppen:','Brytare D öppen, brytare E stängd:', 'Brytare D stängd, brytare E stängd:'],['Ingen lampa lyser','Endast lampa A lyser', 'Endast lampa B och C lyser', 'Alla lampor lyser med samma styrka', 'Alla lampor lyser, men A lyser starkare än B och C', 'Alla lampor lyser, men A lyser svagare än B och C']], image: 'images/lampor.jpg', leftText: '<p>I figuren till höger finns kopplingsschemat till en elektrisk krets med tre likadana lampor och två strömbrytare.</p><p>När en strömbrytare är stängd kan det gå ström genom brytaren. Om den är öppen kan det inte gå någon ström genom den. Beroende på vilka strömbrytare som är öppna och vilka som är stängda kommer olika lampor att lysa.</p><p>Fyll i tabellen med korrekt svarsalternativ för varje situation.</p>', rightText: '<p><img src="images/kopplingsschema.png" width="80%"/></p>', timeText: '2 minuter', scoringText: '2 poäng per rätt svar', maxScoringText: '6 poäng', time: 2*60, slides: ['<p>I figuren finns kopplingsschemat till en elektrisk krets med tre likadana lampor och två strömbrytare.</p><p><img src="images/kopplingsschema.png"/></p><p>När en strömbrytare är stängd kan det gå ström genom brytaren. Om den är öppen kan det inte gå någon ström genom den. Beroende på vilka strömbrytare som är öppna och vilka som är stängda kommer olika lampor att lysa.</p>', '<p><img src="images/kopplingsschema.png"/></p><table><tr><th>Situation</th><th>Svarsalternativ</th></tr><tr><td><p>Brytare D stängd, brytare E öppen<br>Brytare D öppen, brytare E stängd<br>Brytare D stängd, brytare E stängd</p></td><td><ol type="1"><li>Ingen lampa lyser</li><li>Endast lampa A lyser</li><li>Endast lampa B och C lyser</li><li>Alla lampor lyser med samma styrka</li><li>Alla lampor lyser men A lyser starkare än B och C</li><li>Alla lampor lyser men A lyser svagare än B och C</li></ol></td></tr></table>'], answer: '<table><tr><td><img src="images/alt2.png"></td><td>Brytare D stängd, brytare E öppen<br><strong>Alt 2. Endast lampa A lyser</strong></td></tr><tr><td><img src="images/alt1.png"></td><td>Brytare D öppen, brytare E stängd<br><strong>Alt 1. Ingen lampa lyser</strong></td></tr><tr><td><img src="images/alt5.png"></td><td>Brytare D stängd, brytare E stängd<br><strong>Alt 5. Alla lampor lyser, men A lyser starkare än B och C</strong></td></tr></table>'},
                 {type: 'normal', title: 'Spagettitorn', answer_type: 'practical', image: 'images/spagettitorn.jpg', leftText: '<p>Med hjälp av spagetti och marshmallows ska ni bygga ett så högt fristående torn som möjligt. Ni har 4 minuter på er att bygga och tornet ska stå kvar i minst 1 minut efter att byggtiden är slut. Om ni vill får ni bryta av spagettin eller dela på marshmallowsbitarna. Det är också tillåtet att blöta eller knåda dem. Däremot får ni inte använda något utöver spagetti och marshmallows för att stabilisera bygget.</p><p>Höjden på tornet mäts av domarna till överkanten av den högst placerade <strong>odelade</strong> marshmallowsbiten. Om en delad marshmallowsbit placeras högt upp räknas alltså inte den när höjden mäts.</p>', rightText: '', timeText: 'Byggtid 4 minuter', scoringText: 'Efter hur höga tornen är för de olika lagen', maxScoringText: '6 poäng. Uppgiften är utslagsgivande om flera lag har samma totalpoäng', time: 4*60, slides: ['<p>Med hjälp av spagetti och marshmallows ska ni bygga ett så högt fristående torn som möjligt.</p><p>Om ni vill får ni bryta av spagettin eller dela på marshmallowsbitarna. Det är också tillåtet att blöta eller knåda dem.</p><p>Höjden på tornet mäts av domarna till överkanten av den högst placerade odelade marshmallowsbiten.</p>'], answer: '<p>Not implmeneted</p>'}
             ]
*/

var currentQuestion = 0;
var slideIndex = 0;
var hintIndex = 0;
var trueFalseIndex = 0;
var nextState = 'showImage';
var currentTimer; // The current timer that was started by setInterval
var numberOfQuestionsWithoutNumber = 0;


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

http.listen(3000, function () {
  console.log('Magic is happening on port 3000!')
})

function nextPressed(){
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
        if(question.answer_type == 'practical'){
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
            currentQuestion++;
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
    if(question.no_number){
        numberOfQuestionsWithoutNumber++;
        msg.title = question.title;
    }else{
        msg.title = (currentQuestion-numberOfQuestionsWithoutNumber) + ". " + question.title;
    }
    msg.index = currentQuestion;
    msg.timeText = question.timeText;
    msg.scoringText = question.scoringText;
    msg.maxScoringText = question.maxScoringText;
    msg.time = formatTime(question.time);
    io.emit('image', msg);
    nextState = 'showQuestion';
}

function showQuestion(question){
    // Show the team the full question
    if(slideIndex == 0){
        publishQuestionForTeam(question);
    }

    
    // Show the audience the first part of the question
    publishSlideForAudience(question, slideIndex);
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

    currentQuestion++;
    nextState = "showImage";
}


function publishEnd(question){
    console.log("Publish end message");
    var msg = {};
    io.emit('end', msg);
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
        publishHint(question.hints[hintIndex], hintIndex, question.time);
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
    if(trueFalseIndex < question.hints.length){
        publishTrueFalse(question.hints[trueFalseIndex], trueFalseIndex, question.time);
        trueFalseIndex++;
    }
    // Are we done?!
    if(trueFalseIndex >= question.hints.length){
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

function publishSlideForAudience(question, slideIndex){
    console.log("Publish slide "+slideIndex+" for audience");
    var msg = {};
    msg.image = question.image;
    msg.slide = question.slides[slideIndex];
    io.emit('slide', msg);
}
function publishQuestionForTeam(question){
    console.log("Publish question for team");
    var msg = {};
    msg.leftText = question.leftText;
    msg.rightText = question.rightText;
    msg.answer_type = question.answer_type;
    msg.pairs = question.pairs;
    msg.numberOfHints = question.hints ? question.hints.length : 0;
    io.emit('question', msg);
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
