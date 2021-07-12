import React, { Component } from "react";

import { User } from "model/user";
import { ThreeAssignmentColumns, AssignmentBrickData, PlayFilters } from '../../model';
import { prepareVisibleAssignments } from '../../service';
import { prepareVisibleThreeColumnAssignments } from '../../threeColumnService';
import { AssignmentBrickStatus, AssignmentBrick } from "model/assignment";

import BrickBlock16x9 from "components/viewAllPage/components/BrickBlock16x9";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";

import "./AssignedBricks.scss";

interface AssignedBricksProps {
  user: User;
  shown: boolean;
  pageSize: number;
  sortedIndex: number;
  filters: PlayFilters;
  assignments: AssignmentBrick[];
  threeColumns: ThreeAssignmentColumns;
  history: any;

  handleDeleteOpen(brickId: number): void;
}

class AssignedBricks extends Component<AssignedBricksProps> {
  renderBrick(item: AssignmentBrickData) {
    let circleIcon = '';
    console.log(565)
    if (item.isInvitation) {
      circleIcon="users";
    }
    return <BrickBlock16x9
      brick={item.brick}
      index={item.index}
      row={item.row}
      user={this.props.user}
      key={item.index}
      shown={this.props.shown}
      isAssignment={true}
      assignmentId={item.assignmentId}
      history={this.props.history}
      color="#9B33FF"
      circleIcon={circleIcon}
      deadline={item.deadline}
      searchString=""
      handleDeleteOpen={this.props.handleDeleteOpen}
    />
  }

  renderSortedBricks() {
    const data = prepareVisibleAssignments(this.props.sortedIndex, this.props.pageSize, this.props.assignments);
    return data.map(item => this.renderBrick(item));
  }

  renderEmptyPage() {
    return (
      <div className="tab-content-centered">
        <div>
          <div className="icon-container big-search-icon-container" onClick={() => this.props.history.push(map.MainPage)}>
            <SpriteIcon
              name="search-large-blue"
              className="big-search-icon"
            />
          </div>
          <div className="bold">There are no assignments for this class yet.<br />Click the icon to explore Brillder.</div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="bricks-list-container">
        {this.props.assignments.length > 0 ?
          <div className="bricks-list">
            { this.renderSortedBricks() }
          </div>
          : this.renderEmptyPage()
        }
      </div>
    );
  }
}

export default AssignedBricks;
