(function() {
    'use strict';
    var express = require('express');
    var app = express();
    var request = require('request');
    var readline = require('readline');
    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '<email>',
            pass: '<password>'
        }
    });

    let mailOptions = {
        from: '"Fred Foo 👻" <email>', // sender address
        to: '<email>', // list of receivers
        subject: 'Lets go somewhere, fam', // Subject line
        text: '', // plain text body
        html: '<ul>' // html body
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

    rl.question('Please enter an airport code on where you would like to fly (ex. BNA)', (answer) => {
    	console.log("Thank you. Calculating flights to " + answer + ".");
        request({
            url: `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=<apikey>&origin=BNA&destination=${answer}&departure_date=2017-08-25`,
            json: true
        }, function(error, response, body) {

            if (!error && response.statusCode === 200) {
                for (var i = 0; i < 10; i++) {
                    if (body.results[i].fare.total_price < 400) {	
                        mailOptions.html += '<li>'+ body.results[i].fare.total_price+ '</li>';
                    }
                    	mailOptions.html += '</ul>';
                }

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                });
            }
        });
        rl.close();
    });
})();
