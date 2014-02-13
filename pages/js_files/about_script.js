/*
 * @author Rukmal Weerawarana
 *
 * Scripts for about.html, including all jQuery functions.
 */

 'use strict'

 $(document).ready(function() {
 	$('.aboutbox').mouseenter(function() {
 		$(this).animate({'zoom':'1.03'}, 175);
 	})

 	$('.aboutbox').mouseleave(function() {
 		$(this).animate({'zoom':'1'}, 175);
 	})

 	$('#uw, #bsc, #ib, #footer').hide().each(function(i) {
 		$(this).delay(300 * i).fadeIn(500, 'swing');
 	})
 })