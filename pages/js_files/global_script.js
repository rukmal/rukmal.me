/*
 * @author Rukmal Weerawarana
 *
 * Script containing all global JS elements, including all global
 * jQuery functions.
 */

'use strict'

$(document).ready(function() {
	// Menu selection animations
	$('.menuoption').mouseenter(function() {
		$(this).animate({'background-color':'rgb(80,80,80)'}, 150);
	})

	$('.menuoption').mouseleave(function() {
		$(this).animate({'background-color':'rgb(0,0,0)'}, 100);
	})

	//********
	// The following block of code was commented out as a workaround was found by
	// simply settign the height of #menufiller to the padding of the menu plus the font size.
	//********
	// Setting the height of the 'filler' div to the height of the menu.
 	// $('#menufiller').height($('#menu').height());
})