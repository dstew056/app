import React, { useCallback, useState } from 'react';
import Rule from './Rule'
import MultiVarRule from './MultiVarRule'
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ruleTypes from './data/ruleTypes.json'
import CreateRuleModal from './CreateRuleModal';

function App() {

  const [ruleList, setRuleList] = useState([]);
  const [nextRuleId, setNextRuleId] = useState(0);
  const [outputList, setOutputList] = useState([]);

  const addRule = (section) => {
    setRuleList(prevList => [...prevList, { id: nextRuleId, section: section, type: "singleVar" }]);
    setOutputList(prevList => [...prevList, {id: nextRuleId, output: false, outputValue: "", outputColor: "#00000"}]);
    setNextRuleId(prevId => prevId + 1);
  }

  const addMultiVarRule = (section) => {
    setRuleList(prevList => [...prevList, { id: nextRuleId, section: section, type: "multiVar" }]);
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

  return (
    <div>
      <h1>Rule App</h1>
      <CreateRuleModal text={"Add A Single Variable Rule"} type={"singleVar"} addRule={addRule}/>
      <CreateRuleModal text={"Add A Multi Variable Rule"} type={"multiVar"} addRule={addMultiVarRule}/>
      <div className="rule-container">
        {/* Map over the list to render multiple components */}
        {ruleList.map(ruleData => {
          if (ruleData.type === "singleVar"){
            return(
              <div key={ruleData.id}>
                <Rule
                  id={ruleData.id} 
                  section={ruleData.section} 
                  deleteRule={deleteRule}
                  sendOutput={sendOutput}/>
              </div>
            )
          }else{
            return(
              <div key={ruleData.id}>
                <MultiVarRule
                  id={ruleData.id} 
                  section={ruleData.section} 
                  deleteRule={deleteRule}
                  sendOutput={sendOutput}/>
              </div>
            )
          }
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
              style={{color: outputData.outputColor}/* +outputData.outputColor */}
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