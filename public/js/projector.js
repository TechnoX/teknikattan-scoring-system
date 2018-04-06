$(function () {
    var socket = io();
    socket.on('image', function(msg){
        $('#titleimage').empty();
        $('#title').html(msg.index + ". " + msg.title);
        $('#main').html("<img src='"+msg.image+"' id='mainimage'/>");
        $('#time').html(msg.time);
        if(msg.timeText){
            $('#timeText').html(msg.timeText);
        }else{
            $('#timeText').empty();
        }
        if(msg.scoringText){
            $('#scoringText').html(msg.scoringText);
        }else{
            $('#scoringText').empty();
        }
        if(msg.maxScoringText){
            $('#maxScoringText').html(msg.maxScoringText);
        }else{
            $('#maxScoringText').empty();
        }
    });
    socket.on('slide', function(msg){
        $('#titleimage').html("<img src='"+msg.image+"'/>");
        $('#main').html(msg.slide);
    });
    socket.on('hint', function(msg){
        if(msg.index == 0){
            $('#main').html("<ol type='1' id='hints'></ol>");
        }
        $('#hints').append("<li>"+msg.hint+"</li>");
    });
    socket.on('truefalse', function(msg){
        $('#main').html("<h2>"+msg.hint+"</h2>");
    });
    socket.on('time', function(msg){
        $('#time').html(msg);
    });
    socket.on('beforeAnswer', function(msg){
        $('#main').html("<h2>Rätt svar är ...</h2>");
    });
    socket.on('answer', function(msg){
        $('#main').html(msg.answer);
     });
    socket.on('end', function(msg){
        $('#main').html("<h2>Tack för er medverkan!</h2>");
        $('#footer').empty();
        $('#title').empty();
        $('#titleimage').empty();
    });
});
