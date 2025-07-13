import { useState } from 'react';
import independantVarOptions from './data/ruleTypes.json'

function Rule(props) {

  const [id] = useState(props.id);
  const [independantVarType, setIndependantVarType] = useState(props.independantVarType);
  const [independantVar, setIndependantVar] = useState(props.independantVar);
  const [conditionComparator, setConditionComparator] = useState(props.conditionComparator);
  const [conditionValue, setConditionValue] = useState(props.conditionValue);


  return (
    <div className="container">
      <h2>I am rule {id} for {independantVar} {conditionComparator} {conditionValue}</h2>
      <div className="dropdown">
        <select
          className="form-select"
          value={independantVar}
          onChange={ (e) => setIndependantVar(e.target.value)}
          style={{ width: '200px' }}
        >
          {independantVarOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className="form-select"
          value={conditionComparator}
          onChange={ (e) => setConditionComparator(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="<">&lt;</option>
          <option value="=">&#61;</option>
          <option value=">">&gt;</option>
        </select>
        <input 
          type="text"
          value={conditionValue}
          onChange={ (e) => setConditionValue(e.target.value)}
          style={{ width: '200px' }}
        >

        </input>
      </div>
    </div>
  )
 
}

export default Rule;