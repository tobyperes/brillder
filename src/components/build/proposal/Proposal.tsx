import React from "react";
import { Route } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { connect } from "react-redux";
import { History } from "history";

import "./Proposal.scss";
import actions from "redux/actions/brickActions";
import * as socketActions from "redux/actions/socket";
import SubjectPage from "./questionnaire/subject/Subject";
import BrickTitle from "./questionnaire/brickTitle/brickTitle";
import OpenQuestion from "./questionnaire/openQuestion/openQuestion";
import { AcademicLevel, BrickLengthEnum, KeyWord, Subject } from "model/brick";
import BrickLength from "./questionnaire/brickLength/brickLength";
import Brief from "./questionnaire/brief/brief";
import Prep from "./questionnaire/prep/prep";
import HomeButton from "components/baseComponents/homeButton/HomeButton";
import ProposalReview from "./questionnaire/proposalReview/ProposalReview";
import { Brick, Author } from "model/brick";
import { User } from "model/user";
import CloseProposalDialog from "components/build/baseComponents/dialogs/CloseProposalDialog";
import VersionLabel from "components/baseComponents/VersionLabel";
import { setBrillderTitle } from "components/services/titleService";
import { canEditBrick } from "components/services/brickService";
import { ReduxCombinedState } from "redux/reducers";
import { BrickFieldNames, BrickLengthRoutePart, BriefRoutePart, OpenQuestionRoutePart, PlayButtonStatus, PrepRoutePart, ProposalReviewPart, TitleRoutePart } from "./model";
import { validateQuestion } from "components/build/questionService/ValidateQuestionService";
import {
  parseQuestion,
  ApiQuestion,
} from "components/build/questionService/QuestionService";
import map from "components/map";

import { setLocalBrick, getLocalBrick } from "localStorage/proposal";
import { Question } from "model/question";
import { loadSubjects } from "components/services/subject";
import { leftKeyPressed, rightKeyPressed } from "components/services/key";

interface ProposalProps {
  history: History;
  match: any;
  location: any;

  //redux
  brick: Brick;
  user: User;
  saveBrick(brick: Brick): Promise<Brick | null>;
  createBrick(brick: Brick): Promise<Brick | null>;
  socketStartEditing(brickId: number): void;
}

interface ProposalState {
  brick: Brick;
  saving: boolean;
  saved: boolean;
  subjects: Subject[];
  isDialogOpen: boolean;
  moving: boolean;
  handleKey(e: any): void;
}

class Proposal extends React.Component<ProposalProps, ProposalState> {
  constructor(props: ProposalProps) {
    super(props);
    let subjectId = 0;
    const { user, brick } = props;
    const { subjects } = user;
    if (subjects.length === 1) {
      subjectId = subjects[0].id;
    }
    let initBrick = {
      subjectId,
      brickLength: BrickLengthEnum.None,
      title: "",
      openQuestion: "",
      brief: "",
      prep: "",
      synthesis: "",
    } as Brick;

    if (user) {
      initBrick.author = (user as any) as Author;
    }

    // getting brick from local storage
    let localBrick = getLocalBrick();
    if (localBrick) {
      initBrick = localBrick;
    }

    // if brick is fetched then set this brick and save in local storage
    if (brick) {
      initBrick = brick;
      setLocalBrick(brick);
    }

    if (initBrick.id) {
      this.props.socketStartEditing(initBrick.id); // start editing in socket as well.
    }

    this.state = {
      brick: initBrick,
      saved: false,
      saving: false,
      isDialogOpen: false,
      moving: false,
      subjects: [],
      handleKey: this.handleKey.bind(this)
    };

    this.getSubject();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  async handleKey(e: any) {
    if (e.target.tagName === "INPUT") { return; }
    if (e.target.classList.contains("ck-content")) { return; }

    const {history} = this.props;
    const {pathname} = this.props.location;
    const baseUrl = this.getBaseUrl();

    if (rightKeyPressed(e)) {
      if (pathname === map.ProposalSubject) {
        if (this.state.brick.subjectId) {
          history.push(baseUrl + TitleRoutePart);
        }
      } else if (pathname.slice(-TitleRoutePart.length) === TitleRoutePart) {
        history.push(baseUrl + OpenQuestionRoutePart);
      } else if (pathname.slice(-OpenQuestionRoutePart.length) === OpenQuestionRoutePart) {
        history.push(baseUrl + BrickLengthRoutePart);
      } else if (pathname.slice(-BrickLengthRoutePart.length) === BrickLengthRoutePart) {
        history.push(baseUrl + BriefRoutePart );
      } else if (pathname.slice(-BrickLengthRoutePart.length) === BrickLengthRoutePart) {
        history.push(baseUrl + BriefRoutePart);
      } else if (pathname.slice(-BriefRoutePart.length) === BriefRoutePart) {
        history.push(baseUrl + PrepRoutePart);
      } else if (pathname.slice(-PrepRoutePart.length) === PrepRoutePart) {
        this.saveLocalBrick(this.state.brick);
        await this.saveBrick(this.state.brick);
        history.push(baseUrl + ProposalReviewPart);
      }
    } else if (leftKeyPressed(e)) {
      if (pathname.slice(-OpenQuestionRoutePart.length) === OpenQuestionRoutePart) {
        history.push(baseUrl + TitleRoutePart)
      } else if (pathname.slice(-BrickLengthRoutePart.length) === BrickLengthRoutePart) {
        history.push(baseUrl + OpenQuestionRoutePart)
      } else if (pathname.slice(-BriefRoutePart.length) === BriefRoutePart) {
        history.push(baseUrl + BrickLengthRoutePart)
      } else if (pathname.slice(-PrepRoutePart.length) === PrepRoutePart) {
        history.push(baseUrl + BriefRoutePart);
      }
    }
  }

  async getSubject() {
    const subjects = await loadSubjects();
    if (subjects) {
      this.setState({subjects});
    }
  }

  async saveBrick(tempBrick: Brick) {
    if (this.state.saving === true) { return; }
    this.setState({saving: true});
    const { brick } = this.props;
    if (tempBrick.id) {
      await this.props.saveBrick(tempBrick);
    } else if (brick && brick.id) {
      tempBrick.id = brick.id;
      await this.props.saveBrick(tempBrick);
    } else {
      await this.props.createBrick(tempBrick);
    }
    this.setState({saving: false});
  }

  openDialog = () => this.setState({ isDialogOpen: true });
  closeDialog = () => this.setState({ isDialogOpen: false });

  goHome() {
    this.setState({ isDialogOpen: false });
    this.props.history.push("/home");
  }

  saveLocalBrick(brick: Brick) {
    this.setState({ brick });
    setLocalBrick(brick);
  }

  setCore = (isCore: boolean) =>
    this.saveLocalBrick({ ...this.state.brick, isCore });
  setSubject = (subjectId: number) =>
    this.saveLocalBrick({ ...this.state.brick, subject: undefined, subjectId });
  setCoreAndSubject = (subjectId: number, isCore: boolean) => 
    this.saveLocalBrick({ ...this.state.brick, subjectId, isCore });
  setTitles = (titles: any) =>
    this.saveLocalBrick({ ...this.state.brick, ...titles });
  setKeywords = (keywords: KeyWord[]) =>
    this.saveLocalBrick({ ...this.state.brick, keywords});
  setAcademicLevel = (academicLevel: AcademicLevel) =>
    this.saveLocalBrick({ ...this.state.brick, academicLevel});
  setOpenQuestion = (openQuestion: string) =>
    this.saveLocalBrick({ ...this.state.brick, openQuestion } as Brick);
  setBrief = (brief: string) =>
    this.saveLocalBrick({ ...this.state.brick, brief } as Brick);
  setPrep = (prep: string) =>
    this.saveLocalBrick({ ...this.state.brick, prep } as Brick);

  setBrickField = (name: BrickFieldNames, value: string) => {
    let { brick } = this.state;
    brick[name] = value;
    this.saveLocalBrick({ ...this.state.brick });
    this.setState({ brick });
  };

  setLength = (brickLength: BrickLengthEnum) => {
    let brick = { ...this.state.brick, brickLength } as Brick;
    this.saveLocalBrick(brick);
    return brick;
  };

  setLengthAndSave = (brickLength: BrickLengthEnum) => {
    const canEdit = canEditBrick(this.state.brick, this.props.user);
    if (!canEdit) {
      return;
    }
    let brick = this.setLength(brickLength);
    this.saveBrick(brick);
  };

  setPrepAndSave = (prep: string) => {
    const brick = { ...this.state.brick, prep } as Brick;
    this.saveLocalBrick(brick);
    this.saveBrick(brick);
  };

  saveAndMove = async () => {
    if (this.state.saving === true) { return; }
    this.setState({ saving: true });
    await this.saveBrick(this.state.brick);
    this.setState({ saved: true, saving: false });
  };

  async saveAndPreview(playStatus: PlayButtonStatus) {
    if (this.state.brick.id && playStatus === PlayButtonStatus.Valid) {
      await this.props.saveBrick(this.state.brick);
      this.props.history.push(map.playPreviewIntro(this.state.brick.id));
    }
  }

  getBaseUrl() {
    const {brickId} = this.props.match.params;
    if (brickId) {
      return '/build/brick/' + brickId;
    }
    return map.ProposalBase;
  }

  render() {
    const baseUrl = this.getBaseUrl();
    const { history } = this.props;
    const canEdit = canEditBrick(this.state.brick, this.props.user);

    setBrillderTitle();

    if (this.state.saved && this.state.moving === false) {
      this.setState({moving: true});

      if (this.props.brick) {
        history.push(
          `/build/brick/${this.props.brick.id}/investigation/question`
        );
      } else if (this.state.brick.id) {
        history.push(
          `/build/brick/${this.state.brick.id}/investigation/question`
        );
      } else {
        history.push(baseUrl + TitleRoutePart);
      }
    }

    const localBrick = this.state.brick;
    const { user } = this.props;

    let playStatus = PlayButtonStatus.Hidden;
    const { brick } = this.props;
    if (brick && brick.questions && brick.questions.length > 0) {
      playStatus = PlayButtonStatus.Valid;
      const parsedQuestions: Question[] = [];
      for (const question of brick.questions) {
        try {
          parseQuestion(question as ApiQuestion, parsedQuestions);
        } catch (e) { }
      }
      parsedQuestions.forEach((q) => {
        let isQuestionValid = validateQuestion(q as any);
        if (!isQuestionValid) {
          playStatus = PlayButtonStatus.Invalid;
        }
      });
    }

    return (
      <MuiThemeProvider>
        <div>
          <HomeButton onClick={() => this.openDialog()} />
          <div
            style={{ width: "100%", height: "100%" }}
            className="proposal-router"
          >
            <Route path={[map.ProposalSubject, '/build/brick/:brickId/subject']}>
              <SubjectPage
                location={history.location}
                baseUrl={baseUrl}
                subjects={user.subjects}
                subjectId={this.state.brick.subjectId ? this.state.brick.subjectId : ""}
                history={history}
                saveCore={this.setCore}
                saveSubject={this.setSubject}
                saveData={this.setCoreAndSubject}
              />
            </Route>
            <Route path={[map.ProposalTitle, '/build/brick/:brickId/brick-title']}>
              <BrickTitle
                user={user}
                history={history}
                baseUrl={baseUrl}
                playStatus={playStatus}
                parentState={localBrick}
                canEdit={canEdit}
                subjects={this.state.subjects}
                saveTitles={this.setTitles}
                setKeywords={this.setKeywords}
                setAcademicLevel={this.setAcademicLevel}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={[map.ProposalLength, '/build/brick/:brickId/length']}>
              <BrickLength
                baseUrl={baseUrl}
                playStatus={playStatus}
                length={localBrick.brickLength}
                canEdit={canEdit}
                saveLength={this.setLength}
                saveBrick={this.setLength}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={[map.ProposalOpenQuestion, '/build/brick/:brickId/open-question']}>
              <OpenQuestion
                baseUrl={baseUrl}
                playStatus={playStatus}
                history={history}
                selectedQuestion={localBrick.openQuestion}
                canEdit={canEdit}
                saveOpenQuestion={this.setOpenQuestion}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={[map.ProposalBrief, '/build/brick/:brickId/brief']}>
              <Brief
                baseUrl={baseUrl}
                playStatus={playStatus}
                parentBrief={localBrick.brief}
                canEdit={canEdit}
                saveBrief={this.setBrief}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <Route path={[map.ProposalPrep, '/build/brick/:brickId/prep']}>
              <Prep
                playStatus={playStatus}
                parentPrep={localBrick.prep}
                canEdit={canEdit}
                baseUrl={baseUrl}
                savePrep={this.setPrep}
                brickLength={localBrick.brickLength}
                saveBrick={this.setPrepAndSave}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            
            <Route path={[map.ProposalReview, '/build/brick/:brickId/plan']}>
              <ProposalReview
                playStatus={playStatus}
                brick={localBrick}
                baseUrl={baseUrl}
                history={history}
                canEdit={canEdit}
                user={user}
                setBrickField={this.setBrickField}
                setKeywords={this.setKeywords}
                setAcademicLevel={this.setAcademicLevel}
                saveBrick={this.saveAndMove}
                saveAndPreview={() => this.saveAndPreview(playStatus)}
              />
            </Route>
            <VersionLabel />
          </div>
          <CloseProposalDialog
            isOpen={this.state.isDialogOpen}
            close={() => this.closeDialog()}
            move={() => this.goHome()}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  brick: state.brick.brick,
});

const mapDispatch = (dispatch: any) => ({
  saveBrick: (brick: any) => dispatch(actions.saveBrick(brick)),
  createBrick: (brick: any) => dispatch(actions.createBrick(brick)),
  socketStartEditing: (brickId: number) => dispatch(socketActions.socketStartEditing(brickId)),
});

const connector = connect(mapState, mapDispatch);

export default connector(Proposal);
