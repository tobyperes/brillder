import React from 'react';
import { Grid } from '@material-ui/core';
import { ReactSortable } from 'react-sortablejs';
import { isMobile } from 'react-device-detect';

import { CompQuestionProps } from '../types';
import CompComponent from '../Comp';
import ReviewEachHint from 'components/play/baseComponents/ReviewEachHint';
import MathInHtml from '../../baseComponents/MathInHtml';
import { getValidationClassName } from '../service';
import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { isPhone } from 'services/phone';
import PairMatchImageContent from '../pairMatch/PairMatchImageContent';
import Audio from 'components/build/buildQuestions/questionTypes/sound/Audio';
import { ReactComponent as DragIcon } from 'assets/img/drag.svg';
import { ReactComponent as TapIcon } from 'assets/img/tap.svg';


const MobileTheme = React.lazy(() => import('./themes/Phone'));
const TabletTheme = React.lazy(() => import('./themes/Tablet'));
const DesktopTheme = React.lazy(() => import('./themes/Desktop'));

interface VerticalShuffleChoice {
  value: string;
  index: number;
  valueFile: string;
}

export interface VerticalShuffleComponent {
  type: number;
  list: VerticalShuffleChoice[];
}

interface VerticalShuffleProps extends CompQuestionProps {
  isTimeover: boolean;
  component: VerticalShuffleComponent;
  answers: number;
}

enum DragAndDropStatus {
  None,
  Init,
  Changed
}

interface VerticalShuffleState {
  status: DragAndDropStatus;
  switchIndex: number;
  userAnswers: any[];
  canDrag: boolean;
  reviewCorrectAnswers: number[];
}

class VerticalShuffle extends CompComponent<VerticalShuffleProps, VerticalShuffleState> {
  constructor(props: VerticalShuffleProps) {
    super(props);

    let userAnswers = this.props.component.list;

    const { attempt } = this.props;

    if (attempt) {
      if (attempt.answer) {
        userAnswers = attempt.answer;
      }
    }

    let canDrag = true;
    if (this.props.attempt?.correct) {
      canDrag = false;
    }

    let reviewCorrectAnswers = [];

    if (this.props.isReview) {
      for (let i = 0; i < userAnswers.length; i++) {
        const res = this.checkAttemptAnswer(i);
        if (res) {
          reviewCorrectAnswers.push(i);
        }
      }
    }

    this.state = {
      status: DragAndDropStatus.None,
      switchIndex: -1,
      userAnswers: userAnswers,
      canDrag,
      reviewCorrectAnswers
    };
  }

  componentDidUpdate(prevProp: VerticalShuffleProps) {
    if (this.props.isBookPreview) {
      if (this.props.answers !== prevProp.answers) {
        this.setState({ userAnswers: this.props.answers as any });
      }
    }
  }

  setUserAnswers(userAnswers: any[]) {
    if (this.props.isTimeover) { return; }
    let status = DragAndDropStatus.Changed;
    if (this.state.status === DragAndDropStatus.None) {
      status = DragAndDropStatus.Init;
    }
    if (this.state.status === DragAndDropStatus.Changed && this.props.onAttempted) {
      this.props.onAttempted();
    }
   
    // review. make correct answers static on drag and drop
    if (this.state.reviewCorrectAnswers.length > 0) {
      for (let index of this.state.reviewCorrectAnswers) {
        
        let answer = null;
        let answerIndex = 0;

        // get correct answer and index
        for (let j = 0; j < userAnswers.length; j++) {
          if (userAnswers[j].index === index) {
            answerIndex = j;
            answer = userAnswers[j];
          }
        }

        // change answer position
        if (answer) {
          userAnswers.splice(answerIndex, 1);
          userAnswers.splice(index, 0, answer);
        }
      }
    }

    this.setState({ status, userAnswers });
  }

  checkImages() {
    return !!this.props.component.list.find(a => a.valueFile);
  }

  getAnswer(): any[] {
    return this.state.userAnswers;
  }

  UNSAFE_componentWillUpdate(props: VerticalShuffleProps) {
    if (!this.props.isPreview) { return; }

    if (props.component && props.component.list) {
      if (this.state.userAnswers !== props.component.list) {
        this.setState({ userAnswers: props.component.list });
      }
    }
  }

  checkAttemptAnswer(index: number) {
    if (this.props.isReview && this.props.attempt) {
      let answer = this.props.attempt.answer[index];
      if (answer.index - index === 0) {
        return true;
      }
    }
    return false;
  }

  renderEachHint(i: number, answer: any, isCorrect: boolean) {
    if (this.props.isPreview) {
      return (
        <Grid container direction="row" justify="center">
          <ReviewEachHint
            isPhonePreview={this.props.isPreview}
            isReview={this.props.isReview}
            isCorrect={isCorrect}
            index={i}
            hint={this.props.question.hint}
          />
        </Grid>
      )
    } else if (this.props.isReview) {
      return (
        <Grid container direction="row" justify="center">
          <ReviewEachHint
            isPhonePreview={this.props.isPreview}
            isReview={this.props.isReview}
            isCorrect={isCorrect}
            index={answer.index}
            hint={this.props.question.hint}
          />
        </Grid>
      );
    }
    return "";
  }

  renderData(answer: any) {
    if (answer.answerType === QuestionValueType.Image) {
      return <PairMatchImageContent
        fileName={answer.valueFile} imageCaption={answer.imageCaption}
        imageSource={answer.imageSource} />;
    } else if (answer.answerType === QuestionValueType.Sound) {
      return (
        <div>
          <Audio src={answer.soundFile} />
          <div>{answer.soundCaption}</div>
        </div>
      );
    } else {
      return <MathInHtml value={answer.value} />;
    }
  }

  renderAnswer(answer: any, i: number) {
    const isCorrect = this.checkAttemptAnswer(i);
    const { switchIndex } = this.state;
    let className = "vertical-shuffle-choice";

    if (!this.props.isPreview && this.props.attempt && this.props.isReview) {
      if (this.state.status !== DragAndDropStatus.Changed) {
        className += getValidationClassName(isCorrect);
      }
    }

    if (i === this.state.switchIndex) {
      className += ' active';
    }

    if (this.props.isBookPreview) {
      className += getValidationClassName(isCorrect);
    }

    const hasHint = this.props.isReview || this.props.isPreview;

    return (
      <div key={i} className={className} onClick={() => {
        if (this.state.canDrag) {
          if (switchIndex === -1) {
            this.setState({ switchIndex: i });
          } else {
            try {
              const { userAnswers } = this.state;
              const shift1 = userAnswers[switchIndex];
              const shift2 = userAnswers[i];
              userAnswers[switchIndex] = shift2;
              userAnswers[i] = shift1;
              this.setUserAnswers(userAnswers);
              this.setState({ switchIndex: -1 });
            } catch { }
          }
        }
      }}>
        <div className={`vertical-content ${hasHint ? '' : 'full-height'}`}>
          <Grid container direction="row" justify="center">
            <div className="circle-index">
              <div>
                {switchIndex === i ? <SpriteIcon name="feather-refresh" /> : i + 1}
              </div>
            </div>
            {this.renderData(answer)}
          </Grid>
        </div>
        {this.renderEachHint(i, answer, isCorrect)}
      </div>
    );
  }

  renderAnswers() {
    return this.state.userAnswers.map((answer, i) => this.renderAnswer(answer, i));
  }

  renderPhone() {
    const haveImage = this.checkImages();
    return (
      <div className="question-unique-play vertical-shuffle-play">
        <span className="help-text">
          <TapIcon />Click on two answers to reorder them.   {haveImage && <span><SpriteIcon name="f-zoom-in" />Double tap images to zoom.</span>}
        </span>
        {this.props.isBookPreview ? (
          <div>{this.renderAnswers()}</div>
        ) : (
          <div className="verical-shuffle-sort-list">
            {this.renderAnswers()}
          </div>
        )}
        {this.renderGlobalHint()}
      </div>
    );
  }

  renderDesktop() {
    const haveImage = this.checkImages();
    return (
      <div className="question-unique-play vertical-shuffle-play">
        <p><span className="help-text"><DragIcon />Drag to rearrange.   {haveImage && <span>Hover over images to zoom.</span>}
        {!isPhone() && isMobile &&
          <span>
            <SpriteIcon name="hero-cursor-click" />
            Click and hold to move if using an Apple Pencil
          </span>}
          </span>
        </p>
        {this.props.isBookPreview || !this.state.canDrag ? (
          <div>{this.renderAnswers()}</div>
        ) : (
          <ReactSortable
            list={this.state.userAnswers}
            animation={150}
            className="verical-shuffle-sort-list"
            style={{ display: "inline-block" }}
            group={{ name: "cloning-group-name" }}
            setList={(choices) => this.setUserAnswers(choices)}
          >
            {this.renderAnswers()}
          </ReactSortable>
        )}
        {this.renderGlobalHint()}
      </div>
    )
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        {isPhone() ? <MobileTheme /> : isMobile ? <TabletTheme /> : <DesktopTheme />}
        {isPhone() ? this.renderPhone() : this.renderDesktop()}
      </React.Suspense>
    );
  }
}

export default VerticalShuffle;
