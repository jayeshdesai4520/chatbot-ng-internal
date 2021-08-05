const variable = require('./app');
const fuzzySet = require('fuzzyset') 
const axios = require('axios');
const {WebhookClient,Card,Suggestion,Payload,Platforms} = require('dialogflow-fulfillment')
const defaultComponents = ['NED-DBpediaSpotlight', 'QueryBuilderSimpleRealNameOfSuperHero', 'SparqlExecuter', 'OpenTapiocaNED', 'BirthDataQueryBuilder', 'WikidataQueryExecuter'];
const welcomeMessageData = ['Hi! I am the DBpedia bot, How are you doing?','Hello! I am the DBpedia bot,  How can I help you?','Greetings! I am the DBpedia bot,  How can I assist?','Good day! I am the DBpedia bot,  What can I do for you today?']
const coronabotProfile = ['coronabot-answer-generation','coronabot-data-acquisition']
let sessionIdManagement = new Map() 
let askQanaryCount = new Map() 
let profiles = new Map() 
a = fuzzySet();


function welcomeIntent(agent) {
        if(!sessionIdManagement.has(variable.sessionId)){
            sessionIdManagement.set(variable.sessionId,defaultComponents)
            askQanaryCount.set(variable.sessionId,0)
        }
        const welcomeMessageArr = welcomeMessageData;
        const textindex = Math.floor(Math.random() * welcomeMessageArr.length);
        const output = welcomeMessageArr[textindex]; 
        agent.add(output)
        console.log(sessionIdManagement) 
}

function activeComponentsIntent(agent) {
    if (!sessionIdManagement.has(variable.sessionId)) {
        agent.add('Currently, there are no active components.')
    }else{
        agent.add('Currently, active components are ' + sessionIdManagement.get(variable.sessionId))
    } 
    console.log(sessionIdManagement)
}

function resetComponentsListIntent(agent) {
    sessionIdManagement.set(variable.sessionId, "")
    sessionIdManagement.set(variable.sessionId,defaultComponents)
    agent.add('Reset Successfully, Components list are now empty.') 
    console.log(sessionIdManagement)
}

function deactivateComponentIntent(agent) {
    const deactivate = agent.parameters.componentname;  
    let deleteComponent = sessionIdManagement.get(variable.sessionId)
    let fuzzy = variable.compare(a)  
    let deactivateResult = a.get(deactivate);
    if (deactivateResult == null){
        agent.add(deactivate + ' not available to know more about active components use command \'list of active qanary components\'.')
    }else{
        let deactivateComponent = deactivateResult[0][1]     
        let finalComponentAdd = deactivateComponent.replace(/['"]+/g, '') 
        console.log(finalComponentAdd) 
        let duplicateArray = sessionIdManagement.get(variable.sessionId)
        let n = duplicateArray.includes(finalComponentAdd)
        console.log(n)
        if(n == false){
            agent.add(finalComponentAdd + ' do not exists in the list of active components to know more about active components use command \'list of active components\'.')
        }else{
            deleteComponent = deleteComponent.toString().replace("," + finalComponentAdd, "")
            sessionIdManagement.set(variable.sessionId,deleteComponent) 
            agent.add("Successfully removed " + deactivateComponent + " from components list.")
            console.log(sessionIdManagement)
        }  
    }
}

function activateComponentIntent(agent) {
    let activate = agent.parameters.activatecomponent; 
    let activateComponent = JSON.stringify(activate)
    let fuzzy = variable.compare(a) 
    //console.log(fuzzy.values())
    let compareResult = a.get(activateComponent);
    if (compareResult == null){
        agent.add(activateComponent + ' not available to know more about active components use command \'list of active qanary components\'.')
    }else{  
        let addComponent = compareResult[0][1] 
        let finalComponentAdd = addComponent.replace(/['"]+/g, '') 
        let duplicateArray = sessionIdManagement.get(variable.sessionId)
        console.log(typeof(duplicateArray))
        console.log(duplicateArray)
        console.log(duplicateArray[0])
        let n = duplicateArray.includes(finalComponentAdd);  
        if(n == true){
            agent.add(finalComponentAdd + ' already exists in the list to know more about active components use command \'list of active qanary components\'.')
        }else{
            if(finalComponentAdd == duplicateArray[0]){
                console.log("yes it is first")
            }
            sessionIdManagement.set(variable.sessionId, sessionIdManagement.get(variable.sessionId) + ',' +  finalComponentAdd)
            agent.add('Successfully Added ' + finalComponentAdd + ' you can add more components by saying Add and then name of the component.')
            console.log(sessionIdManagement)
        }
    }
}

function activeQanaryIntent(agent) { 
    if (askQanaryCount.get(variable.sessionId) == 25){
         agent.add('Limit reached! You can ask again after 5 minutes.')
         setTimeout(function(){  
            askQanaryCount.set(variable.sessionId,0)
            console.log('reset done')
         }, 300000)
    }else{
         let fuzzy = variable.compare(a)   
         askQanaryCount.set(variable.sessionId, askQanaryCount.get(variable.sessionId) + 1) 
         agent.add('Total Active components are ' + fuzzy.length() + ' and components are ' + fuzzy.values() )  
         console.log(askQanaryCount.get(variable.sessionId))
    }
}

function activateProfileIntent(agent) {
    let profile = agent.parameters.profilename;
    if(profile == 'coronabot'){
        let finalComponentAdd = 'coronabot-answer-generation'
        let duplicateArray = sessionIdManagement.get(variable.sessionId)
        let n = duplicateArray.includes(finalComponentAdd); 
        if(n == true){
            agent.add('This profile already exists in the list to know more about active components use command \'list of active qanary components\'.')
        }else{
            sessionIdManagement.set(variable.sessionId, sessionIdManagement.get(variable.sessionId) + ',' +  coronabotProfile)
            agent.add(profile + ' Profile added successfully') 
        } 
    }else{
        agent.add(profile + ' Profile not defined by admin or by you.')   
    }
    console.log(sessionIdManagement.get(variable.sessionId))  
}

function componentStartwithIntent(agent) {
    let startWithName = agent.parameters.startwith; 
    let fuzzy = variable.compare(a) 
    let startWithCompare = fuzzy.values()
    let filteredList = startWithCompare.map(s => s.slice(1)); 
    let newfilteredList = filteredList.map(u => u.slice(0, -1)); 
    let startsWith = newfilteredList.filter((componentName) => componentName[0]===startWithName.toUpperCase())
    console.log(startsWith)  
    if(startsWith.length === 0){
        agent.add('Component name starting with ' + startWithName + ' are not available.') 
    }else{
        const str = startsWith.toString();
        agent.add('Components starting with ' + startWithName + ' are ' + str)  
    } 
}

function show_RdfgraphIntent(agent) { 
    return axios.get('https://rdfgraphvisualizations.herokuapp.com/updategraphvalue')
    .then(function (response) { 
        let graphId = response.data
        console.log(graphId)
        let outputLink = 'Go to this link to see RDF Visualization - https://rdfgraphvisualizations.herokuapp.com/visualize/' + graphId
        agent.add(outputLink) 
        //agent.add(new Card({
        //title: `RDF Graph Visualization`,
         //buttonText: 'open website',
         //buttonUrl: 'https://rdfgraphvisualizations.herokuapp.com/visualize/' + graphId
           //})
        // )    
    }).catch(function(error) {
            console.log(error)
            agent.add('No visualization could be loaded. Try again? or you can ask for help!')
        });
}

//Profile related Intents

function createProfileIntent(agent) {  
    let profileName = agent.parameters.newprofilename;
    if(profiles.has(variable.sessionId + profileName)){
        agent.add(profileName + ' Profile already exists.'); 
    }else{ 
        profiles.set(variable.sessionId + profileName,"") 
        console.log(profiles)
        agent.add(profileName + ' Profile added successfully. Now to use this profile you can say start ' + profileName + ' to activate the profile.');      
    }
}

function addComponentsToProfile(agent) {  
    let profileName = agent.parameters.profilename;
    if(profiles.has(variable.sessionId + profileName)){
    let componentName = agent.parameters.newcomponentname;
    let fuzzy = variable.compare(a)  
    let checkComponents = a.get(componentName);
    if (checkComponents == null){
        agent.add(componentName + ' not available to know more about active components use command \'list of active qanary components\'.')
    }else{
        let addComponents = checkComponents[0][1]     
        let finalComponentAdd = addComponents.replace(/['"]+/g, '') 
        console.log(finalComponentAdd)
        profiles.set(variable.sessionId + profileName, profiles.get(variable.sessionId + profileName) + ',' +  finalComponentAdd)
        agent.add('Successfully Added ' + finalComponentAdd + ' to ' + profileName + ' you can add more components by saying Add and then name of the component.')
        console.log(profiles)
    } 
    }else{
         agent.add(profileName + ' does not exists, to create new profile you can say \'create profile and then profile name\' like create profile country')
    }
}

function removeComponentFromProfile(agent) { 
    let profileName = agent.parameters.profilename;
    let componentName = agent.parameters.newcomponentname;
    if(profiles.has(variable.sessionId + profileName)){
    let fuzzy = variable.compare(a)
    let checkComponents = a.get(componentName); 
    if (checkComponents == null){
        agent.add(componentName + ' not available to know more about active components use command \'list of active qanary components\'.')
    }else{     
        let deleteComponent = profiles.get(variable.sessionId + profileName)
        let removeComponents = checkComponents[0][1] 
        let finalComponentRemove = removeComponents.replace(/['"]+/g, '') 
        console.log(deleteComponent)  
        let duplicateArray = profiles.get(variable.sessionId + profileName)
        console.log(duplicateArray)
        let n = deleteComponent.includes(finalComponentRemove)
        if(n == false){
            agent.add(finalComponentRemove + ' not available in list to know more about ' + profileName  + ' components use command \'show components of \'' + profileName)
        }else{
            deleteComponent = deleteComponent.toString().replace("," + finalComponentRemove, "")
            profiles.set(variable.sessionId + profileName,deleteComponent) 
            agent.add("Successfully removed " + finalComponentRemove + " from components list of " +  profileName)
            console.log(profiles)
        }   
    }
    }else{
        agent.add(profileName + ' does not exists, to create new profile you can say \'create profile and then profile name\' like create profile country')
    }
}


function componentInformationFromProfile(agent) {  
    let profileName = agent.parameters.profilename;
    if(profiles.has(variable.sessionId + profileName)){
        if(profiles.get(variable.sessionId + profileName) == ""){
            agent.add(profileName + ' list is empty.') 
        }else{
            agent.add(profileName +  ' contains ' + profiles.get(variable.sessionId + profileName));  
        }
    }else{
       agent.add(profileName + ' does not exists, to create new profile you can say \'create profile and then profile name\' like create profile country') 
     }
}
//End

function fallBack(agent) {
    console.log(variable.kbQuestion)
    return axios.post('https://webengineering.ins.hs-anhalt.de:43740/gerbil-execute/' + sessionIdManagement.get(variable.sessionId)  + '?query=' + variable.kbQuestion, {
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
            let resultObj = JSON.parse(result);
            let myValue = resultObj["question"]["answers"];
            let infoList = JSON.parse(myValue);
            let infoOne = infoList["head"]["vars"][0]
            let infoTwo = infoList["head"]["vars"][1]
            let infoThree = infoList["head"]["vars"][2]
            let answerInfo = infoList["results"]["bindings"]
            let answerOne = answerInfo[0][infoOne]["value"]
            let answerTwo = answerInfo[0][infoTwo]["value"]
            let answerThree = answerInfo[0][infoThree]["value"]
            let output = infoOne + ':' + answerOne + ' ' + infoTwo + ':' + answerTwo + ' ' + infoThree + ':' + answerThree
            //console.log(response)
            agent.add(output) 

        }).catch(function(error) {
            console.log(error)
            agent.add('No answer could be loaded. Try again? or you can ask for help!')
        });
}


function payloadTest(agent) {  
    agent.add(variable.sessionId) 
}


module.exports = { payloadTest,welcomeIntent,activeComponentsIntent,resetComponentsListIntent,deactivateComponentIntent,activateComponentIntent,activeQanaryIntent,activateProfileIntent,componentStartwithIntent,show_RdfgraphIntent,createProfileIntent,addComponentsToProfile,removeComponentFromProfile,componentInformationFromProfile,fallBack  };