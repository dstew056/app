import { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import ruleTypes from './data/ruleTypes.json'
import conditionComparators from './data/conditionComparators.json'
import patientData from './data/patientData.json'
import autocompleteValues from './data/autocompleteValues.json'
import AutocompleteInput from "./AutocompleteInput";
import './styles.css'

function Rule(props) {

  const id = props.id;
  const [section,setSection] = useState(props.section);
  const [independentVar, setindependentVar] = useState(props.independentVar);
  const [conditionComparator, setConditionComparator] = useState("");
  const [conditionValue, setConditionValue] = useState("");
  const [output, setOutput] = useState("");

  const renderInputField = () => {
    const inputType = ruleTypes?.[section]?.[independentVar]?.conditionValueType || 'text';
    if (inputType === "autocompleteText"){
      console.log(conditionValue);
      return(<AutocompleteInput options={autocompleteValues[ruleTypes?.[section]?.[independentVar]?.autocompleteValues]} setConditionValue={setConditionValue}/>)
    }else{
      return(
        <input 
            type={inputType}
            value={conditionValue}
            onChange={ (e) => setConditionValue(e.target.value)}
            style={{ width: '200px' }}
          />
      )
    }
  }

  const calculateOutput = useCallback((target,cvt) => {
    if (conditionValue === ""){ return false};
    switch(cvt){
      case "text":
      case "autocompleteText":
        switch(conditionComparator){
          case "contains":
            return target.toLowerCase().includes(conditionValue.toLowerCase());
          case "contains (case sensitive)":
            return target.includes(conditionValue);
          case "is exactly":
            return target === conditionValue;
          default:
            return false;
        }
      case "number":
        target= +target
        const cv = +conditionValue
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
  },[conditionComparator,conditionValue]);

  useEffect(() => {
    const target = patientData[section][independentVar]
    const cvt = ruleTypes?.[section]?.[independentVar]?.conditionValueType || "text"
    setOutput(calculateOutput(target,cvt).toString())
  },[section,independentVar,conditionValue,calculateOutput]);

  useEffect(()=>{
    setConditionValue("")
    setindependentVar(Object.keys(ruleTypes[section])[0]);
    setConditionComparator(conditionComparators[ruleTypes[section][Object.keys(ruleTypes[section])[0]].conditionValueType][0])
  },[section]);

  useEffect(()=>{
    setConditionValue("")
    /* console.log(conditionComparators[ruleTypes?.[section]?.[independentVar]?.conditionValueType || "text"][0]) */
    setConditionComparator(conditionComparators[ruleTypes?.[section]?.[independentVar]?.conditionValueType || "text"][0])
  },[independentVar, section]);

  return (
    <div className="container">
      {/* <h2>I am rule {id} for {independentVar} {conditionComparator} {conditionValue} in {section}</h2> */}
      <div className="ruleButtonsContainer">
        <h3>In&nbsp;&nbsp;</h3>
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
        <h3>&nbsp;&nbsp;if&nbsp;&nbsp;</h3>
        <select
          className="form-select"
          value={independentVar}
          onChange={ (e) => setindependentVar(e.target.value)}
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
          {conditionComparators[ruleTypes?.[section]?.[independentVar]?.conditionValueType || "text"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {renderInputField()}
        <p>{output}</p>
      </div>
      {/* <Button variant="primary" className="btn btn-primary" onClick={handleCalculate}>Calculate</Button> */}
      <Button variant="danger" className="btn btn-danger" onClick={() => props.deleteRule(id)}>Delete Rule</Button>

    </div>
  )
 
}

export default Rule;