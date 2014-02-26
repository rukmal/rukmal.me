/*
 * @author Rukmal Weerawarana
 *
 * Scripts for about.html, including all jQuery functions.
 */

 'use strict'

 $(document).ready(function() {
 	$('.aboutbox').mouseenter(function() {
 		$(this).animate({'zoom':'1.02'}, 120);
 	})

 	$('.aboutbox').mouseleave(function() {
 		$(this).animate({'zoom':'1'}, 120);
 	})

 	$('#uw, #bsc, #ib, #computers, #conclusion, #footer').hide().each(function(i) {
 		$(this).delay(225 * i).fadeIn(500, 'swing');
 	})
 })