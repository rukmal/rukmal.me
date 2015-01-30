var target = document.getElementById('spinnerbackground');

var spinner = new Spinner({
	lines: 13, // The number of lines to draw
	length: 20, // The length of each line
	width: 2, // The line thickness
	radius: 20, // The radius of the inner circle
	corners: 1, // Corner roundness (0...1)
	color: 'white', // Color
	speed: 1, // Revs/second
	className: 'spinner' // Class to be assigned to the spinner
}).spin(target);

/**
 * Function to fade the spinner out of the DOM
 */
function fadeOutSpinner () {
	$('.spinner').fadeOut({
		duration: 1500,
		start: function () {
			$('#spinnerbackground').delay(1200).fadeOut(600, function () {
				$(this).remove();
			});
		}
	});
}

$.when(
	$.getScript('dist/js/main.min.js'),
	$('head').append('<link href="dist/css/style.min.css" rel="stylesheet">')
).then(function () {
	fadeOutSpinner();
});