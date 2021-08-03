from flask import *  
import os 
from rdflib.extras.external_graph_libs import rdflib_to_networkx_graph
from pyvis.network import Network 
from SPARQLWrapper import SPARQLWrapper, JSON , XML, N3, RDF, CSV, TSV, RDFXML 
import requests 
app = Flask('testapp')
app.config['TEMPLATES_AUTO_RELOAD'] = True
global graph_id 

@app.route('/updategraphvalue')
def generate_graph_id():
    global graph_id   
    get_question = requests.get("https://dbpediachatbot.herokuapp.com/question").content
    question = get_question.decode("utf-8")  
    get_graph_id = requests.post('https://webengineering.ins.hs-anhalt.de:43740/startquestionansweringwithtextquestion',
            params={
                    "question": question,
                    "componentlist[]": ["NED-DBpediaSpotlight",
                    "QueryBuilderSimpleRealNameOfSuperHero",
                    "SparqlExecuter",
                    "OpenTapiocaNED",
                    "BirthDataQueryBuilder",
                    "WikidataQueryExecuter"]
    })
    res_json = get_graph_id.json()   
    graph_id = res_json['inGraph'] 
    return graph_id

@app.route('/showgraph')
def show_graph(): 
    global graph_id   
    sparql_database = SPARQLWrapper("https://webengineering.ins.hs-anhalt.de:40159/qanary/query")
    sparql_database.setCredentials("admin", "admin")
    sparql_query = """ 
    DESCRIBE *
    FROM <""" + graph_id  + """>
    WHERE {
            ?s a qa:AnnotationOfAnswerSPARQL.
            ?s oa:hasBody ?sparqlQueryOnDBpedia .
            ?s oa:annotatedBy ?annotatingService .
            ?s oa:annotatedAt ?time .
        }
        """  
    sparql_database.setQuery(sparql_query)
    sparql_database.setReturnFormat(XML)
    sparql_database.setMethod("POST")
    results = sparql_database.query().convert()  
    networkx_graph = rdflib_to_networkx_graph(results) 
    net = Network(height="750px", width="100%")
    net.from_nx(networkx_graph)
    net.show_buttons(filter_=['physics'])
    net.force_atlas_2based(gravity=-90,spring_length = 175, central_gravity = 0) 
    save = net.show("templates/index.html")
    return render_template('index.html')


@app.route('/visualize/<name>')  
def user(name):  
    global graph_id
    if name == graph_id:
        return redirect(url_for('show_graph')) 
    else:
        error_page = "Visualization Page not found Try Again... graph_id invalid"
        return error_page

@app.route('/visualize/example')
def html_page():  
    get_graph_id = requests.post('https://webengineering.ins.hs-anhalt.de:43740/startquestionansweringwithtextquestion',
            params={
                    "question": "What is the real name of hulk?",
                    "componentlist[]": ["NED-DBpediaSpotlight",
                    "QueryBuilderSimpleRealNameOfSuperHero",
                    "SparqlExecuter",
                    "OpenTapiocaNED",
                    "BirthDataQueryBuilder",
                    "WikidataQueryExecuter"]
    })
    res_json = get_graph_id.json()   
    graph_id_test = res_json['inGraph'] 
    sparql_database = SPARQLWrapper("https://webengineering.ins.hs-anhalt.de:40159/qanary/query")
    sparql_database.setCredentials("admin", "admin")
    sparql_query = """ 
    DESCRIBE *
    FROM <""" + graph_id_test  + """>
    WHERE {
            ?s a qa:AnnotationOfAnswerSPARQL.
            ?s oa:hasBody ?sparqlQueryOnDBpedia .
            ?s oa:annotatedBy ?annotatingService .
            ?s oa:annotatedAt ?time .
        }
        """  
    sparql_database.setQuery(sparql_query)
    sparql_database.setReturnFormat(XML)
    sparql_database.setMethod("POST")
    results = sparql_database.query().convert()  
    networkx_graph = rdflib_to_networkx_graph(results) 
    net = Network(height="750px", width="100%")
    net.from_nx(networkx_graph)
    net.show_buttons(filter_=['physics'])
    net.force_atlas_2based(gravity=-90,spring_length = 175, central_gravity = 0) 
    save = net.show("templates/exampleviz.html")
    return render_template('/exampleviz.html')


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
    app.run()