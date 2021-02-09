import React from "react";
import { Checkbox } from "@material-ui/core";
import { MUser } from "../../model";
import { UserSortBy } from '../ManageClassrooms';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import StudentTableHead from "./StudentTableHead";

import './StudentTable.scss';

interface StudentTableProps {
  users: MUser[];
  selectedUsers: MUser[];
  isClassroom: boolean;

  sortBy: UserSortBy;
  isAscending: boolean;
  pageStudentsSelected: boolean;

  toggleUser(userId: number): void;
  sort(sortBy: UserSortBy): void;
  assignToClass(): void;
  unassign(student: MUser): void;
  togglePageStudents(): void;
}

const StudentTable: React.FC<StudentTableProps> = props => {
  const { users, sortBy, isAscending } = props;

  if (!users) {
    return <div></div>;
  }

  const onDragStart = (e: React.DragEvent<HTMLTableRowElement>) => {
    let count = 0;
    let studentIds:Number[] = [];
    for (let student of users) {
      if (student.selected) {
        studentIds.push(student.id);
        count += 1;
      }
    }
    var elem = document.createElement("div");
    elem.id = "student-drag-element";
    elem.innerHTML = "Dragging " + count + ' students';
    elem.style.position = "absolute";
    elem.style.top = "-1000px";
    document.body.appendChild(elem);
    e.dataTransfer.setDragImage(elem, 0, 0);
    e.dataTransfer.setData("text/plain", JSON.stringify({studentIds}));
  }

  return (
    <div className="users-table">
      <table cellSpacing="0" cellPadding="0">
        <thead>
          <StudentTableHead
            selectedUsers={props.selectedUsers}
            sortBy={sortBy}
            isAscending={isAscending}
            pageStudentsSelected={props.pageStudentsSelected}
            sort={props.sort}
            assignToClass={props.assignToClass}
            togglePageStudents={props.togglePageStudents}
          />
        </thead>
        <tbody>
          {users.map((user, i) => {
            return (
              <tr draggable={true} onDragStart={onDragStart} className={user.hasInvitation ? "user-row yellow" : "user-row"} key={i}>
                <td className="user-radio-column">
                  <Checkbox checked={user.selected} onClick={() => props.toggleUser(user.id)} />
                </td>
                <td>
                  {user.hasInvitation
                    ? <div className="user-email">{user.email}</div>
                    : <div>
                      <span className="user-first-name">{user.firstName} </span>
                      <span className="user-last-name">{user.lastName}</span>
                    </div>}
                </td>
                <td>
                  <div className="classroom-names">
                    {user.studyClassrooms && user.studyClassrooms.map((classroom, i) =>
                      <div key={i} className="classroom-name" style={{
                        backgroundColor: classroom.subject?.color
                      }}>{classroom.name}</div>)
                    }
                    {user.hasInvitation && <div key={i} className="classroom-name text-theme-dark-blue pending-label">Pending</div>}
                  </div>
                </td>
                <td className="selected-column">
                  <div className="action-buttons">
                    <div className="edit-button svgOnHover">
                      <SpriteIcon name="edit-outline" className="active" />
                    </div>
                    {props.isClassroom &&
                      <div className="trash-button svgOnHover" onClick={() => props.unassign(user)}>
                        <SpriteIcon name="trash-outline" className="active" />
                      </div>
                    }
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
