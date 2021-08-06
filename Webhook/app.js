const express = require('express')
const axios = require('axios');
const {WebhookClient} = require('dialogflow-fulfillment')
const fuzzySet = require('fuzzyset')
const intent = require("./intent")    
let intentMap = new Map(); 
const app = express()
app.use(express.json())
a = fuzzySet();

intentMap.set('Default Welcome Intent', intent.welcomeIntent)
intentMap.set('DBpedia Info Intent', intent.dbpediaInfoIntent)
intentMap.set('DBpedia contribute Intent', intent.dbpediaContributeIntent)
intentMap.set('Show component list Intent', intent.activeComponentsIntent)
intentMap.set('Reset list of components Intent', intent.resetComponentsListIntent)
intentMap.set('Deactivate component Intent', intent.deactivateComponentIntent)
intentMap.set('Activate component Intent', intent.activateComponentIntent) 
intentMap.set('Active Qanary components', intent.activeQanaryIntent) 
intentMap.set('Activate profile component', intent.activateProfileIntent) 
intentMap.set('Component startwith intent', intent.componentStartwithIntent) 
intentMap.set('show rdf visualization', intent.show_RdfgraphIntent) 
intentMap.set('Create profile intent', intent.createProfileIntent) 
intentMap.set('Add components to profile', intent.addComponentsToProfile) 
intentMap.set('Remove component from profile', intent.removeComponentFromProfile) 
intentMap.set('Component information from profile', intent.componentInformationFromProfile) 
intentMap.set('Help Intent', intent.helpIntent)
intentMap.set('Default Fallback Intent', intent.fallBack);

app.post('/webhook', (request, response) => {    
    // get agent from request
    let agent = new WebhookClient({
        request: request,
        response: response
    })  
    let sessionId = request.body.session.split('/')[4] 
    if(request.body.queryResult.intent.displayName == 'Default Fallback Intent'){
    let kbQuestion = request.body.queryResult.queryText
    module.exports.kbQuestion = kbQuestion; 
    }   
    module.exports.sessionId = sessionId; 
    agent.handleRequest(intentMap)

}) 

app.get('/graphId', (req, res) => { 
    console.log(intent.graphId)  
    res.send(intent.graphId)  
})
 
function myFunction() {
  
  setInterval(function(){ 
    axios.get('https://webengineering.ins.hs-anhalt.de:43740/components')
    .then(function (response) {
        let body = response.data 
        global.a 
        for (var i = 0; i < body.length; i++){   
          a.add(JSON.stringify(body[i]['name']))
         }    
        compare(a) 
        console.log('15 seconds done')
   }) }, 15000);
}


async function initialUpdate(){
    await axios.get('https://webengineering.ins.hs-anhalt.de:43740/components')
    .then(function (response) {
        let body = response.data 
        global.a 
        for (var i = 0; i < body.length; i++){   
          a.add(JSON.stringify(body[i]['name']))
         }    
        compare(a) 
        console.log('Initial Update Done')
   })  
   app.listen(process.env.PORT || 3000, () => {
    myFunction() 
    console.log('Server is Running on port 3000')
   })
}



function compare(a) {  
    global.a   
    return a
}  

initialUpdate()

module.exports.compare = compare; 


