$(function () {
    var socket = io();
    socket.on('image', function(msg){
        $('#title').html(msg.index + ". " + msg.title);
        $('#main').html("<img src='"+msg.image+"' id='mainimage'/>");
    });
    socket.on('question', function(msg){
        if(Array.isArray(msg.answer_type)){
            var isJustOneQuestion = (msg.answer_type.length==1)

            if(!isJustOneQuestion){
                $('#main').html("<ol type='a' id='answer-list'></ol>");
            }
            
            for(var i = 0; i < msg.answer_type.length; i++){
                if(Array.isArray(msg.answer_type[i])){
                    selectAnswer(msg.answer_type[i], i, isJustOneQuestion);
                }else{
                    switch(msg.answer_type[i]){
                    case 'number':
                        numberAnswer(i, isJustOneQuestion);
                        break;
                    case 'text':
                        textAnswer(i, isJustOneQuestion);
                        break;
                    default:
                        console.warn("Unknown answer type: " + msg.answer_type[i]);
                    }
                }
            }
        }else{
            switch(msg.answer_type){
            case 'pairing':
                pairingAnswer(msg.pairs[0], msg.pairs[1]);
                break;
            case 'hints':
                hintsAnswer(msg.numberOfHints)
                break
            case 'truefalse':
                trueFalseAnswer()
                break
            case 'practical':
                break
            default:
                console.warn("Unknown answer type: " + msg.answer_type);
                break
            }
        }
    });
    socket.on('timeout', function(msg){
        // Lås tidigare fält så man inte kan mata in mer
        if(msg.index == 0){
            
        }
    });
    socket.on('end', function(msg){
        $('#main').html("<h2>Tack för er medverkan!</h2>");
        $('#title').empty();
    });


    function numberAnswer(index, isJustOneQuestion){
        if(!isJustOneQuestion){
            $('#answer-list').append("<li><label>Svar: </label><input type='number' readonly='readonly' id='answer"+index+"'></input></li>");
        }else{
            $('#main').html("<label>Svar: </label><input type='number' readonly='readonly' id='answer"+index+"'></input>");
        }
    }
    function textAnswer(index, isJustOneQuestion){
        if(!isJustOneQuestion){
            $('#answer-list').append("<li><label>Svar: <input type='text' readonly='readonly' id='answer"+index+"'></input></label></li>");
        }else{
            $('#main').html("<label>Svar: <input type='text' readonly='readonly' id='answer"+index+"'></input></label>");
        }
    }
    function selectAnswer(alternatives, index, isJustOneQuestion){
        var choices = "";
        for(var i = 0; i < alternatives.length; i++){
            choices += "<label class='choice'><input type='radio' readonly='readonly' name='choice"+index+"'><span class='checkmark'>"+alternatives[i]+"</span></label>";
        }
        if(!isJustOneQuestion){
            $('#answer-list').append("<li><label>Välj en av följande: </label>"+choices+"</li>");
        }else{
            $('#main').html("<label>Välj en av följande: </label>"+choices);
        }
    }

    function pairingAnswer(pair1, pair2){
        var html = "<div id='selectables'>";
        if(pair1.length >= pair2.length){
            for(var i = 0; i < pair1.length; i++){
                html += "<div class='selectable' id='drag"+i+"'>"+pair1[i]+"</div>";
            }
            html += "</div>";
            html += "<table id='pairing'>";
            for(var i = 0; i < pair2.length; i++){
                html += "<tr><td id='drop"+i+"'></td><td>"+pair2[i]+"</td></tr>";
            }
            html += "</table>";
        }else{
            for(var i = 0; i < pair2.length; i++){
                html += "<div class='selectable' id='drag"+i+"'>"+pair2[i]+"</div>";
            }
            html += "</div>";
            html += "<table id='pairing'>";
            for(var i = 0; i < pair1.length; i++){
                html += "<tr><td>"+pair1[i]+"</td><td id='drop"+i+"'></td></tr>";
            }
            html += "</table>";
        }
        
        $('#main').html(html);
        
    }
    function hintsAnswer(numberOfHints){
        $('#main').html("<ol type='a' id='answer-list'></ol>");
        for(var i = 0; i < numberOfHints; i++){
            $("#answer-list").append("<li><label>Ledtråd "+(i+1)+": <input type='text' readonly='readonly' id='hint"+i+"'></input></label></li>")
        }
    }
    function trueFalseAnswer(){
        $('#main').html("<table id='truefalse'><tr><td id='true'>Sant</td><td id='false'>Falskt</td></tr></table>");
    }


});

function trueClick(){
    $("#false").removeClass("marked");
    $("#true").addClass("marked");
}

function falseClick(){
    $("#true").removeClass("marked");
    $("#false").addClass("marked");
}
