import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import { Brick } from "model/brick";
import React, { useEffect } from "react";
import { getLatestBrick } from "services/axios/brick";
import PlayDialog from "./PlayDialog";

import './StartBuilding.scss';

interface Props {
  history: any;
}

const StartBuildingPage: React.FC<Props> = ({
  history
}) => {
  const [isOpen, setOpen] = React.useState(false);
  const [brick, setBrick] = React.useState(null as Brick | null);

  useEffect(() => {
   const loadBrick = async() => {
     const initBrick = await getLatestBrick();
     if (initBrick) {
       setBrick(initBrick);
     }
   }
   loadBrick();
  }, [])

  return (
    <div className="start-building">
      <div>
        <h1>Always keep the learner in mind.</h1>
        <div className="icon-container">
          <SpriteIcon name="feather-map-custom" />
        </div>
        <p>Before starting the Investigation (questions), some framework helps learners get in the right headplace.</p>
        <div className="button-container">
          <button className="btn btn-gray" onClick={() => setOpen(true)}>
            See an example
          </button>
          <button className="btn blue" onClick={() => history.push(map.ProposalSubjectLink)}>
            Start Building
          </button>
        </div>
      </div>
      {brick && <PlayDialog isOpen={isOpen} brick={brick} history={history} close={() => setOpen(false)} />}
    </div>
  );
}

export default StartBuildingPage;
