import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface TabProps {
  draft: number;
  build: number;
  review: number;
  publish: number;
  onCoreSwitch(): void;
}

const TabComponent: React.FC<TabProps> = (props) => {
  const [publicHovered, publicHover] = React.useState(false);
  const [personalHovered, personalHover] = React.useState(false);

  const renderPublicTip = () => {
    return (
      <div className="custom-tooltip">
        <div>Educate the World</div>
        <div>These are bricks you hope to publish to our core library</div>
      </div>
    );
  }

  const getPublicTab = () => {
    return (
      <div key={2} className="no-active" onClick={props.onCoreSwitch}>
        <div style={{ display: "flex", position: "relative" }}>
          <span>Public</span>
          <div className="tab-icon-container public" onMouseEnter={() => publicHover(true)} onMouseLeave={() => publicHover(false)}>
            <SpriteIcon name="globe" className="no-active" />
            {publicHovered && renderPublicTip()}
          </div>
          <div className="round-button-container">
            <div className="round-button draft">{props.draft}</div>
            <div className="round-button build">{props.build}</div>
            <div className="round-button review">{props.review}</div>
            <div className="round-button publish">{props.publish}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderPersonalTip = () => {
    return (
      <div className="custom-tooltip">
        <div>Keep Control</div>
        <div>These are bricks you plan to use within your own bubbles</div>
      </div>
    );
  }

  const getPersonalTab = () => {
    return (
      <div key={3} className="active">
        <div style={{ display: "flex" }}>
          <span>Personal</span>
          <div className="tab-icon-container personal" onMouseEnter={() => personalHover(true)} onMouseLeave={() => personalHover(false)}>
            <SpriteIcon name="key" className="active" />
            {personalHovered && renderPersonalTip()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tab-container">
      {getPublicTab()}
      {getPersonalTab()}
    </div>
  );
};

export default TabComponent;
