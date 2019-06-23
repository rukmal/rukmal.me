current_tab_id = '#ka_nav_item';
updateActiveTab(current_tab_id);

var store_test;

var course_output = [];

function storeResults(res) {
    course_output.push(res);
}


function courseDataHandler(store) {
    
    function onDone() {
        // Deal with 'output' object here
        // Need to recursively get all the shit we need
        // Sorting output (in alphabetical order)
        course_output = course_output.sort(function(a, b) {
            var textA = a['?taught_name'].value.toUpperCase();
            var textB = b['?taught_name'].value.toUpperCase();

            if (textA < textB) {
                return -1;
            } else if (textA > textB) {
                return 1;
            } else {
                // Equal (i.e. same taught at)
                // Secondary sort by department + course code combo
                var course_nameA = a['?department_code'].value.toUpperCase() + a['?course_code'].value.toUpperCase();
                var course_nameB = b['?department_code'].value.toUpperCase() + b['?course_code'].value.toUpperCase();
                return (course_nameA < course_nameB) ? -1 : (course_nameA > course_nameB) ? 1 : 0;
            }
        });

        // See: https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
        var groupBy = function(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };

        // Loop counter
        var counter = 0

        // Setting initial organization
        var current_org = course_output[0]['?taught_name'].value;

        // Variable to store HTML for the section
        var courses_html = ''
        // Opening new element container
        courses_html += '<div class="ka_element container"><div class="row"><div class="container element_content_container">';
        // Institution name
        courses_html += '<div class="elem_name"><span rel="popover" data-dbpedia="' + course_output[counter]['?taught_res'].value + '">' + course_output[counter]['?taught_name'].value + '</span></div><br>';
        // Starting list
        courses_html += '<ul>';

        function loopArray(arr_elem) {
            // Variable to store element output
            var elem_output = [];

            getAllCourse(store, arr_elem['?course'].value, function (out) {
                // Appending to element output array
                elem_output.push(out);
            }, function onElemDone() {
                // Remapping output array
                var template_elem = elem_output.reduce(templateElemArrayRemap, {});
                
                // Build item HTML with layout engine
                courses_html += layoutCourse(template_elem, arr_elem['?course'].value);

                // Append counter
                counter++;

                // Reset element array
                elem_output = [];

                // If counter is still less than output size, run again
                if (counter < course_output.length) {
                    // Check if the next course is from the same institution, if not start new element
                    if (course_output[counter]['?taught_name'].value !== current_org) {
                        // Update current org
                        current_org = course_output[counter]['?taught_name'].value;
                        // Closing old element container
                        courses_html += '</ul></div></div></div>'
                        // Opening new element container
                        courses_html += '<div class="ka_element container"><div class="row"><div class="container element_content_container">';
                        // Institution name
                        courses_html += '<div class="elem_name"><span rel="popover" data-dbpedia="' + course_output[counter]['?taught_res'].value + '">' + course_output[counter]['?taught_name'].value + '</span></div><br>';
                        // Starting list
                        courses_html += '<ul>';
                    }
                    loopArray(course_output[counter]);
                } else {
                    courses_html += '</ul></div></div></div>';
                    // Add to page
                    $('.course_entities').append(courses_html);
                    // Last iteration; reload JS
                    $.getScript('dist/js/global_handlers.js');
                }
            });
        }

        loopArray(course_output[counter]);
    }

    // Getting all institutions where courses are taught
    getAllTaughtAt(store, storeResults, onDone);
}

// Starting page load with graph data handler
loadGraphData(courseDataHandler);
