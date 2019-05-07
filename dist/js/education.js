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
}

function educationDataHandler(store) {
    // This is working now! Just need to start doing stuff
    
    getOfType(store, 'Degree', storeResults, onDone)
}

loadGraphData(educationDataHandler);
