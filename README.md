
### Folder Structure

    ├── Dialogflow-Agent        # chatbot code
    ├── Zip File                # import zip file in dialogflow
    ├── Webhook code            # heroku Webhook code
    ├── RDF-Visualization       # visualization code
    
    
## Getting Started

List of some main intents

template -
example command
intent name
outcome

We need to provide to the users 3 classes of interactions / intents:

basic information:

hello:
[Default Welcome Intent]
Greetings! I am the DBpedia bot, How can I assist?

what can I do:
[Help_Intent]
Currently, You can ask me about what is DBpedia? or how to contribute to DBpedia?

what is DBpedia:
[DBpedia_Info]
DBpedia is a crowd-sourced community effort to extract structured information from Wikipedia and make this information available on the Web.

how to contribute:
[DBpedia_Contribute]
There are multiple ways to contribute to DBpedia You can: 1 - Look at open issues if you want to contribute to the codebase 2 - Improve Documentation 3 - Join the discussion on upcoming features, releases, and issues

configuration and internal information:

(de-)activate components (this status needs to be stored):

Add sparql executer:
[Activate_component_intent]
succesfully Added SparqlExecuter you can add more components by saying Add and then name of the component.

Remove sparql executer:
[Deactivate_component_intent]
succesfully removed SparqlExecuter from components list

get information about the current Qanary pipeline configuration:

tell me an order of components list:
[show_component_list]
currently, active components are SparqlExecuter,QueryBuilder

ask a KB-related question (handed via Webhook to the Qanary backend) - not done

additional intent added

remove all the components from list:
[reset_list_of_components]
Components list are now empty


### Demo 
Check out new live link demo here it also supports Suggestion chip response [Link](https://tacoaccounttest.github.io/)



    
