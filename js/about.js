var CATEGORIES = ['#aboutcategory-school', '#aboutcategory-work', '#aboutcategory-personal'];
var CURRENT_CATEGORY = '';

$('div[id*="aboutcategory"').on('click', function () {
	animateCategory('#' + $(this).attr('id'));
});

$('#aboutback').on('click', function () {
	resetAnimation();
});

function animateCategory (category) {
	CURRENT_CATEGORY = category;
	var minCategories = CATEGORIES.slice();
	minCategories.splice(minCategories.indexOf(category), 1);
	$.each(minCategories, function (index, value) {
		$(value).animate({
			'width': '20%'
		}, {
			'queue': false,
			'duration': '100',
			'easing': 'linear'
		});
	});
	$(category).animate({
		'width': '60%'
	}, {
		'queue': false,
		'duration': '200',
		'easing': 'linear'
	});
	$('#aboutback').fadeTo(200, 1);
}

function resetAnimation () {
	var minCategories = CATEGORIES.slice();
	minCategories.splice(minCategories.indexOf(CURRENT_CATEGORY), 1);
	$.each(minCategories, function (index, value) {
		$(value).animate({
			'width': '33.333333333%'
		}, {
			'queue': false,
			'duration': '200',
			'easing': 'linear'
		});
	});
	$(CURRENT_CATEGORY).animate({
		'width': '33.333333333%'
	}, {
		'queue': false,
		'duration': '185',
		'easing': 'linear'
	});
	$('#aboutback').fadeTo(200, 0);
}