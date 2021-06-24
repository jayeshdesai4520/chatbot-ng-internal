
### Folder Structure

    ├── Dialogflow-Agent        # chatbot code
    ├── Zip File                # import zip file in dialogflow
    ├── Webhook code            # heroku Webhook code
    ├── RDF-Visualization       # visualization code
    
    
## Getting Started

### List of some main intents

Template - <br>
Example command <br>
Intent name <br>
Outcome <br>

#### Basic information: <br>

hello: <br>
[Default Welcome Intent] <br>
Greetings! I am the DBpedia bot, How can I assist? <br>

what can I do: <br>
[Help_Intent] <br>
Currently, You can ask me about what is DBpedia? or how to contribute to DBpedia? <br>

what is DBpedia: <br>
[DBpedia_Info] <br>
DBpedia is a crowd-sourced community effort to extract structured information from Wikipedia and make this information available on the Web. <br>

how to contribute: <br>
[DBpedia_Contribute] <br>
There are multiple ways to contribute to DBpedia You can: 1 - Look at open issues if you want to contribute to the codebase 2 - Improve Documentation 3 - Join the discussion on upcoming features, releases, and issues <br>

#### Configuration and internal information: <br>

##### (de-)activate components (this status needs to be stored): <br>

Add sparql executer: <br>
[Activate_component_intent] <br>
succesfully Added SparqlExecuter you can add more components by saying Add and then name of the component. <br>

Remove sparql executer: <br>
[Deactivate_component_intent] <br>
succesfully removed SparqlExecuter from components list <br>
  
##### Get information about the current Qanary pipeline configuration: <br>

tell me an order of components list: <br>
[show_component_list] <br>
currently, active components are SparqlExecuter,QueryBuilder <br>

#### Ask a KB-related question (handed via Webhook to the Qanary backend) - currently doing <br>

#### Additional intent added <br>

remove all the components from list: <br>
[reset_list_of_components] <br>
Components list are now empty <br>


### Demo 
Check out new live link demo here it also supports Suggestion chip response [Link](https://tacoaccounttest.github.io/)



    
