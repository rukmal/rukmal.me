/*
 * @author Rukmal Weerawarana
 *
 * Script that contains all javascript functions including jQuery for the
 * projects.html page
 */

 'use strict'

 $(document).ready(function() {
 	$('.projectbox').mouseenter(function() {
 		$(this).animate({'zoom':'1.02'}, 120);
 	})

 	$('.projectbox').mouseleave(function() {
 		$(this).animate({'zoom':'1'}, 120);
 	})

 	$('#leappong, #nodeblog, #huskycourseminer, #rukmalme, #footer').hide().each(function(i) {
 		$(this).delay(225 * i).fadeIn(500, 'swing');
 	})
 })
