import React from "react";

import './ShortBrickDescription.scss';
import './PhoneTopBrick16x9.scss';
import { AcademicLevel, AcademicLevelLabels, Brick } from "model/brick";

import { User } from "model/user";
import BrickCircle from "./BrickCircle";
import BrickTitle from "./BrickTitle";
import { fileUrl } from "components/services/uploadFile";
import { getDate, getMonth, getYear } from "components/services/brickService";
import { CircularProgressbar } from "react-circular-progressbar";

interface Props {
  brick: Brick;
  circleIcon?: string;
  iconColor?: string;
  user?: User;
  handleDeleteOpen?(id: number): void;

  circleClass?: string;

  // only for play tab in back to work
  color?: string;

  // only for some pages
  isInvited?: boolean;

  deadline?: string;
  isAssignment?: boolean;
  bestScore?: number;
  isViewAllAssignment?: boolean;

  onClick?(): void;
  onIconClick?(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}


const PhoneTopBrick16x9: React.FC<Props> = (props) => {
  const { color, brick } = props;
  const [imgLoaded, setLoaded] = React.useState(false);

  let label = '';
  if (brick.academicLevel >= AcademicLevel.First) {
    label = AcademicLevelLabels[brick.academicLevel];
  }

  const renderDeadline = () => {
    const { deadline } = props;
    if (!props.isAssignment) {
      return '';
    }
    let res = 'NO DEADLINE';
    let className = '';
    if (deadline) {
      const date = new Date(deadline);
      const now = Date.now();
      if (date.getTime() < now) {
        className = 'orange';
      } else {
        className = 'yellow';
      }
      res = `${getDate(date)}.${getMonth(date)}.${getYear(date)}`;
    } else {
      className = 'smaller-blue';
    }
    return (<div className="fwe1-16x9-deadline">
      <div>
        <div className={className}>{res}</div>
      </div>
    </div>
    );
  }

  const renderBestScore = () => {
    if (props.bestScore) {
      return (
        <div className="left-brick-circle brick-status-circle score-circle">
          <div className="round-button" style={{ background: "white" }}>
            <div className="label-circle-text">{Math.round(props.bestScore)}</div>
          </div>
          <CircularProgressbar
            className="circle-progress-first"
            strokeWidth={8}
            counterClockwise={false}
            value={props.bestScore}
          />
        </div>
      );
    }
    return '';
  }

  return (
    <div className="phone-top-brick-16x9" onClick={() => props.onClick ? props.onClick() : {}}>
      {renderDeadline()}
      {color
        && (
          <BrickCircle
            color={color}
            circleIcon={props.circleIcon}
            circleClass={props.circleClass}
            iconColor={props.iconColor}
            isAssignment={props.isViewAllAssignment}
            canHover={true}
            label={label}
            onClick={e => props.onIconClick?.(e)}
          />
        )
      }
      {renderBestScore()}
      <div className="p-blue-background" />
      <img alt="" className={`p-cover-image ${imgLoaded ? 'visible' : 'hidden'}`} onLoad={() => setLoaded(true)} src={fileUrl(brick.coverImage)} />
      <div className="bottom-description-color" />
      <div className="bottom-description">
        <BrickTitle title={brick.title} />
      </div>
    </div >
  );
}

export default PhoneTopBrick16x9;
