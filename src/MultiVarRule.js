import { useState, useEffect, useCallback } from 'react';
import { Button,  } from 'react-bootstrap';
import ruleTypes from './data/ruleTypes.json'
import conditionComparators from './data/conditionComparators.json'
import patientData from './data/patientData.json'
import autocompleteValues from './data/autocompleteValues.json'
import AutocompleteInput from "./AutocompleteInput";
import './styles.css'

function MultiVarRule(props) {

  const id = props.id;
  const sendOutput = props.sendOutput
  const [section,setSection] = useState(props.section);
  const [independentVar, setindependentVar] = useState([props.independentVar]);
  const [conditionComparator, setConditionComparator] = useState([""]);
  const [conditionValue, setConditionValue] = useState([""]);
  const [output, setOutput] = useState("");//boolean, display output value if true
  const [outputValue, setOutputValue] = useState("");//value to be output
  const [outputColor,setOutputColor] = useState("#000000");

  const renderInputField = () => {
    const inputType = ruleTypes?.[section]?.[independentVar]?.conditionValueType || 'text';
    if (inputType === "autocompleteText"){
      return(<AutocompleteInput options={autocompleteValues[ruleTypes?.[section]?.[independentVar]?.autocompleteValues]} setValue={setConditionValue}/>)
    }else if(inputType === "boolean"){
      return(
        <select
          className="dropdown"
        >
          <option key={"true"} value={true}>true</option>
          <option key={"false"} value={false}>false</option>
        </select>
      )
    }else{
      return(
        <input 
            className="input-container"
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
      case "boolean":
        target= (target === "true");
        const cvBool = (conditionValue === "true");
        switch(conditionComparator){
          case "eqauls":
            return target===cvBool;
          case "does not equal":
            return target!==cvBool;
          default:
            return false;
        }
      default:
        return false;
    }
  },[conditionComparator,conditionValue]);

  useEffect(() => {
    const targets = patientData?.[section].map(subarray => subarray?.[independentVar] || "") || []
    const cvt = ruleTypes?.[section]?.[independentVar]?.conditionValueType || "text"
    setOutput(targets.map(target => calculateOutput(target,cvt)).some(value=>value===true))
  },[section,independentVar,conditionValue,calculateOutput]);

  useEffect(() => {
    sendOutput(id,output,outputValue,outputColor)
  },[output,outputValue,id,outputColor,sendOutput]);

  useEffect(()=>{
    setConditionValue("")
    setindependentVar(Object.keys(ruleTypes[section])[0]);
    setConditionComparator(conditionComparators[ruleTypes[section][Object.keys(ruleTypes[section])[0]].conditionValueType][0])
  },[section]);

  useEffect(()=>{
    setConditionValue("")
    setConditionComparator(conditionComparators[ruleTypes?.[section]?.[independentVar]?.conditionValueType || "text"][0])
  },[independentVar, section]);

  return (
    <div className="container">
      <h2>I am rule {id} for {independentVar} {conditionComparator} {conditionValue} in {section}</h2>
      <div className="ruleButtonsContainer">
        <h3>In</h3>
        <select
          className="dropdown"
          value={section}
        >
          <option>{section}</option>
        </select>
        <h3>if</h3>
        {/* <AutocompleteInput options={Object.keys(ruleTypes[section])} setValue={setindependentVar}/> */}
        <select
          className="dropdown"
          value={independentVar}
          onChange={ (e) => setindependentVar(e.target.value)}
        >
          {Object.keys(ruleTypes[section]).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          className="dropdown"
          value={conditionComparator}
          onChange={ (e) => setConditionComparator(e.target.value)}
        >
          {conditionComparators[ruleTypes?.[section]?.[independentVar]?.conditionValueType || "text"].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {renderInputField()}
        <h3>output</h3> 
        <input 
          className="input-container"
          type="text"
          value={outputValue}
          onChange={ (e) => setOutputValue(e.target.value)}
          style={{ width: '200px' }}
        />
        <div>
          <label>colour:</label>
          <input
            type="color"
            value={outputColor}
            onChange={(e) => setOutputColor(e.target.value)}
          />
        </div>
        {/* <p>{output}</p> */}
      </div>
      <Button variant="danger" className="btn btn-danger" onClick={() => props.deleteRule(id)}>Delete Rule</Button>

    </div>
  )
 
}

export default MultiVarRule;