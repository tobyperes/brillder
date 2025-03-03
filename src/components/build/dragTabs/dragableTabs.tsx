import React from "react";
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";
import { ReactSortable } from "react-sortablejs";

import "./DragableTabs.scss";
import { validateQuestion } from "../questionService/ValidateQuestionService";
import DragTab from "./dragTab";
import PlusTab from "./plusTab";
import SynthesisTab from "./SynthesisTab";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import { Comment, CommentLocation } from "model/comments";
import { ReduxCombinedState } from "redux/reducers";
import { connect } from "react-redux";
import { User } from "model/user";
import { leftKeyPressed, rightKeyPressed } from "components/services/key";
import routes, { moveToPlan, moveToSynthesis } from "../routes";
import PlanTab from "./PlanTab";

interface Question {
  id: number;
  active: boolean;
  type: number;
}

interface DragTabsProps {
  history: any;
  brickId: number;
  questionId: number;
  questions: Question[];
  user: User;
  comments: Comment[] | null;
  synthesis: string;
  isSynthesisPage: boolean;
  isPlanValid: boolean;
  validationRequired: boolean;
  tutorialStep: TutorialStep;
  tutorialSkipped: boolean;
  currentQuestionIndex: number;
  openSkipTutorial(): void;
  createNewQuestion(): void;
  setQuestions(questions: any): void;
  selectQuestion(e: any): void;
  moveToLastQuestion(): void;
  removeQuestion(e: any): void;
}

interface TabsState {
  handleKey(e: any): void;
}

class DragableTabs extends React.Component<DragTabsProps, TabsState> {
  constructor(props: DragTabsProps) {
    super(props);

    this.state = {
      handleKey: this.handleKey.bind(this)
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  handleKey(e: any) {
    if (e.target.tagName === "INPUT") { return; }
    if (e.target.tagName === "TEXTAREA") { return; }
    if (e.target.classList.contains("ck-content")) { return; }
    if (e.target.classList.contains("ql-editor")) { return; }

    const { pathname } = this.props.history.location;

    if (leftKeyPressed(e)) {
      if (pathname.slice(-routes.BuildSynthesisLastPrefix.length).toLowerCase() === routes.BuildSynthesisLastPrefix) {
        this.props.selectQuestion(this.props.questions.length - 1);
      } else {
        const keyIndex = this.props.questions.findIndex(q => q.id === this.props.questionId);

        if (keyIndex > 0) {
          this.props.selectQuestion(keyIndex - 1)
        } else {
          moveToPlan(this.props.history, this.props.brickId)
        }
      }
    } else if (rightKeyPressed(e)) {
      if (pathname.slice(-routes.BuildPlanLastPrefix.length) === routes.BuildPlanLastPrefix) {
        this.props.selectQuestion(0);
      } else if (pathname.slice(-routes.BuildSynthesisLastPrefix.length).toLowerCase() === routes.BuildSynthesisLastPrefix) {
      } else {
        const keyIndex = this.props.questions.findIndex(q => q.id === this.props.questionId);

        if (keyIndex < this.props.questions.length - 1) {
          this.props.selectQuestion(keyIndex + 1);
        } else {
          moveToSynthesis(this.props.history, this.props.brickId);
        }
      }
    }
  }

  render() {
    let isInit = true;
    let isSynthesisPresent = true;
    const { props } = this;
    const { questions, isSynthesisPage, synthesis } = props;

    let isPlanPage = false;
    if (this.props.history.location.pathname.slice(-5) === routes.BuildPlanLastPrefix) {
      isPlanPage = true;
    }

    const getRepliesStatus = (replies: Comment[] | undefined) => {
      if (replies && replies.length > 0) {
        const latestAuthor = replies[0].author.id;
        const isCurrentUser = latestAuthor === props.user.id;
        return isCurrentUser ? 1 : -1;
      } else {
        return 0;
      }
    }

    const getHasPlanReplied = () => {
      const replies = props.comments
        ?.filter((comment) => comment.location === CommentLocation.Prep)
        .map(getLatestChild)
        .sort(
          (a, b) =>
            new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()
        );
      return getRepliesStatus(replies);
    }

    const getHasSynthesisReplied = () => {
      const replies = props.comments
        ?.filter((comment) => comment.location === CommentLocation.Synthesis)
        .map(getLatestChild)
        .sort(
          (a, b) =>
            new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()
        );
      return getRepliesStatus(replies);
    };

    const getHasReplied = (questionId: number) => {
      const replies = props.comments
        ?.filter((comment) => (comment.question?.id ?? -1) === questionId)
        .map(getLatestChild)
        .sort(
          (a, b) =>
            new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()
        );
      return getRepliesStatus(replies);
    };

    const getLatestChild = (comment: Comment) => {
      if (!comment.children || comment.children.length <= 0) {
        return comment;
      }
      const replies = comment.children.sort(
        (a, b) =>
          new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()
      );
      return replies[0];
    };

    const renderQuestionTab = (
      questions: Question[],
      question: Question,
      index: number,
      comlumns: number
    ) => {
      let titleClassNames = "drag-tile-container";
      let cols = 2;
      if (index === this.props.currentQuestionIndex) {
        titleClassNames += " active";
        cols = 3;
      }

      let nextQuestion = questions[index + 1];
      if (nextQuestion && nextQuestion.active) {
        titleClassNames += " pre-active";
      }

      let width = (100 * 2) / (comlumns - 2);
      if (index === this.props.currentQuestionIndex) {
        width = (100 * 3) / (comlumns - 2);
      }

      if (isSynthesisPage) {
        width = (100 * 2) / (comlumns - 2);
      }

      let isValid = true;
      if (props.validationRequired) {
        isValid = validateQuestion(question as any);
      }

      return (
        <GridListTile
          className={titleClassNames}
          key={index}
          cols={cols}
          style={{ display: "inline-block", width: `${width}%` }}
        >
          <DragTab
            index={index}
            deleteHidden={questions.length === 1}
            questionId={question.id}
            active={index === this.props.currentQuestionIndex}
            isValid={isValid}
            getHasReplied={getHasReplied}
            selectQuestion={props.selectQuestion}
            removeQuestion={props.removeQuestion}
          />
        </GridListTile>
      );
    };

    let columns = questions.length * 2 + 4;

    if (questions.length === 0) {
      columns = 2 + 1.582 + 1.5555;
      if (isPlanPage) {
        columns = 1.58 + 1.5555 + 1.5555;
      }
    }

    const setQuestions = (newQuestions: Question[], d: any) => {
      if (isInit === false) {
        let switched = newQuestions.find((q, i) => questions[i].id !== q.id);
        if (switched) {
          props.setQuestions(newQuestions);
        }
      } else {
        isInit = false;
      }
    };

    const renderSynthesisTab = () => {
      let className = 'synthesis-tile drag-tile-container';
      if (isSynthesisPage) {
        className += ' synthesis-tab active';
      }

      return (
        <GridListTile
          onClick={() => {
            if (props.tutorialSkipped) {
              moveToSynthesis(this.props.history, this.props.brickId);
            } else {
              props.openSkipTutorial();
            }
          }}
          className={className}
          cols={1.5555}
        >
          <SynthesisTab
            columns={columns}
            tutorialStep={props.tutorialStep}
            validationRequired={props.validationRequired}
            synthesis={synthesis}
            getHasReplied={getHasSynthesisReplied}
          />
        </GridListTile>
      );
    }

    return (
      <div
        className="drag-tabs"
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <GridList
          cellHeight={40}
          cols={columns}
          style={{
            width: "100%",
            flexWrap: "nowrap",
            margin: "0 !important",
            transform: "translateZ(0)",
          }}
        >
          <GridListTile
            className={`drag-tile-container plan-tab ${isPlanPage ? 'active' : ''}`}
            cols={isPlanPage ? 1.5555 : 2}
          >
            <PlanTab
              brickId={this.props.brickId} isValid={!props.validationRequired || props.isPlanValid}
              tutorialStep={props.tutorialStep} isActive={isPlanPage} history={this.props.history}
              getHasReplied={getHasPlanReplied}
            />
          </GridListTile>
          <ReactSortable
            list={questions}
            className="drag-container"
            group="tabs-group"
            setList={setQuestions}
          >
            {questions.map((question, i) =>
              renderQuestionTab(questions, question, i, columns)
            )}
          </ReactSortable>
          <GridListTile
            onClick={props.createNewQuestion}
            className="drag-tile-container add-tile-container"
            cols={isSynthesisPresent || isSynthesisPage ? 1.5555 : 2}
          >
            <PlusTab tutorialStep={props.tutorialStep} />
          </GridListTile>
          {(isSynthesisPresent || isSynthesisPage) && (
            renderSynthesisTab()
          )}
        </GridList>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  comments: state.comments.comments,
});

const connector = connect(mapState);

export default connector(DragableTabs);
