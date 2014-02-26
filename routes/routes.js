/*
 * @author Rukmal Weerawarana
 *
 * Main routes file for http://rukmal.me
 */

'use strict'

var siteName = 'Rukmal\'s World - '

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('home', {
			title: siteName + 'Home'
		});
	});

	app.get('/about', function(req, res) {
		res.render('about', {
			title: siteName + 'About'
		});
	});

	app.get('/projects', function(req, res) {
		res.render('projects', {
			title: siteName + 'Projects'
		});
	});

	app.get('/contact', function(req, res) {
		res.render('contact', {
			title : siteName + 'Contact'
		});
	});

	app.get('/blog', function(req, res) {
		res.render('blog', {
			title: siteName + 'Blog'
		});
	});
};