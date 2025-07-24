import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import ruleTypes from './data/ruleTypes.json'
import conditionComparators from './data/conditionComparators.json'
import patientData from './data/patientData.json'

function Rule(props) {

  const [id] = useState(props.id);
  const [section,setSection] = useState(props.section);
  const [independantVar, setIndependantVar] = useState(props.independantVar);
  const [conditionComparator, setConditionComparator] = useState(props.conditionComparator);
  const [conditionValue, setConditionValue] = useState(props.conditionValue);
  
  const renderInputField = () => {
    const inputType = ruleTypes?.[section]?.[independantVar]?.conditionValueType || 'text';
    return(
      <input 
          type={inputType}
          value={conditionValue}
          onChange={ (e) => setConditionValue(e.target.value)}
          style={{ width: '200px' }}
        />
    )
  }

  const renderOutput = () => {
    switch(ruleTypes[section][independantVar].conditionValueType){

      case "text":
        
        switch(conditionValue){
          case "contains":
            return 
        }
        break;
      default:
    }
    
  }

  useEffect(()=>{
    setConditionValue("")
    setIndependantVar(Object.keys(ruleTypes[section])[0]);
    //setConditionComparatorOptions(conditionComparators[ruleTypes[section][Object.keys(ruleTypes[section])[0]].conditionValueType]);
  },[section]);

  return (
    <div className="container">
      <h2>I am rule {id} for {independantVar} {conditionComparator} {conditionValue} in {section}</h2>
      <div className="dropdown">
        <select
          className="form-select"
          value={section}
          onChange={ (e) => setSection(e.target.value)}
          style={{ width: '200px' }}
        >
          {Object.keys(ruleTypes).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          className="form-select"
          value={independantVar}
          onChange={ (e) => setIndependantVar(e.target.value)}
          style={{ width: '200px' }}
        >
          {Object.keys(ruleTypes[section]).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          className="form-select"
          value={conditionComparator}
          onChange={ (e) => setConditionComparator(e.target.value)}
          style={{ width: '200px' }}
        >
          {conditionComparators[ruleTypes?.[section]?.[independantVar]?.conditionValueType || "text"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {renderInputField()}
      </div>
      <Button variant="primary" className="btn btn-primary" onClick={renderOutput()}>Calculate</Button>
    </div>
  )
 
}

export default Rule;