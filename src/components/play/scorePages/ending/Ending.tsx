import React from "react";
import { Grid } from "@material-ui/core";
import { CircularProgressbar } from "react-circular-progressbar";

import "./Ending.scss";
import { Brick } from "model/brick";
import { PlayStatus } from "../../model";
import { BrickAttempt } from "../../model";
import EndingStepper from "./EndingStepper";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isPhone } from "services/phone";
import BrickTitle from "components/baseComponents/BrickTitle";
import routes from "../../routes";
import moment from "moment";
import { prepareDuration } from "../service";
import AttemptedText from "../components/AttemptedText";

interface EndingState {
  oldScore: number;

  liveScore: number;
  reviewScore: number;
  currentScore: number;

  currentPScore: number;
  minPScore: number;
  maxPScore: number;

  interval: number;
}

interface EndingProps {
  status: PlayStatus;
  brick: Brick;
  history: any;
  location: any;
  brickAttempt: BrickAttempt;

  liveDuration?: null | moment.Duration;
  reviewDuration?: null | moment.Duration;

  move(): void;
}

class EndingPage extends React.Component<EndingProps, EndingState> {
  constructor(props: EndingProps) {
    super(props);

    const { oldScore, maxScore, score } = this.props.brickAttempt;

    const oldScoreNumber = oldScore ? oldScore : 0;

    const currentPScore = 0;
    const minPScore = Math.round((oldScoreNumber * 100) / maxScore);
    const maxPScore = Math.round((score * 100) / maxScore);

    this.state = {
      oldScore: oldScoreNumber,

      currentScore: 0,
      liveScore: 0,
      reviewScore: 0,

      currentPScore,
      minPScore,
      maxPScore,

      interval: 0,
    };
  }

  componentDidMount() {
    const step = 3;
    const { oldScore } = this.state;
    const { score, maxScore } = this.props.brickAttempt;
    const liveScore = Math.round((oldScore * 100) / maxScore);
    const reviewScore = Math.round((score * 100) / maxScore);
    const currentScore = Math.round(((oldScore + score) * 50) / maxScore);
    const interval = setInterval(() => {
      let tempReviewScore = this.state.reviewScore;
      let tempLiveScore = this.state.liveScore;
      let tempCurrentScore = this.state.currentScore;

      if (tempReviewScore < reviewScore - step) {
        tempReviewScore += step;
      } else {
        tempReviewScore = reviewScore;
      }
      if (tempLiveScore < liveScore - step) {
        tempLiveScore += step;
      } else {
        tempLiveScore = liveScore;
      }

      if (tempCurrentScore < currentScore - step) {
        tempCurrentScore += step;
      } else {
        tempCurrentScore = currentScore;
      }

      this.setState({
        liveScore: tempLiveScore,
        reviewScore: tempReviewScore,
        currentScore: tempCurrentScore,
      });

      if (
        liveScore === this.state.liveScore &&
        reviewScore === tempReviewScore &&
        currentScore === tempCurrentScore
      ) {
        clearInterval(interval);
      }
    }, 100);
    this.setState({ interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  renderStepper() {
    return (
      <EndingStepper
        questions={this.props.brick.questions}
        attempts={this.props.brickAttempt.answers}
        handleStep={() => { }}
      />
    );
  }

  render() {
    const {brick} = this.props;

    if (this.props.status === PlayStatus.Live) {
      if (isPhone()) {
        this.props.history.push(routes.phonePrep(brick));
      } else {
        this.props.history.push(routes.playNewPrep(brick));
      }
    }

    const { answers, liveAnswers, score, maxScore } = this.props.brickAttempt;

    let attempted = 0;
    let numberOfFailed = 0;
    let numberOfyellow = 0;
    let numberOfcorrect = 0;
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      const liveAnswer = liveAnswers?.[i] || null;
      if (answer.attempted || liveAnswer?.attempted) {
        attempted += 1;
      }
      if (answer.correct && liveAnswer?.correct) {
        numberOfcorrect += 1;
      } else if (answer.correct) {
        numberOfyellow += 1;
      } else if (liveAnswer?.correct) {
        numberOfyellow += 1;
      } else {
        numberOfFailed += 1;
      }
    }

    if (isPhone()) {
      return (
        <div className="phone-provisional-score">
          <div
            className="fixed-upper-b-title"
            dangerouslySetInnerHTML={{ __html: this.props.brick.title }}
          />
          <div className="header">{this.renderStepper()}</div>
          <div className="content">
            <div className="title">Final Score</div>
            <div className="pr-progress-center">
              <div className="pr-progress-container">
                <CircularProgressbar
                  className="circle-progress-first"
                  strokeWidth={4}
                  counterClockwise={true}
                  value={this.state.liveScore}
                />
                <Grid
                  container
                  justify="center"
                  alignContent="center"
                  className="score-circle"
                >
                  <CircularProgressbar
                    className="circle-progress-second"
                    counterClockwise={true}
                    strokeWidth={4}
                    value={this.state.reviewScore}
                  />
                </Grid>
                <Grid
                  container
                  justify="center"
                  alignContent="center"
                  className="score-circle"
                >
                  <CircularProgressbar
                    className="circle-progress-third"
                    counterClockwise={true}
                    strokeWidth={4}
                    value={this.state.currentScore}
                  />
                </Grid>
                <div className="score-data">{this.state.currentScore}%</div>
              </div>
            </div>
            <div className="attempted-numbers">
              <div className={numberOfFailed === 0 ? "text-tab-gray" : ""}>
                <SpriteIcon
                  name="cancel-custom"
                  className={
                    numberOfFailed === 0 ? "text-tab-gray" : "text-orange"
                  }
                />
                : {numberOfFailed}
              </div>
              <div className={numberOfyellow === 0 ? "text-tab-gray" : ""}>
                <SpriteIcon
                  name="check-icon"
                  className={
                    numberOfyellow === 0 ? "text-tab-gray" : "text-yellow"
                  }
                />
                : {numberOfyellow}
              </div>
              <div className={numberOfcorrect === 0 ? "text-tab-gray" : ""}>
                <SpriteIcon
                  name="check-icon"
                  className={
                    numberOfcorrect === 0 ? "text-tab-gray" : "text-theme-green"
                  }
                />
                : {numberOfcorrect}
              </div>
            </div>
            <AttemptedText
              attempted={attempted}
              attemptsCount={answers.length}
              score={this.props.brickAttempt.score}
              maxScore={this.props.brickAttempt.maxScore}
            />
            {this.props.liveDuration && (
              <div className="duration">
                <SpriteIcon name="clock" />
                <div>{prepareDuration(this.props.liveDuration)}</div>
              </div>
            )}
            {this.props.reviewDuration && (
              <div className="review-duration">
                + {prepareDuration(this.props.reviewDuration)} Review
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="brick-row-container ending-container">
        <div className="brick-container play-preview-panel ending-page">
          <div className="fixed-upper-b-title">
            <BrickTitle title={this.props.brick.title} />
          </div>
          <Grid container direction="row">
            <Grid item xs={8}>
              <div className="introduction-page">
                <h1 className="title">Final Score</h1>
                {score < maxScore &&
                  <div className="hr-sub-title">This is an average of your provisional score and your review score</div>
                }
                <div className="question-live-play">
                  <Grid
                    container
                    justify="center"
                    alignContent="center"
                    className="circle-progress-container"
                  >
                    <CircularProgressbar
                      className="circle-progress-first"
                      strokeWidth={4}
                      counterClockwise={true}
                      value={this.state.liveScore}
                    />
                    <Grid
                      container
                      justify="center"
                      alignContent="center"
                      className="score-circle"
                    >
                      <CircularProgressbar
                        className="circle-progress-second"
                        counterClockwise={true}
                        strokeWidth={4}
                        value={this.state.reviewScore}
                      />
                    </Grid>
                    <Grid
                      container
                      justify="center"
                      alignContent="center"
                      className="score-circle"
                    >
                      <CircularProgressbar
                        className="circle-progress-third"
                        counterClockwise={true}
                        strokeWidth={4}
                        value={this.state.currentScore}
                      />
                    </Grid>
                    <Grid
                      container
                      justify="center"
                      alignContent="center"
                      className="score-circle"
                    >
                      <div>
                        <div className="score-precentage">{this.state.currentScore}%</div>
                      </div>
                    </Grid>
                  </Grid>
                  <AttemptedText
                    attempted={attempted}
                    attemptsCount={answers.length}
                    score={score}
                    maxScore={maxScore}
                  />
                  {this.props.liveDuration && (
                    <div className="duration">
                      <SpriteIcon name="clock" />
                      <div>{prepareDuration(this.props.liveDuration)}</div>
                    </div>
                  )}
                  {this.props.reviewDuration && (
                    <div className="review-duration">
                      + {prepareDuration(this.props.reviewDuration)} Review
                    </div>
                  )}
                </div>
              </div>
              <div className="new-layout-footer" style={{ display: "none" }}>
                <div className="time-container" />
                <div className="minutes-footer" />
                <div className="footer-space" />
                <div className="new-navigation-buttons">
                  <div className="n-btn next" onClick={this.props.move}>
                    Next
                    <SpriteIcon name="arrow-right" />
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="introduction-info">
                <div className="intro-header">
                  <div>
                    Range: {this.state.minPScore}%-{this.state.maxPScore}%
                  </div>
                </div>
                <div className="intro-text-row f-align-self-start m-t-5">
                  {this.renderStepper()}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default EndingPage;
