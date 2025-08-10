import React, { useState } from 'react';
import Rule from './Rule'
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ruleTypes from './data/ruleTypes.json'
import CreateRule from './CreateRule';

function App() {

  const [ruleList, setRuleList] = useState([]);
  const [nextRuleId, setNextRuleId] = useState(0);

  const addRule = (section) => {
    setRuleList(prevList => [...prevList, { id: nextRuleId, section: section }]);
    setNextRuleId(prevId => prevId + 1);
  }

  const deleteRule = (id) => {
    setRuleList(prevList => {
      return prevList.filter(rule => rule.id!==id)
    })
  }

  return (
    <div>
      <h1>Rule App</h1>
      <CreateRule type="Labs" onClick={addRule}/>
      <CreateRule type="Medications" onClick={addRule}/>
      {/* {Object.keys(ruleTypes).map(ruletype => (
        <CreateRule key={ruletype.key} onClick={addRule}/>
      ))} */}
      {/* <Button variant="primary" className="btn btn-primary" onClick={addRule}>Add Rule</Button> */}
      <div className="rule-container">
        {/* Map over the list to render multiple components */}
        {ruleList.map(ruleData => (
          <div key={ruleData.id}>
            <Rule key={ruleData.id} id={ruleData.id} section={ruleData.section} deleteRule={deleteRule}/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;