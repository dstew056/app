import { useState, useEffect, useCallback } from 'react';
import { Button,  } from 'react-bootstrap';
import ruleTypes from './data/ruleTypes.json'
import conditionComparators from './data/conditionComparators.json'
import patientData from './data/patientData.json'
import autocompleteValues from './data/autocompleteValues.json'
import AutocompleteInput from "./AutocompleteInput";
import './styles.css'

function InputField(props) {

  const id = props.id;
  const sendOutput = props.sendOutput
  const section = props.section;
  const [updateIndependentVar,updateConditionComparator,updateConditionValue] = props.updateData;
  const [independentVar, setIndependentVar] = useState(props.independentVar);
  const [conditionComparator, setConditionComparator] = useState(props.conditionComparator);
  const [conditionValue, setConditionValue] = useState("");

  const renderInputField = () => {
    const inputType = ruleTypes?.[section]?.[independentVar]?.conditionValueType || 'text';
    if (inputType === "autocompleteText"){
      return(<AutocompleteInput options={autocompleteValues[ruleTypes?.[section]?.[independentVar]?.autocompleteValues]} setValue={handleCVChange}/>)
    }else if(inputType === "boolean"){
      return(
        <select
          className="dropdown"
          onChange={(e) => handleCVChange(e.target.value)}
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
            onChange={ (e) => handleCVChange(e.target.value)}
            style={{ width: '200px' }}
          />
      )
    }
  }

  useEffect(()=>{
    setConditionValue("")
    setConditionComparator(conditionComparators[ruleTypes?.[section]?.[independentVar]?.conditionValueType || "text"][0])
  },[independentVar, section]);

  const handleIVChange = (e)=>{
    setIndependentVar(e);
    updateIndependentVar(id,e);
    updateConditionComparator(id,conditionComparators[ruleTypes?.[section]?.[e]?.conditionValueType || "text"][0]);
    updateConditionValue("");
    console.log(conditionComparators[ruleTypes?.[section]?.[e]?.conditionValueType || "text"][0])
  }

  const handleCCChange = (e)=>{
    setConditionComparator(e);
    updateConditionComparator(id,e);
  }

  const handleCVChange = (e)=>{
    setConditionValue(e);
    updateConditionValue(id,e);
  }

return (
    <div className="ruleButtonsContainer">
      <select
        className="dropdown"
        value={independentVar}
        onChange={ (e) => handleIVChange(e.target.value)}
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
        onChange={ (e) => handleCCChange(e.target.value)}
      >
        {conditionComparators[ruleTypes?.[section]?.[independentVar]?.conditionValueType || "text"].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {renderInputField()}
    </div>
  )
}

export default InputField;