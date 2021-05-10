import React from 'react';
import ListItem from '@material-ui/core/ListItem';

import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { Answer } from 'components/build/buildQuestions/questionTypes/pairMatchBuild/types';
import MathInHtml from '../../baseComponents/MathInHtml';
import PairMatchImageContent from './PairMatchImageContent';

interface OptionProps {
  index: number;
  item: any;
}

const PairMatchOption: React.FC<OptionProps> = (props) => {
  const { item, index } = props;

  const renderOptionContent = (answer: Answer) => {
    if (answer.optionType && answer.optionType === QuestionValueType.Image) {
      return <PairMatchImageContent fileName={answer.optionFile} imageCaption={answer.imageCaption} />
    }
    return <MathInHtml value={answer.option} />;
  }

  let className = "pair-match-play-option";
  if (item.optionType === QuestionValueType.Image || item.answerType === QuestionValueType.Image) {
    className += " pair-match-image-choice";
  }
  if (item.optionType === QuestionValueType.Image) {
    className += " image-choice";
  }
  return (
    <ListItem key={index} className={className}>
      <div className="option-container">
        {renderOptionContent(item as any)}
      </div>
    </ListItem>
  );
}

export default PairMatchOption;
