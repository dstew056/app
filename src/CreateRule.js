import React from 'react';
import {Button} from 'react-bootstrap';

function CreateRule(props) {

  const type = props.type;

  return(
    <Button variant="primary" onClick={() => props.onClick(type)}>Create {type}</Button>
  );
};

export default CreateRule;