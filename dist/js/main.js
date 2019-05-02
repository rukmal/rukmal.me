var url = 'https://raw.githubusercontent.com/rukmal/Resume/gh-pages/personal_data.rdf';
var store = $rdf.graph();
$.get(url, function (data) {
    console.log(typeof (data));
    var mimeType = 'RDF/XML';
    // $rdf.parse(data, store, 'http://precis.rukmal.me/', mimeType);
    // NOTE: This works, just need to use Turtle serialization instead of RDF/XML.
    // Fuck you, rdflibjs
});
