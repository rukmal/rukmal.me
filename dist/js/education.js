current_tab_id = '#education_nav_item';
updateActiveTab(current_tab_id);


function educationDataHandler(store) {
    // This is working now! Just need to start doing stuff
    console.log(store);
    console.log('ehre');
    console.log(new Date().getTime());
}

console.log(new Date().getTime());
loadGraphData(educationDataHandler);
