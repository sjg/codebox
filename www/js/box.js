var socket;

$(document).ready(function() {
	socket = io.connect('http://128.40.111.205:8008');

	socket.on('connect',function() {
			$(".circle").addClass("connected");
	});

	socket.on('disconnect',function() {
			 $(".circle").removeClass("connected");
	});	

	socket.on('currentBoxState',function(data) {
			 console.log("Box Status: " + data);
	});	

	socket.on('boxopen',function(data) {
			 console.log("I just saw boxopen");
	});	

	socket.on('boxclose',function(data) {
			 console.log("I just saw boxclose");
	});	

	socket.on('getGuessObject', function(data){
		var obj = JSON.parse(data);
		console.log(obj)
		$('#guessBox').html("");
		$.each(obj.results, function(index, value){
			if(value.result == 'correct'){
				$('#guessBox').prepend(rightGuess(value.team, value.guess, value.timeguess));
			}else{
				$('#guessBox').prepend(wrongGuess(value.team, value.guess, value.timeguess));
			}
		});

		$("#number").html(obj.results.length);
		$("#password").focus();
	});

	socket.emit('getGuesses');

	socket.on('guessMade', function(data){
		socket.emit('getGuesses');
	});

});

var wrongGuess = function(teamNum, password, timeG){
 	return "<div class='alert alert-error'>"+ new XDate(timeG).toString('HH:mm:ss') +" - Team '<b>" + teamNum + "</b>' guessed '<b>"+password+"</b>' which was wrong!</div>";
}

var rightGuess = function(teamNum, password, timeG){
 	var obfuscated = ""
 	for(var i=0; i<password.length; i++){
 		obfuscated += '*';
 	}
 	return "<div class='alert alert-success'>" + new XDate(timeG).toString('HH:mm:ss') + " - Team '<b>" + teamNum + "</b>' guessed '<b>" + obfuscated + "</b>' which was right! The box has been opened!</div>";
}

var submitGuess = function(guess, team){
	socket.emit('guess', JSON.stringify({'guess': guess, 'team': team}));
}

function handleKeyPress(e,form){
	var key=e.keyCode || e.which;
	if (key==13){
		$('#submitButton').click();
		$("#password").blur();
	}
}

function submit(){
	var password = $("#password").val();
	var team = $("#team").val();

	if(password != ""){
		$("#password").val("");
		$("#password").focus();
		submitGuess(password, $.cookie('team'));
		return true; 
	}

	if(team != ""){
		$.cookie('team', team, { expires: 1 });
		location.reload();
		return true; 
	}

	return false;
}

//Set the cookie
if(($.cookie("team") != undefined)){
	$("#password").show();
	$("#team").hide();
}else{
	$(".lead").html("Enter your team name or number");
	$("#guess").hide();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Includes functions from the beta version of this file box2.js -- not used anymore!
