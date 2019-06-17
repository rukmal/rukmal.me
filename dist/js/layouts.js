/**
 * Function to build a external resource enabled <span> tag to the layout.
 * This also intelligently creates links (if websites are available).
 * 
 * @param {Object} elem Layout element.
 * @param {String} iri IRI of the target property.
 */
function buildOptionalExtResElem(elem, iri) {
    var result = ''

    // Check if external resource exists
    if (elem[relIRI(iri)]['?obj_ext_res']) {
        result = `<span class="descr_emph" rel="popover" data-dbpedia="${elem[relIRI(iri)]['?obj_ext_res'].value}">${elem[relIRI(iri)]['?obj_name'].value}</span>`
    } else {
        result = elem[relIRI(iri)]['?obj_name'].value
    }

    // Check if website exists
    if (elem[relIRI(iri)]['?obj_website']) {
        result = `<a class="entity_link" href="${elem[relIRI(iri)]['?obj_website'].value}">` + result + '</a>'
    }

    return result
}

/**
 * Function to populate a field with information from a dbpedia resource.
 * 
 * @param {String} dbpedia_resource Target dbpedia resource.
 * @param {String} field Target field to extract from dbpedia.
 * @param {String} container_id Target ID of container to store new information.
 */
function populateFromDBPedia(dbpedia_resource, field, container_id) {
    function result_handler(result) {
        // Formatted text with URL embedded
        var formatted_html = `<a href="${result.wikipedia_res.value}" class="entity_link">${result[field].value}</a>`
        // Setting to container
        $(container_id).html(formatted_html);
    }

    getDBpediaData(dbpedia_resource, result_handler);
}


/**
 * Function to build the layout for an 'Education' item.
 * 
 * @param {Object} elem Layout object.
 * @param {String} elem_id ID of the element.
 */
function layoutEducation(elem, elem_id) {
    // Random number for element IDs
    var rand_id = Math.ceil(Math.random() * 1000);

    var item = `
    <div class="precis_element container">
    <div id=${elem_id} class="row">
        <div class="col-sm-8 element_content_container">
            <div class="elem_secondary">
                ${buildOptionalExtResElem(elem, 'degreeUniversity')} (${new Date(elem[relIRI('hasDate')]['?obj'].value).getFullYear()})
            </div>
            <div class="elem_third">
            ${buildOptionalExtResElem(elem, 'degreeSchool')}
            </div>
            <div class="elem_name">${elem[relIRI('hasName')]['?obj'].value}</div>
            <div class="elem_fourth">
                ${buildOptionalExtResElem(elem, 'degreeDepartment')}
            </div>
            <div class="degree_concentration">
                Concentration: <span class="descr_emph degree_concentration_name" rel="popover" data-dbpedia="${elem[relIRI('degreeConcentration')]['?obj'].value}" id="${'concentration' + rand_id}"></span>
            </div>
            <br>
            <button type="button" class="more_info_btn btn-secondary" data-toggle="modal" data-target="${'#modal' + rand_id}">
                More Information
            </button>
        </div>
        <div class="col-sm-4 element_picture_container">
            <img class="element_picture" src="${elem[relIRI('hasImage')]['?obj'].value}">
        </div>
    </div>
    </div>


    <div class="modal fade" id="${'modal' + rand_id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exmpleModalLabel">More Information</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <b>${elem[relIRI('hasName')]['?obj'].value}</b>
                    <br>
                    <br>
                    ${buildOptionalExtResElem(elem, 'degreeUniversity')}
                    <br>
                    ${buildOptionalExtResElem(elem, 'degreeSchool')}
                    <br>
                    ${buildOptionalExtResElem(elem, 'degreeDepartment')}
                    <br>
                    <br>
                    <i>Location</i>: ${elem[relIRI('inCity')]['?obj'].value}, ${(elem[relIRI('inState')]) ? elem[relIRI('inState')]['?obj'].value : elem[relIRI('inCountry')]['?obj'].value}
                    <br>
                    <i>Type</i>: <span class="descr_emph" rel="popover" data-dbpedia="${elem[relIRI('degreeType')]['?obj'].value}" id="${'deg_type' + rand_id}"></span>
                    <br>
                    <i>Concentration</i>: <span class="descr_emph" rel="popover" data-dbpedia="${elem[relIRI('degreeConcentration')]['?obj'].value}" id="${'modalConcentration' + rand_id}"></span>
                    <br>
                    <i>Date</i>: ${new Date(elem[relIRI('hasDate')]['?obj'].value).toDateString()}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" data-dismiss="modal" aria-label="Close">Close</button>
                </div>
            </div>
        </div>
    </div>
    `

    // Populating dbpedia fields
    populateFromDBPedia(elem[relIRI('degreeConcentration')]['?obj'].value, 'name', '#concentration' + rand_id); // Main page degree concentration
    populateFromDBPedia(elem[relIRI('degreeConcentration')]['?obj'].value, 'name', '#modalConcentration' + rand_id); // Modal degree concentration
    populateFromDBPedia(elem[relIRI('degreeType')]['?obj'].value, 'name', '#deg_type' + rand_id); // Modal degree type

    return item;

}


/**
 * Function to build the layout for a 'WorkExperience' item.
 * 
 * @param {Object} elem Layout object.
 * @param {String} elem_id ID of the element.
 */
function layoutWork(elem, elem_id) {
    var item = `
    <div class="precis_element container">
    <div id=${elem_id} class="row">
        <div class="col-sm-8 element_content_container">
            <div class="elem_secondary">
                ${buildOptionalExtResElem(elem, 'employedAt')}
            </div>
            ${elem[relIRI('externalResource')] ? elem[relIRI('externalResource')]['?obj'].value : ''}
            <div class="elem_name">
                ${elem[relIRI('hasName')]['?obj'].value}
            </div>

            <div class="elem_third">
                ${elem[relIRI('employedAt')]['?obj_parent'] ? elem[relIRI('employedAt')]['?obj_parent'].value : ''}
            </div>
        </div>
        <div class="col-sm-4 element_picture_container">
            <img class="element_picture" src="${elem[relIRI('hasImage')]['?obj'].value}">
        </div>
    </div>
    </div>
    `

    return item;

}
