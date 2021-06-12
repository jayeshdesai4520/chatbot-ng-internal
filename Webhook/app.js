const axios = require('axios');
const express = require('express')
const {WebhookClient} = require('dialogflow-fulfillment')
const app = express()
app.use(express.json())
app.get('/', (req, res) => {
    res.send("Server Is Working......")
})
/**
* on this route dialogflow send the webhook request
* For the dialogflow we need POST Route.
* */
app.post('/webhook', (req, res) => {
    // get agent from request
    let agent = new WebhookClient({request: req, response: res})
    // create intentMap for handle intent
    let intentMap = new Map();
    // add intent map 2nd parameter pass function 
    intentMap.set('weather',weatherIntent)
    // now agent is handle request and pass intent map
    agent.handleRequest(intentMap)
})

 
 
function weatherIntent(agent){ 
    const apiKey = "23756992e06787aa9225e9b361dfcd66"
    const city = agent.parameters.city; 
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
    return axios.get(url)
      .then(function (response) {
        // handle success
        console.log(response.data.main.temp); 
        agent.add("Temp in " + city +  " is " + response.data.main.temp)
        
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
}

/**
* now listing the server on port number 3000 :)
* */
app.listen(3000, () => {
    console.log("Server is Running on port 3000")
})