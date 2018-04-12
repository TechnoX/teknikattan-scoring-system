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
            $('#answer-list').append("<li><label>Svar: </label><input type='number' onchange='send(this,"+index+");' id='answer"+index+"'></input></li>");
        }else{
            $('#main').html("<label>Svar: </label><input type='number' onchange='send(this,"+index+");' id='answer"+index+"'></input>");
        }
    }
    function textAnswer(index, isJustOneQuestion){
        if(!isJustOneQuestion){
            $('#answer-list').append("<li><label>Svar: <input type='text' onchange='send(this,"+index+");' id='answer"+index+"'></input></label></li>");
        }else{
            $('#main').html("<label>Svar: <input type='text' onchange='send(this,"+index+");' id='answer"+index+"'></input></label>");
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
        var html = "<div id='selectables'>";
        if(pair1.length >= pair2.length){
            for(var i = 0; i < pair1.length; i++){
                html += "<div class='selectable' draggable='true' ondragstart='drag(event)' id='drag"+i+"'>"+pair1[i]+"</div>";
            }
            html += "</div>";
            html += "<table id='pairing'>";
            for(var i = 0; i < pair2.length; i++){
                html += "<tr><td id='drop"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'></td><td>"+pair2[i]+"</td></tr>";
            }
            html += "</table>";
        }else{
            for(var i = 0; i < pair2.length; i++){
                html += "<div class='selectable' draggable='true' ondragstart='drag(event)' id='drag"+i+"'>"+pair2[i]+"</div>";
            }
            html += "</div>";
            html += "<table id='pairing'>";
            for(var i = 0; i < pair1.length; i++){
                html += "<tr><td>"+pair1[i]+"</td><td id='drop"+i+"' ondrop='drop(event)' ondragover='allowDrop(event)'></td></tr>";
            }
            html += "</table>";
        }
        
        $('#main').html(html);
        
    }
    function hintsAnswer(numberOfHints){
        $('#main').html("<ol type='a' id='answer-list'></ol>");
        for(var i = 0; i < numberOfHints; i++){
            $("#answer-list").append("<li><label>Ledtråd "+(i+1)+": <input type='text' onchange='send(this,"+i+");' id='hint"+i+"'></input></label></li>")
        }
    }
    function trueFalseAnswer(){
        $('#main').html("<table id='truefalse'><tr><td id='true' onclick='trueClick();'>Sant</td><td id='false' onclick='falseClick()'>Falskt</td></tr></table>");
    }


});


function send(element, index){
    $.post("text", {'value': element.value, 'index': index}, function( data ) {
        // Do nothing
    }).fail(function() {
        alert("Error!!");
        console.error("Error: ", element.value, element.id, index);
    });
}


function trueClick(){
    $.post("truefalse", {'value': 'true'}, function( data ) {
        $("#false").removeClass("marked");
        $("#true").addClass("marked");
    }).fail(function() {
        alert("Error!!");
        console.error("Error: true click");
    });
}

function falseClick(){
    $.post("truefalse", {'value': 'false'}, function( data ) {
        $("#true").removeClass("marked");
        $("#false").addClass("marked");
    }).fail(function() {
        alert("Error!!");
        console.error("Error: false click");
    });
}

function allowDrop(ev) {
    console.log("allowdrop");
    ev.preventDefault();/*
    if (ev.target.getAttribute("draggable") == "true")
        ev.dataTransfer.dropEffect = "none"; // dropping is not allowed
    else
        ev.dataTransfer.dropEffect = "all"; // drop it like it's hot
    */
}

function drag(ev) {
    console.log("drag");
    ev.dataTransfer.setData("text", ev.target.id);
    console.log(ev.dataTransfer.getData("text"));
}

function drop(ev) {
    console.log("drop");
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if(!sendDrop(data, ev.target.id)){
        return false;
    }
    if (ev.target.getAttribute("draggable") == "true"){
        console.log("Drop on old label")
        console.log("add new element to cell")
        ev.target.parentNode.insertBefore(document.getElementById(data), ev.target);
        console.log("move old cell up to pickable list")
        document.getElementById('selectables').appendChild(ev.target);
    }else{
        console.log("drop in table cell")
        if(ev.target.firstChild){
            console.log("table cell already contains data, removes the old data")
            document.getElementById('selectables').appendChild(ev.target.firstChild);
        }
        console.log("add new element to cell")
        ev.target.appendChild(document.getElementById(data));
    }
}

function sendDrop(draggedID, droppedID){
    $.post("drop", {'dragged': draggedID, 'dropped': droppedID}, function( data ) {
        return true;
    }, "json").fail(function() {
        alert("Error!!");
        console.error("Error: ", draggedID, droppedID);
        return false;
    });
}
