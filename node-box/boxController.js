#!/usr/bin/env node

var argv = require('optimist')
  .usage('Usage: --port=[serialport]')
  .argv
;

var sPort = argv.port

if(sPort != undefined){
	sPort.trim();
}else{
	sPort = "/dev/tty.usbmodemfa141";
}

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort(sPort, {
  baudrate: 9600
}, false); // this is the openImmediately flag [default is true]

serialPort.open(function () {
  console.log('Serial port open');
  console.log('Connecting to the Box Server');
  
  var io = require('socket.io-client'),
  socket = io.connect('http://www.stevenjamesgray.com:8888');

  socket.on('connect', function () { 	
	console.log("Box Controller connected to server.");
	
	 socket.on('boxopen', function (data) {
                console.log("Opening the box");
                serialPort.write("o", function(err, results) {
                        if(results != 1){
			   console.log("Something went wrong");
			}
                });
        });

        socket.on('boxclose', function (data) {
                console.log("Closing the box");
                serialPort.write("c", function(err, results) {
			if(results != 1){
                           console.log("Something went wrong");
                        }
                });
                currentBoxState = 0;
        });

        socket.on('currentBoxState', function(data) {
                console.log(JSON.parse(data));
        });

  });


  //Debugging the Serial Output
  serialPort.on('data', function(data) {
    //console.log('SERIAL SAYS: data received: ' + data);
  });

});
