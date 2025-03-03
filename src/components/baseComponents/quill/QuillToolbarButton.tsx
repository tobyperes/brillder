import React from 'react';
import SpriteIcon from '../SpriteIcon';

interface QuillToolbarButtonProps {
  name: string;
  value?: string;
  icon?: string;
  label?: string;

  enabled?: boolean;
  handler(name: string, value?: string): boolean | undefined;
  format?: any;
}

const QuillToolbarButton: React.FC<QuillToolbarButtonProps> = props => {
  return (
    <button
      disabled={!props.enabled}
      className={`q-tooltip-hover q-${props.name}${props.value ? `-${props.value}` : ""}${(props.format?.[props.name] && (!props.value || props.format?.[props.name] === props.value)) ? " active" : ""}`}
      onClick={(evt) => {
        evt.preventDefault();
        return props.enabled && (props.handler(props.name, props.value) ?? false);
      }}
    >
      <SpriteIcon name={props.icon ? props.icon : ("ql-" + props.name + (props.value ? `-${props.value}` : ""))} />
      {props.enabled && <div className="css-custom-tooltip">{props.label || props.name}</div>}
    </button>
  );
};

export default QuillToolbarButton;