(function() {
    'use strict';
    var express = require('express');
    var app = express();
    var request = require('request');
    var dateFormat = require('dateformat');
    var readline = require('readline');
    var nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    });

    let mailOptions = {
        from: '"Mr. Airplane Bot 🤖" <thecuatro@gmail.com>', // sender address
        to: 'fordheacock@gmail.com', // list of receivers
        subject: 'Lets go somewhere, fam', // Subject line
        text: '', // plain text body
        html: '' // html body
    };

    // START THE SERVER
    console.log('STARTING THE SERVER');
    console.log('-------------------------');
    app.listen(3000);
    console.log('Started the server');

    process.on('uncaughtException', function(error) {
        console.log(error.stack);
        console.log(error);
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });


    rl.question('Please enter an airport code (ex. BNA) : ', (answer1) => {
    rl.question('Please enter a departure date (YYYY-MM-DD) : ', (answer2) => {
	        var result = [answer1, answer2];
	        custAnswers(result);
	        rl.close();
	    });
	});

    function custAnswers(answers){
    	console.log(`calculating flights to ${answers[0]}`);
    	request({
            url: `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=<APIKEY>&origin=BNA&destination=${answers[0]}&departure_date=${answers[1]}`,
            json: true
        }, function(error, response, body) {

            if (!error && response.statusCode === 200) {

                for (var i = 0; i < 1; i++) {
                    if (body.results[i].fare.total_price < 400) {	
                    	var depart = `${body.results[i].itineraries[0].outbound.flights[0].departs_at}`;

                        mailOptions.html +=

                        `  	 
                        The cheapest flight to ${answers[0]} costs $${body.results[i].fare.total_price} and leaves at ${dateFormat(depart, "dddd, mmmm dS, yyyy, h:MM:ss TT")}. There are/is ${body.results[i].itineraries[0].outbound.flights[0].booking_info.seats_remaining} seats remaining.	
                        `;
                       
                    } else {
                    	console.log('that aint cheap, my man. look elsewhere for your vacay.')               	
                    }
                }
                console.log(mailOptions.html);

                //***UN-COMMENT IF YOU WANT RESULTS E-MAILED TO YOU***
                // transporter.sendMail(mailOptions, (error, info) => {
                //     if (error) {
                //         return console.log(error);
                //     }
                //     console.log('WE JUST HOOKED YOU UPPPPPP!! 🤖 %s sent: %s', info.messageId, info.response);
                // });

            } else {
            	console.log('looks like something broke, brother.');
            }
        });
    }     
})();
