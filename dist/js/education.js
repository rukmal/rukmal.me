current_tab_id = '#education_nav_item';
updateActiveTab(current_tab_id);


var store_test;

var output = [];

function storeResults(res) {
    output.push(res);
}

function onDone() {
    // Deal with 'output' object here
    // Need to recursively get all the shit we need
    // Sorting output 
    output.sort(compareDataDesc);

    // TODO Now:
    // Write another sparql query to get all this shit out of the graph, one by one
    // (i.e. get it for each of the shits in output, in order)

    // Explore adding shit shite directly to the original query; will improve speed

    // An alternative to dealing with Javascript's asnyc clusterfuck would be to put
    // both of these functions inside the education data handler; then you will have
    // access to `store`, and can just write your queries directly in there
}

function educationDataHandler(store) {
    // This is working now! Just need to start doing stuff
    
    getOfType(store, 'Degree', storeResults, onDone);
}

loadGraphData(educationDataHandler);
