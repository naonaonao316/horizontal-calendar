import React, { Component } from "react";
import moment from "moment";
import Timeline from 'react-calendar-timeline/lib';
import generateFakeData from "./generate-fake-data";
import { Modal,
         Button,
         FormGroup,
         FormControl,
         ControlLabel,
         Radio,
         HelpBlock
        } from "react-bootstrap";
import ProjectForm from "./ProjectForm";

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

//    this.handleChange = this.handleChange.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const { groups, items } = generateFakeData();
    const defaultTimeStart = moment()
      .startOf("day")
      .toDate();
    const defaultTimeEnd = moment()
      .startOf("day")
      .add(4, "year")
      .toDate();
    const movedTimeStart = defaultTimeStart;
    this.state = {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd,
      defaultTimeEndState: defaultTimeEnd,
      movedTimeStart: defaultTimeStart,
      show: false,
      projectForm: {
        groupTitle: "",
        valid: true
      },
      formA: {
        inputFormA: {
          value: "",
          valid: true
        }
      }
    };
  }

  getValidationState() {
    const length = this.state.projectForm.groupTitle.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
    return null;
  }

  onTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    console.log("time changed")
  }

  handleScaleChange = (target_scale) => {
    console.log('hello')
    this.setState({defaultTimeEndState: moment().startOf("day").add(1, "year").toDate()})
  }

  handleChange = (e) => {
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
    console.log(group);

    let project = {groupTitle: "aaaa", valid: true}

    this.setState({ show: true , projectForm: project});
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

  handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    console.log('Time Changed')
    console.log(visibleTimeStart)
    console.log('Time Changed')
    this.setState({movedTimeStart: moment(visibleTimeStart).toDate()});
    updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
    console.log(this.state.movedTimeStart)
  }

  handleSubmit() {
    console.log("hello from submission");
    // API call
    this.handleClose();
  }

  render() {
    const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state;
    console.log("groups");
    console.log(groups);

    console.log("items");
    console.log(items);

    const InputForm = () => {
      return (
        <form>
          <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
            <ControlLabel>Group</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              name="groupTitle"
              value={this.state.projectForm.groupTitle}
              placeholder="Enter Group"
              onChange={this.handleChange}
            />
            <FormControl.Feedback />
            <HelpBlock>{this.getValidationState()}</HelpBlock>
          </FormGroup>
        </form>
      );
    }

    return (
      <div>
        <FormGroup>
          <Radio onClick={() => this.handleScaleChange()} name="radioGroup" inline>
            Yearly
          </Radio>
          <Radio name="radioGroup" inline>
            Monthly
          </Radio>
          <Radio name="radioGroup" inline>
            Weekly
          </Radio>
          <Radio name="radioGroup" inline>
            Daily
          </Radio>
          <Radio name="radioGroup" inline>
            Hourly
          </Radio>
        </FormGroup>
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
          defaultTimeEnd={this.state.defaultTimeEndState}
          onItemMove={this.handleItemMove}
          onItemResize={this.handleItemResize}
          onTimeChange={this.handleTimeChange}
          onBoundsChange={this.handleBoundChange}
          onCanvasDoubleClick={this.handleCanvasDoubleClick}
        />
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputForm />
          </Modal.Body>
          <Modal.Footer>
            <ProjectForm title="abceef" validationState={this.getValidationState()}/>
            <Button bsStyle="primary" type="submit" onClick={this.handleSubmit}>Submit</Button>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
