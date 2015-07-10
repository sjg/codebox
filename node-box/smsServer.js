var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io-client');

socket = io.connect('http://www.stevenjamesgray.com:8888');

socket.on('connect', function (sockets) { 	
	console.log("Box Controller connected to server.");

	var app = express();
  
	app.use(logger('dev'));
	app.use(bodyParser.json());
	
	app.use(bodyParser.urlencoded({
  		extended: true
	}));
	
	app.use(cookieParser());
	app.use(express.static('public'));
 
	var allowCrossDomain = function(req, res, next) {
  		res.header('Access-Control-Allow-Origin', '*');
  		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  		res.header('Access-Control-Allow-Headers', 'Content-Type');
 
  		next();
	};
 
	app.use(allowCrossDomain);

	app.get('/', function(req, res) {
  		res.send('CODEBOX SMS SERVER');
	});

	app.get('/voice', function(req, res){
  		res.send('<?xml version="1.0" encoding="UTF-8" ?><Response><Say voice="woman" language="en">Hello there! Congratulations for discovering our little secret. The code for the box is d,,u,,j,,k,,e,,*,,*,,e,,i,,e,,f,,y,,u,, . ,,Goodbye</Say></Response>');
	});

	app.post('/sms', function(req, res) {
    		//res.send("Got Message");
    		var id = mysql_real_escape_string(req.body.SmsSid);
    		var sms = mysql_real_escape_string(req.body.Body);
    		var from = mysql_real_escape_string(req.body.From);

		var responseHangup = '<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>';

    		if(sms.toLowerCase() == "open"){
			console.log("Open the box ... for " + from );
        		socket.emit('open');
			res.send(responseHangup);
    		}else if(sms.toLowerCase() == "close"){
			console.log("Close the box ... for " + from);
			socket.emit('close');
			res.send(responseHangup);
    		}else{
			res.send('<?xml version="1.0" encoding="UTF-8" ?><Response><Sms>Hello there! Congratulations for discovering our little secret. The code for the box is dujke**eiefyu. Goodbye</Sms></Response>');
    		}
	});
 
	app.set('port', process.env.PORT || 3001);
 
	var server = app.listen(app.get('port'), function() {
 		console.log('Express server listening on port ' + server.address().port);
	});
 
	module.exports = app;

});
