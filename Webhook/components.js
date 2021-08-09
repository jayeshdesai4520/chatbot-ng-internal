const fuzzySet = require('fuzzyset')
const axios = require('axios');
let qanaryComponents = fuzzySet(); 

async function getComponents(){
      const response = await axios.get('https://webengineering.ins.hs-anhalt.de:43740/components')
      const body = response.data 
      const newQanaryComponents = fuzzySet() 
      for (var i = 0; i < body.length; i++){   
        newQanaryComponents.add(JSON.stringify(body[i]['name']))
        } 
      qanaryComponents = newQanaryComponents  
  }
 
 

module.exports.getQanaryComponents = async () => {
  if(!qanaryComponents) {
    await getComponents()
  } 
  await getComponents() 
  return qanaryComponents
}

  
module.exports.updateComponents = function() {
  setInterval(async function(){
    await getComponents() 
    console.log("15 sec done")
    //console.log(qanaryComponents.values())  
    }, 15000);
}