// Graph Constants
const max_graph_age = 60 * 60 * 24 * 1000; // Seconds (1 day; can probably be longer)
const rukmal_data_graph_url = 'https://raw.githubusercontent.com/rukmal/Resume/gh-pages/personal_data.rdf';

// Store-specific things
const store_mimeType = 'application/rdf+xml';
const store_base_uri = 'http://precis.rukmal.me/'


/**
 * Function to load graph data.
 * 
 * This data is loaded either from the existing browser storage, or from GitHub. This
 * decision is made dynamically, first checking if browser storage exists, then if the
 * graph data exists, before finally checking if the graph data is not too old (as set by)
 * `max_graph_age`. If any of these conditions are not satisfied, `downloadGraphData` is
 * called, and the data is downloaded asynchronously from GitHub.
 * 
 * Note that the "asynchronous" feature here does little to nothing, as all content
 * is coming from the graph; this is effectively a blocking call, hence the callback to
 * populate page data.
 * 
 * @param {Callback} graphHandler Callback function to handle the build graph store.
 */
function loadGraphData(graphHandler) {
    // This loop misses the case of web storage NOT existing, and the variable not existing
    if(typeof(Storage) !== 'undefined') {
        // HTML5 Web storage exists, check for store
        if (typeof(sessionStorage.rukmal_data_graph) === 'undefined') {
            // Browser storage exists, but graph data does not
            // Download graph data
            downloadGraphData(buildGraph, graphHandler)
        } else {
            if ((Number(sessionStorage.rukmal_data_graph_last_updated) - 
                new Date().getTime()) > max_graph_age) {
                // Graph data exists, but it is too old
                downloadGraphData(buildGraph, graphHandler);
            } else {
                // Graph data exists, just use it
                buildGraph(sessionStorage.rukmal_data_graph, graphHandler);
            }
        }
    } else {
        downloadGraphData(buildGraph, graphHandler);
    }
}


/**
 * Function to download graph data (from my Resume GitHub Page;
 * [http://github.com/rukmal/Resume]). Passes resulting data to a callback.
 * 
 * @param {Callback} dataHandler Function to handle response.
 */
function downloadGraphData(dataHandler, dataHandlerArg) {
    $.get(rukmal_data_graph_url, function (data, status) {
        if (status === 'success') {
            // Check if session storage is supported; store if it is; update flags
            if (typeof(Storage) !== 'undefined') {
                sessionStorage.rukmal_data_graph = data;
                sessionStorage.rukmal_data_graph_last_updated = new Date().getTime();
            }

            // Handle data, pass thru data handler args too
            dataHandler(data, dataHandlerArg);
        }
    });
}


/**
 * Function to build a store and load graph data.
 * 
 * @param {String} data String of graph data (RDF/XML).
 * @param {Callback} graphHandler Callback function to handle graph data.
 */
function buildGraph(data, graphHandler) {
    // Creating new graph
    // TODO: (this is PRIME candidate for improvement in the future;
    // this is done on each reload, on every page. There must be a better way.)
    const store = $rdf.graph();
    // Parsing data into store
    $rdf.parse(data, store, store_base_uri, store_mimeType);

    // Calling graph handler function with the graph data
    graphHandler(store);
}


/**
 * Function to get all nodes of a given type from the Precis knowledge graph.
 * 
 * @param {Object} store RDFLib.js Store.
 * @param {String} type_name Target type to get.
 * @param {Callback} resCallback Callback function called with each result.
 * @param {Callback} doneCallback Callback function called when query is complete.
 */
function getOfType(store, type_name, resCallback, doneCallback) {
    // SPARQL query (plain text)
    var sparql_query = `
    PREFIX precis: <http://precis.rukmal.me/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT ?name ?date
    WHERE {
        ?name rdf:type precis:${type_name} .
        OPTIONAL { ?name precis:hasDate ?date . }
    }
    `;

    // Converting SPARQL query to rdflibjs query object
    // Note: RDFLib.js docs are absolute fucking garbage, so look at the source code:
    // https://linkeddata.github.io/rdflib.js/doc/sparql-to-query.js.html
    var rdflib_query = $rdf.SPARQLToQuery(sparql_query, false, store);

    // Running query
    // `resCallback` is called with each result
    // Third `false` argument is for stupid ass rdflib.js reasons
    // `doneCallback` is called when the query is complete
    // See: https://linkeddata.github.io/rdflib.js/doc/query.js.html
    store.query(rdflib_query, resCallback, false, doneCallback);
}


/**
 * Function to get all properties of a given node. Also get names of the nested
 * property (if it is also an object), and the externalResource of the nested node.
 * 
 * @param {Object} store RDFLib.js store.
 * @param {String} individual_iri Target IRI.
 * @param {Callback} resCallback Callback function called with each result.
 * @param {Callback} doneCallback Callback function called when query is complete.
 */
function getAllProperties(store, individual_iri, resCallback, doneCallback) {
    var sparql_query = `
    PREFIX precis: <http://precis.rukmal.me/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT ?predicate ?obj ?obj_name ?obj_ext_res ?obj_website
    WHERE {
        <${individual_iri}> ?predicate ?obj .
        OPTIONAL { ?obj precis:hasName ?obj_name . }
        OPTIONAL { ?obj precis:externalResource ?obj_ext_res . }
        OPTIONAL { ?obj precis:hasWebsite ?obj_website . }
    }
    `;

    // Converting to rdflibjs query object
    var rdflib_query = $rdf.SPARQLToQuery(sparql_query, false, store);

    // Running query
    store.query(rdflib_query, resCallback, false, doneCallback);
}


/**
 * Function to get all properties of a given WorkExperience. Also resolves secondary
 * and tertiary "parentOrganization"s for the "employedAt" organization.
 * 
 * Note that the reason for the absolutely ridiculous amount of "OPTIONAL" statements
 * is because rdflib.js is awful and doesn't allow for nested if statements.
 * 
 * @param {Object} store RDFLib.js store.
 * @param {String} individual_iri Target IRI.
 * @param {Callback} resCallback Callback function called with each result.
 * @param {Callback} doneCallback Callback function called when query is complete.
 */
function getAllWorkExperience(store, individual_iri, resCallback, doneCallback) {
    var sparql_query = `
    PREFIX precis: <http://precis.rukmal.me/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT DISTINCT ?description_text ?priority ?desc ?predicate ?obj ?obj_website ?obj_name ?parentOrgName ?parentOrgResource ?parentOrgWebsite ?superParentOrgName ?superParentOrgWebsite ?superParentOrgResource
    WHERE {
        <${individual_iri}> ?predicate ?obj .
        OPTIONAL { ?obj precis:hasName ?obj_name . }
        OPTIONAL { ?obj precis:hasWebsite ?obj_website . }
        OPTIONAL {
            <${individual_iri}> precis:hasDescription ?desc .
            ?desc precis:hasPriority ?priority .
            ?desc precis:hasText ?description_text .
        }
        OPTIONAL {
            <${individual_iri}> precis:employedAt ?org .
            ?org precis:hasParentOrganization ?parentOrg .
            ?parentOrg precis:hasName ?parentOrgName .
            ?parentOrg precis:hasWebsite ?parentOrgWebsite .
        }
        OPTIONAL {
            <${individual_iri}> precis:employedAt ?org .
            ?org precis:hasParentOrganization ?parentOrg .
            ?parentOrg precis:hasName ?parentOrgName .
            ?parentOrg precis:hasWebsite ?parentOrgWebsite .
            ?parentOrg precis:externalResource ?parentOrgResource .
        }
        OPTIONAL {
            <${individual_iri}> precis:employedAt ?org .
            ?org precis:hasParentOrganization ?parentOrg .
            ?parentOrg precis:hasParentOrganization ?superParentOrg .
            ?superParentOrg precis:hasName ?superParentOrgName .
            ?superParentOrg precis:hasWebsite ?superParentOrgWebsite .
            ?superParentOrg precis:externalResource ?superParentOrgResource .
        }
        OPTIONAL {
            <${individual_iri}> precis:employedAt ?org .
            ?org precis:hasParentOrganization ?parentOrg .
            ?parentOrg precis:hasParentOrganization ?superParentOrg .
            ?superParentOrg precis:hasName ?superParentOrgName .
            ?superParentOrg precis:hasWebsite ?superParentOrgWebsite .
        }
    }
    `;

    // Converting to rdflibjs query object
    var rdflib_query = $rdf.SPARQLToQuery(sparql_query, false, store);

    // Running query
    store.query(rdflib_query, resCallback, false, doneCallback);
}


/**
 * Function to get all properties of a given Project. Also resolves relatedTo
 * Activities and Skills.
 * 
 * The multiple "OPTIONAL" clauses is because rdflib.js is shit.
 * 
 * @param {Object} store RDFLib.js store.
 * @param {String} individual_iri Target IRI.
 * @param {Callback} resCallback Callback function called with each result.
 * @param {Callback} doneCallback Callback function called when query is complete.
 */
function getAllProjects(store, individual_iri, resCallback, doneCallback) {
    var sparql_query = `
        PREFIX precis: <http://precis.rukmal.me/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT ?description_text ?predicate ?obj ?sk_name ?sk_resource ?ac_name ?award_name
        WHERE {
            <${individual_iri}> ?predicate ?obj .
            OPTIONAL {
                <${individual_iri}> precis:hasDescription ?desc .
                ?desc precis:hasText ?description_text .
            }
            OPTIONAL {
                <${individual_iri}> precis:relatedTo ?relatedItem .
                ?relatedItem rdf:type precis:Skill .
                ?relatedItem precis:hasName ?sk_name .
                ?relatedItem precis:externalResource ?sk_resource .
            }
            OPTIONAL {
                <${individual_iri}> precis:relatedTo ?relatedItem .
                ?relatedItem rdf:type precis:Activity .
                ?relatedItem precis:hasName ?ac_name .
            }
            OPTIONAL {
                <${individual_iri}> precis:relatedTo ?relatedItem .
                ?relatedItem rdf:type precis:Activity .
                ?award precis:affiliatedWith ?relatedItem .
                ?award precis:hasName ?award_name .
            }
        }
    `

    // Converting to rdflibjs query object
    var rdflib_query = $rdf.SPARQLToQuery(sparql_query, false, store);

    // Running query
    store.query(rdflib_query, resCallback, false, doneCallback);
}


/**
 * Function to get all properties of a given Talk.
 * 
 * @param {Object} store RDFLib.js store.
 * @param {String} individual_iri Target IRI.
 * @param {Callback} resCallback Callback function called with each result.
 * @param {Callback} doneCallback Callback function called when query is complete.
 */
function getAllTalks(store, individual_iri, resCallback, doneCallback) {
    var sparql_query = `
        PREFIX precis: <http://precis.rukmal.me/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT ?description_text ?predicate ?obj
        WHERE {
            <${individual_iri}> ?predicate ?obj .
            OPTIONAL {
                <${individual_iri}> precis:hasDescription ?desc .
                ?desc precis:hasText ?description_text .
            }
        }
    `

    // Converting to rdflibjs query object
    var rdflib_query = $rdf.SPARQLToQuery(sparql_query, false, store);

    // Running query
    store.query(rdflib_query, resCallback, false, doneCallback);
}


/**
 * Function to get all properties of a given Publication.
 * 
 * @param {Object} store RDFLib.js store.
 * @param {String} individual_iri Target IRI.
 * @param {Callback} resCallback Callback function called with each result.
 * @param {Callback} doneCallback Callback function called when query is complete.
 */
function getAllPublications(store, individual_iri, resCallback, doneCallback) {
    var sparql_query = `
        PREFIX precis: <http://precis.rukmal.me/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT ?description_text ?predicate ?obj ?priority ?affiliated_name
        WHERE {
            <${individual_iri}> ?predicate ?obj .
            OPTIONAL {
                <${individual_iri}> precis:hasDescription ?desc .
                ?desc precis:hasPriority ?priority .
                ?desc precis:hasText ?description_text .
            }
        }
    `

    // Converting to rdflibjs query object
    var rdflib_query = $rdf.SPARQLToQuery(sparql_query, false, store);

    // Running query
    store.query(rdflib_query, resCallback, false, doneCallback);
}
