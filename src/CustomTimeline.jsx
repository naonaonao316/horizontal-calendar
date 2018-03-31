import React, { Component } from "react";
import moment from "moment";
import Timeline from 'react-calendar-timeline/lib';
import generateFakeData from "./generate-fake-data";
import {Modal,
        Button,
        FormGroup,
        FormControl,
        ControlLabel,
        HelpBlock
       } from "react-bootstrap";

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end"
};

export default class CustomTimeline extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    const { groups, items } = generateFakeData();
    const defaultTimeStart = moment()
      .startOf("day")
      .toDate();
    const defaultTimeEnd = moment()
      .startOf("day")
      .add(1, "day")
      .toDate();

    this.state = {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd,
      show: false,
      projectForm: {
        projectName: "initial value"
      }
    };
  }

  getValidationState() {
    const length = this.state.value.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state;

    const group = groups[newGroupOrder];

    this.setState({
      items: items.map(
        item =>
          item.id === itemId
            ? Object.assign({}, item, {
                start: dragTime,
                end: dragTime + (item.end - item.start),
                group: group.id
              })
            : item
      )
    });

    console.log("Moved", itemId, dragTime, newGroupOrder);
  };

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state;

    this.setState({
      items: items.map(
        item =>
          item.id === itemId
            ? Object.assign({}, item, {
                start: edge === "left" ? time : item.start,
                end: edge === "left" ? item.end : time
              })
            : item
      )
    });

    console.log("Resized", itemId, time, edge);
  };

  handleCanvasDoubleClick = (group, time, e) => {
    console.log("canvas gets double clicked!!");
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleChange = (e) => {
    let inputName = e.target.name;
    let inputValue = e.target.value;

    let statusCopy = Object.assign({}, this.state);
    console.log(inputName);
    console.log(inputValue);
    console.log(statusCopy);
    statusCopy.projectForm[inputName] = inputValue;

    this.setState({ state: statusCopy });
  }

  render() {
    const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state;
    console.log("groups");
    console.log(groups);

    console.log("items");
    console.log(items);

    return (
      <div>
        <Timeline
          groups={groups}
          items={items}
          keys={keys}
          fullUpdate
          sidebarContent={<div>Above The Left</div>}
          itemsSorted
          itemTouchSendsClick={false}
          stackItems
          itemHeightRatio={0.75}
          showCursorLine
          canMove={true}
          canResize={true}
          defaultTimeStart={defaultTimeStart}
          defaultTimeEnd={defaultTimeEnd}
          onItemMove={this.handleItemMove}
          onItemResize={this.handleItemResize}
          onTimeChange={this.handleTimeChange}
          onCanvasDoubleClick={this.handleCanvasDoubleClick}
        />
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Text in a modal</h4>
            <form>
              <FormGroup controlId="formBasicText">
                <ControlLabel>Working example with validation</ControlLabel>
                <FormControl
                  type="text"
                  name="projectName"
                  value={this.state.projectForm.projectName}
                  placeholder="Enter text"
                  onChange={this.handleChange}
                />
                <FormControl.Feedback />
                <HelpBlock>Validation is based on string length.</HelpBlock>
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" type="submit">Submit</Button>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
