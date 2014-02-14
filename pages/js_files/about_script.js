/*
 * @author Rukmal Weerawarana
 *
 * Scripts for about.html, including all jQuery functions.
 */

 'use strict'

 $(document).ready(function() {
 	$('.aboutbox').mouseenter(function() {
 		$(this).animate({'zoom':'1.03'}, 150);
 	})

 	$('.aboutbox').mouseleave(function() {
 		$(this).animate({'zoom':'1'}, 150);
 	})

 	$('#uw, #bsc, #ib, #footer').hide().each(function(i) {
 		$(this).delay(225 * i).fadeIn(500, 'swing');
 	})
 })