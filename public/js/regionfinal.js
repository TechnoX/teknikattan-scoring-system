$(function () {
    var socket = io();
    
    socket.on('generalToJudges', function(msg){
        $("#schools .team"+msg.teamIndex).text(msg.team.name);
        for(var i = 0; i < 8; i++){
            if(msg.team.answers[i]){
                $("#question"+i+" .team"+msg.teamIndex+" input").val(msg.team.answers[i]);
            }/*else{
                $("#question"+i+" .team"+msg.teamIndex+" input").val("0");
            }*/
        }
        $("#total .team"+msg.teamIndex).text(msg.team.score);
    });

});



function sendScore(element, team, question){
    $.post("scoring", {'score': element.value, 'teamIndex': team, 'questionIndex': question}, function( data ) {
        // Do nothing
    }).fail(function() {
        alert("Error!!");
        console.error("Error: false click");
    });
}
