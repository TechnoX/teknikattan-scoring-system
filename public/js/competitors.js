$(function () {
    var socket = io();
    socket.on('image', function(msg){
        $('#title').html(msg.title);
        $('#left').html("<p><img src='"+msg.image+"' style='max-width: 65%; max-height: 15em'/></p>");
        $('#right').empty();
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
    socket.on('question', function(msg){
        $('#left').append(msg.leftText);
        $('#right').html(msg.rightText);
    });
    socket.on('hint', function(msg){
        if(msg.index == 0){
            $('#right').html("<ol type='1' id='hints'></ol>");
        }
        $('#hints').append("<li>"+msg.hint+"</li>");
    });
    socket.on('truefalse', function(msg){
        $('#right').html("<h2>"+msg.hint+"</h2>");
    });
    socket.on('time', function(msg){
        $('#time').html(msg);
    });
    socket.on('beforeAnswer', function(msg){
        $('#left').html("<h2>Rätt svar är ...</h2>");
        $('#right').empty();
    });
    socket.on('answer', function(msg){
        $('#left').html(msg.answer);
        $('#right').empty();
    });
    socket.on('end', function(msg){
        $('#left').html("<h2>Tack för er medverkan!</h2>");
        $('#right').empty();
        $('#footer').empty();
        $('#title').empty();
    });
});
