/*
 * @author Rukmal Weerawarana
 *
 * Script containing javascript functions for the home page, including
 * all jQuery functions.
 */

'use strict'

$(document).ready(function() {
	setInterval(function() {
		$('#cursor').animate({
			opacity: 0
		}, 300, 'swing').animate({
			opacity: 1
		}, 650, 'swing');
	}, 1000);

	$('#introduction').css('padding-top', $('#menufiller').height());

	$('#intropicture, #introcommand, #introname').hide().each(function(i) {
		$(this).fadeIn(700, 'swing');
	})
})