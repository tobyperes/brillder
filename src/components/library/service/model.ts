import { LibraryAssignmentBrick } from "model/assignment";
import { Subject } from "model/brick";

export enum SortBy {
  None,
  Date,
  Score,
  Level,
}

export interface SubjectAssignments {
  subject: Subject,
  assignments: LibraryAssignmentBrick[]
}
