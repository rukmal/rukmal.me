current_tab_id = '#projects_nav_item';
updateActiveTab('#projects_nav_item');


var store_test;

var output = [];

function storeResults(res) {
    output.push(res);
}


function projectDataHandler(store) {
    
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

            getAllProjects(store, arr_elem['?name'].value, function (out) {
                // Appending to element output array
                elem_output.push(out);
            }, function onElemDone() {
                // Template data object
                var template_data = {};

                // Variables to store unique elements
                var descriptions = [];
                var media_url = [];
                var skills = [];
                var activity = [];
                var award = [];

                // Store for seen stuff
                var seen_descriptions = new Set();
                var seen_media = new Set();
                var seen_skills = new Set();
                var seen_activity = new Set();
                var seen_award = new Set();

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

                    // Isolating skills
                    if (elem['?sk_name']) {
                        // Checking if it already in the set
                        if (!seen_skills.has(elem['?sk_name'].value)) {
                            // Adding to set if not see
                            seen_skills.add(elem['?sk_name'].value);
                            // Adding element to the media array
                            skills.push(elem);
                        }
                    }

                    // Isolating related activities
                    if (elem['?ac_name']) {
                        // Checking if it already in the set
                        if (!seen_activity.has(elem['?ac_name'].value)) {
                            // Adding to set if not see
                            seen_activity.add(elem['?ac_name'].value);
                            // Adding element to the media array
                            activity.push(elem['?ac_name'].value);
                        }
                    }

                    // Isolating related activities
                    if (elem['?award_name']) {
                        // Checking if it already in the set
                        if (!seen_award.has(elem['?award_name'].value)) {
                            // Adding to set if not see
                            seen_award.add(elem['?award_name'].value);
                            // Adding element to the media array
                            award.push(elem['?award_name'].value);
                        }
                    }
                }

                descriptions.sort(function(a, b) {
                    return a['?priority'].value - b['?priority'].value;
                });

                // Adding sorted descriptions to template data (just the text)
                // See: https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array
                template_data['description'] = descriptions.map(
                    a => a['?description_text'].value
                );

                // Adding data to template object
                template_data['media_url'] = media_url;
                template_data['skills'] = skills;
                template_data['awards'] = award;
                template_data['activity'] = activity;

                // Remapping output array
                var template_elem = elem_output.reduce(templateElemArrayRemap, {});

                // Combining remapped output array and the specially identified
                // items above
                var full_template_data = {...template_elem, ...template_data};

                // Build item HTML with layout engine
                var item_html = layoutProject(full_template_data, arr_elem['?name'].value);

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

    // Getting all Project instances (for sorting)
    getOfType(store, 'Project', storeResults, onDone);
}

// Starting page load with graph data handler
loadGraphData(projectDataHandler);
