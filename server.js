/*
 * @author Rukmal Weerawarana
 * @email rukmal.weerawarana@gmail.com
 *
 * This script starts and manages bad requests for the Node.js server used
 * to host the site on a Raspberry Pi.
 */

'use strict'

var path = require('path');
var express = require('express');
var app = express();
var port = 1000;

//Log all requests
app.use(express.logger('dev'));

// Pass all static requests to express.static
app.use(express.static(path.join(__dirname, 'pages')));

// Route for everything else
app.get('*', function(req, res) {
	res.send("Sorry, the page you were looking for does not exist.");
});

//Starting the server up
app.listen(port);
console.log('listening on port ' + port);