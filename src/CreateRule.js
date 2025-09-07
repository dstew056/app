import React from 'react';
import {Button} from 'react-bootstrap';

function CreateRule(props) {

  const section = props.section;

  return(
    <Button variant="primary" 
    onClick={() => {
      props.onClick(section);
      props.close(); //Close the parent using a function that is passed in props (this is the whole reason we need a custom button)
    }
    }>Create {section} Rule</Button>
  );
};

export default CreateRule;