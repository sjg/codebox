#!/usr/bin/env node

var serverPort = 8008;

var argv = require('optimist')
  .usage('Usage: --key=[boxKey]')
  .demand(['key'])
  .argv
;

var key = argv.key.trim()

var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8008);

var currentBoxState = 0;
var pastGuesses = {};
pastGuesses.results = [];

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.set('log level', 1); // reduce logging
io.sockets.on('connection', function (socket) {
  
  socket.on('open', function (data) {
    console.log("opening the box");
    io.sockets.emit('boxopen');
    currentBoxState = 1;
  });

  socket.on('close', function (data) {
    console.log("closing the box");
    io.sockets.emit('boxclose');
    currentBoxState = 0; 
  });

  socket.on('clear', function(data){
    pastGuesses = {};
    pastGuesses.results = [];
    io.sockets.emit('guessMade');
  });

  socket.on('guess', function (data) {
	try{
		var obj = JSON.parse(data);		
		if(obj.guess === key){
      console.log("opening the box");
			io.sockets.emit('boxopen');
			guessObject = {'team': obj.team, 'guess': obj.guess, 'timeguess':  new Date().getTime(), 'result': 'correct'};
	                pastGuesses.results.push(guessObject);
        	}else{
                	console.log("nope");
			guessObject = {'team': obj.team, 'guess': obj.guess, 'timeguess':  new Date().getTime(), 'result': 'wrong'};
                	pastGuesses.results.push(guessObject);
        	}

		io.sockets.emit('guessMade');

	}catch(ex){
		console.log("error");
	}	
  });

  socket.on('getGuesses', function(data) {
	socket.emit('getGuessObject', JSON.stringify(pastGuesses) );
  });

  socket.on('boxState', function(data) {
        socket.emit('currentBoxState', JSON.stringify(currentBoxState) );
  });

});

