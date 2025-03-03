import React, { useEffect } from "react";

import "./shortAnswerBuild.scss";
import { UniqueComponentProps } from "../types";
import { ShortAnswerData, ShortAnswerItem } from "./interface";

import { stripHtml } from "components/build/questionService/ConvertService";
import AddAnswerButton from "components/build/baseComponents/addAnswerButton/AddAnswerButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import QuillShortAnswer from "components/baseComponents/quill/QuillShortAnswer";


export interface ShortAnswerBuildProps extends UniqueComponentProps {
  data: ShortAnswerData;
}

export const getDefaultShortAnswerAnswer = () => {
  return { list: [{ value: "" }] };
}

const ShortAnswerBuildComponent: React.FC<ShortAnswerBuildProps> = ({
  locked, editOnly, data, save, ...props
}) => {
  if (!data.list) data.list = getDefaultShortAnswerAnswer().list;

  const [state, setState] = React.useState(data);

  useEffect(() => setState(data), [data]);

  const update = () => {
    setState(Object.assign({}, state));
    props.updateComponent(state);
  };

  const changed = (shortAnswer: ShortAnswerItem, htmlValue: string) => {
    if (locked) return;
    shortAnswer.value = htmlValue;
    update();
    save();
  };

  const addShortAnswer = () => {
    if (locked) return;
    state.list.push({ value: "" });
    update();
    save();
  };

  const removeFromList = (index: number) => {
    if (locked) return;
    state.list.splice(index, 1);
    update();
    save();
  };

  const renderDeleteButton = (index: number) => {
    if (state.list.length > 1) {
      return (
        <button className="btn btn-transparent right-top-icon svgOnHover" onClick={() => removeFromList(index)}>
          <SpriteIcon name="trash-outline" className="active back-button theme-orange" />
        </button>
      )
    }
  }

  const renderShortAnswer = (answer: ShortAnswerItem, index: number) => {
    let className = "short-answer-box";
    if (props.validationRequired) {
      if (!answer.value) {
        className += ' invalid-answer';
      }
    }
    return (
      <div className={className} key={index}>
        {renderDeleteButton(index)}
        <QuillShortAnswer
          disabled={locked}
          validate={props.validationRequired}
          isValid={!!stripHtml(answer.value)}
          data={answer.value}
          placeholder="Short Answer (max. 3 words)"
          onChange={(value) => changed(answer, value)}
        />
      </div>
    );
  };

  return (
    <div className="short-answer-build unique-component">
      <div className="component-title">
        <p><SpriteIcon name="alert-triangle" />Take care to choose an unambiguous answer.</p>
        <p>Specify the required form and whether an article is expected.</p>
      </div>
      {state.list.map((shortAnswer, i) => renderShortAnswer(shortAnswer, i))}
      <AddAnswerButton
        locked={locked}
        addAnswer={addShortAnswer}
        height="auto"
        label="Add a short answer"
      />
    </div>
  );
};

export default ShortAnswerBuildComponent;
