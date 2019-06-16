function buildOptionalExtResElem(elem, iri) {
    if (elem[relIRI(iri)]['?obj_ext_res']) {
        return `<span class="descr_emph" rel="popover" data-dbpedia="${elem[relIRI(iri)]['?obj_ext_res'].value}">${elem[relIRI(iri)]['?obj_name'].value}</span>`
    } else {
        return elem[relIRI(iri)]['?obj_name'].value
    }
}

function layoutEducation(elem, elem_id) {
    var item = `
    <div class="precis_element container">
    <div id=${elem_id} class="row">
        <div class="col-sm-8 element_content_container">
            <div class="elem_secondary">
                ${buildOptionalExtResElem(elem, 'degreeUniversity')}
            </div>
            <div class="elem_third">
            ${buildOptionalExtResElem(elem, 'degreeSchool')}
            </div>
            <div class="elem_name">${elem[relIRI('hasName')]['?obj'].value}</div>
            <div class="elem_fourth">
                ${buildOptionalExtResElem(elem, 'degreeDepartment')}
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
