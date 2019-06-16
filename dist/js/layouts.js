function layoutEducation(elem, elem_id) {
    var item = `
    <div id=${elem_id}>
        <div class="elem_name">${elem[relIRI('hasName')]['?obj'].value}</div>
        <div class="deg_department">
            <span class="descr_emph" rel="popover" data-dbpedia="${(elem[relIRI('degreeDepartment')]['?obj_ext_res']) ? elem[relIRI('degreeDepartment')]['?obj_ext_res'].value : ''}">${elem[relIRI('degreeDepartment')]['?obj_name'].value}</span>
        </div>
        <div class="deg_school">
        <span class="descr_emph" rel="popover" data-dbpedia="${(elem[relIRI('degreeSchool')]['?obj_ext_res']) ? elem[relIRI('degreeSchool')]['?obj_ext_res'].value : ''}">${elem[relIRI('degreeSchool')]['?obj_name'].value}</span>
    </div>
    </div>
    `

    return item;

}
