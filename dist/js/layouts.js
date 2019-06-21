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
 * Function to build HTML for an organization, given its type. That is, either
 * 'parentOrg' or 'superParentOrg'. This is a workaround to help separate
 * individual organization types; rdflib.js does not work with nested SPARQL
 * queries for some reason (it is shit).
 * 
 * @param {Object} org_elems Target object.
 * @param {Object} type Type of the organization.
 * 
 * @return {String} HTML ready for layout with organization information. Note that
 *                  multiple organizations are separated with a comma and space.
 */
function buildOrganizationHTML(org_elems, type) {
    
    // Variable to store complete HTML
    var org_html_full = [];

    // Iterating through organizations
    for (idx in org_elems) {
        // Variable to store final organization HTML
        var org_html = '';
        
        // Isolating individual organization
        var org = org_elems[idx];

        // Dynamically assigning HTML depending on external resource existence
        if (org['?' + type + 'Resource']) {
            org_html += `<span class="descr_emph" rel="popover" data-dbpedia="${org['?' + type + 'Resource'].value}">${org['?' + type + 'Name'].value}</span>`;
        } else {
            org_html += org['?' + type + 'Name'].value;
        }

        // Checking if website exists for the given org
        if (org['?' + type + 'Website']) {
            org_html = `<a class="entity_link" href="${org['?' + type + 'Website'].value}">` + org_html + '</a>';
        }

        // Appending to array
        org_html_full.push(org_html);
    }

    return org_html_full.join(', ');
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
        <div class="col-sm-8 col-md element_content_container">
            <div class="elem_secondary">
                ${buildOptionalExtResElem(elem, 'degreeUniversity')}
            </div>
            <div class="elem_name">
                ${elem[relIRI('hasName')]['?obj'].value}
            </div>
            <div class="elem_third">
            ${buildOptionalExtResElem(elem, 'degreeSchool')}
            </div>
            <div class="elem_fourth">
                Concentration: <span class="descr_emph degree_concentration_name" rel="popover" data-dbpedia="${elem[relIRI('degreeConcentration')]['?obj'].value}" id="${'concentration' + rand_id}"></span>
            </div>
            <div class="elem_fourth">
                ${elem[relIRI('inCity')]['?obj'].value}, ${(elem[relIRI('inState')]) ? elem[relIRI('inState')]['?obj'].value : elem[relIRI('inCountry')]['?obj'].value} (${new Date(elem[relIRI('hasDate')]['?obj'].value).getFullYear()})
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
                    <h5 class="modal-title" id="exmpleModalLabel">${elem[relIRI('hasName')]['?obj'].value}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ${buildOptionalExtResElem(elem, 'degreeDepartment')}
                    <br>
                    ${buildOptionalExtResElem(elem, 'degreeSchool')}
                    <br>
                    ${buildOptionalExtResElem(elem, 'degreeUniversity')}
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
    // Random number for element IDs
    var rand_id = Math.ceil(Math.random() * 1000);

    // Organization HTML
    var org_html = '';

    // Building organization html
    var super_parent_html = buildOrganizationHTML(elem['super_parent_orgs'],
                                                   'superParentOrg');
    var parent_html = buildOrganizationHTML(elem['parent_orgs'],
                                            'parentOrg');

    // Building organization website stuff
    if (elem['super_parent_orgs'].length > 0) {
        org_html = super_parent_html;
    } else if (elem['parent_orgs'].length > 0) {
        org_html = parent_html;
    }

    // End date intelligent construction (may not exist if to present)
    var end_date = 'Present';
    if (elem[relIRI('endDate')]) {
        end_date = date_months[new Date(elem[relIRI('endDate')]['?obj'].value).getMonth()] + ' ' + new Date(elem[relIRI('endDate')]['?obj'].value).getFullYear()
    }

    // Descriptions
    var description_html = '<ul>';

    for (var idx in elem['description']) {
        description_html += '<li>' + elem['description'][idx] + '</li>';
    }

    description_html += '</ul>';

    // Media URLs
    var media_html = '';

    // Only appending list and title if not empty
    if (elem['media_url'].length > 0) {
        media_html = '<br><b><i>Other Media</i></b><ul>';
        for (var idx in elem['media_url']) {
            media_html += '<li><a href="' + elem['media_url'][idx] + '">' + elem['media_url'][idx] + '</a></li>';
        }
        media_html += '</ul>';
    }


    var item = `
    <div class="precis_element container">
    <div id=${elem_id} class="row">
        <div class="col-sm-8 element_content_container">
            <div class="elem_secondary">
                ${buildOptionalExtResElem(elem, 'employedAt')}
            </div>
            <div class="elem_name">
                ${elem[relIRI('hasName')]['?obj'].value}
            </div>
            <div class="elem_third">
                ${org_html}
            </div>
            <div class="elem_fourth">
                ${date_months[new Date(elem[relIRI('hasDate')]['?obj'].value).getMonth()]} ${new Date(elem[relIRI('hasDate')]['?obj'].value).getFullYear()} - ${end_date}
            </div>
            <div class="elem_fourth">
                ${elem[relIRI('inCity')]['?obj'].value}, ${(elem[relIRI('inState')]) ? elem[relIRI('inState')]['?obj'].value : elem[relIRI('inCountry')]['?obj'].value}
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
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exmpleModalLabel">${elem[relIRI('hasName')]['?obj'].value}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                ${buildOptionalExtResElem(elem, 'employedAt')}
                <br>
                ${parent_html}
                <br>
                ${super_parent_html}
                <br>
                <br>
                <i>Other Titles</i>: ${elem['other_titles'].sort().join(', ')}
                <br>
                <i>Location</i>: ${elem[relIRI('inCity')]['?obj'].value}, ${(elem[relIRI('inState')]) ? elem[relIRI('inState')]['?obj'].value : elem[relIRI('inCountry')]['?obj'].value}
                <br>
                <i>Tenure</i>: ${date_months[new Date(elem[relIRI('hasDate')]['?obj'].value).getMonth()]} ${new Date(elem[relIRI('hasDate')]['?obj'].value).getFullYear()} - ${end_date}
                <br>
                <br>
                <i><b>Description</b></i>
                ${description_html}
                ${media_html}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" data-dismiss="modal" aria-label="Close">Close</button>
            </div>
        </div>
    </div>
    </div>
    `

    return item;

}


/**
 * Function to build the layout for a 'Project' item.
 * 
 * @param {Object} elem Layout object.
 * @param {String} elem_id ID of the element.
 */
function layoutProject(elem, elem_id) {
    // Random number for element IDs
    var rand_id = Math.ceil(Math.random() * 1000);

    // Isolating image URL (if any)
    var image_url = (elem[relIRI('hasImage')] ? elem[relIRI('hasImage')]['?obj'].value : '');

    // Creating name HTML
    var proj_website = (elem[relIRI('hasWebsite')] ? elem[relIRI('hasWebsite')]['?obj'].value : '');

    // Building skills HTML
    var skills_html = '';
    if (elem['skills'].length > 0) {
        var individual_skill = [];
        skills_html += '<br><i>Skills</i>: '
        for (idx in elem['skills']) {
            individual_skill.push(`<span class="descr_emph" rel="popover" data-dbpedia="${elem['skills'][idx]['?sk_resource'].value}">${elem['skills'][idx]['?sk_name'].value}</span>`);
        }
        skills_html += individual_skill.join(', ');
    }

    // Building collaborators HTML
    var collaborators_html = '';
    if (elem[relIRI('hasCollaborators')]) {
        collaborators_html += '<br><i>Collaborators</i>: ' + elem[relIRI('hasCollaborators')]['?obj'].value;
    }

    // Building activities HTML
    var activities_html = '';
    if (elem['activity'].length > 0) {
        activities_html += '<br><i>Related Activities</i>: ' + elem['activity'].join(', ');
    }

    // Building awards HTML
    var awards_html = '';
    if (elem['awards'].length > 0) {
        awards_html += '<br><i>Awards</i>: ' + elem['awards'].join(', ');
    }


    // Media URLs
    var media_html = '';
    // Only appending list and title if not empty
    if (elem['media_url'].length > 0) {
        media_html = '<br><b><i>Other Media</i></b><ul>';
        for (var idx in elem['media_url']) {
            media_html += '<li><a href="' + elem['media_url'][idx] + '">' + elem['media_url'][idx] + '</a></li>';
        }
        media_html += '</ul>';
    }

    var item = `
    <div class="precis_element container">
    <div id=${elem_id} class="row">
        <div class="col-sm-8 element_content_container">
            <div class="elem_fourth">
                ${date_months[new Date(elem[relIRI('hasDate')]['?obj'].value).getMonth()]} ${new Date(elem[relIRI('hasDate')]['?obj'].value).getFullYear()}
            </div>
            <div class="elem_name">
                <a class="entity_link" href="${proj_website}">${elem[relIRI('hasName')]['?obj'].value}</a>
            </div>
            <div class="elem_fourth">
                ${elem['description']}
            </div>
            <br>
            <button type="button" class="more_info_btn btn-secondary" data-toggle="modal" data-target="${'#modal' + rand_id}">
                More Information
            </button>
        </div>
        <div class="col-sm-4 element_picture_container">
        <img class="project_image" src="${image_url}">
        </div>
    </div>
    </div>

    <div class="modal fade" id="${'modal' + rand_id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exmpleModalLabel">${elem[relIRI('hasName')]['?obj'].value}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                ${elem['description']}
                <br>
                <br>
                <i>Project Website</i>: <a href="${proj_website}">${proj_website}</a>
                <br>
                ${collaborators_html}
                ${skills_html}
                <br>
                ${activities_html}
                ${awards_html}
                <br>
                ${media_html}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" data-dismiss="modal" aria-label="Close">Close</button>
            </div>
        </div>
    </div>
    </div>
    `

    return item;
}
