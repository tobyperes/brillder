import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import queryString from 'query-string';
import { isIPad13, isMobile, isTablet } from 'react-device-detect';

import Cover from "./cover/Cover";
import Sections from "./sections/Sections";
import Introduction from "./introduction/Introduction";
import Live from "./live/Live";
import ProvisionalScore from "./provisionalScore/ProvisionalScore";
import Synthesis from "./synthesis/Synthesis";
import Review from "./review/ReviewPage";
import Ending from "./ending/Ending";
import FinalStep from "./finalStep/FinalStep";
import HomeButton from "components/baseComponents/homeButton/HomeButton";
import PageHeadWithMenu, {
  PageEnum,
} from "components/baseComponents/pageHeader/PageHeadWithMenu";

import { Brick, isAuthenticated } from "model/brick";
import { PlayStatus, BrickAttempt } from "./model";
import {
  Question,
  QuestionTypeEnum,
  QuestionComponentTypeEnum,
  HintStatus,
} from "model/question";
import { calcBrickLiveAttempt, calcBrickReviewAttempt } from './services/scoring';
import { getBrillderTitle } from "components/services/titleService";
import { prefillAttempts } from "components/services/PlayService";
import PlayLeftSidebar from './PlayLeftSidebar';
import { PlayMode } from './model';
import { ReduxCombinedState } from "redux/reducers";
import { BrickFieldNames } from "components/build/proposal/model";
import { maximizeZendeskButton, minimizeZendeskButton } from 'services/zendesk';
import { getPlayPath } from "./service";
import UnauthorizedUserDialog from "components/baseComponents/dialogs/UnauthorizedUserDialog";
import map, { playIntro } from "components/map";
import userActions from 'redux/actions/user';
import { User } from "model/user";
import { ChooseOneComponent } from "./questionTypes/choose/chooseOne/ChooseOne";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import PhonePlayFooter from "./phoneComponents/PhonePlayFooter";
import { createUserByEmail } from "services/axios/user";
import routes, { playBrief, PlayCoverLastPrefix, playNewPrep, playPreInvesigation, playPrePrep, playSections } from "./routes";
import { isPhone } from "services/phone";
import Brief from "./brief/Brief";
import PrePrep from "./prePrep/PrePrep";
import NewPrep from "./newPrep/NewPrep";
import PreInvestigationPage from "./preInvestigation/PreInvestigation";
import PreSynthesis from "./preSynthesis/PreSynthesis";
import PreReview from "./preReview/PreReview";
import { clearAssignmentId, getAssignmentId } from "localStorage/playAssignmentId";
import { trackSignUp } from "services/matomo";


function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface BrickRoutingProps {
  match: any;
  history: any;
  location: any;

  // redux
  brick: Brick;
  user: User;
  isAuthenticated: isAuthenticated;
  getUser(): Promise<any>;
  setUser(user: User): void;
}

const MobileTheme = React.lazy(() => import('./themes/BrickPageMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/BrickPageTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/BrickPageDesktopTheme'));

const BrickRouting: React.FC<BrickRoutingProps> = (props) => {
  const parsedBrick = parseAndShuffleQuestions(props.brick);
  const [saveFailed, setFailed] = React.useState(false);
  const [brick, setBrick] = React.useState(parsedBrick);
  const initAttempts = prefillAttempts(brick.questions);
  const [status, setStatus] = React.useState(PlayStatus.Live);
  const [brickAttempt, setBrickAttempt] = React.useState({} as BrickAttempt);
  const [attempts, setAttempts] = React.useState(initAttempts);
  const [reviewAttempts, setReviewAttempts] = React.useState(initAttempts);
  const [startTime, setStartTime] = React.useState(undefined);
  const [mode, setMode] = React.useState(PlayMode.Normal);
  const [liveEndTime, setLiveEndTime] = React.useState(null as any);
  const [reviewEndTime, setReviewEndTime] = React.useState(null as any);
  const location = useLocation();
  const finalStep = location.pathname.search("/finalStep") >= 0;
  const [headerHidden, setHeader] = React.useState(false);
  const [unauthorizedOpen, setUnauthorized] = React.useState(false);
  const [sidebarRolledUp, toggleSideBar] = React.useState(false);
  const [searchString, setSearchString] = React.useState("");
  const [attemptId, setAttemptId] = React.useState<string>();


  const {history} = props;

  // used for unauthenticated user.
  const [userToken, setUserToken] = React.useState<string>();
  const [emailInvalid, setInvalidEmail] = React.useState<boolean | null>(null); // null - before submit button clicked, true - invalid


  // only cover page should have big sidebar
  useEffect(() => {
    if (!isPhone()) {
      let {pathname} = history.location;
      if (pathname.search(PlayCoverLastPrefix) === -1) {
        setSidebar(true);
      }
    }
  /*eslint-disable-next-line*/
  }, [])

  // by default move to Prep
  const splited = location.pathname.split('/');
  if (splited.length === 4) {
    if (isPhone()) {
      history.push(routes.phonePrep(brick.id));
    } else {
      history.push(routes.playNewPrep(brick.id));
    }
    return <PageLoader content="...Getting Brick..." />;
  }

  const updateAttempts = (attempt: any, index: number) => {
    if (attempt) {
      attempts[index] = attempt;
      setAttempts(attempts);
    }
  };

  const updateReviewAttempts = (attempt: any, index: number) => {
    if (attempt) {
      reviewAttempts[index] = attempt;
      setReviewAttempts(reviewAttempts);
    }
  };

  const finishLive = () => {
    var ba = calcBrickLiveAttempt(brick, attempts);
    setStatus(PlayStatus.Review);
    setBrickAttempt(ba);
    setReviewAttempts(Object.assign([], attempts));
    setStatus(PlayStatus.Review);
  };

  const finishReview = () => {
    var ba = calcBrickReviewAttempt(brick, reviewAttempts, brickAttempt);
    setBrickAttempt(ba);
    setStatus(PlayStatus.Ending);
    saveBrickAttempt(ba);
  };

  const finishBrick = () => {
    history.push(`/play/brick/${brick.id}/finalStep`);
  }

  const createBrickAttempt = async (brickAttempt: BrickAttempt) => {
    brickAttempt.brick = brick;
    brickAttempt.brickId = brick.id;
    brickAttempt.studentId = props.user.id;

    const assignmentId = getAssignmentId();
    if (assignmentId) {
      brickAttempt.assignmentId = assignmentId;
    }
    return axios.post(
      process.env.REACT_APP_BACKEND_HOST + "/play/attempt",
      { brickAttempt, userId: props.user.id },
      { withCredentials: true }
    ).then(async (response) => {
      clearAssignmentId();
      if (!props.user.hasPlayedBrick && props.isAuthenticated === isAuthenticated.True) {
        await props.getUser();
      }
      setAttemptId(response.data);
    }).catch(() => {
      setFailed(true);
    });
  };

  const saveBrickAttempt = async (brickAttempt: BrickAttempt) => {
    if(!attemptId) {
      return createBrickAttempt(brickAttempt);
    }

    brickAttempt.brick = brick;
    brickAttempt.brickId = brick.id;
    brickAttempt.studentId = props.user.id;
    const assignmentId = getAssignmentId();
    if (assignmentId) {
      brickAttempt.assignmentId = assignmentId;
    }
    return axios.put(
      process.env.REACT_APP_BACKEND_HOST + "/play/attempt",
      { id: attemptId, userId: props.user.id, body: brickAttempt },
      { withCredentials: true }
    ).then(async (response) => {
      clearAssignmentId();
      if (!props.user.hasPlayedBrick && props.isAuthenticated === isAuthenticated.True) {
        await props.getUser();
      }
      setAttemptId(response.data);
    }).catch(() => {
      setFailed(true);
    });
  }

  const setSidebar = (state?: boolean) => {
    if (typeof state === "boolean") {
      toggleSideBar(state);
      if (!state) {
        maximizeZendeskButton();
      } else {
        minimizeZendeskButton();
      }
    } else {
      toggleSideBar(!sidebarRolledUp);
      if (sidebarRolledUp) {
        maximizeZendeskButton();
      } else {
        minimizeZendeskButton();
      }
    }
  }

  const moveToLive = () => {
    let liveLink = `/play/brick/${brick.id}/live`;
    const values = queryString.parse(props.location.search);
    const query = {} as any;
    if (values.resume === 'true') {
      if (values.activeStep) {
        query.activeStep = values.activeStep;
      }
    }
    if (isPhone()) {
      setHeader(true);
    }
    history.push(liveLink);
    setSidebar(true);
  }

  const coverMoveNext = () => {
    if (isPhone()) {
      moveToIntro();
    } else {
      if (props.user) {
        moveToBrief();
      } else {
        moveToSections();
      }
      setSidebar(true);
    }
  }
      
  const moveToSections = () => history.push(playSections(brick.id));
  const moveToBrief = () => history.push(playBrief(brick.id));
  const moveToPrePrep = () => history.push(playPrePrep(brick.id));
  const moveToNewPrep = () => history.push(playNewPrep(brick.id));
  const moveToIntro = () => history.push(playIntro(brick.id));
  const moveToPreInvestigation = () => history.push(playPreInvesigation(brick.id));

  const moveToReview = () => {
    if (props.user) {
      if (!isPhone()) {
        return history.push(routes.playPreReview(brick.id));
      }
      saveBrickAttempt(brickAttempt);
      const playPath = getPlayPath(false, brick.id);
      history.push(`${playPath}/review`);
    } else {
      // unauthorized users finish it here. show popup
      setUnauthorized(true);
    }
  }

  const moveToPostPlay = () => {
    if(props.isAuthenticated === isAuthenticated.True) {
      history.push(map.postPlay(brick.id, props.user.id));
    } else if (userToken) {
      history.push(map.ActivateAccount + "?token=" + userToken);
    }
  }

  const createInactiveAccount = async (email: string) => {
    if (!props.user) {
      // create a new account for an unauthorized user.
      let data = await createUserByEmail(email);
      if (data) {
        const { user, token } = data;
        props.setUser(user);
        setUnauthorized(false);
        setUserToken(token);
        trackSignUp();
      } else {
        setInvalidEmail(true);
      }
    }
  }

  const again = () => {
    history.push(`/play/dashboard`);
  }

  const onHighlight = (name: BrickFieldNames, value: string) => {
    brick[name] = value;
    setBrick(brick);
  }

  const search = () => {
    history.push(map.ViewAllPage + '?searchString=' + searchString);
  }

  const searching = (v: string) => {
    setSearchString(v);
  }

  const renderPhoneFooter = () => {
    return <PhonePlayFooter
      brick={brick}
      user={props.user}
      history={history}
      menuOpen={false}
      mode={mode}
      setMode={setMode}
      moveToPostPlay={moveToPostPlay}
    />;
  }

  const renderHead = () => {
    let isMobileHidden = false;
    const live = location.pathname.search("/live");
    const score = location.pathname.search("/provisionalScore");
    const synthesis = location.pathname.search("/synthesis");
    const review = location.pathname.search("/review");
    const ending = location.pathname.search("/ending");
    if (live > 0 || score > 0 || synthesis > 0 || review > 0 || ending > 0) {
      isMobileHidden = true;
    }
    let link = map.MainPage;
    if (!props.user) {
      link = map.ViewAllPage;
    }
    if (!isPhone() && sidebarRolledUp) {
      return <HomeButton link={link} />;
    }
    if (headerHidden) {
      return <div></div>;
    }
    return (
      <PageHeadWithMenu
        isMobileHidden={isMobileHidden}
        page={PageEnum.Play}
        user={props.user}
        link={link}
        history={history}
        search={search}
        searching={searching}
      />
    );
  };

  const renderRouter = () => {
    return <>
      <Helmet>
        <title>{getBrillderTitle(brick.title)}</title>
        <meta property="og:title" content={brick.title} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={brick.openQuestion} />
        <meta property="og:image" content={brick.coverImage} />
      </Helmet>
      <Switch>
        <Route exac path={routes.coverRoute}>
          <Cover
            user={props.user}
            location={props.location}
            history={history}
            brick={brick}
            moveNext={coverMoveNext}
          />
          {isPhone() && renderPhoneFooter()}
        </Route>
        <Route exact path={routes.briefRoute}>
          <Brief brick={brick} mode={mode} user={props.user} moveNext={moveToPrePrep} onHighlight={onHighlight} />
        </Route>
        <Route exact path={routes.sectionsRoute}>
          <Sections brick={brick} moveNext={moveToBrief} />
        </Route>
        <Route exact path={routes.prePrepRoute}>
          <PrePrep brick={brick} mode={mode} moveNext={moveToNewPrep} onHighlight={onHighlight} />
        </Route>
        <Route exact path={routes.newPrepRoute}>
          <NewPrep brick={brick} mode={mode} moveNext={moveToPreInvestigation} onHighlight={onHighlight} />
        </Route>
        <Route exact path={routes.preInvestigationRoute}>
          <PreInvestigationPage user={props.user} brick={brick} moveNext={moveToLive} />
        </Route>

        <Route exac path={["/play/brick/:brickId/intro", "/play/brick/:brickId/prep"]}>
          <Introduction
            location={props.location}
            history={history}
            mode={mode}
            brick={brick}
            startTime={startTime}
            setStartTime={setStartTime}
            moveNext={moveToLive}
            onHighlight={onHighlight}
          />
          {isPhone() && renderPhoneFooter()}
        </Route>
        <Route exac path="/play/brick/:brickId/live">
          <Live
            mode={mode}
            status={status}
            attempts={attempts}
            questions={brick.questions}
            brick={brick}
            updateAttempts={updateAttempts}
            finishBrick={finishLive}
            endTime={liveEndTime}
            setEndTime={time => {
              if (liveEndTime === null) {
                setLiveEndTime(time);
              }
            }}
          />
          {isPhone() && renderPhoneFooter()}
        </Route>
        <Route exac path="/play/brick/:brickId/provisionalScore">
          <ProvisionalScore
            user={props.user}
            history={history}
            location={location}
            status={status}
            brick={brick}
            attempts={attempts}
          />
          {isPhone() && renderPhoneFooter()}
        </Route>

        <Route exact path={routes.preSynthesisRoute}>
          <PreSynthesis brick={brick} history={history} />
        </Route>

        <Route exac path={routes.synthesisRoute}>
          <Synthesis mode={mode} status={status} brick={brick} moveNext={moveToReview} onHighlight={onHighlight} />
          {isPhone() && renderPhoneFooter()}
        </Route>
        
        <Route exact path={routes.preReviewRoute}>
          <PreReview brick={brick} history={history} />
        </Route>

        <Route exac path={routes.reviewRoute}>
          <Review
            mode={mode}
            status={status}
            history={history}
            startTime={startTime}
            brick={brick}
            updateAttempts={updateReviewAttempts}
            attempts={attempts}
            finishBrick={finishReview}
            endTime={reviewEndTime}
            setEndTime={time => {
              if (reviewEndTime === null) {
                setReviewEndTime(time);
              }
            }}
          />
          {isPhone() && renderPhoneFooter()}
        </Route>
        <Route exac path="/play/brick/:brickId/ending">
          <Ending
            status={status}
            location={location}
            brick={brick}
            history={history}
            brickAttempt={brickAttempt}
            move={finishBrick}
          />
          {isPhone() && renderPhoneFooter()}
        </Route>
        <Route exac path="/play/brick/:brickId/finalStep">
          <FinalStep
            user={props.user}
            brick={brick}
            history={history}
            moveNext={moveToPostPlay}
          />
          {isPhone() && renderPhoneFooter()}
        </Route>
        <ValidationFailedDialog
          isOpen={saveFailed}
          header="Can`t save your attempt"
          close={() => setFailed(false)}
        />
      </Switch>
    </>;
  };

  let className = "sorted-row";
  if (sidebarRolledUp) {
    className += " sorted-row-expanded";
  }

  return (
    <React.Suspense fallback={<></>}>
      {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
      <div className="play-preview-pages">
        {isPhone() ? <div /> : renderHead()}
        <div className={className}>
          {!isPhone() &&
            <PlayLeftSidebar
              history={history}
              brick={brick}
              mode={mode}
              sidebarRolledUp={sidebarRolledUp}
              empty={finalStep}
              setMode={setMode}
              toggleSidebar={setSidebar}
            />}
          {renderRouter()}
        </div>
        <UnauthorizedUserDialog
          isOpen={unauthorizedOpen}
          emailInvalid={emailInvalid}
          login={(email) => createInactiveAccount(email)}
          again={again}
          close={() => setUnauthorized(false)}
        />
      </div>
    </React.Suspense>
  );
};

const parseAndShuffleQuestions = (brick: Brick): Brick => {
  /* Parsing each Question object from json <contentBlocks> */
  if (!brick) {
    return brick;
  }
  const parsedQuestions: Question[] = [];
  for (const question of brick.questions) {
    if (!question.components) {
      try {
        const parsedQuestion = JSON.parse(question.contentBlocks as string);
        if (parsedQuestion.components) {
          let q = {
            id: question.id,
            type: question.type,
            hint: parsedQuestion.hint,
            firstComponent: parsedQuestion.firstComponent ? parsedQuestion.firstComponent : { type: QuestionComponentTypeEnum.Text, value: '' },
            components: parsedQuestion.components,
          } as Question;
          parsedQuestions.push(q);
        }
      } catch (e) { }
    } else {
      parsedQuestions.push(question);
    }
  }

  let shuffleBrick = Object.assign({}, brick);

  shuffleBrick.questions = parsedQuestions;

  shuffleBrick.questions.forEach((question) => {
    if (
      question.type === QuestionTypeEnum.ChooseOne ||
      question.type === QuestionTypeEnum.ChooseSeveral
    ) {
      question.components.forEach((c: ChooseOneComponent) => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          const { hint } = question;
          if (hint.status === HintStatus.Each) {
            let list = c.list as any;
            for (let [index, item] of list.entries()) {
              item.hint = question.hint.list[index];
            }
          }
          c.list.map((c, i) => c.index = i);
          c.list = shuffle(c.list);
        }
      });
    } else if (
      question.type === QuestionTypeEnum.VerticalShuffle ||
      question.type === QuestionTypeEnum.HorizontalShuffle
    ) {
      question.components.forEach((c) => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          for (let [index, item] of c.list.entries()) {
            item.index = index;
            item.hint = question.hint.list[index];
          }
          c.list.map((c: any, i: number) => c.index = i);
          c.list = shuffle(c.list);
        }
      });
    } else if (question.type === QuestionTypeEnum.PairMatch) {
      question.components.forEach((c) => {
        if (c.type === QuestionComponentTypeEnum.Component) {
          for (let [index, item] of c.list.entries()) {
            item.index = index;
            item.hint = question.hint.list[index];
          }
          const choices = c.list.map((a: any) => ({
            value: a.value,
            index: a.index,
            valueFile: a.valueFile,
            answerType: a.answerType,
          }));
          c.choices = shuffle(choices);
        }
      });
    }
  });
  return shuffleBrick;
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  brick: state.brick.brick,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
  setUser: (user: User) => dispatch(userActions.setUser(user)),
});

const connector = connect(mapState, mapDispatch);

export default connector(BrickRouting);
