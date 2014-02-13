'use strict'

var path = require('path');
var express = require('express');
var app = express();

//Log all requests
app.use(express.logger('dev'));

// Pass all static requests to express.static
app.use(express.static(path.join(__dirname, 'pages')));

// Route for everything else
app.get('*', function(req, res) {
	res.send("Sorry, the page you were looking for does not exist.");
});

//Starting the server up
app.listen(3000);
console.log('listening on port 3000');