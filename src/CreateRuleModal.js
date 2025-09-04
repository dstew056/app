import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import CreateRule from './CreateRule';
import ruleTypes from './data/ruleTypes.json'

function CreateRuleModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Add a New Rule
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Rule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(ruleTypes).map(section=>(
            <CreateRule type={section} onClick={props.addRule} close={handleClose}/>
          ))}
          {/* <CreateRule type="Labs" onClick={props.addRule} close={handleClose}/>
          <CreateRule type="Medications" onClick={props.addRule} close={handleClose}/> */}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CreateRuleModal;