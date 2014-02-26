/*
 * @author Rukmal Weerawarana
 * @email rukmal.weerawarana@gmail.com
 *
 * This script starts and manages bad requests for the Node.js server used
 * to host the site on an Amazon EC2 server.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname, 'public/images/page_icon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Linking the routes file to the app.
require('./routes/routes')(app);

// Redirecting 404 errors
app.use(function(req, res) {
 	res.status(404);
    res.render('404');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
