/*
 * @author Rukmal Weerawarana
 * @email rukmal.weerawarana@gmail.com
 *
 * This script starts and manages bad requests for the Node.js server used
 * to host the site on an Amazon EC2 server.
 */

'use strict'

var path = require('path');
var express = require('express');
var app = express();
var port = 3000;

//Log all requests
app.use(express.logger('dev'));

//Pass all static requests to express.static
app.use(express.static(path.join(__dirname, 'pages')));

//404 for everything else
app.get('*', function(req, res) {
	res.sendfile(__dirname + '/pages/404.html');
});

//Starting the server up
app.listen(port);
console.log('listening on port ' + port);