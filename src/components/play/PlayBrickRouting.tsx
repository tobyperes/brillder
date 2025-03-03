import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import moment from 'moment';
import queryString from 'query-string';

import Cover from "./cover/Cover";
import Sections from "./sections/Sections";
import Introduction from "./newPrep/PhonePrep";
import Live from "./live/Live";
import ProvisionalScore from "./scorePages/provisionalScore/ProvisionalScore";
import Synthesis from "./synthesis/Synthesis";
import Review from "./review/ReviewPage";
import Ending from "./scorePages/ending/Ending";
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
import { maximizeZendeskButton, minimizeZendeskButton, showZendesk } from 'services/zendesk';
import map from "components/map";
import userActions from 'redux/actions/user';
import { User } from "model/user";
import { ChooseOneComponent } from "./questionTypes/choose/chooseOne/ChooseOne";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import PhonePlayFooter from "./phoneComponents/PhonePlayFooter";
import { CreateByEmailRes } from "services/axios/user";
import routes, { playBrief, playCountInvesigation, PlayCoverLastPrefix, playInvestigation, playNewPrep, playPreInvesigation, playPrePrep, playSections } from "./routes";
import { isPhone } from "services/phone";
import Brief from "./brief/Brief";
import PrePrep from "./prePrep/PrePrep";
import NewPrep from "./newPrep/NewPrep";
import PhonePreInvestigationPage from "./preInvestigation/PhonePreInvestigation";
import PreInvestigationPage from "./preInvestigation/PreInvestigation";
import PhoneCountInvestigationPage from './preInvestigation/PhoneCountdownInvestigation';
import PhonePreSynthesisPage from "./preSynthesis/PhonePreSynthesis";
import PreSynthesis from "./preSynthesis/PreSynthesis";
import PreReview from "./preReview/PreReview";
import { clearAssignmentId, getAssignmentId } from "localStorage/playAssignmentId";
import { trackSignUp } from "services/matomo";
import { CashAttempt, GetCashedPlayAttempt } from "localStorage/play";
import TextDialog from "components/baseComponents/dialogs/TextDialog";
import PhonePlaySimpleFooter from "./phoneComponents/PhonePlaySimpleFooter";
import PhonePlayShareFooter from "./phoneComponents/PhonePlayShareFooter";
import { getLiveTime, getReviewTime } from "./services/playTimes";
import PhoneTimeSynthesisPage from "./preSynthesis/PhoneTimeSynthesis";
import PhoneCountdownReview from "./preReview/PhoneCountdownReview";
import CountdownInvestigationPage from "./preInvestigation/CountdownInvestigation";
import CountdownReview from "./preReview/CountdownReview";
import UnauthorizedUserDialogV2 from "components/baseComponents/dialogs/unauthorizedUserDialogV2/UnauthorizedUserDialogV2";
import PlaySkipDialog from "components/baseComponents/dialogs/PlaySkipDialog";
import LastAttemptDialog from "./baseComponents/dialogs/LastAttemptDialog";
import PremiumEducatorDialog from "./baseComponents/dialogs/PremiumEducatorDialog";
import PremiumLearnerDialog from "./baseComponents/dialogs/PremiumLearnerDialog";

export enum PlayPage {
  Cover,
  Live,
  Synthesis,
  Review,
  Ending,
  FinalStep
}

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
  const { history } = props;

  let parsedBrick = null;
  let initBrickAttempt: any = {};
  let initAttempts: any = [];
  let initReviewAttempts: any = [];
  let initMode = PlayMode.Normal;
  let initStatus = PlayStatus.Live;
  let initLiveEndTime: any = null;
  let initReviewEndTime: any = null;
  let initAttemptId: any = null;
  let initPrepEndTime: any = undefined;
  let initLiveDuration: null | moment.Duration = null;
  let initReviewDuration: null | moment.Duration = null;

  const cashAttemptString = GetCashedPlayAttempt();

  const [restoredFromCash, setRestored] = useState(false);
  const [isSkipOpen, setPlaySkip] = useState(false);

  if (cashAttemptString && !restoredFromCash) {
    // parsing cashed play

    // check if is Cover page
    let isCover = false;
    const coverPart = history.location.pathname.split('/')[4];
    if (coverPart === 'cover') {
      isCover = true;
      CashAttempt('');
    }
    const cashAttempt = JSON.parse(cashAttemptString);

    if (cashAttempt.brick.id === props.brick.id && !isCover) {
      parsedBrick = cashAttempt.brick;
      initAttempts = cashAttempt.attempts;
      initReviewAttempts = cashAttempt.reviewAttempts;
      initMode = cashAttempt.mode;
      initLiveEndTime = cashAttempt.liveEndTime ? moment(cashAttempt.liveEndTime) : null;
      initReviewEndTime = cashAttempt.reviewEndTime ? moment(cashAttempt.reviewEndTime) : null;
      initAttemptId = cashAttempt.attemptId;
      initStatus = parseInt(cashAttempt.status);
      initLiveDuration = cashAttempt.liveDuration;
      initBrickAttempt = cashAttempt.brickAttempt;
      initReviewDuration = cashAttempt.reviewDuration;
      if (cashAttempt.prepEndTime) {
        initPrepEndTime = moment(cashAttempt.prepEndTime);
      }

      const isProvisional = history.location.pathname.slice(-routes.PlayProvisionalScoreLastPrefix.length) === routes.PlayProvisionalScoreLastPrefix;
      if (!isProvisional && cashAttempt.lastPageUrl === routes.PlayProvisionalScoreLastPrefix && initStatus === PlayStatus.Review) {
        history.push(routes.playTimeReview(props.brick))
      }
      const isSynthesis = history.location.pathname.slice(-routes.PlaySynthesisLastPrefix.length) === routes.PlaySynthesisLastPrefix;
      if (!isSynthesis && cashAttempt.lastPageUrl === routes.PlaySynthesisLastPrefix && initStatus === PlayStatus.Review) {
        history.push(routes.playTimeReview(props.brick))
      }
      setRestored(true);
    } else {
      parsedBrick = parseAndShuffleQuestions(props.brick);
      initAttempts = prefillAttempts(parsedBrick.questions);
      initReviewAttempts = initAttempts;
    }
  } else {
    parsedBrick = parseAndShuffleQuestions(props.brick);
    initAttempts = prefillAttempts(parsedBrick.questions);
    initReviewAttempts = initAttempts;
  }

  const [isCreatingAttempt, setCreatingAttempt] = useState(false);

  const [brick, setBrick] = useState(parsedBrick);
  const [status, setStatus] = useState(initStatus);
  const [competitionId, setCompetitionId] = useState(-1);
  const [brickAttempt, setBrickAttempt] = useState(initBrickAttempt as BrickAttempt);

  const [attempts, setAttempts] = useState(initAttempts);
  const [reviewAttempts, setReviewAttempts] = useState(initReviewAttempts);
  const [prepEndTime, setPrepEndTime] = useState(initPrepEndTime);
  const [mode, setMode] = useState(initMode);
  const [liveEndTime, setLiveEndTime] = useState(initLiveEndTime);
  const [synthesisEndTime, setSynthesisEndTime] = useState(null);
  const [reviewEndTime, setReviewEndTime] = useState(initReviewEndTime);
  const [attemptId, setAttemptId] = useState<string>(initAttemptId);

  const [liveDuration, setLiveDuration] = useState(initLiveDuration);
  const [reviewDuration, setReviewDuration] = useState(initReviewDuration);

  const [unauthorizedOpen, setUnauthorized] = useState(false);
  const [headerHidden, setHeader] = useState(false);
  const [sidebarRolledUp, toggleSideBar] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [saveFailed, setFailed] = useState(false);

  const [isLastAttemptOpen, setLastAttemptDialog] = useState(false);
  const [isPremiumLOpen, setPremiumLOpen] = useState(false);
  const [isPremiumEOpen, setPremiumEOpen] = useState(false);

  const location = useLocation();
  const finalStep = location.pathname.search("/finalStep") >= 0;

  // used for unauthenticated user.
  const [userToken, setUserToken] = useState<string>();
  const [emailInvalidPopup, setInvalidEmailPopup] = useState(false); // null - before submit button clicked, true - invalid

  const cashAttempt = (lastUrl?: string, tempStatus?: PlayStatus) => {
    let lastPageUrl = lastUrl;
    if (!lastUrl) {
      const found = location.pathname.match(`[^/]+(?=/$|$)`);
      if (found) {
        lastPageUrl = '/' + found[0];
      }
    }
    if (!tempStatus) {
      tempStatus = status;
    }
    CashAttempt(JSON.stringify({
      brick,
      lastPageUrl,
      status: tempStatus,
      attempts,
      reviewAttempts,
      attemptId,
      prepEndTime,
      reviewEndTime,
      liveEndTime,
      brickAttempt,
      liveDuration,
      reviewDuration,
      mode,
    }));
  }

  const showInitDialogs = async () => {
    var user = await props.getUser();
    if (user) {
      /*eslint-disable-next-line*/
      if (user.freeAttemptsLeft == 1) {
        setLastAttemptDialog(true);
      } else if (user.freeAttemptsLeft <= 0) {
        setPremiumLOpen(true);
      } else if (user.freeAssignmentsLeft <= 0) {
        setPremiumEOpen(true);
      }
    }
    console.log(user);
  }

  // only cover page should have big sidebar
  useEffect(() => {
    showInitDialogs();

    if (!isPhone()) {
      let { pathname } = history.location;
      if (pathname.search(PlayCoverLastPrefix) === -1) {
        setSidebar(true);
      }
    } else {
      showZendesk();
    }


    // competition
    const values = queryString.parse(props.location.search);
    if (values.competitionId) {
      try {
        var compId = parseInt(values.competitionId as string);
        setCompetitionId(compId);
        brick.competitionId = compId;
      } catch {
        console.log('can`t convert competition id');
      }
    }
    /*eslint-disable-next-line*/
  }, [])

  const updateAttempts = (attempt: any, index: number) => {
    if (attempt) {
      attempts[index] = attempt;
      setAttempts(attempts);
      cashAttempt();
    }
  };

  const updateReviewAttempts = (attempt: any, index: number) => {
    if (attempt) {
      reviewAttempts[index] = attempt;
      setReviewAttempts(reviewAttempts);
      cashAttempt();
    }
  };

  const settingLiveDuration = () => {
    const now = moment().add(getLiveTime(brick.brickLength), 'minutes');
    const dif = moment.duration(now.diff(liveEndTime));
    setLiveDuration(dif);
  }

  const settingReviewDuration = () => {
    const now = moment().add(getReviewTime(brick.brickLength), 'minutes');
    const dif = moment.duration(now.diff(reviewEndTime));
    setReviewDuration(dif);
  }

  const finishLive = () => {
    const ba = calcBrickLiveAttempt(brick, attempts);
    setStatus(PlayStatus.Review);
    setBrickAttempt(ba);
    setReviewAttempts(Object.assign([], attempts));
    setStatus(PlayStatus.Review);
    if (competitionId > -1) {
      ba.competitionId = competitionId;
    }
    saveBrickAttempt(ba);
    settingLiveDuration();
  };

  const finishReview = () => {
    const ba = calcBrickReviewAttempt(brick, reviewAttempts, brickAttempt);
    setBrickAttempt(ba);
    setStatus(PlayStatus.Ending);
    saveBrickAttempt(ba);
    settingReviewDuration();
  };


  const createBrickAttempt = async (brickAttempt: BrickAttempt) => {
    if (isCreatingAttempt) {
      return;
    }

    setCreatingAttempt(true);
    brickAttempt.brick = brick;
    brickAttempt.brickId = brick.id;
    if (props.user) {
      brickAttempt.studentId = props.user.id;
    }

    const assignmentId = getAssignmentId();
    if (assignmentId) {
      brickAttempt.assignmentId = assignmentId;
    }
    return axios.post(
      process.env.REACT_APP_BACKEND_HOST + "/play/attempt",
      { brickAttempt, userId: props.user?.id },
      { withCredentials: true }
    ).then(async (response) => {
      clearAssignmentId();
      if (!props.user.hasPlayedBrick && props.isAuthenticated === isAuthenticated.True) {
        await props.getUser();
      }
      setAttemptId(response.data.id);
      setCreatingAttempt(false);
    }).catch(() => {
      setFailed(true);
      setCreatingAttempt(false);
    });
  };

  const saveBrickAttempt = async (brickAttempt: BrickAttempt) => {
    if (!attemptId) {
      return createBrickAttempt(brickAttempt);
    }
    brickAttempt.brick = brick;
    brickAttempt.brickId = brick.id;
    brickAttempt.studentId = props.user.id;
    const assignmentId = getAssignmentId();
    if (assignmentId) {
      brickAttempt.assignmentId = assignmentId;
    }
    brickAttempt.id = attemptId;
    return axios.put(
      process.env.REACT_APP_BACKEND_HOST + "/play/attempt",
      { id: attemptId, userId: props.user.id, body: brickAttempt },
      { withCredentials: true }
    ).then(async (response) => {
      clearAssignmentId();
      if (!props.user.hasPlayedBrick && props.isAuthenticated === isAuthenticated.True) {
        await props.getUser();
      }
      setAttemptId(response.data.Id);
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
    if (isPhone()) {
      setHeader(true);
    }
    moveToInvestigation();
    setSidebar(true);
  }

  const coverMoveNext = () => {
    const { user } = props;
    if (user && user.freeAttemptsLeft <= 0) { // Check if user exists (because of anonymous users)
      if (!user.subscriptionState || user.subscriptionState === 0) {
        setPremiumLOpen(true);
        return;
      }
    }
    if (isPhone()) {
      moveToBrief();
    } else {
      if (props.user) {
        moveToBrief();
      } else {
        moveToSections();
      }
      setSidebar(true);
    }
  }

  const moveToSections = () => history.push(playSections(brick));
  const moveToBrief = () => history.push(playBrief(brick));
  const moveToPrePrep = () => history.push(playPrePrep(brick));
  const moveToNewPrep = () => history.push(playNewPrep(brick));
  const moveToPreInvestigation = (isResume: boolean) => {
    if (isResume) {
      moveToInvestigation();
    } else {
      history.push(playPreInvesigation(brick));
    }
  }
  const moveToInvestigation = () => history.push(playInvestigation(brick));
  const moveToTimeInvestigation = () => history.push(playCountInvesigation(brick));
  const moveToTimeSynthesis = () => history.push(routes.playTimeSynthesis(brick));
  const moveToSynthesis = () => history.push(routes.playSynthesis(brick));
  const moveToPreReview = () => history.push(routes.playPreReview(brick));
  const moveToTimeReview = () => history.push(routes.playTimeReview(brick));
  const finishBrick = () => history.push(routes.playFinalStep(brick));


  const moveToReview = () => {
    if (props.user) {
      history.push(routes.playReview(brick));
    } else {
      // unauthorized users finish it here. show popup
      setUnauthorized(true);
    }
  }

  const moveToPostPlay = () => {
    if (props.isAuthenticated === isAuthenticated.True) {
      history.push(map.postPlay(brick.id, props.user.id));
    } else if (userToken) {
      history.push(map.ActivateAccount + "?token=" + userToken);
    }
  }

  const setUser = (data: CreateByEmailRes) => {
    const { user, token } = data;
    props.setUser(user);
    setUserToken(token);
    trackSignUp();
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

  const renderPhoneFooter = (page: PlayPage) => {
    return <PhonePlayFooter
      brick={brick}
      page={page}
      user={props.user}
      history={history}
      menuOpen={false}
      mode={mode}
      setMode={setMode}
      moveToPostPlay={moveToPostPlay}
    />;
  }

  const renderHead = () => {
    let link = map.MainPage;
    if (!props.user) {
      link = map.ViewAllPage;
    }
    if (!isPhone() && sidebarRolledUp) {
      return <HomeButton history={history} onClick={() => {
        setPlaySkip(true);
      }} />;
    }
    if (headerHidden) {
      return <div></div>;
    }

    return (
      <PageHeadWithMenu
        page={PageEnum.Play}
        user={props.user}
        link={link}
        suggestions={true}
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
        <Route path={routes.coverRoute}>
          <Cover
            user={props.user}
            location={props.location}
            history={history}
            brick={brick}
            setCompetitionId={id => {
              setCompetitionId(id);
              brick.competitionId = id;
              history.push(routes.playCover(brick));
            }}
            setUser={setUser}
            moveNext={coverMoveNext}
          />
          {isPhone() && <PhonePlayShareFooter isCover={true} brick={brick} history={history} next={coverMoveNext} />}
        </Route>
        <Route path={routes.briefRoute}>
          <Brief brick={brick} mode={mode} user={props.user} competitionId={competitionId} setCompetitionId={id => {
            setCompetitionId(id);
            brick.competitionId = id;
            history.push(routes.playBrief(brick));
          }} moveNext={moveToPrePrep} onHighlight={onHighlight} />
          {isPhone() && <PhonePlayShareFooter brick={brick} history={history} next={() => history.push(routes.playPrePrep(brick))} />}
        </Route>
        <Route path={routes.sectionsRoute}>
          <Sections brick={brick} moveNext={moveToBrief} />
          {isPhone() && <PhonePlayShareFooter brick={brick} history={history} next={() => { }} />}
        </Route>
        <Route path={routes.prePrepRoute}>
          <PrePrep brick={brick} mode={mode} moveNext={moveToNewPrep} onHighlight={onHighlight} />
          {isPhone() && <PhonePlaySimpleFooter brick={brick} history={history} btnText="Start Prep" next={() => history.push(routes.playNewPrep(brick))} />}
        </Route>
        <Route path={routes.preInvestigationRoute}>
          {isPhone()
            ? <PhonePreInvestigationPage brick={brick} moveNext={moveToTimeInvestigation} />
            : <PreInvestigationPage brick={brick} moveNext={moveToTimeInvestigation} />
          }
          {isPhone() && <PhonePlaySimpleFooter brick={brick} history={history} btnText="Next" next={moveToTimeInvestigation} />}
        </Route>

        <Route path={routes.countInvestigationRoute}>
          {isPhone()
            ? <PhoneCountInvestigationPage brick={brick} moveNext={moveToInvestigation} />
            : <CountdownInvestigationPage brick={brick} moveNext={moveToLive} />
          }
          {isPhone() && <PhonePlaySimpleFooter brick={brick} history={history} btnText="Start Timer" next={moveToInvestigation} />}
        </Route>

        <Route path={["/play/brick/:brickId/intro", "/play/brick/:brickId/prep"]}>
          {isPhone() ?
            <Introduction
              location={props.location}
              history={history}
              mode={mode}
              brick={brick}
              endTime={prepEndTime}
              setEndTime={setPrepEndTime}
              moveNext={moveToLive}
              cashAttempt={cashAttempt}
              onHighlight={onHighlight}
            />
            : <NewPrep
              history={history}
              brick={brick} mode={mode} moveNext={moveToPreInvestigation} endTime={prepEndTime}
              setEndTime={setPrepEndTime} onHighlight={onHighlight}
            />
          }
          {isPhone() && <PhonePlayShareFooter brick={brick} history={history} next={() => history.push(routes.playPreInvesigation(brick))} />}
        </Route>
        <Route path="/play/brick/:brickId/live">
          <Live
            history={history}
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
            moveNext={() => cashAttempt(routes.PlayProvisionalScoreLastPrefix, PlayStatus.Review)}
          />
          {isPhone() && renderPhoneFooter(PlayPage.Live)}
        </Route>
        <Route path="/play/brick/:brickId/provisionalScore">
          <ProvisionalScore
            user={props.user}
            history={history}
            location={location}
            status={status}
            brick={brick}
            attempts={attempts}
            liveDuration={liveDuration}
            moveNext={() => cashAttempt(routes.PlaySynthesisLastPrefix)}
          />
          {isPhone() && <PhonePlaySimpleFooter brick={brick} history={history} showQRCode={true} btnText="Next" next={() => history.push(routes.playPreSynthesis(brick))} />}
        </Route>

        <Route path={routes.preSynthesisRoute}>
          {isPhone()
            ? <PhonePreSynthesisPage brick={brick} moveNext={moveToTimeSynthesis} />
            : <PreSynthesis brick={brick} history={history} />
          }
          {isPhone() && <PhonePlaySimpleFooter brick={brick} history={history} showQRCode={true} btnText="Next" next={moveToTimeSynthesis} />}
        </Route>

        <Route path={routes.timeSynthesisRoute}>
          {isPhone()
            ? <PhoneTimeSynthesisPage brick={brick} />
            : <PreSynthesis brick={brick} history={history} />
          }
          {isPhone() && <PhonePlaySimpleFooter brick={brick} history={history} btnText="Synthesis" next={moveToSynthesis} />}
        </Route>

        <Route path={routes.synthesisRoute}>
          <Synthesis
            mode={mode} status={status} brick={brick}
            moveNext={moveToPreReview} onHighlight={onHighlight}
            endTime={synthesisEndTime}
            setEndTime={setSynthesisEndTime}
          />
          {isPhone() && <PhonePlayShareFooter brick={brick} history={history} next={moveToPreReview} />}
        </Route>

        <Route path={routes.preReviewRoute}>
          <PreReview brick={brick} moveNext={moveToTimeReview} />
          {isPhone() && <PhonePlaySimpleFooter brick={brick} history={history} btnText="Start Review" next={moveToTimeReview} />}
        </Route>

        <Route path={routes.timeReviewRoute}>
          {isPhone()
            ? <PhoneCountdownReview brick={brick} moveNext={moveToReview} />
            : <CountdownReview brick={brick} moveNext={moveToReview} />
          }
          {isPhone() && <PhonePlaySimpleFooter brick={brick} history={history} btnText="Start Timer" next={moveToReview} />}
        </Route>

        <Route exac path={routes.reviewRoute}>
          <Review
            mode={mode}
            status={status}
            history={history}
            brick={brick}
            updateAttempts={updateReviewAttempts}
            liveAttempts={attempts}
            attempts={reviewAttempts}
            finishBrick={finishReview}
            endTime={reviewEndTime}
            setEndTime={time => {
              if (reviewEndTime === null) {
                setReviewEndTime(time);
              }
            }}
          />
          {isPhone() && renderPhoneFooter(PlayPage.Review)}
        </Route>
        <Route exac path="/play/brick/:brickId/ending">
          <Ending
            status={status}
            location={location}
            brick={brick}
            history={history}
            brickAttempt={brickAttempt}
            liveDuration={liveDuration}
            reviewDuration={reviewDuration}
            move={finishBrick}
          />
          {isPhone() && <PhonePlaySimpleFooter
            brick={brick} history={history} btnText="Next" next={finishBrick}
          />}
        </Route>
        <Route exac path="/play/brick/:brickId/finalStep">
          <FinalStep
            user={props.user}
            brick={brick}
            history={history}
            moveNext={moveToPostPlay}
          />
          {isPhone() && renderPhoneFooter(PlayPage.FinalStep)}
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

  const renderPremiumPopups = () => {
    const { user } = props;
    if (user) {
      return <div>
        {(user.subscriptionState === 0 || !user.subscriptionState) &&
          <LastAttemptDialog isOpen={isLastAttemptOpen} history={history} close={() => setLastAttemptDialog(false)} submit={() => {
            toggleSideBar(true);
            setLastAttemptDialog(false);
            moveToBrief();
          }} />}
        {(user.subscriptionState === 0 || !user.subscriptionState) && <PremiumEducatorDialog isOpen={isPremiumEOpen} close={() => setPremiumEOpen(false)} submit={() => props.history.push(map.StripeEducator)} />}
        {(user.subscriptionState === 0 || !user.subscriptionState) && <PremiumLearnerDialog isOpen={isPremiumLOpen} close={() => setPremiumLOpen(false)} submit={() => props.history.push(map.StripeLearner)} />}
      </div>
    }
    return '';
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
              showPremium={() => setPremiumEOpen(true)}
              toggleSidebar={setSidebar}
            />}
          {renderRouter()}
        </div>
        <PlaySkipDialog
          isOpen={isSkipOpen}
          label="Exit"
          submit={() => {
            let link = map.MainPage;
            if (!props.user) {
              link = map.ViewAllPage;
            }

            props.history.push(link)
          }}
          close={() => setPlaySkip(false)}
        />
        <UnauthorizedUserDialogV2
          history={history}
          isBeforeReview={true}
          brickId={brick.id}
          isOpen={unauthorizedOpen}
          notyet={() => {
            history.push(map.ViewAllPage);
          }}
        />
        <TextDialog
          isOpen={emailInvalidPopup} close={() => setInvalidEmailPopup(false)}
          label="You might already have an account, try signing in."
        />
      </div>
      {renderPremiumPopups()}
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
            brickQuestionId: question.brickQuestionId
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
            imageSource: a.imageSource,
            imageCaption: a.imageCaption,
            valueSoundFile: a.valueSoundFile,
            valueSoundCaption: a.valueSoundCaption
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
