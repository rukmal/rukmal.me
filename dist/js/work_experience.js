current_tab_id = '#work_nav_item';
updateActiveTab(current_tab_id);


var store_test;

var output = [];

function storeResults(res) {
    output.push(res);
}


function workDataHandler(store) {
    
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

            getAllWorkExperience(store, arr_elem['?name'].value, function (out) {
                // Appending to element output array
                elem_output.push(out);
            }, function onElemDone() {
                // Template data object
                var template_data = {};

                // Variables to store unique elements
                var descriptions = [];
                var parent_orgs = [];
                var super_parent_orgs = [];
                var media_url = [];
                var other_titles = [];

                // Store for seen descriptions
                var seen_descriptions = new Set();

                // Store for seen parent organizations
                var seen_parent_orgs = new Set(); 

                // Store for seen super parent organizations
                var seen_super_orgs = new Set();

                // Store for seen media items
                var seen_media = new Set();

                // Store for seen other titles
                var seen_titles = new Set();

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
                    
                    // Isolating parent organizations
                    if (elem['?parentOrgName']) {
                        // Checking if it is already in the set
                        if (!seen_parent_orgs.has(elem['?parentOrgName'].value)) {
                            // Adding to set if not seen
                            seen_parent_orgs.add(elem['?parentOrgName'].value);
                            // Adding element to the parent organizations array
                            parent_orgs.push(elem);
                        }
                    }

                    // Isolating super parent organizations
                    if (elem['?superParentOrgName']) {
                        // Checking if it is already in the set
                        if (!seen_super_orgs.has(elem['?superParentOrgName'].value)) {
                            // Adding to set if not seen
                            seen_super_orgs.add(elem['?superParentOrgName'].value);
                            // Adding element to the parent organizations array
                            super_parent_orgs.push(elem);
                        }
                    }

                    // Isolating media URLs
                    if (elem['?predicate'].value ===  relIRI('hasMedia')) {
                        // Checking if it already in the set
                        if (!seen_media.has(elem['?obj'].value)) {
                            // Adding to set if not see
                            seen_media.add(elem['?obj'].value);
                            // Adding element to the media array
                            media_url.push(elem['?obj'].value);
                        }
                    }

                    if (elem['?predicate'].value === relIRI('otherTitles')) {
                        // Checking if it already in the set
                        if (!seen_titles.has(elem['?obj'].value)) {
                            // Adding to set if not see
                            seen_titles.add(elem['?obj'].value);
                            // Adding element to the media array
                            other_titles.push(elem['?obj'].value);
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

                // Adding organizations
                template_data['parent_orgs'] = parent_orgs;
                template_data['super_parent_orgs'] = super_parent_orgs;

                // Adding media
                template_data['media_url'] = media_url;

                // Adding other titles
                template_data['other_titles'] = other_titles;

                // Remapping output array
                var template_elem = elem_output.reduce(templateElemArrayRemap, {});

                // Combining remapped output array and the specially identified
                // items above
                var full_template_data = {...template_elem, ...template_data};

                // Build item HTML with layout engine
                var item_html = layoutWork(full_template_data, arr_elem['?name'].value);

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
    getOfType(store, 'WorkExperience', storeResults, onDone);
}

// Starting page load with graph data handler
loadGraphData(workDataHandler);
