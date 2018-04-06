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
                pairingAnswer(msg.pairs);
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
            $('#answer-list').append("<li><label>Svar: </label><input type='number' onchange='send' id='answer"+index+"'></input></li>");
        }else{
            $('#main').html("<label>Svar: </label><input type='number' onchange='send' id='answer"+index+"'></input>");
        }
    }
    function textAnswer(index, isJustOneQuestion){
        if(!isJustOneQuestion){
            $('#answer-list').append("<li><label>Svar: <input type='text' onchange='send' id='answer"+index+"'></input></label></li>");
        }else{
            $('#main').html("<label>Svar: <input type='text' onchange='send' id='answer"+index+"'></input></label>");
        }
    }
    function selectAnswer(alternatives, index, isJustOneQuestion){
        var table = "<table><tr>";
        console.log(alternatives.length)
        console.log(alternatives)
        for(var i = 0; i < alternatives.length; i++){
            table += "<td>"+alternatives[i]+"</td>";
        }
        table += "</tr></table>";
        if(!isJustOneQuestion){
            $('#answer-list').append("<li><label>Välj en av följande: </label>"+table+"</li>");
        }else{
            $('#main').html("<label>Välj en av följande: </label>"+table);
        }
    }

    function pairingAnswer(pairs){
        console.warn("Not implemented pairing yet");
    }
    function hintsAnswer(numberOfHints){
        $('#main').html("<ol type='a' id='answer-list'></ol>");
        for(var i = 0; i < 0; i++){
            $("#answer-list").append("<li><label>Ledtråd "+(i+1)+": <input type='text' onchange='send' id='hint"+i+"'></input></label></li>")
        }
    }
    function trueFalseAnswer(){
        $('#main').html("<table id='truefalse'><tr><td id='true'>Sant</td><td id='false'>Falskt</td></tr></table>");
    }    
});
