import React from 'react';
import {Button} from 'react-bootstrap';

function CreateRule(props) {

  const type = props.type;

  return(
    <Button variant="primary" 
    onClick={() => {
      props.onClick(type);
      props.close(); //Close the parent using a function that is passed in props (this is the whole reason we need a custom button)
    }
    }>Create {type}</Button>
  );
};

export default CreateRule;