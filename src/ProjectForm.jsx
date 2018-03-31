import React, { Component } from "react";
import { Modal,
         Button,
         FormGroup,
         FormControl,
         ControlLabel,
         HelpBlock
        } from "react-bootstrap";

const ProjectForm = (props) => {
  return (
    <div>
      {props.title}
      {props.validationState}
    </div>
  );
}

export default ProjectForm;
