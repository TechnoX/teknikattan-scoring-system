app.directive('multipleChoices', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            // How view values will be saved in the model
            ngModel.$parsers.push(function(value) {
                var text = "";
                var arr = document.getElementsByName(attrs.name);
                for (var i = 0; i < arr.length; i++) {
                    if(arr[i].checked)
                        text += ";" + arr[i].value;
                }
                text = text.substring(1);
                return text;
            });
            // How model values will appear in the view
            ngModel.$formatters.push(function(value) {
                // TODO: Attrs.value is always undefined when page loads since value has not have had time to update before this is ran
                //console.log("formatter value: '" + value + "'");
                //console.log("attrs value: '" + attrs.value + "'");
                if(value === undefined || value === null)
                    return false;
                //console.log(value.split(";"))
                //console.log(value.split(";").indexOf(attrs.value));
                return value.split(";").indexOf(attrs.value) != -1;
            });
        }
    };
});


app.directive('stringToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(value) {
                return '' + value;
            });
            ngModel.$formatters.push(function(value) {
                return parseFloat(value);
            });
        }
    };
});



app.directive('setFocus', function($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            var model = $parse(attrs.setFocus);
            scope.$watch(model, function(value) {
                if(value === true) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
        }
    };
});



app.controller('answerCtrl', ['$scope', '$http', '$routeParams', '$timeout', function($scope, $http, $routeParams, $timeout){
    var socket = io();
    var competition_id = $routeParams.id;
    var team_id = $routeParams.team;
    $scope.timesUp = false;

    const wrapper = document.getElementById("pairing-wrapper");
    const svgScene = wrapper.querySelector("svg");
    const content = wrapper.querySelector(".content");

    const sources = [];
    let currentLine = null;
    let drag = false;

    wrapper.addEventListener("mousedown", drawStart);
    wrapper.addEventListener("mousemove", drawMove);
    wrapper.addEventListener("mouseup", drawEnd);
    
    wrapper.addEventListener("touchstart", drawStart);
    wrapper.addEventListener("touchmove", drawMove);
    wrapper.addEventListener("touchend", drawEnd);



    
    $http.get('/api/competition/'+competition_id+'/currentView').then(function(resp) {
        $scope.view = resp.data;
        console.log("Current view", resp.data);
        if($scope.view.answer.type == "pairing"){
            $timeout(function() {
                loadPairing($scope.view.answer.pairs);
            });
        }else if($scope.view.answer.type == "ordering"){
            $timeout(function() {
                loadClothes();
            });
	}
    });
    $http.get('/api/competition/'+competition_id+'/timesup').then(function(resp) {
        $scope.timesUp = resp.data;
    });

    
    socket.on('view_changed', function(msg){
        // Not affecting this page
        if(msg !== competition_id){
            return;
        }
        $http.get('/api/competition/'+competition_id+'/currentView').then(function(resp) {
            $scope.view = resp.data;
            console.log("Current view", resp.data);
            if($scope.view.state == 'beforeanswer' || $scope.view.state == 'answer'){
                $scope.timesUp = true;
            }else{
                $scope.timesUp = false;
            }
            if($scope.view.answer && $scope.view.answer.type == "pairing"){
                $timeout(function() {
                    loadPairing($scope.view.answer.pairs);
                });
            }   
        });
    });

    socket.on('timesUp', function(msg){
        // Not affecting this page
        if(msg.competition != competition_id)
            return;
        console.log("Times up!");
        $scope.$applyAsync(function () {
            $scope.timesUp = true;
        });
    });
    
    socket.on('time', function(msg){
        // Not affecting this page
        if(msg.competition !== competition_id)
            return;
        $scope.$applyAsync(function () {
            $scope.view.time = msg.time;
        });
    });

    // Get the team matching the ID given in the url bar
    $http.get('/api/team/'+team_id).then(function(resp) {
        if(resp.data){
            $scope.team = resp.data;
            console.log("Set team to ", $scope.team);
        }
    });

        
    $scope.$watch('team.answers', function(newValue, oldValue, scope) {
        // If the new value is not updated, just re-assigned, do not save it
        if(!$scope.view || newValue === undefined || newValue.length == 0)
            return;
        console.log("Save: ", newValue);
        $http.post("/api/competition/"+competition_id+"/answer/"+team_id, {'team': team_id, 'question': $scope.view.number, 'answers': newValue}).then(function(res) {
            // Do nothing
        }, function(res){
            alert("Något gick fel när svaret skulle sparas!");
            console.log(res);
        });
    }, true);



    function loadPairing(pairs) {
	// Allow multiple lines from this side
	if(pairs[0].multiple){
	    document.getElementById("left").classList.add("multiple-allowed");
	}else{
	    document.getElementById("left").classList.remove("multiple-allowed");
	}
	if(pairs[1].multiple){
	    document.getElementById("right").classList.add("multiple-allowed");
	}else{
	    document.getElementById("right").classList.remove("multiple-allowed");
	}	
	sources.length = 0;
	currentLine = null;
	drag = false;
	while (svgScene.lastChild) {
	    svgScene.removeChild(svgScene.lastChild);
	}
	
	// Answers
        for(var i = 0; i < $scope.team.answers[$scope.view.number].length; i++){
            var pair = $scope.team.answers[$scope.view.number][i].split("&rarr;");
	    let startEl = document.getElementById(pair[0]);
	    let endEl = document.getElementById(pair[1]);
	    let startRect = startEl.getBoundingClientRect();
	    let endRect = endEl.getBoundingClientRect();
	    let lineEl = document.createElementNS('http://www.w3.org/2000/svg','line');
	    lineEl.setAttribute("x1", startRect.left + (startRect.right-startRect.left)/2 - wrapper.offsetLeft);
	    lineEl.setAttribute("y1", startRect.top + (startRect.bottom-startRect.top)/2 - wrapper.offsetTop);
	    lineEl.setAttribute("x2", endRect.left + (endRect.right-endRect.left)/2 - wrapper.offsetLeft);
	    lineEl.setAttribute("y2", endRect.top + (endRect.bottom-endRect.top)/2 - wrapper.offsetTop);
	    lineEl.setAttribute("stroke", "blue");
	    lineEl.setAttribute("stroke-width", "10");
	    lineEl.classList.add("fixed-line");
	    lineEl.addEventListener("click", deleteLine);
	    
	    svgScene.appendChild(lineEl);
	    sources.push({line: lineEl, start: startEl, end: endEl});
        }
    }
    function  drawStart(e) {
	if(!e.target.classList.contains("hook")) return;
	if($scope.timesUp) return;
	// If not multiple allowed
	if(!e.target.parentElement.parentElement.classList.contains("multiple-allowed")){
	    for(var i = 0; i < sources.length; i++){
		// If there already exist an endpoint connected to this hook, we return
		if (sources[i].start == e.target ||
		    sources[i].end   == e.target) {
		    return;
		}
	    }
	}
	
	let eventX = e.type == "mousedown" ? e.clientX - wrapper.offsetLeft : e.targetTouches[0].clientX - wrapper.offsetLeft;
	let eventY = e.type == "mousedown" ? e.clientY - wrapper.offsetTop + window.scrollY : e.targetTouches[0].clientY - wrapper.offsetTop + window.scrollY;
	
	let lineEl = document.createElementNS('http://www.w3.org/2000/svg','line');
	currentLine = lineEl;
	currentLine.setAttribute("x1", eventX);
	currentLine.setAttribute("y1", eventY);
	currentLine.setAttribute("x2", eventX);
	currentLine.setAttribute("y2", eventY);
	currentLine.setAttribute("stroke", "blue");
	currentLine.setAttribute("stroke-width", "10");
	currentLine.addEventListener("click", deleteLine);
	
	svgScene.appendChild(currentLine);
	sources.push({ line: lineEl, start: e.target, end: null });
	
	drag = true;
    }

    function drawMove(e){
	if (!drag || currentLine == null) return;
	let eventX = e.type == "mousemove" ? e.clientX - wrapper.offsetLeft : e.targetTouches[0].clientX - wrapper.offsetLeft;
	let eventY = e.type == "mousemove" ? e.clientY - wrapper.offsetTop + window.scrollY : e.targetTouches[0].clientY - wrapper.offsetTop + window.scrollY;
	currentLine.setAttribute("x2", eventX);
	currentLine.setAttribute("y2", eventY);
    }

    function drawEnd(e){
	if (!drag || currentLine == null) return;
	if($scope.timesUp){
	    currentLine.remove();
	    sources.splice(sources.length - 1, 1);
	    drag = false;
	}
	let targetHook = e.type == "mouseup" ? e.target : document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

	let alreadyExists = false;
	for(var i = 0; i < sources.length; i++){
	    // If this very same line with start and end already exists
	    if ((sources[i].start == sources[sources.length - 1].start && sources[i].end   == targetHook) ||
		(sources[i].end   == sources[sources.length - 1].start && sources[i].start == targetHook)) {
		alreadyExists = true;
	    }
	    // If not multiple allowed
	    if(!targetHook.parentElement.parentElement.classList.contains("multiple-allowed")){
		// If there already exist an endpoint connected to this hook, we return
		if (sources[i].start == targetHook ||
		    sources[i].end   == targetHook) {
		    alreadyExists = true;
		}
	    }
	}
	
	if (!targetHook.classList.contains("hook") || // Kan bara droppa på en cirkel
	    targetHook == sources[sources.length - 1].start || // Kan inte droppa på samma som den startade ifrån
	    (targetHook.parentElement.parentElement.id === "left"  && sources[sources.length - 1].start.parentElement.parentElement.id === "left" ) || // Kan inte droppa på samma sida som den starta
	    (targetHook.parentElement.parentElement.id === "right" && sources[sources.length - 1].start.parentElement.parentElement.id === "right") ||
	    alreadyExists) { 
	    currentLine.remove();
	    sources.splice(sources.length - 1, 1);
	} else {
	    sources[sources.length - 1].end = targetHook;
	    sources[sources.length - 1].line.classList.add("fixed-line");
	    updateBackend()
	}
	drag = false
    }
    function deleteLine(e){
	if($scope.timesUp) return;
	sources.splice(sources.findIndex(item => item.line === e.target), 1)
	e.target.remove();
	updateBackend();
    }
    

    function updateBackend() {
        $scope.$applyAsync(function () {
            var answer = [];
            for(var i = 0; i < sources.length; i++){
		if(sources[i].start.previousSibling){
                    answer.push(sources[i].start.id + "&rarr;" + sources[i].end.id);
		}else{
		    answer.push(sources[i].end.id + "&rarr;" + sources[i].start.id);
		}
            }
            $scope.team.answers[$scope.view.number] = answer;
        });
    }
    
    $scope.dragMouseDown = function($event){
	const elmnt = $event.currentTarget || $event.srcElement;
	e = $event || window.event;
	e.preventDefault();
	if($scope.timesUp) return;
	
	// get the mouse cursor position at startup:
	var start_left = e.clientX - elmnt.offsetLeft;
	var start_top = e.clientY - elmnt.offsetTop;
	
	document.onmouseup = closeDragElement;
	// call a function whenever the cursor moves:
	document.onmousemove = elementDrag;

	function elementDrag(e) {
	    e = e || window.event;
	    e.preventDefault();
	    if($scope.timesUp) {
		saveClothes();
		return;
	    }
	    
	    
	    const new_left = e.clientX - start_left;
	    const new_top = e.clientY - start_top;
	    // set the element's new position:
	    elmnt.style.top = new_top + "px";
	    elmnt.style.left = new_left + "px";
	    if (new_top > 300){
		elmnt.classList.remove("hunged");
		const parts = elmnt.innerHTML.split(" ");
		if (parts.length > 1){
		    elmnt.innerHTML = parts[1];
		}
	    }else{
		elmnt.classList.add("hunged");
	    }
	    
	    hunged = []
	    for (el of document.getElementsByClassName("hunged")){
		const rect = el.getBoundingClientRect();
		const center = rect.left;// + rect.width/2;
		hunged.push([center, el])
	    }
	    hunged.sort((a,b) => a[0] - b[0])
	    hunged.forEach(function (el, index) {
		var parts = el[1].innerHTML.split(" ");
		if (parts.length > 1){
		    el[1].innerHTML = (index+1) + " " + parts[1];
		}else{
		    el[1].innerHTML = (index+1) + " " + parts[0];
		}
	    });

	    
	}

	function closeDragElement() {
	    // stop moving when mouse button is released:
	    document.onmouseup = null;
	    document.onmousemove = null;
	    saveClothes();
	}
    }
    function saveClothes(){
	$scope.$applyAsync(function () {
	    var answer = [];
	    for (el of document.getElementsByClassName("clothespin")){
		const parts = el.innerHTML.split(" ");
		if (parts.length > 1){
		    answer.push(el.innerHTML+"⇔"+el.offsetLeft+"x"+el.offsetTop);
		}
            }
            $scope.team.answers[$scope.view.number] = answer;
        });
    }
    
    function loadClothes() {
	for (el of document.getElementsByClassName("clothespin")){
	    var found = false;
            for(var i = 0; i < $scope.team.answers[$scope.view.number].length; i++){
		var parts = $scope.team.answers[$scope.view.number][i].split("⇔");
		var alt = parts[0].split(" ");
		var coords = parts[1].split("x");
		if(alt[1] == el.innerHTML){
		    el.add
		    found = true;
		    break;
		}
            }

	    if(found){
		el.classList.add("hunged");
		el.innerHTML = parts[0];
		// update top and left position
		el.style.top = coords[1] +"px";
		el.style.left = coords[0] +"px";
	    }else{
		// get random numbers for each element
		randomTop = Math.random() * 30 + 55;
		randomLeft = Math.random() * 80 ;
		// update top and left position
		el.style.top = randomTop +"%";
		el.style.left = randomLeft +"%";
	    }
	}
    }

    
}]);
