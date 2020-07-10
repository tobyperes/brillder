import React from "react";
import { Filters } from "./BackToWork";


interface BackPageTitleProps {
  filters: Filters;
}

const BackPageTitle: React.FC<BackPageTitleProps> = ({ filters }) => {
  let title = ""
  if (filters.viewAll) {
    title = "ALL PROJECTS";
  } else if (filters.buildAll) {
    title = "BUILD";
  } else if (filters.editAll) {
    title = "EDIT";
  } else if (
    filters.draft &&
    !filters.build &&
    !filters.review &&
    !filters.publish
  ) {
    title = "DRAFT";
  } else if (
    !filters.draft &&
    filters.build &&
    !filters.review &&
    !filters.publish
  ) {
    title = "BUILD IN PROGRESS";
  } else if (
    !filters.draft &&
    !filters.build &&
    filters.review &&
    !filters.publish
  ) {
    title = "REVIEW";
  } else if (
    !filters.draft &&
    !filters.build &&
    !filters.review &&
    filters.publish
  ) {
    title = "PUBLISHED";
  } else {
    title = "FILTERED";
  }
  return <span>{title}</span>
}

export default BackPageTitle;
