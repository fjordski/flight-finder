	var express = require('express');
    var app = express();

    module.exports = function(){
	    console.log('STARTING THE SERVER');
	    console.log('-------------------------');
	    app.listen(3000);
	    console.log('Started the server');

	    process.on('uncaughtException', function(error) {
	        console.log(error.stack);
	        console.log(error);
	    });
    }