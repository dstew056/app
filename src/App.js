import React, { useCallback, useState, useMemo } from 'react';
import Rule from './Rule'
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ruleTypes from './data/ruleTypes.json'
import CreateRuleModal from './CreateRuleModal';
import CombinationRule from './CombinationRule';

function App() {

  const [ruleList, setRuleList] = useState([]);
  const [nextRuleId, setNextRuleId] = useState(0);
  const [outputList, setOutputList] = useState([]);

  const addRule = (section) => {
    if (section==="Combination" && comboRuleData.length === 0){
      alert("Please create at least one rule before adding a combination")
      return
    }
    
    setRuleList(prevList => [...prevList, { id: nextRuleId, section: section}]);
    setOutputList(prevList => [...prevList, {id: nextRuleId, output: false, outputValue: "", outputColor: "#00000"}]);
    setNextRuleId(prevId => prevId + 1);
  }

  const deleteRule = (id) => {
    setRuleList(prevList => {
      return prevList.filter(rule => rule.id!==id)
    })
    setOutputList(prevList => {
      return prevList.filter(rule => rule.id!==id)
    })
  }

  const sendOutput = useCallback((id, output, outputValue, outputColor) => {
    setOutputList(prevList => {
      return prevList.map(rule => {
        if (rule.id===id){
          return {id,output,outputValue, outputColor}
        }else{return rule}
      }
      )
    })
  },[]);

  const comboRuleData = useMemo(()=>{
    const ids = ruleList.filter(
        ruleData=>ruleData.section!=="Combination").map(
          ruleData=>ruleData.id)
    return outputList.filter(outputData=>ids.includes(outputData.id))
  },[outputList,ruleList])

  return (
    <div>
      <h1>Rule App</h1>
      <CreateRuleModal text={"Add A Rule"} addRule={addRule}/>
      <Button variant="primary" onClick={()=>addRule("Combination")}>Add A Combination Rule</Button>
      <div className="rule-container">
        {/* Map over the list to render multiple components */}
        {ruleList.map(ruleData => {
          if (ruleData.section === "Combination"){
            return(
              <div key={ruleData.id}>
                <CombinationRule
                  id={ruleData.id} 
                  section={ruleData.section} 
                  deleteRule={deleteRule}
                  sendOutput={sendOutput}
                  data={comboRuleData}/>
              </div>)
          }
          return(
            <div key={ruleData.id}>
              <Rule
                id={ruleData.id} 
                section={ruleData.section} 
                deleteRule={deleteRule}
                sendOutput={sendOutput}/>
            </div>
          )
        }
        )}
      </div>
      <br/>
      <h4 className="output-container-label">Output:</h4>
      <div className='output-container'>
        {outputList.map(outputData => (
          <div key={outputData.id}>
            <p 
              key={outputData.id} 
              id={outputData.id} 
              className={"outputLine"+outputData.output} 
              style={{color: outputData.outputColor.hex}}
            >
              {outputData.outputValue}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;