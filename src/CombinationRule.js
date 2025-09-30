import { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import ruleTypes from './data/ruleTypes.json'
import conditionComparators from './data/conditionComparators.json'
import patientData from './data/patientData.json'
import './styles.css'
import InputField from './InputField';
import { CirclePicker } from 'react-color';
import AutocompleteInput from "./AutocompleteInput";

function CombinationRule(props){

  const id = props.id;
  const data = props.data;
  const sendOutput = props.sendOutput

  const [selectList,setSelectList] = useState([{i:0,rule:data[0].id}])
  const [nextSelectId, setNextSelectId] = useState(1)

  const [output, setOutput] = useState("");//boolean, display output value if true
  const [outputValue, setOutputValue] = useState("");//value to be output
  const [outputColor,setOutputColor] = useState("#000000");
  const [outputOptions,setOutputOptions] = useState([])

  useEffect(() =>{
    console.log("asdf")
    for(let i=0; i<selectList.length;i++){
      const ruleId = selectList.filter(e=>e.i===i)[0].rule
      if (!data.filter(e=>e.id===+ruleId)[0].output){
        setOutput(false);
        return;
      }
    }
    setOutput(true);
  },[selectList,data])

  useEffect(() => {
    sendOutput(id,output,outputValue,outputColor)
  },[output,outputValue,id,outputColor,sendOutput]);

  const addSelect = () =>{
    setSelectList(prevList => [
      ...prevList, 
      {i:nextSelectId, rule:data[0].id}
    ])
    setNextSelectId(prevId=>prevId+1)
  }

  return(
    <div className="ruleContainer">
      <div className="ruleButtonsContainer">
        <h6>{id+1}</h6>
        <div className="setOutputContainer">
          <div className="ruleButtonsContainer">
            <div className='inputFieldContainer'>
              {selectList.map(selectData=>(
                <div>
                  {/* <h4>{selectData.i===0?"If":"and"}</h4> */}
                  <select
                    key={selectData.i}
                    className="dropdown"
                    onChange={(e)=>setSelectList(prevList=>
                      [...prevList.filter(select=>select.i!==selectData.i),{i:selectData.i,rule:e.target.value}])}
                    value={selectData.rule}>
                    {data.map(data => (
                      <option key={data.id} value={data.id}>
                        {"rule " + (data.id + 1)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <Button onClick={addSelect}>Add Condition</Button>
            </div>
            <h4>output</h4>
            <AutocompleteInput options={outputOptions} setValue={setOutputValue}/>
            <CirclePicker onChange={setOutputColor}
              colors={["#f44336", "#e9a21eff", "#2752b0ff", "#1d8122ff", "#000000ff", "#7c6646ff"]}
            />
          </div>
        </div>
      </div>
      <Button variant="danger" className="btn btn-danger" onClick={() => props.deleteRule(id)}>Delete Rule</Button>

    </div>
  )
}

export default CombinationRule;