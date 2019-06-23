current_tab_id = '#ka_nav_item';
updateActiveTab(current_tab_id);

var store_test;

var output = [];

function storeResults(res) {
    output.push(res);
}


function knowledgeAreaDataHandler(store) {
    
    function onDone() {
        // Deal with 'output' object here
        // Need to recursively get all the shit we need
        // Sorting output (in alphabetical order)
        output = output.sort(function(a, b) {
            var textA = a['?text_name'].value.toUpperCase();
            var textB = b['?text_name'].value.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        // Loop counter
        var counter = 0

        function loopArray(arr_elem) {
            // Variable to store element output
            var elem_output = [];

            getAllKnowledgeAreas(store, arr_elem['?name'].value, function (out) {
                // Appending to element output array
                elem_output.push(out);
            }, function onElemDone() {
                // Variables to store unique elements
                var subjects = [];

                // Store for seen stuff
                var seen_subjects = new Set();

                // Iterating over all output to extract multiples fields
                // This must be done like this because rdflib.js is trash,
                // and DOES NOT respect SPARQL queries correctly
                for (var idx in elem_output) {
                    var elem = elem_output[idx];
                    
                    // Isolating subjects
                    if (elem['?predicate'].value === relIRI('hasSubject')) {
                        // Checking if it is already in the set
                        if (!seen_subjects.has(elem['?sub_name'].value)) {
                            // Adding to set if not seen
                            seen_subjects.add(elem['?sub_name'].value);
                            // Adding element to descriptions array
                            subjects.push(elem);
                        }
                    }
                }

                subjects = subjects.sort(function(a, b) {
                    var textA = a['?sub_name'].value.toUpperCase();
                    var textB = b['?sub_name'].value.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                // Remapping output array
                var template_elem = elem_output.reduce(templateElemArrayRemap, {});

                // Adding subjects
                template_elem['subjects'] = subjects;

                // Build item HTML with layout engine
                var item_html = layoutKnowledgeArea(template_elem, arr_elem['?name'].value);

                // Add to page
                $('.ka_entities').append(item_html)

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
    getOfType(store, 'KnowledgeArea', storeResults, onDone);
}

// Starting page load with graph data handler
loadGraphData(knowledgeAreaDataHandler);
