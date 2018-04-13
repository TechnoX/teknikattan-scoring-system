$(function () {
    var socket = io();
    
    socket.on('generalToJudges', function(msg){
        $("#schools .team"+msg.teamIndex).text(msg.team.name);
        for(var i = 0; i < 8; i++){
            if(msg.team.answers[i]){
                $("#question"+i+" .team"+msg.teamIndex).text(msg.team.answers[i]);
            }else{
                $("#question"+i+" .team"+msg.teamIndex).text("0");
            }
        }
        $("#total .team"+msg.teamIndex).text(msg.team.score);
    });

});


