const express = require('express')
const axios = require('axios');
const {
    WebhookClient
} = require('dialogflow-fulfillment')
const app = express()
app.use(express.json())
app.get('/', (req, res) => {
    res.send("ok Server Is Working......")
})

var session 
var kbquestion
var body 
var defaultcomponents = ["NED-DBpediaSpotlight", "QueryBuilderSimpleRealNameOfSuperHero", "SparqlExecuter", "OpenTapiocaNED", "BirthDataQueryBuilder", "WikidataQueryExecuter"];
var NED_Default = ["NED-DBpediaSpotlight"]
var NER_Default = ["NER-DBpediaSpotlight"]
var Querybuilder_Default = ["QueryBuilder"]
var Queryexecuter_Default = ["SparqlExecuter"]


let sessionidmanagement = new Map()
/**
 * on this route dialogflow send the webhook request
 * For the dialogflow we need POST Route.
 * */
app.post('/webhook', (request, response) => {
    // get agent from request
    let agent = new WebhookClient({
        request: request,
        response: response
    })
    // create intentMap for handle intent
    let intentMap = new Map();
    body = request.body
    session = request.body.session.split('/')[4]
    kbquestion = request.body.queryResult.queryText
    // add intent map 2nd parameter pass function 
    intentMap.set('Default Welcome Intent', Welcome_Intent)
    intentMap.set('Show component list Intent', Active_components_Intent)
    intentMap.set('Reset list of components Intent', Reset_components_list_Intent)
    intentMap.set('Deactivate component Intent', Deactivate_component_Intent)
    intentMap.set('Activate component Intent', Activate_component_Intent)
    intentMap.set('Default Fallback Intent', fallback);
    //now agent is handle request and pass intent map
    agent.handleRequest(intentMap)
})


app.get('/question', (req, res) => {
    res.send(kbquestion)
})



const welcome_message_data = ['Hi! I am the DBpedia bot, How are you doing?','Hello! I am the DBpedia bot,  How can I help you?','Greetings! I am the DBpedia bot,  How can I assist?','Good day! I am the DBpedia bot,  What can I do for you today?']

function Welcome_Intent(agent) {
        if(!sessionidmanagement.has(session)){
        sessionidmanagement.set(session,defaultcomponents)
        }
        const welcomeMessageArr = welcome_message_data;
        const textindex = Math.floor(Math.random() * welcomeMessageArr.length);
        const out = welcomeMessageArr[textindex];
        const speechOutput =  out; 
        agent.add(speechOutput)
        console.log(sessionidmanagement) 
}


//name saved components
function Active_components_Intent(agent) {
    if (!sessionidmanagement.has(session)) {
        agent.add("currently, there are no active components")
    } else {
        agent.add("currently, active components are " + sessionidmanagement.get(session))
    } 
    console.log(sessionidmanagement)
}


function Reset_components_list_Intent(agent) {
    sessionidmanagement.clear()
    agent.add("Components list are now empty") 
    console.log(sessionidmanagement)
}


function Deactivate_component_Intent(agent) {
    const deactivate = agent.parameters.componentname; 
    deletecomponent = sessionidmanagement.get(session)
    deletecomponent = deletecomponent.replace("," + deactivate, "")
    sessionidmanagement.set(session,deletecomponent) 
    agent.add("succesfully removed " + deactivate + " from components list")
    console.log(sessionidmanagement)
}


function Activate_component_Intent(agent) {
    //agent.add("To add the components in order you can say Add and then name of the components")
    var activate = agent.parameters.activatecomponent; 
    sessionidmanagement.set(session, sessionidmanagement.get(session) + "," +  activate)
    agent.add("succesfully Added " + activate + " you can add more components by saying Add and then name of the component")
    console.log(sessionidmanagement)
}



function fallback(agent) {


    return axios.post('https://webengineering.ins.hs-anhalt.de:43740/gerbil-execute/' + sessionidmanagement.get(session)  + '?query=' + kbquestion, {
            headers: {
                'content-type': 'text/plain'
            }
        })
        .then(function(response) {
            let body = response.data.questions
            let status = response.status
            result = JSON.stringify(body[0])
            result = result.replace(/(^\[)/, '');
            result = result.replace(/(\]$)/, '');
            var resultObj = JSON.parse(result);
            var my_value = resultObj["question"]["answers"];
            var infolist = JSON.parse(my_value);
            var infoone = infolist["head"]["vars"][0]
            var infotwo = infolist["head"]["vars"][1]
            var infothree = infolist["head"]["vars"][2]
            var answerinfo = infolist["results"]["bindings"]
            var answerone = answerinfo[0][infoone]["value"]
            var answertwo = answerinfo[0][infotwo]["value"]
            var answerthree = answerinfo[0][infothree]["value"]
            var output = infoone + ":" + answerone + " " + infotwo + ":" + answertwo + " " + infothree + ":" + answerthree
            //console.log(response)
            agent.add(output) 

        }).catch(function(error) {
            console.log(error)
            agent.add("No answer could be loaded. Try again? or you can ask for help!")
        });
}


/**
 * now listing the server on port number 3000 :)
 * */
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running on port 3000")
})