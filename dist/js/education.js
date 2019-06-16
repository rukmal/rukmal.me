current_tab_id = '#education_nav_item';
updateActiveTab(current_tab_id);


var store_test;

var output = [];

function storeResults(res) {
    output.push(res);
}


function educationDataHandler(store) {
    
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

            getAllProperties(store, arr_elem['?name'].value, function (out) {
                // Appending to element output array
                elem_output.push(out);
            }, function onElemDone() {
                // Remapping output array
                var template_elem = elem_output.reduce(templateElemArrayRemap, {});

                // Build item HTML with layout engine
                var item_html = layoutEducation(template_elem, arr_elem['?name'].value);

                // Add to page
                $('.entities').append(item_html)

                console.log(item_html);

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

        loopArray(output[counter])

        // // Iterating through now sorted output
        // for (idx in output) {
        //     item = output[idx]
        //     print(idx)
        //     getAllProperties(store, item['?name'].value, function (out) {
        //         console.log(item['?name'].value, out);
        //     }, function (out) {
        //         console.log(out);
        //     });
        // }

        // TODO Now:
        // Write another sparql query to get all this shit out of the graph, one by one
        // (i.e. get it for each of the shits in output, in order)

        // Explore adding shit shite directly to the original query; will improve speed

        // An alternative to dealing with Javascript's asnyc clusterfuck would be to put
        // both of these functions inside the education data handler; then you will have
        // access to `store`, and can just write your queries directly in there
    }

        // This is working now! Just need to start doing stuff
        
        getOfType(store, 'Degree', storeResults, onDone);
    }

loadGraphData(educationDataHandler);
