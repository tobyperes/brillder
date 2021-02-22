import React, { useContext } from "react";
import { Redirect, RouteComponentProps, Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { Grid, Hidden } from "@material-ui/core";
import { connect } from "react-redux";
import queryString from 'query-string';

import "./investigationBuildPage.scss";
import map from 'components/map';
import {
  Question,
  QuestionTypeEnum,
} from "model/question";
import actions from "redux/actions/brickActions";
import { socketStartEditing, socketNavigateToQuestion } from "redux/actions/socket";
import { isHighlightInvalid, validateHint, validateQuestion } from "./questionService/ValidateQuestionService";
import {
  getNewQuestion,
  removeQuestionByIndex,
  setQuestionTypeByIndex,
  getFirstInvalidQuestion,
  getUniqueComponent,
} from "./questionService/QuestionService";
import { convertToQuestionType } from "./questionService/ConvertService";
import { User } from "model/user";
import { GetCashedBuildQuestion } from 'localStorage/buildLocalStorage';
import { setBrillderTitle } from "components/services/titleService";
import { canEditBrick, checkAdmin, checkPublisher } from "components/services/brickService";
import { ReduxCombinedState } from "redux/reducers";
import { validateProposal } from 'components/build/proposal/service/validation';
import UndoRedoService from "components/services/UndoRedoService";
import { Brick } from "model/brick";

import QuestionPanelWorkArea from "./buildQuestions/questionPanelWorkArea";
import TutorialWorkArea, { TutorialStep } from './tutorial/TutorialPanelWorkArea';
import QuestionTypePage from "./questionType/questionType";
import SynthesisPage from "./synthesisPage/SynthesisPage";
import LastSave from "components/build/baseComponents/lastSave/LastSave";
import DragableTabs from "./dragTabs/dragableTabs";
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import PhoneQuestionPreview from "components/build/baseComponents/phonePreview/phoneQuestionPreview/PhoneQuestionPreview";
import SynthesisPreviewComponent from "./baseComponents/phonePreview/synthesis/SynthesisPreview";
import QuestionTypePreview from "components/build/baseComponents/QuestionTypePreview";
import TutorialPhonePreview from "./tutorial/TutorialPreview";
import YourProposalLink from './baseComponents/YourProposalLink';
import TutorialLabels from './baseComponents/TutorialLabels';
import PageLoader from "components/baseComponents/loaders/pageLoader";
import Proposal from "./proposal/Proposal";

import DeleteQuestionDialog from "./baseComponents/dialogs/DeleteQuestionDialog";
import DesktopVersionDialog from 'components/build/baseComponents/dialogs/DesktopVersionDialog';
import QuestionInvalidDialog from './baseComponents/dialogs/QuestionInvalidDialog';
import HighlightInvalidDialog from './baseComponents/dialogs/HighlightInvalidDialog';
import HintInvalidDialog from './baseComponents/dialogs/HintInvalidDialog';
import ProposalInvalidDialog from './baseComponents/dialogs/ProposalInvalidDialog';
import SkipTutorialDialog from "./baseComponents/dialogs/SkipTutorialDialog";
import BuildNavigation from "./baseComponents/BuildNavigation";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import { BrickLengthRoutePart, BriefRoutePart, OpenQuestionRoutePart, PrepRoutePart, ProposalReviewPart, TitleRoutePart } from "./proposal/model";
import { YJSContext } from "./baseComponents/YJSProvider";
import * as Y from "yjs";
import { convertQuestion, toRenderJSON } from "services/SharedTypeService";
import _ from "lodash";


interface InvestigationBuildProps extends RouteComponentProps<any> {
  user: User;
  reduxBrick: Brick;
  startEditing(brickId: number): void;
  changeQuestion(questionId?: number): void;
  forgetBrick(): void;
}

const InvestigationBuildPage: React.FC<InvestigationBuildProps> = props => {
  const { params } = props.match;
  const brickId = parseInt(params.brickId);

  const values = queryString.parse(props.location.search);
  let initSuggestionExpanded = false;
  if (values.suggestionsExpanded) {
    initSuggestionExpanded = true;
  }

  const isCurrentEditor = (props.reduxBrick.editors?.findIndex((e:any) => e.id === props.user.id) ?? -1) >= 0;
  if (isCurrentEditor) {
    initSuggestionExpanded = true;
  }

  let initQuestionId = -1;
  if (params.questionId) {
    try {
      let questionId = parseInt(params.questionId);
      if (questionId >= 1) {
        initQuestionId = questionId;
      }
    } catch {
      console.log('can`t parse question id');
    }
  }

  const { history } = props;

  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  const [lastQuestionDialog, setLastQuestionDialog] = React.useState(false);
  let [locked, setLock] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialog] = React.useState(false);
  const [submitDialogOpen, setSubmitDialog] = React.useState(false);
  const [invalidHint, setInvalidHint] = React.useState({
    isOpen: false,
    questionNumber: -1
  });
  const [highlightInvalid, setInvalidHighlight] = React.useState({
    isOpen: false,
    isLine: false
  });
  const [movingFromSynthesis, setMovingFromSynthesis] = React.useState(false);
  const [proposalInvalidOpen, setProposalInvalidOpen] = React.useState(false);
  const [validationRequired, setValidation] = React.useState(false);
  const [deleteQuestionIndex, setDeleteIndex] = React.useState(-1);
  const [activeQuestionType] = React.useState(QuestionTypeEnum.None);
  const [hoverQuestion, setHoverQuestion] = React.useState(QuestionTypeEnum.None);
  const [isSaving, setSavingStatus] = React.useState(false);
  const [hasSaveError, setSaveError] = React.useState(false);
  const [skipTutorialOpen, setSkipDialog] = React.useState(false);
  const [tutorialSkipped, skipTutorial] = React.useState(false);
  const [step, setStep] = React.useState(TutorialStep.Proposal);
  const [focusIndex, setFocusIndex] = React.useState(-1);
  // time of last autosave
  let [lastAutoSave, setLastAutoSave] = React.useState(Date.now());

  const [undoRedoService] = React.useState(UndoRedoService.instance);

  /* Synthesis */
  let isSynthesisPage = false;
  if (history.location.pathname.slice(-10).toLowerCase() === '/synthesis') {
    isSynthesisPage = true;
  }

  /* Proposal */
  const validRoutes = ["/investigation", "/synthesis", "/subject", TitleRoutePart, OpenQuestionRoutePart, BrickLengthRoutePart, BriefRoutePart, PrepRoutePart, ProposalReviewPart];
  const isProposalPage = validRoutes.includes(props.location.pathname.split("/")[4]);

  const { ydoc, json: yjson } = useContext(YJSContext)!;
  React.useEffect(() => {
    const callback = (location: any) => console.log(location.pathname);
    history.listen(callback);
  }, []);
  const ybrick = ydoc!.getMap("brick")!;

  if(!ybrick) {
    return <PageLoader content="Getting brick..." />
  }

  const questions = ybrick.get("questions") as Y.Array<Y.Doc>;
  let synthesis = ybrick.get("synthesis") as Y.Text;

  const proposalResult = validateProposal(toRenderJSON(ybrick));

  let isAuthor = false;
  try {
    isAuthor = props.reduxBrick.author.id === props.user.id;
  } catch { }

  const openSkipTutorial = () => {
    setSkipDialog(true);
  }
   
  const undo = () => {
    // TODO: implement undo
  }

  const redo = () => {
    // TODO: implement redo
  }

  let canEdit = canEditBrick(props.reduxBrick, props.user);
  locked = canEdit ? locked : true;

  setBrillderTitle(ybrick.get("title"));

  const getQuestionIndex = (question: Y.Doc) => {
    let qIndex = -1;
    questions.forEach((q, index) => {
      if(q === question) {
        qIndex = index;
      }
    });
    return qIndex;
  };

  const getJSONQuestionIndex = (question: Question) => {
    let qIndex = -1;
    questions.forEach((q, index) => {
      if(q.getMap().toJSON() === question) {
        qIndex = index;
      }
    });
    return qIndex;
  }

  let activeQuestion: Y.Doc = undefined as any;
  if(currentQuestionIndex !== -1) {
    activeQuestion = questions.get(currentQuestionIndex);
    if(activeQuestion) {
      questions.map((q: Y.Doc) => q.load());
    }
  }
  if (isSynthesisPage || isProposalPage) {
    if (activeQuestion) {
      if (movingFromSynthesis === false) {
        setCurrentQuestionIndex(-1);
      }
      return <PageLoader content="...Loading..." />;
    }
  } else if (_.isEmpty(activeQuestion?.toJSON()) || _.isEmpty(activeQuestion?.getMap()?.toJSON())) {
    if(questions.length <= 0) {
      if (!canEdit || locked) { return <PageLoader content="...Loading..." />; }
      const newQuestion = convertQuestion(getNewQuestion(QuestionTypeEnum.None, false))
      questions.push([newQuestion]);
      console.log(newQuestion);
      setCurrentQuestionIndex(questions.length - 1);
    }
    return <PageLoader content="...Loading..." />;
  }

  if (activeQuestion) {
    if (movingFromSynthesis) {
      setMovingFromSynthesis(false);
    }
  }

  /* Changing question number by tabs in build */
  const setPreviousQuestion = () => {
    if (currentQuestionIndex >= 1) {
      setCurrentQuestionIndex(index => index - 1);
    } else {
      history.push(map.ProposalReview);
    }
  };

  const setPrevFromPhone = () => {
    if (currentQuestionIndex >= 1) {
      setCurrentQuestionIndex(index => index - 1);
    }
  }

  const setNextQuestion = () => {
    let lastIndex = questions.length - 1;
    if (currentQuestionIndex < lastIndex) {
      setCurrentQuestionIndex(index => index + 1);
    } else {
      history.push(map.InvestigationSynthesis(brickId));
    }
  };
  /* Changing question in build */

  const createNewQuestion = () => {
    if (!isTutorialPassed()) {
      setSkipDialog(true);
      return;
    }
    if (!canEdit) { return; }
    if (locked) { return; }
    const newQuestion = convertQuestion(getNewQuestion(QuestionTypeEnum.None, false))
    questions.push([newQuestion]);
    console.log(newQuestion);
    setCurrentQuestionIndex(questions.length - 1);

    if (history.location.pathname.slice(-10) === '/synthesis') {
      history.push(`/build/brick/${brickId}/investigation/question`);
    }
  };

  const moveToSynthesis = () => {
    history.push(map.InvestigationSynthesis(brickId));
  }

  const setQuestionTypeAndMove = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    setQuestionType(type);
    history.push(`/build/brick/${brickId}/investigation/question-component`);
  };

  const componentFocus = (index: number) => {
    setFocusIndex(index);
  };

  const setQuestionType = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    var index = getQuestionIndex(activeQuestion);
    const updatedQuestions = setQuestionTypeByIndex(questions, index, type);
  };

  const convertQuestionTypes = (type: QuestionTypeEnum) => {
    if (locked) { return; }
    convertToQuestionType(questions, activeQuestion, type);
  };

  const deleteQuestionByIndex = (index: number) => {
    removeQuestionByIndex(questions, index);
    setDeleteDialog(false);
    setCurrentQuestionIndex(deleteQuestionIndex <= 0 ? 0 : deleteQuestionIndex - 1);
  }

  const removeQuestion = (index: number) => {
    if (locked) { return; }
    if (questions.length === 1) {
      setLastQuestionDialog(true);
      return;
    }
    if (questions.get(index).get("type")) {
      setDeleteDialog(true);
      setDeleteIndex(index);
      return;
    }
    deleteQuestionByIndex(index);
  };

  const selectQuestion = (index: number) => {
    if (history.location.pathname.slice(-10) === '/synthesis') {
      setMovingFromSynthesis(true);
    }
    setCurrentQuestionIndex(index);
    if (history.location.pathname.slice(-10) === '/synthesis') {
      history.push(`/build/brick/${brickId}/investigation/question`);
    }
  };

  const toggleLock = () => {
    setLock(!locked);
    ybrick.set("locked", !locked);
  }

  if (ybrick.get("id") !== brickId) {
    return <PageLoader content="...Loading..." />;
  }

  const moveToReview = () => {
    let invalidQuestion: Y.Doc | undefined;
    questions.forEach(question => {
      const jsonQuestion = toRenderJSON(question.getMap());
      if(!validateQuestion(jsonQuestion)){
        invalidQuestion = question;
      }
    });

    // synthesis invalid
    if ((!synthesis || synthesis.toString().trim()) === "" && !invalidQuestion) {
      setSubmitDialog(true);
      return;
    }

    if (invalidQuestion) {
      let invalidQuestionJson = invalidQuestion.getMap().toJSON();
      let invalid = isHighlightInvalid(invalidQuestionJson);
      if (invalid === false) {
        let isLine = false;
        if (invalidQuestionJson.type === QuestionTypeEnum.LineHighlighting) {
          isLine = true;
        }
        setInvalidHighlight({ isOpen: true, isLine });
      } else {
        const comp = getUniqueComponent(invalidQuestion).toJSON();

        let answersCount = 1;
        if (comp.list) {
          answersCount = comp.list.length;
        }
        let isHintInvalid = validateHint(invalidQuestionJson.hint, answersCount);
        if (isHintInvalid) {
          let index = getQuestionIndex(invalidQuestion);
          setInvalidHint({ isOpen: true, questionNumber: index + 1});
        } else {
          setSubmitDialog(true);
        }
      }
    } else {
      if (proposalResult.isValid) {
        let buildQuestion = GetCashedBuildQuestion();
        props.forgetBrick();

        if (isSynthesisPage) {
          history.push(`/play-preview/brick/${brickId}/intro`);
        } else if (
          buildQuestion && buildQuestion.questionNumber &&
          buildQuestion.brickId === brickId &&
          buildQuestion.isTwoOrMoreRedirect
        ) {
          history.push(`/play-preview/brick/${brickId}/live`);
        } else {
          history.push(`/play-preview/brick/${brickId}/intro`);
        }
      } else {
        setProposalInvalidOpen(true);
      }
    }
  }

  const moveToInvalidProposal = () => {
    history.push(proposalResult.url);
  }

  const submitInvalidBrick = () => {
    history.push(`/back-to-work`);
  }

  const moveToRedTab = () => {
    const index = getFirstInvalidQuestion(toRenderJSON(questions));
    setCurrentQuestionIndex(index);
  }

  const hideInvalidBrick = () => {
    setValidation(true);
    setSubmitDialog(false);
    moveToRedTab();
  }

  const setAutoSaveTime = () => {
    let time = Date.now();
    lastAutoSave = time;
    setLastAutoSave(time);
  }

  const exitAndSave = () => {
    history.push('/home');
  }

  const renderBuildQuestion = () => {
    return (
      <QuestionPanelWorkArea
        brickId={brickId}
        history={history}
        synthesis={ybrick.get("synthesis")}
        questionsCount={questions ? questions.length : 0}
        yquestion={activeQuestion}
        canEdit={canEdit}
        locked={locked}
        isAuthor={isAuthor}
        validationRequired={validationRequired}
        initSuggestionExpanded={initSuggestionExpanded}
        componentFocus={componentFocus}
        getQuestionIndex={getQuestionIndex}
        toggleLock={toggleLock}
        setQuestionType={convertQuestionTypes}
        setPreviousQuestion={setPreviousQuestion}
        nextOrNewQuestion={setNextQuestion}
        undo={undo}
        redo={redo}
        undoRedoService={undoRedoService}
      />
    );
  };

  const renderQuestionComponent = () => {
    if (!isTutorialPassed()) {
      return (
        <TutorialWorkArea
          brickId={brickId}
          step={step}
          setStep={setStep}
          user={props.user}
          skipTutorial={() => skipTutorial(true)}
        />
      );
    }
    let type = QuestionTypeEnum.None;
    if (activeQuestion && activeQuestion.getMap().get("type")) {
      type = activeQuestion.getMap().get("type");
    }
    return (
      <QuestionTypePage
        history={history}
        brickId={brickId}
        setHoverQuestion={setHoverQuestion}
        questionId={activeQuestion.getMap().get("id")}
        setQuestionType={setQuestionTypeAndMove}
        questionType={type}
      />
    );
  };

  const isTutorialPassed = () => {
    const isCurrentEditor = (props.reduxBrick.editors?.findIndex((e:any) => e.id === props.user.id) ?? -1) >= 0;
    if (isCurrentEditor) {
      return true;
    }
    if (props.user.tutorialPassed) {
      return true;
    }
    if (tutorialSkipped) {
      return true;
    }
    if (questions.length > 1) {
      return true;
    }
    if (questions.get(0)?.getMap() && questions.get(0)?.getMap().get("type") !== QuestionTypeEnum.None) {
      return true;
    }
    return false;
  }

  const renderPanel = () => {
    return (
      <Switch>
        <Route path="/build/brick/:brickId/investigation/question-component">
          {renderBuildQuestion}
        </Route>
        <Route path="/build/brick/:brickId/investigation/question">
          {renderQuestionComponent}
        </Route>
        <Route path="/build/brick/:brickId/synthesis">
          <SynthesisPage
            locked={locked}
            editOnly={!canEdit}
            synthesis={synthesis}
            initSuggestionExpanded={initSuggestionExpanded}
            undoRedoService={undoRedoService}
            undo={undo}
            redo={redo}
           />
        </Route>
      </Switch>
    );
  }

  const renderQuestionTypePreview = () => {
    if (isTutorialPassed()) {
      return <QuestionTypePreview
        hoverQuestion={hoverQuestion}
        activeQuestionType={activeQuestionType}
        nextQuestion={setNextQuestion}
        prevQuestion={setPrevFromPhone}
      />;
    }
    return <TutorialPhonePreview step={step} />;
  }

  let isValid = true;
  questions.forEach(q => {
    let isQuestionValid = validateQuestion(toRenderJSON(q.getMap()));
    if (!isQuestionValid) {
      isValid = false;
    }
  });

  const switchQuestions = (newQuestions: { id: string }[]) => {
    if (canEdit === true) {
      // create a new doc and sync it with this one.
      const newDoc = new Y.Doc();
      const oldUpdate = Y.encodeStateAsUpdate(ydoc);
      Y.applyUpdate(newDoc, oldUpdate);

      const newQuestionsArray = new Y.Array();
      const qs = newQuestions.map(question =>
        questions
          .map((q: Y.Doc) => ({ guid: q.guid, doc: Y.Doc }))
          .find(q => q.guid === question.id)?.doc
      );
      newDoc.getMap().set("questions", newQuestionsArray);

      const newState = Y.encodeStateVector(newDoc);
      const newUpdate = Y.encodeStateAsUpdate(ydoc, newState);
      Y.applyUpdate(ydoc, newUpdate);

      setAutoSaveTime();
      setSavingStatus(true);
    }
  }

  const moveToLastQuestion = () => {
    history.push(`/build/brick/${brickId}/investigation/question-component/${questions.get(questions.length - 1).get("id")}`);
  }

  if (!synthesis || synthesis.toString().trim() === "") {
    isValid = false;
  }

  const isPublisher = checkPublisher(props.user, props.reduxBrick);
  const isAdmin = checkAdmin(props.user.roles);

  const renderBuildPage = () => {
    return (
      <div className="investigation-build-page">
      <BuildNavigation
        tutorialStep={step}
        user={props.user}
        isTutorialSkipped={isTutorialPassed()}
        isValid={isValid}
        moveToReview={moveToReview}
        isEditor={isCurrentEditor}
        isPublisher={isPublisher}
        isAdmin={isAdmin}
        isAuthor={isAuthor}
        history={history}
        brick={props.reduxBrick}
        exitAndSave={exitAndSave}
      />
      <Hidden only={['xs', 'sm']}>
        <TutorialLabels isTutorialPassed={isTutorialPassed()} />
        <YourProposalLink
          brickId={brickId}
          tutorialStep={step}
          invalid={validationRequired && !proposalResult.isValid}
          isTutorialPassed={isTutorialPassed}
        />
        <Grid
          container direction="row"
          className="investigation-build-background"
          alignItems="center"
        >
          <Grid
            container
            item xs={12} sm={12} md={9}
            alignItems="center"
            style={{ height: "100%" }}
            className="question-container"
          >
            <Grid
              container direction="row"
              justify="center" alignItems="center"
              style={{ height: "100%" }}
            >
              <div className="build-brick-title">
                <div>{ybrick.get("title")}</div>
              </div>
              <Grid
                container
                item xs={12} sm={12} md={9}
                style={{ height: "90%", width: "75vw", minWidth: 'none' }}
              >
                <DragableTabs
                  history={history}
                  setQuestions={switchQuestions}
                  yquestions={questions}
                  currentQuestionIndex={currentQuestionIndex}
                  synthesis={synthesis.toString()}
                  validationRequired={validationRequired}
                  tutorialSkipped={isTutorialPassed()}
                  openSkipTutorial={openSkipTutorial}
                  tutorialStep={isTutorialPassed() ? TutorialStep.None : step}
                  isSynthesisPage={isSynthesisPage}
                  moveToSynthesis={moveToSynthesis}
                  createNewQuestion={createNewQuestion}
                  selectQuestion={selectQuestion}
                  removeQuestion={removeQuestion}
                  moveToLastQuestion={moveToLastQuestion}
                />
                {renderPanel()}
              </Grid>
            </Grid>
          </Grid>
          <LastSave updated={new Date(ybrick.get("updated")).toString()} tutorialStep={isTutorialPassed() ? TutorialStep.None : step} isSaving={isSaving} saveError={hasSaveError} />
          <Route path="/build/brick/:brickId/investigation/" exact>
            <Redirect to={`/build/brick/${ybrick.get("id")}/investigation/question`} />
          </Route>
          <Route path="/build/brick/:brickId/investigation/question-component">
            {activeQuestion &&
              <PhoneQuestionPreview
                question={toRenderJSON(activeQuestion.getMap())}
                focusIndex={focusIndex}
                getQuestionIndex={getJSONQuestionIndex}
                nextQuestion={setNextQuestion}
                prevQuestion={setPrevFromPhone}
              />
            }
          </Route>
          <Route path="/build/brick/:brickId/investigation/question">
            {renderQuestionTypePreview()}
          </Route>
          <Route path="/build/brick/:brickId/synthesis">
            <PhonePreview
              Component={SynthesisPreviewComponent}
              prev={() => selectQuestion(questions.length - 1)}
              next={()=>{}}
              nextDisabled={true}
              data={{synthesis: toRenderJSON(ybrick).synthesis, brickLength: ybrick.get("brickLength")}}
            />
          </Route>
        </Grid>
        <HighlightInvalidDialog
          isOpen={highlightInvalid.isOpen}
          isLines={highlightInvalid.isLine}
          close={() => {
            setValidation(true);
            setInvalidHighlight({ isOpen: false, isLine: false})
          }}
        />
        <HintInvalidDialog
          isOpen={invalidHint.isOpen}
          invalidQuestionNumber={invalidHint.questionNumber}
          close={() => {
            setValidation(true);
            setInvalidHint({isOpen: false, questionNumber: -1})
          }}
        />
        <QuestionInvalidDialog
          isOpen={submitDialogOpen}
          close={() => setSubmitDialog(false)}
          submit={() => submitInvalidBrick()}
          hide={() => hideInvalidBrick()}
        />
        <ProposalInvalidDialog
          isOpen={!proposalResult.isValid && proposalInvalidOpen}
          close={() => setProposalInvalidOpen(false)}
          submit={() => submitInvalidBrick()}
          hide={() => moveToInvalidProposal()}
        />
        <DeleteQuestionDialog
          open={deleteDialogOpen}
          index={deleteQuestionIndex}
          setDialog={setDeleteDialog}
          deleteQuestion={deleteQuestionByIndex}
        />
        <ValidationFailedDialog
          isOpen={lastQuestionDialog}
          header="You can`t delete last question"
          close={() => setLastQuestionDialog(false)}
        />
        <SkipTutorialDialog
          open={skipTutorialOpen}
          close={() => setSkipDialog(false)}
          skip={() => {
            skipTutorial(true);
            setSkipDialog(false);
          }}
        />
      </Hidden>
      <Hidden only={['md', 'lg', 'xl']}>
        <div className="blue-page">
          <DesktopVersionDialog history={history} />
        </div>
      </Hidden>
    </div>
  );
  }

  const proposalBaseUrl = '/build/brick/' + brickId;

  return (
    <Switch>
      <Route
        path={[
          proposalBaseUrl + "/subject",
          proposalBaseUrl + TitleRoutePart,
          proposalBaseUrl + OpenQuestionRoutePart,
          proposalBaseUrl + BrickLengthRoutePart,
          proposalBaseUrl + BriefRoutePart,
          proposalBaseUrl + PrepRoutePart,
          proposalBaseUrl + ProposalReviewPart
        ]}
      >
        <Proposal history={history} location={props.location} match={props.match} />
      </Route>
      <Route path="/build/brick/:brickId">
        {renderBuildPage()}
      </Route>
    </Switch>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  reduxBrick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
  startEditing: (brickId: number) => dispatch(socketStartEditing(brickId)),
  changeQuestion: (questionId?: number) => dispatch(socketNavigateToQuestion(questionId)),
  forgetBrick: () => dispatch(actions.forgetBrick()),
});

const connector = connect(mapState, mapDispatch);

export default connector(InvestigationBuildPage);
