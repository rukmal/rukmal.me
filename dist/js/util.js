/**
 * Function to query DBpedia, and get the name, abstract, thumbnail, and wikipedia URL.
 * 
 * @param {string} dbpedia_resource DBpedia resource URI (does not perform error checks)
 * @param {callback} result_trigger Result handler callback.
 */
function getDBpediaData(dbpedia_resource, result_trigger) {
    var sparqlQuery = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?name ?abstract ?thumbnail ?wikipedia_res
        WHERE {
            OPTIONAL { <${dbpedia_resource}> foaf:name|rdfs:label ?name } .
            OPTIONAL { <${dbpedia_resource}> dbo:abstract ?abstract } .
            OPTIONAL { <${dbpedia_resource}> dbo:thumbnail ?thumbnail } .
            OPTIONAL { <${dbpedia_resource}> foaf:isPrimaryTopicOf|foaf:primaryTopic ?wikipedia_res } .
            FILTER LANGMATCHES(LANG(?abstract), 'en') .
        }
    `

    var base_url = 'https://dbpedia.org/sparql';

    var queryUrl = base_url + '?query=' + encodeURIComponent(sparqlQuery) + '&format=json';

    // Making request to DBpedia
    $.ajax({
        dataType: 'jsonp',
        url: queryUrl,
        success: function (response_data) {
            try {
                // Extracting results; pass without doing anything if none exist
                var results = response_data.results.bindings[0];
                result_trigger(results);
            } finally {}
        }
    });
}

/**
 * Function to update the current active tab in the sidebar (must be called on
 * each page load; need to do this because this is not a single-page webapp)
 * 
 * @param {string} current_tab Current tab ID.
 */
function updateActiveTab(current_tab) {
    // Remove all active class tabs enabled (if any)
    $('navbar > li').removeClass('active');
    // Add active class to current tab
    $(current_tab).addClass('active');
}


/**
 * Function to compare the dates of two objects from a SPARQL query, and to
 * return sort values appropriate to sort the objects in descending 
 * temporal order (i.e. to be used with `arr.sort()`).
 * 
 * @param {Object} a Candidate SPARQL return object (from query).
 * @param {Object} b Candidate SPARQL return object (from query).
 */
function compareDateDesc(a, b) {
    // Create date objects
    var d1 = new Date(a['?date'].value);
    var d2 = new Date(b['?date'].value);
    
    // Return (positive -> sorted first)
    return (d2.getTime() - d1.getTime());
}


/**
 * Remapping function to be used to remap an array of output from the SPARQL
 * queries, to having their IRIs as keys in a new object, as opposed to an array.
 * 
 * @param {Object} map Output map object.
 * @param {Object} obj Input object to be mapped.
 */
function templateElemArrayRemap(map, obj) {
    map[obj['?predicate'].value] = obj;
    return map;
}


/**
 * Function to build full Precis IRI labels, given a relationship name.
 * 
 * @param {string} rel Relationship name to be converted to full IRI.
 */
function relIRI(rel) {
    return 'http://precis.rukmal.me/ontology#' + rel
}


// Variable to store months (for lookup with date function)
date_months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
               'August', 'September', 'October', 'November', 'December'];
