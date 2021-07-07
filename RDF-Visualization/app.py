from flask import Flask, render_template
from SPARQLWrapper import SPARQLWrapper, JSON , XML, N3, RDF, CSV, TSV, RDFXML
import os
import rdflib.graph as g
from rdflib.extras.external_graph_libs import rdflib_to_networkx_graph
from pyvis.network import Network
import requests
from qanary_helpers import qanary_queries
app = Flask('testapp')

#Get question from https://dbpediachatbot.herokuapp.com/question

question = requests.get("https://dbpediachatbot.herokuapp.com/question").content

#Get Graphid
r = requests.post('https://webengineering.ins.hs-anhalt.de:43740/startquestionansweringwithtextquestion',
             params={
                     "question": question,
                     "componentlist[]": ["NED-DBpediaSpotlight",
                     "QueryBuilderSimpleRealNameOfSuperHero",
                     "SparqlExecuter",
                     "OpenTapiocaNED",
                     "BirthDataQueryBuilder",
                     "WikidataQueryExecuter"]
})
res = r.json()
graphid = res['inGraph']



#read data
sparql = SPARQLWrapper("https://webengineering.ins.hs-anhalt.de:40159/qanary/query")
sparql.setCredentials("admin", "admin")
sparql_query = """ 
DESCRIBE *
FROM <""" + graphid  + """>
WHERE {
    ?s a qa:AnnotationOfAnswerSPARQL.
    ?s oa:hasBody ?sparqlQueryOnDBpedia .
    ?s oa:annotatedBy ?annotatingService .
    ?s oa:annotatedAt ?time .
}

"""
sparql.setQuery(sparql_query)
sparql.setReturnFormat(XML)
sparql.setMethod("POST")
results = sparql.query().convert()
print(results)

#rdflib to network graph
rg = results
G = rdflib_to_networkx_graph(rg)
print("networkx Graph loaded successfully with length {}".format(len(G)))


#visualization 
def generatehtmlpage():
    net = Network(height="750px", width="100%")
    net.from_nx(G)
    net.show_buttons(filter_=['physics'])
    net.force_atlas_2based(gravity=-90,spring_length = 175, central_gravity = 0)
    save = net.show("example.html")
    return save


@app.route('/')
def index(): 
    return render_template('/example.html', variable=generatehtmlpage())

if __name__ == '__main__':
    #port = int(os.environ.get("PORT", 5000))
    #app.run(host='0.0.0.0', port=port)
    app.run()