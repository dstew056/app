import React, { useState } from 'react';
import Rule from './Rule'
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ruleTypes from './data/ruleTypes.json'
import CreateRuleModal from './CreateRuleModal';

function App() {

  const [ruleList, setRuleList] = useState([]);
  const [nextRuleId, setNextRuleId] = useState(0);
  const [outputList, setOutputList] = useState([]);

  const addRule = (section) => {
    setRuleList(prevList => [...prevList, { id: nextRuleId, section: section }]);
    setOutputList(prevList => [...prevList, {id: nextRuleId, output: false, outputValue: ""}]);
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

  const sendOutput = (id, output, outputValue) => {
    setOutputList(prevList => {
      return prevList.map(rule => {
        if (rule.id===id){
          return {id,output,outputValue}
        }else{return rule}
      }
      )
    })
  }

  return (
    <div>
      <h1>Rule App</h1>
      <CreateRuleModal addRule={addRule}/>
      {/* {Object.keys(ruleTypes).map(ruletype => (
        <CreateRule key={ruletype.key} onClick={addRule}/>
      ))} */}
      {/* <Button variant="primary" className="btn btn-primary" onClick={addRule}>Add Rule</Button> */}
      <div className="rule-container">
        {/* Map over the list to render multiple components */}
        {ruleList.map(ruleData => (
          <div key={ruleData.id}>
            <Rule 
              key={ruleData.id} 
              id={ruleData.id} 
              section={ruleData.section} 
              deleteRule={deleteRule}
              sendOutput={sendOutput}/>
          </div>
        ))}
      </div>
      <div className='outputContainer'>
        {outputList.map(outputData => (
          <div key={outputData.id}>
            <p key={outputData.id} id={outputData.id} class={"outputLine"+outputData.output}>{outputData.outputValue}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;