current_tab_id = '#talks_nav_item';
updateActiveTab(current_tab_id);

var store_test;

var output = [];

function storeResults(res) {
    output.push(res);
}


function talkDataHandler(store) {
    
    function onDone() {
        // Deal with 'output' object here
        // Need to recursively get all the shit we need
        // Sorting output (by descending date)
        output = output.sort(compareDateDesc);

        // Loop counter
        var counter = 0

        function loopArray(arr_elem) {
            // Variable to store element output
            var elem_output = [];

            getAllTalks(store, arr_elem['?name'].value, function (out) {
                // Appending to element output array
                elem_output.push(out);
            }, function onElemDone() {

                // Variables to store unique elements
                var descriptions = [];
                var media_url = [];

                // Store for seen stuff
                var seen_descriptions = new Set();
                var seen_media = new Set();

                // Iterating over all output to extract multiples fields
                // This must be done like this because rdflib.js is trash,
                // and DOES NOT respect SPARQL queries correctly
                for (var idx in elem_output) {
                    var elem = elem_output[idx];
                    
                    // Isolating descriptions
                    if (elem['?predicate'].value === relIRI('hasDescription')) {
                        // Checking if it is already in the set
                        if (!seen_descriptions.has(elem['?desc'].value)) {
                            // Adding to set if not seen
                            seen_descriptions.add(elem['?desc'].value);
                            // Adding element to descriptions array
                            descriptions.push(elem);
                        }
                    }

                    // Isolating media URLs
                    if (elem['?predicate'].value === relIRI('hasMedia')) {
                        // Checking if it already in the set
                        if (!seen_media.has(elem['?obj'].value)) {
                            // Adding to set if not see
                            seen_media.add(elem['?obj'].value);
                            // Adding element to the media array
                            media_url.push(elem['?obj'].value);
                        }
                    }
                }

                descriptions.sort(function(a, b) {
                    return a['?priority'].value - b['?priority'].value;
                });

                // Remapping output array
                var template_elem = elem_output.reduce(templateElemArrayRemap, {});

                // Adding descriptions
                template_elem['description'] = descriptions.map(
                    a => a['?description_text'].value
                );

                // Adding media URL
                template_elem['media_url'] = media_url;

                // Build item HTML with layout engine
                var item_html = layoutTalk(template_elem, arr_elem['?name'].value);

                // Add to page
                $('.entities').append(item_html)

                // Append counter
                counter++;

                // Reset element array
                elem_output = [];

                // If counter is still less than output size, run again
                if (counter < output.length) {
                    loopArray(output[counter]);
                } else {
                    // Last iteration; reload JS
                    $.getScript('dist/js/global_handlers.js');
                }
            });
        }

        loopArray(output[counter]);
    }

    // Getting all WorkExperience instances (for sorting)
    getOfType(store, 'Talk', storeResults, onDone);
}

// Starting page load with graph data handler
loadGraphData(talkDataHandler);
