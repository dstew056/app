import { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import ruleTypes from './data/ruleTypes.json'
import conditionComparators from './data/conditionComparators.json'
import patientData from './data/patientData.json'
import './styles.css'
import InputField from './InputField';
import { GithubPicker } from 'react-color';
import AutocompleteInput from "./AutocompleteInput";

function Rule(props) {

  const id = props.id;
  const sendOutput = props.sendOutput
  const [section,setSection] = useState([props.section]);

  const [independentVar, setIndependentVar] = useState([Object.keys(ruleTypes[section[0]])[0]]);
  const [conditionComparator, setConditionComparator] = useState([conditionComparators[ruleTypes[section[0]][Object.keys(ruleTypes[section[0]])[0]].conditionValueType][0]]);
  const [conditionValue, setConditionValue] = useState([""]);

  const [output, setOutput] = useState("");//boolean, display output value if true
  const [outputValue, setOutputValue] = useState("");//value to be output
  const [outputColor,setOutputColor] = useState("#000000");
  const [outputOptions,setOutputOptions] = useState([])
  
  const [fieldList,setFieldList] = useState([
    {
      id: 0, 
      section: section, 
      independentVar: Object.keys(ruleTypes[section[0]])[0],
      conditionComparator: conditionComparators[ruleTypes[section[0]][Object.keys(ruleTypes[section[0]])[0]].conditionValueType][0],
      conditionValue: ""
    }
  ]);
  const [nextFieldId,setNextFieldId] = useState(1);

  const calculateOutput = useCallback((target,cvt,conditionComparator_,conditionValue_) => {
    if (conditionValue_ === ""){ return false};
    switch(cvt){
      case "text":
      case "autocompleteText":
        switch(conditionComparator_){
          case "contains":
            return target.toLowerCase().includes(conditionValue_.toLowerCase());
          case "contains (case sensitive)":
            return target.includes(conditionValue_);
          case "is exactly":
            return target === conditionValue_;
          default:
            return false;
        }
      case "number":
        target= +target
        const cv = +conditionValue_
        switch(conditionComparator_){
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
        const cvDate = new Date(conditionValue_);
        switch(conditionComparator_){
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
        const cvBool = (conditionValue_ === "true");
        switch(conditionComparator_){
          case "equals":
            return target===cvBool;
          case "does not equal":
            return target!==cvBool;
          default:
            return false;
        }
      default:
        return false;
    }
  },[]);

  const updateIndependentVar = (id,value) => {
    const updatedValue = {
      ...independentVar,
      [id]: value
    };
    setIndependentVar(updatedValue);
  }

  const updateConditionComparator = (id,value) => {
    const updatedValue = {
      ...conditionComparator,
      [id]: value
    };  
    setConditionComparator(updatedValue);
  }
  
  const updateConditionValue = (id,value) => {
    const updatedValue = {
      ...conditionValue,
      [id]: value
    };
    setConditionValue(updatedValue);
  }

  const getOutputOptions = useCallback(()=>{
    let results = [];
    const cVValues = Object.values(conditionValue);
    for (let i = 0; i < cVValues.length; i++) {
      results.push(cVValues[i] === "" ? '""' : cVValues[i])
    }
    return results
  },[conditionValue]);

  useEffect(() => {
    let results = [];
    const iVValues = Object.values(independentVar);
    const cCValues = Object.values(conditionComparator);
    const cVValues = Object.values(conditionValue);

    let result=[]

    for(let i = 0; i < section.length; i++){
      for (let j = 0; j < iVValues.length; j++) {
        const targets = patientData?.[section[i]].map(subarray => subarray?.[iVValues[j]] || "") || [];
        const cvt = ruleTypes?.[section[i]]?.[iVValues[j]]?.conditionValueType || "text";
        results = [...results,...targets.map(target => calculateOutput(target,cvt,cCValues[j],cVValues[j]))];
      }

      /* result = [...result, results.length > 0 ?
        results.reduce((accumulator, currentArray) => {
          return accumulator.map((element, index) => {
            return element && currentArray[index];
          });
        })
        : []]; */
    }

    console.log(results)
    setOutputOptions(getOutputOptions())
    setOutput(results.some(e=>e===true))
  },[section,independentVar,conditionComparator,conditionValue,calculateOutput,getOutputOptions]);

  useEffect(() => {
    sendOutput(id,output,outputValue,outputColor)
  },[output,outputValue,id,outputColor,sendOutput]);

  const addField = ()=>{
    setFieldList(prevList => [...prevList, { 
      id: nextFieldId, 
      section: section, 
      independentVar: Object.keys(ruleTypes[section])[0],
      conditionComparator: conditionComparators[ruleTypes[section][Object.keys(ruleTypes[section])[0]].conditionValueType][0],
      conditionValue: ""
    }]);
    updateIndependentVar(nextFieldId,Object.keys(ruleTypes[section])[0]);
    updateConditionComparator(nextFieldId,conditionComparators[ruleTypes[section][Object.keys(ruleTypes[section])[0]].conditionValueType][0]);
    updateConditionValue(nextFieldId,"");
    setNextFieldId(prevId=> prevId + 1);
  }

  const deleteField = (id) => {
    const { [id]: _, ...updatedIndependentVar } = independentVar;
    setIndependentVar(updatedIndependentVar);

    const { [id]: __, ...updatedConditionComparator } = conditionComparator;
    setConditionComparator(updatedConditionComparator);

    const { [id]: ___, ...updatedConditionValue } = conditionValue;
    setConditionValue(updatedConditionValue);

    setFieldList(prevList => {
      return prevList.filter(field => field.id!==id)
    })
  }

  const changeSection = (event)=>{
    const {value, checked} = event.target;

    console.log(section)
    console.log(value)
    setSection(prevCheckedItems => {
      if (checked) {
        return [...prevCheckedItems, value];
      } else {
        return prevCheckedItems.filter(item => item !== value);
      }
    });
  }

  return (
    <div className="ruleContainer">
      <div className="ruleButtonsContainer">
        <h6>{id+1}</h6>
        <h3>In</h3>
        <form className="sectionSelect">
          {Object.keys(ruleTypes).map(sectionName=>(
            <div key={sectionName}>
              <input type="checkbox" value={sectionName} checked={section.includes(sectionName)} onChange={changeSection}/>
              <label >{sectionName}</label>
            </div>
          ))}
        </form>
        <div className='inputFieldContainer'>
          {fieldList.map(fieldData=>{
            return(
              <div key={fieldData.id}>
                <InputField id={fieldData.id} section={section} independentVar={independentVar[fieldData.id]} conditionComparator={conditionComparator[fieldData.id]} conditionValue={conditionValue[fieldData.id]} updateData={[updateIndependentVar,updateConditionComparator,updateConditionValue]} deleteField={deleteField} minId={Math.min(...fieldList.map(item => +(item.id)))}></InputField>
              </div>
            )
          }
          )}
          {/* <InputField id={0} section={section} updateData={[updateIndependentVar,updateConditionComparator,updateConditionValue]}></InputField>
          <InputField id={1} section={section} updateData={[updateIndependentVar,updateConditionComparator,updateConditionValue]}></InputField>
         */}
          <Button onClick={addField}>Add Condition</Button>
        </div>
        <div className="setOutputContainer">
          <div className='inputFieldContainer'>
            <AutocompleteInput options={outputOptions} setValue={setOutputValue}/>
            <GithubPicker onChange={setOutputColor} color={"#000000ff"} triangle='hide' width="163px"
              colors={["#000000ff", "#f44336", "#e9a21eff", "#2752b0ff", "#1d8122ff", "#7c6646ff"]}
            />
          </div>
        </div>
        <Button variant="danger" className="btn btn-danger" onClick={() => props.deleteRule(id)}>Delete Rule</Button>
      </div>

    </div>
  )
 
}

export default Rule;