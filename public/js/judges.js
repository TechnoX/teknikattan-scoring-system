var currentQuestion = -1;

$(function () {
    var socket = io();
    socket.on('image', function(msg){
        currentQuestion = msg.index;
        $('.scoring').show();
        $('input').val('');
        $('#title').html(msg.index + ". " + msg.title);
        $('.answers').html("<img src='"+msg.image+"' class='mainimage'/>");
    });
    socket.on('question', function(msg){
        if(Array.isArray(msg.answer_type)){
            var isJustOneQuestion = (msg.answer_type.length==1)

            if(!isJustOneQuestion){
                $('.answers').html("<ol type='a' class='answer-list'></ol>");
            }
            
            for(var i = 0; i < msg.answer_type.length; i++){
                answer(i, isJustOneQuestion);
            }
        }else{
            $('.answers').html("<ol type='a' class='answer-list'></ol>");
            switch(msg.answer_type){
            case 'pairing':
                pairingAnswer(msg.pairs[0], msg.pairs[1]);
                break;
            case 'hints':
                hintsAnswer(msg.numberOfHints)
                break
            case 'truefalse':
                trueFalseAnswer(msg.numberOfHints)
                break
            case 'practical':
                break
            default:
                console.warn("Unknown answer type: " + msg.answer_type);
                break
            }
        }
    });

    socket.on('end', function(msg){
        $('.answers').html("<h2>Tack för er medverkan!</h2>");
        $('#title').empty();
    });
    
    socket.on('answerToJudges', function(msg){
        $("#team"+msg.teamIndex+" .answer"+msg.index).html(msg.text);
    });

    socket.on('generalToJudges', function(msg){
        $("#team"+msg.teamIndex+" .total-score").html(msg.team.score);
        $("#team"+msg.teamIndex+" h2").html(msg.team.name);
    });


    function answer(index, isJustOneQuestion){
        if(!isJustOneQuestion){
            $('.answer-list').append("<li><label>Svar: </label><span class='answer"+index+"'></span></li>");
        }else{
            $('.answers').html("<label>Svar: </label><span class='answer"+index+"'></span>");
        }
    }

    function pairingAnswer(pair1, pair2){
        for(var i = 0; i < Math.min(pair1.length, pair2.length); i++){
            $('.answer-list').append("<li><span class='answer"+i+"'></span></li>");
        }
    }
    function hintsAnswer(numberOfHints){
        for(var i = 0; i < numberOfHints; i++){
            $(".answer-list").append("<li><label>Ledtråd "+(i+1)+": </label><span class='answer"+i+"'></span></li>")
        }
    }
    function trueFalseAnswer(numberOfHints){
        for(var i = 0; i < numberOfHints; i++){
            $(".answer-list").append("<li><label>Påstående "+(i+1)+": </label><span class='answer"+i+"'></span></li>")
        }
    }


});



function sendScore(element, team){
    $.post("scoring", {'score': element.value, 'teamIndex': team, 'questionIndex': currentQuestion}, function( data ) {
        // Do nothing
    }).fail(function() {
        alert("Error!!");
        console.error("Error: false click");
    });
}
