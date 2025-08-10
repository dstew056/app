import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import ruleTypes from './data/ruleTypes.json'
import conditionComparators from './data/conditionComparators.json'
import patientData from './data/patientData.json'

function Rule(props) {

  const id = props.id;
  const [section,setSection] = useState(props.section);
  const [independantVar, setIndependantVar] = useState(props.independantVar);
  const [conditionComparator, setConditionComparator] = useState("");
  const [conditionValue, setConditionValue] = useState("");
  const [output, setOutput] = useState("");
  
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

  const calculateOutput = (target,cvt) => {
    switch(cvt){

      case "text":
        switch(conditionComparator){
          case "contains":
            return target.includes(conditionValue);
          case "is exactly":
            return target === conditionValue;
          default:
            return false;
        }
      case "number":
        target= +target
        const cv = +conditionValue
        console.log(conditionComparator)
        switch(conditionComparator){
          case ">":
            return target>cv;
          case ">=":
            return target>=cv;
          case "=":
            return target===cv;
          case "<=":
            return target<=cv;
          case "<":
            return target<cv;
          default:
            console.log("default");
            return false;
        }
      case "date":
        target= new Date(target);
        const cvDate = new Date(conditionValue);
        switch(conditionComparator){
          case "is before":
            return target<cvDate;
          case "is exactly":
            return target===cvDate;
          case "is after":
            return target>cvDate;
          default:
            return false;
        }
      default:
        return false;
    }
  }

  const handleCalculate = () => {
    const target = patientData[section][independantVar]
    const cvt = ruleTypes[section][independantVar].conditionValueType
    console.log(calculateOutput(target,cvt))
    setOutput(calculateOutput(target,cvt).toString())
  }

  useEffect(()=>{
    setConditionValue("")
    setIndependantVar(Object.keys(ruleTypes[section])[0]);
    setConditionComparator(conditionComparators[ruleTypes[section][Object.keys(ruleTypes[section])[0]].conditionValueType][0])
  },[section]);

  useEffect(()=>{
    setConditionValue("")
    console.log(conditionComparators[ruleTypes?.[section]?.[independantVar]?.conditionValueType || "text"][0])
    setConditionComparator(conditionComparators[ruleTypes?.[section]?.[independantVar]?.conditionValueType || "text"][0])
  },[independantVar, section]);

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
        <p>{output}</p>
      </div>
      <Button variant="primary" className="btn btn-primary" onClick={handleCalculate}>Calculate</Button>
      <Button variant="danger" className="btn btn-danger" onClick={() => props.deleteRule(id)}>Delete Rule</Button>
    </div>
  )
 
}

export default Rule;