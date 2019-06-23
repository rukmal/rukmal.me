var abstract_len = 500;


/**
 * This function handles the creation and display of popovers for span tags that
 * have the necessary 'rel=popover' attribute, and accompanying 'data-dbpedia'
 * attribute pointing to a DBpedia resource that can be queried.
 */
function dbpediaPopupHandler() {
    var currentElem = this;
    // The callback function here populates the popup
    getDBpediaData($(this).data('dbpedia'), function (res) {
        var title = '';
        var abstract = '';
        var img_url = '';
        var wiki_url = '';

        // Isolating image URL
        try { var img_url = res.thumbnail.value; } catch (err) {};

        // Isolating Wikipedia URL
        try { var wiki_url = res.wikipedia_res.value; } catch (err) {};

        // Isolating abstract
        try { var abstract = res.abstract.value; } catch (err) {};

        // Isolating title
        try { var title = res.name.value; } catch (err) {};

        var template = `
            <div class="popover" role="tooltip">
                <div class="arrow"></div>
                <h3 class="text-center popover-header"></h3>
                <div class="text-center" popover-img">
                    <img width="200" src="${img_url}">
                </div>
                <div class="popover-body"></div>
                <br />
                <div class="text-center popover-url">
                    <i>Data from DBpedia</i>
                    <a href="${wiki_url}">(URL)</a>
                </div>
            </div>
        `

        // Format this shit
        var trimmedAbstract = abstract.substring(0, abstract_len) + '...';

        // The following code handles intelligently displaying and tearing down
        // popovers, including continuing to display them while the user's mouse
        // is over said popover. This enables interactivity with the popover by
        // the user.
        $(currentElem).popover({
            html: true,
            trigger: 'manual',
            placement: 'auto',
            content: trimmedAbstract,
            title: title,
            template: template
        }).on('mouseenter', function () {
            $(currentElem).popover('show');
            $('.popover').on('mouseleave', function () {
                $(currentElem).popover('hide');
            });
        }).on('mouseleave', function () {
            setTimeout(function () {
                if (!$('.popover:hover').length) {
                    $(currentElem).popover('hide');
                };
            }, 10);
        });
    });
};


$('span[rel=popover]').hover(dbpediaPopupHandler);
$('span[rel=popover]').on('tap', dbpediaPopupHandler);
$('span[rel=popover]').on('taphold', dbpediaPopupHandler);
