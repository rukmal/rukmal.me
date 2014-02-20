/*
 * @author Rukmal Weerawarana
 *
 * Script containing all global JS elements, including all global
 * jQuery functions.
 */

'use strict'

$(document).ready(function() {
	/*
 	 * The following is code for Google Analytics to work
 	 */
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	ga('create', 'UA-48259582-1', 'rukmal.me');
	ga('send', 'pageview');

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