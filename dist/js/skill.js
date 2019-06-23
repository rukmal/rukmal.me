current_tab_id = '#ka_nav_item';
updateActiveTab(current_tab_id);

var store_test;

var sk_output = [];

function storeResults(res) {
    sk_output.push(res);
}


function skillDataHandler(store) {
    
    function onDone() {
        // Deal with 'output' object here
        // Need to recursively get all the shit we need
        // Sorting output (in alphabetical order)
        sk_output = sk_output.sort(function(a, b) {
            var textA = a['?text_name'].value.toUpperCase();
            var textB = b['?text_name'].value.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        // Loop counter
        var counter = 0

        function loopArray(arr_elem) {
            // Variable to store element output
            var elem_output = [];

            getAllSkillGroup(store, arr_elem['?name'].value, function (out) {
                // Appending to element output array
                elem_output.push(out);
            }, function onElemDone() {
                // Variables to store unique elements
                var skills = [];

                // Store for seen stuff
                var seen_skills = new Set();

                // Iterating over all output to extract multiples fields
                // This must be done like this because rdflib.js is trash,
                // and DOES NOT respect SPARQL queries correctly
                for (var idx in elem_output) {
                    var elem = elem_output[idx];
                    
                    // Isolating subjects
                    if (elem['?predicate'].value === relIRI('hasSkill')) {
                        // Checking if it is already in the set
                        if (!seen_skills.has(elem['?sk_name'].value)) {
                            // Adding to set if not seen
                            seen_skills.add(elem['?sk_name'].value);
                            // Adding element to descriptions array
                            skills.push(elem);
                        }
                    }
                }

                skills = skills.sort(function(a, b) {
                    var textA = a['?sk_name'].value.toUpperCase();
                    var textB = b['?sk_name'].value.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                // Remapping output array
                var template_elem = elem_output.reduce(templateElemArrayRemap, {});

                // Adding subjects
                template_elem['skills'] = skills;

                // Build item HTML with layout engine
                var item_html = layoutSkillGroup(template_elem, arr_elem['?name'].value);

                // Add to page
                $('.sk_entities').append(item_html)

                // Append counter
                counter++;

                // Reset element array
                elem_output = [];

                // If counter is still less than output size, run again
                if (counter < sk_output.length) {
                    loopArray(sk_output[counter]);
                } else {
                    // Last iteration; reload JS
                    $.getScript('dist/js/global_handlers.js');
                }
            });
        }

        loopArray(sk_output[counter]);
    }

    // Getting all WorkExperience instances (for sorting)
    getOfType(store, 'SkillGroup', storeResults, onDone);
}

// Starting page load with graph data handler
loadGraphData(skillDataHandler);
