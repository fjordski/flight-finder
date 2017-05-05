(function () {
	'use strict';
	var express = require('express');
	var app = express();
	var request = require('request');
	var readline = require('readline');
	const nodemailer = require('nodemailer');

	let transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	        user: 'thecuatro@gmail.com',
	        pass: '<password>'
	    }
	});

	let mailOptions = {
	    from: '"Fred Foo 👻" <thecuatro@gmail.com>', // sender address
	    to: 'fordheacock@gmail.com', // list of receivers
	    subject: 'Lets go somewhere, fam', // Subject line
	    text: 'Hello world ?', // plain text body
	    html: '<b>Hello world ?</b>' // html body
	};



	// START THE SERVER
	console.log('STARTING THE SERVER');
	console.log('-------------------------');
	app.listen(3000);
	console.log('Started the server');
	
	process.on('uncaughtException', function (error) {
	  console.log(error.stack);
	  console.log(error);
	});

	const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});

	rl.question('Where do you want to go? ', (answer) => {
	  // TODO: Log the answer in a database
	  request({
	    url: `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=2eGy6gQ8nhAbhNlh1vWd40j6hmi2rmrE&origin=BOS&destination=${answer}&departure_date=2017-08-25`,
	    json: true
		}, function (error, response, body) {

		    if (!error && response.statusCode === 200) {
		    	for(var i = 0; i < body.results.length; i++){
		    		if(body.results[i].fare.total_price < 400){
		    			console.log(body.results[i].fare.total_price);
		    		};
		    	}  	
		    }
		});

	  rl.close();
	});

	transporter.sendMail(mailOptions, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }
	    console.log('Message %s sent: %s', info.messageId, info.response);
	});
})();
