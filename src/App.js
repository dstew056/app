import React, { useState } from 'react';
import Rule from './Rule'
import { Button , Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [componentList, setComponentList] = useState([]);
  const [nextId, setNextId] = useState(0);

  const addRule = () => {
    setComponentList(prevList => [...prevList, { id: nextId }]);
    setNextId(prevId => prevId + 1);
  }

  return (
    <div>
      <h1>Rule App</h1>
      <Button variant="primary" className="btn btn-primary" onClick={addRule}>Add Rule</Button>
      <div className="rule-container">
        {/* Map over the list to render multiple components */}
        {componentList.map(componentData => (
          <Rule key={componentData.id} id={componentData.id} independantVar="name" conditionComparator="=" conditionValue = ""/>
        ))}
      </div>
    </div>
  );
}

export default App;