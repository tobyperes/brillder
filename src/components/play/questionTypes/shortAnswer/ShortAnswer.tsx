import React from "react";
import { Grid } from "@material-ui/core";
import CompComponent from "../Comp";

import "./ShortAnswer.scss";
import { ComponentAttempt } from "components/play/model";
import ReviewEachHint from "../../baseComponents/ReviewEachHint";
import ReviewGlobalHint from "../../baseComponents/ReviewGlobalHint";
import { CompQuestionProps } from "../types";
import {
  ShrortAnswerData,
  ShortAnswerItem,
} from "components/build/buildQuestions/questionTypes/shortAnswerBuild/interface";
import { stripHtml } from "components/build/questionService/ConvertService";
import DocumentWirisEditorComponent from "components/baseComponents/ckeditor/DocumentWirisEditor";

interface ShortAnswerProps extends CompQuestionProps {
  component: ShrortAnswerData;
  isTimeover: boolean;
  attempt: ComponentAttempt<string[]>;
  answers: string[];
}

interface ShortAnswerState {
  userAnswers: string[];
}

class ShortAnswer extends CompComponent<ShortAnswerProps, ShortAnswerState> {
  constructor(props: ShortAnswerProps) {
    super(props);

    let userAnswers: string[] = [];
    if (props.answers) {
      userAnswers = props.answers;
    } else if (props.attempt?.answer?.length > 0) {
      props.attempt.answer.forEach((a: string) => userAnswers.push(a));
    } else {
      props.component.list.forEach(() => userAnswers.push(""));
    }

    this.state = { userAnswers } as ShortAnswerState;
  }

  setUserAnswer(value: string, index: number) {
    let userAnswers = this.state.userAnswers;
    userAnswers[index] = value;
    if (value && this.props.onAttempted) {
      this.props.onAttempted();
    }
    this.setState({ userAnswers });
  }

  formatAnswer(value: string) {
    return value.toLocaleLowerCase().replace(/ /g, "");
  }

  getAnswer = (): string[] => this.state.userAnswers;

  checkAttemptAnswer(answer: ShortAnswerItem, index: number) {
    const answerValue = stripHtml(answer.value);
    if (this.props.attempt.answer) {
      const attepmtValue = this.props.attempt.answer[index];
      if (
        this.props.attempt &&
        this.props.attempt.answer &&
        this.formatAnswer(attepmtValue) === this.formatAnswer(answerValue)
      ) {
        return true;
      }
    }
    return false;
  }

  mark(attempt: ComponentAttempt<string[]>, prev: ComponentAttempt<string[]>) {
    // The maximum number of marks is the number of entries * 5.
    attempt.maxMarks = 6;

    // The maximum number of marks is divided between all answers.
    let markIncrement = attempt.maxMarks / this.props.component.list.length;
    attempt.correct = true;
    attempt.marks = 0;

    this.props.component.list.forEach((answer, index) => {
      if (this.state.userAnswers[index]) {
        let correctAnswer = stripHtml(answer.value);
        if (stripHtml(this.state.userAnswers[index]) === correctAnswer) {
          // add the correct amount of marks
          attempt.marks += markIncrement;
        } else {
          // the answer is not correct.
          attempt.correct = false;
        }
      } else {
        // the answer is not filled in.
        attempt.correct = false;
      } 
    });
    // Then, if there are no marks, and there are no empty entries, give the student half a mark.
    const emptyAnswer = this.state.userAnswers.indexOf("");
    if (attempt.marks === 0 && emptyAnswer === -1) attempt.marks += 0.5;
    return attempt;
  }

  renderCkeditor(index: number) {
    let value = this.state.userAnswers[index];
    if (this.props.isPreview) {
      value = this.props.component.list[index].value;
    }
    return (
      <DocumentWirisEditorComponent
        data={value}
        disabled={false}
        onChange={v => this.setUserAnswer(v, index)}
        toolbar={["superscript", "subscript"]}
        onBlur={() => { }}
        placeholder={`Answer ${index + 1}`}
      />
    );
  }

  renderAnswer(answer: ShortAnswerItem, width: number, index: number) {
    let isCorrect = false;
    if (this.props.attempt) {
      isCorrect = this.checkAttemptAnswer(answer, index);
    }
    return (
      <div
        key={index}
        className={`short-answer-input ${isCorrect ? "correct" : ""}`}
        style={{ width: `${width}%` }}
      >
        <Grid container direction="row" justify="center">
          {this.renderCkeditor(index)}
        </Grid>
        <Grid container direction="row" justify="center">
          <ReviewEachHint
            isPhonePreview={this.props.isPreview}
            isReview={this.props.isReview}
            isCorrect={isCorrect}
            index={index}
            hint={this.props.question.hint}
          />
        </Grid>
      </div>
    );
  }

  render() {
    const { component } = this.props;
    let width = 100;
    if (component.list && component.list.length >= 1) {
      width = (100 - 1) / component.list.length;
    }

    if (this.props.isPreview) width = 100;

    return (
      <div className="question-unique-play short-answer-live">
        {component.list.map((answer, index) => {
          return this.renderAnswer(answer, width, index);
        })}
        <ReviewGlobalHint
          isReview={this.props.isReview}
          attempt={this.props.attempt}
          isPhonePreview={this.props.isPreview}
          hint={this.props.question.hint}
        />
      </div>
    );
  }
}

export default ShortAnswer;
