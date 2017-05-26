const request = require('request');
const dateFormat = require('dateformat');
const readline = require('readline');
const nodemailer = require('nodemailer');
const server = require('./server');

server();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

let mailOptions = {
    from: '"Mr. Airplane Bot 🤖" <thecuatro@gmail.com>', // sender address
    to: '', // list of receivers
    subject: 'Lets go somewhere, fam', // Subject line
    text: '', // plain text body
    html: '' // html body
};

rl.question('Please enter an airport code (ex. BNA) : ', (answer1) => {
    rl.question('Please enter a departure date (YYYY-MM-DD) : ', (answer2) => {
        var result = [answer1, answer2];
        custAnswers(result);
        rl.close();
    });
});

let flag = false;

function custAnswers(answers) {
    console.log(`calculating flights to ${answers[0]}...`);
    var theURL = `https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=<APIKEY>&origin=BNA&destination=${answers[0]}&departure_date=${answers[1]}`;
    request({
        url: theURL,
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
            flag = true;
            console.log(mailOptions.html);

            if (flag) {
                rl.question('Would you like the buy link e-mailed to you? (ex. Y or N) ', (answer3) => {
                    if (answer3 == "y") {
                        console.log('ok');
                        //***UN-COMMENT IF YOU WANT RESULTS E-MAILED TO YOU***
                        // transporter.sendMail(mailOptions, (error, info) => {
                        //     if (error) {
                        //         return console.log(error);
                        //     }
                        //     console.log('WE JUST HOOKED YOU UPPPPPP!! 🤖 %s sent: %s', info.messageId, info.response);
                        // });
                    } else {
                        console.log('das kewl, das kewl...');
                    }
                    rl.close();
                });
            }


        } else {
            flag = false;
            console.log('looks like something broke, brother.');
        }
    });
}
