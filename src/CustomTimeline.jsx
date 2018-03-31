import React, { Component } from "react";
import moment from "moment";

import Timeline from "react-calendar-timeline";

export default class CustomTimeline extends Component {
  constructor(props) {
  }

  render() {
    return (
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
      />

    );
  }
}
