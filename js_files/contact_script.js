/*
 * @author Rukmal Weerawarana
 *
 * Scripts for contact.html, including all jQuery functions.
 */

 'use strict'

 $(document).ready(function() {
 	$('.socialicon').hide().fadeIn(700, 'swing');

 	$('.socialicon').mouseenter(function() {
 		$(this).animate({'zoom':'1.05'}, 200);
 	})

 	$('.socialicon').mouseleave(function() {
 		$(this).animate({'zoom':'1'}, 200);
 	})
 })