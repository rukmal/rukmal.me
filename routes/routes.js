/*
 * @author Rukmal Weerawarana
 *
 * Main routes file for http://rukmal.me
 */

 'use strict'

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('home');
	});

	app.get('/about', function(req, res) {
		res.render('about');
	});

	app.get('/projects', function(req, res) {
		res.render('projects');
	});

	app.get('/contact', function(req, res) {
		res.render('contact');
	});

	app.get('/blog', function(req, res) {
		res.render('blog');
	});
};