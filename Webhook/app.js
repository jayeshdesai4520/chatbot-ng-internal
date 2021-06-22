const express = require('express')
const axios = require('axios');
const {WebhookClient} = require('dialogflow-fulfillment')
const app = express()
app.use(express.json())
app.get('/', (req, res) => {
    res.send("ok Server Is Working......")
})

var kbquestion

/**
* on this route dialogflow send the webhook request
* For the dialogflow we need POST Route.
* */
app.post('/webhook', (request, response) => {
    // get agent from request
    let agent = new WebhookClient({request: request, response: response})
    // create intentMap for handle intent
    let intentMap = new Map();
    kbquestion = request.body.queryResult.queryText
    // add intent map 2nd parameter pass function
    intentMap.set('webhook_test_intent',weatherIntent)
    intentMap.set('Show component list Intent',Active_components_Intent)
    intentMap.set('Reset list of components Intent',Reset_components_list_Intent)
    intentMap.set('Deactivate component Intent',Deactivate_component_Intent)
    intentMap.set('Activate component Intent',Activate_component_Intent)
    intentMap.set('Default Fallback Intent', fallback);
    // now agent is handle request and pass intent map
    agent.handleRequest(intentMap)
})

var activecomponents = [NED-DBpediaSpotlight,QueryBuilderSimpleRealNameOfSuperHero,SparqlExecuter,OpenTapiocaNED,BirthDataQueryBuilder,WikidataQueryExecuter];
  

function Active_components_Intent(agent){ 
    if (activecomponents.length === 0){
        agent.add("currently, there are no active components")     
    } else {
        agent.add("currently, active components are " + activecomponents) 
    }
}


function Reset_components_list_Intent(agent){ 
        activecomponents = []
        agent.add("Components list are now empty")  
        console.log(activecomponents)   
}


function Deactivate_component_Intent(agent){ 
        const deactivate = agent.parameters.componentname; 
        activecomponents.pop(deactivate); 
        agent.add("succesfully removed " + deactivate + " from components list")        
}


function Activate_component_Intent(agent){ 
        //agent.add("To add the components in order you can say Add and then name of the components")
        const activate = agent.parameters.activatecomponent; 
        activecomponents.push(activate); 
        agent.add("succesfully Added " + activate + " you can add more components by saying Add and then name of the component")       
}

var query  = 'What is the real name of Batman?'
function fallback(agent){          
        agent.add(kbquestion) 
        axios.post('https://webengineering.ins.hs-anhalt.de:43740/gerbil-execute/NED-DBpediaSpotlight,QueryBuilderSimpleRealNameOfSuperHero,SparqlExecuter,OpenTapiocaNED,BirthDataQueryBuilder,WikidataQueryExecuter', {
            query
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });            
}


/**
* now listing the server on port number 3000 :)
* */
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running on port 3000")
})