# http://rukmal.me Source Code

## How does this work?
This website is powered by the <a href="https://precis.rukmal.me/ontology">Precis Ontology</a> for modeling personal professional metadata, which is a part of the greater <a href="https://precis.rukmal.me">Precis Toolkit</a>. The website is statically served using <a href="https://pages.github.com/">GitHub Pages</a>.

With the exception of the <a href="https://rukmal.me/">homepage</a> and the <a href="https://rukmal.me/contact">contact</a> page, all pages are generated at runtime on the client side. This operation is performed by loading a copy of my <a href="https://github.com/rukmal/Resume/blob/gh-pages/personal_data.rdf">personal Precis ontology</a> on the client side, and extracting information from the graph using <a href="https://www.w3.org/TR/sparql11-overview/"><span rel="popover" data-dbpedia="http://dbpedia.org/resource/SPARQL">SPARQL</span></a>.

The <span rel="popover" data-dbpedia="http://dbpedia.org/resource/SPARQL">SPARQL</span> queries used for this purpose are consolidated in a single <span rel="popover" data-dbpedia="http://dbpedia.org/resource/JavaScript">JavaScript</span> module, and are available <a href="https://github.com/rukmal/rukmal.me/blob/gh-pages/dist/js/graph_manager.js">from the project repository</a>. Additionally, the <span rel="popover" data-dbpedia="http://dbpedia.org/resource/JavaScript">JavaScript</span> module handling page layouts is also <a href="https://github.com/rukmal/rukmal.me/blob/gh-pages/dist/js/layouts.js">available here</a>.

Certain nodes in the graph are linked to external <span rel="popover" data-dbpedia="http://dbpedia.org/resource/Ontology_(information_science)">Knowledge Graph</span> entities from <a href="https://wiki.dbpedia.org/"><span rel="popover" data-dbpedia="http://dbpedia.org/resource/DBpedia">DBpedia</span></a>. When an object with an associated <span rel="popover" data-dbpedia="http://dbpedia.org/resource/DBpedia">DBpedia</span> entity is moused over, a popover is displayed with information from that entity's <span rel="popover" data-dbpedia="http://dbpedia.org/resource/DBpedia">DBpedia</span> resource.

As with the core page layout process, this operation is also enabled by <span rel="popover" data-dbpedia="http://dbpedia.org/resource/SPARQL">SPARQL</span> queries to the <a href="https://wiki.dbpedia.org/OnlineAccess">DBpedia SPARQL server</a>, with results added to the page dynamically on the client side. The source code used for this operation is available <a href="https://github.com/rukmal/rukmal.me/blob/gh-pages/dist/js/global_handlers.js">here</a>.
