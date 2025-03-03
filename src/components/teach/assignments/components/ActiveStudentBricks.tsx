import React, { Component } from "react";
import { Grow } from "@material-ui/core";

import './ActiveStudentBricks.scss';
import { Assignment, TeachClassroom, TeachStudent } from "model/classroom";
import { getStudentAssignments } from "services/axios/brick";
import { Subject } from "model/brick";

import AssignedBrickDescription from "./AssignedBrickDescription";
import BackPagePagination from "../../../backToWorkPage/components/BackPagePagination";
import { getAssignmentStats } from "services/axios/stats";
import ExpandedStudentAssignment from "./ExpandedStudentAssignment";

interface ActiveStudentBricksProps {
  history: any;
  classroom: TeachClassroom | null;
  subjects: Subject[];
  isArchive: boolean;
  activeStudent: TeachStudent;
  onRemind?(count: number, isDeadlinePassed: boolean): void;
}

interface ActiveStudentState {
  sortedIndex: number;
  pageSize: number;
  isLoaded: boolean;
  activeAssignment: Assignment | null;
  assignmentStats: any;
  assignments: Assignment[];
  archived: Assignment[];
}

class ActiveStudentBricks extends Component<ActiveStudentBricksProps, ActiveStudentState> {
  constructor(props: ActiveStudentBricksProps) {
    super(props);

    this.state = {
      sortedIndex: 0,
      pageSize: 6,
      isLoaded: false,
      activeAssignment: null,
      assignmentStats: null,
      assignments: [],
      archived: []
    };
    this.loadAssignments();
  }

  /**
   * Load student assignments if other student selected
   */
  componentDidUpdate(prevProps: ActiveStudentBricksProps) {
    if (this.props.activeStudent !== prevProps.activeStudent) {
      this.loadAssignments();
    }
  }

  async loadAssignments() {
    const res = (await getStudentAssignments(this.props.activeStudent.id)) as Assignment[] | null;
    if (res) {
      const archived = res.filter(res => res.studentStatus && res.studentStatus.length > 0 && res.studentStatus[0].status === 3);
      const assignments = res.filter(res => !res.studentStatus || !res.studentStatus[0] || res.studentStatus[0].status < 3);
      this.setState({ isLoaded: true, assignments, archived });
    }
  }

  moveNext() {
    this.setState({
      sortedIndex: this.state.sortedIndex + this.state.pageSize,
    });
  }

  moveBack() {
    this.setState({
      sortedIndex: this.state.sortedIndex - this.state.pageSize,
    });
  }

  renderPagination(assignments: Assignment[]) {
    const itemsCount = assignments.length;
    return (
      <BackPagePagination
        sortedIndex={this.state.sortedIndex}
        pageSize={this.state.pageSize}
        bricksLength={itemsCount}
        moveNext={this.moveNext.bind(this)}
        moveBack={this.moveBack.bind(this)}
      />
    );
  }

  async setActiveAssignment(a: Assignment) {
    const assignmentStats = await getAssignmentStats(a.id);
    this.setState({ sortedIndex: 0, activeAssignment: a, assignmentStats });
  }

  renderStudentAssignments(assignments: Assignment[]) {
    return (
      <div className="classroom-list 66">
        {assignments.map((a, i) => {
          if (
            i >= this.state.sortedIndex &&
            i < this.state.sortedIndex + this.state.pageSize
          ) {
            return (
              <Grow
                in={true}
                key={i}
                style={{ transformOrigin: "left 0 0" }}
                timeout={i * 200}
              >
                <div>
                  <AssignedBrickDescription
                    subjects={this.props.subjects}
                    isStudent={true}
                    isArchive={this.props.isArchive}
                    isStudentAssignment={true}
                    activeStudent={this.props.activeStudent}
                    expand={() => this.setActiveAssignment(a)}
                    key={i}
                    assignment={a as any}
                    archive={this.loadAssignments.bind(this)}
                    unarchive={() => { }}
                    onRemind={this.props.onRemind}
                  />
                </div>
              </Grow>
            );
          }
          return "";
        })}
      </div>
    );
  }

  renderExpandedAssignment(a: Assignment) {
    return (
      <div>
        <div style={{ height: 'calc(3vh + 1.5vw)' }} />
        <ExpandedStudentAssignment
          assignment={a}
          isStudentAssignment={true}
          history={this.props.history}
          student={this.props.activeStudent}
          stats={this.state.assignmentStats}
          subjects={this.props.subjects}
          onRemind={this.props.onRemind}
          minimize={() =>
            this.setState({ assignmentStats: null, activeAssignment: null })
          }
        />
      </div>
    );
  }

  render() {
    let assignments: Assignment[] = [];
    if (this.props.classroom?.assignments) {
      assignments = this.props.classroom.assignments;
    }
    const { activeStudent } = this.props;
    const { activeAssignment } = this.state;
    return (
      <div className="student-assignments">
        <div className="classroom-title hh-student-name">
          <div>{activeStudent.firstName} {activeStudent.lastName}</div>
        </div>
        {activeAssignment
          ? this.renderExpandedAssignment(activeAssignment)
          : this.renderStudentAssignments(assignments)}
        {this.renderPagination(assignments)}
      </div>
    );
  }
}

export default ActiveStudentBricks;
