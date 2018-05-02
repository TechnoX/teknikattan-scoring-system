$(function () {
    var socket = io();

    var state = 'begin';

    // Remove lock when new title image, and show image
    socket.on('image', function(msg){
        timesUp = false;
        $("#lock").hide();
        $('#title').html(msg.title);
        $('#main').html("<img src='"+msg.image+"' id='mainimage'/>");
    });
    // Remove lock when new true/false statement
    socket.on('truefalse', function(msg){
        timesUp = false;
        $("#lock").hide();
        $("#false").removeClass("marked");
        $("#true").removeClass("marked");
    });
    // Remove lock when end message comes
    socket.on('end', function(msg){
        timesUp = false;
        $("#lock").hide();
    });
    socket.on('question', function(msg){
        if(Array.isArray(msg.answer_type)){
            state = 'subquestions'
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
            state = msg.answer_type;
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
                practicalAnswer();
                break
            default:
                console.warn("Unknown answer type: " + msg.answer_type);
                break
            }
        }
    });
    socket.on('timesUp', function(msg){
        // Lås tidigare fält så man inte kan mata in mer
        timesUp = true;
        if(state == 'hints'){
            console.log("State: hints: ", msg.hintIndex);
            for(var i = 0; i < msg.hintIndex; i++){
                console.log("Lock hint " + i);
                $("#hint"+i).prop('disabled', true);
                $("#hint"+i).addClass('hintlock');
            }
            console.log("Set focus to hint "+ msg.hintIndex);
            $("#hint"+msg.hintIndex).focus()
        }else{
            $("input").prop('disabled', true);
            $("#lock").show(2000);
        }
    });
    socket.on('end', function(msg){
        $('#main').html("<h2>Tack för er medverkan!</h2>");
        $('#title').empty();
    });


    function numberAnswer(index, isJustOneQuestion){
        if(!isJustOneQuestion){
            $('#answer-list').append("<li><label>Svar: </label><input type='number' oninput='send(this,"+index+");' id='answer"+index+"'></input></li>");
        }else{
            $('#main').html("<label>Svar: </label><input type='number' oninput='send(this,"+index+");' id='answer"+index+"'></input>");
        }
    }
    function textAnswer(index, isJustOneQuestion){
        if(!isJustOneQuestion){
            $('#answer-list').append("<li><label>Svar: <input type='text' oninput='send(this,"+index+");' id='answer"+index+"'></input></label></li>");
        }else{
            $('#main').html("<label>Svar: <input type='text' oninput='send(this,"+index+");' id='answer"+index+"'></input></label>");
        }
    }
    function selectAnswer(alternatives, index, isJustOneQuestion){
        var choices = "";
        for(var i = 0; i < alternatives.length; i++){
            choices += "<label class='choice'><input type='radio' onchange='send(this,"+index+");' name='choice"+index+"' value='"+alternatives[i]+"'><span class='checkmark'>"+alternatives[i]+"</span></label>";
        }
        if(!isJustOneQuestion){
            $('#answer-list').append("<li><label>Välj en av följande: </label>"+choices+"</li>");
        }else{
            $('#main').html("<label>Välj en av följande: </label>"+choices);
        }
    }

    function pairingAnswer(pair1, pair2){
        var selectables = $("<div id='selectables'></div>");
        if(pair1.length >= pair2.length){
            for(var i = 0; i < pair1.length; i++){
                $("<div class='selectable' id='drag"+i+"'>"+pair1[i]+"</div>").appendTo(selectables).draggable();;
            }

            var table = $("<table id='pairing'></table>");
            for(var i = 0; i < pair2.length; i++){
                // TODO: Here am I working on drag and drop stuff! Replacing html +=  with jQuery equivalent
                $("<tr><td id='drop"+i+"'></td><td>"+pair2[i]+"</td></tr>";
            }
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
            $("#answer-list").append("<li><label>Ledtråd "+(i+1)+": <input type='text' oninput='send(this,"+i+");' id='hint"+i+"'></input></label></li>")
        }
    }
    function trueFalseAnswer(){
        $('#main').html("<table id='truefalse'><tr><td id='true' onclick='trueClick();'>Sant</td><td id='false' onclick='falseClick()'>Falskt</td></tr></table>");
    }
    function practicalAnswer(){
        $('#main').html("<p>Här får ni lägga undan paddan och jobba praktiskt.</p>");
    }
});


function send(element, index){
    console.log(element.value);
    $.post("text", {'value': element.value, 'index': index}, function( data ) {
        // Do nothing
    }).fail(function() {
        alert("Error!!");
        console.error("Error: ", element.value, element.id, index);
    });
}


function trueClick(){
    if(timesUp)
        return false;
    $.post("truefalse", {'value': 'true'}, function( data ) {
        $("#false").removeClass("marked");
        $("#true").addClass("marked");
    }).fail(function() {
        alert("Error!!");
        console.error("Error: true click");
    });
}

function falseClick(){
    if(timesUp)
        return false;
    $.post("truefalse", {'value': 'false'}, function( data ) {
        $("#true").removeClass("marked");
        $("#false").addClass("marked");
    }).fail(function() {
        alert("Error!!");
        console.error("Error: false click");
    });
}

function sendDrop(draggedID, droppedID){
    /*
      var draggedText = document.getElementById(draggedID).innerHTML;
      var droppedText = document.getElementById(droppedID).nextElementSibling.innerHTML || document.getElementById(droppedID).previousElementSibling.innerHTML;
    */
    
    $.post("drop", {'dragged': draggedID, 'dropped': droppedID}, function( data ) {
        // Do nothing
    }).fail(function() {
        alert("Error!!");
        console.error("Error: ", draggedID, droppedID);
    });
}
