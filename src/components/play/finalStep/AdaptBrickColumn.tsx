import React from "react";
import { Grid } from "@material-ui/core";

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ShareProps {
  size?: 3 | 4 | 5 | 6 | 7 | 8;
  onClick(): void;
}

const AdaptBrickColumn: React.FC<ShareProps> = props => {
  return (
    <Grid className="share-column final-assign-brick-column" onClick={props.onClick} container item xs={props.size ? props.size : 6} justify="center">
      <div>
        <div className="button-container">
          <SpriteIcon name="copy" className="active" />
        </div>
        <div className="link-text">Adapt</div>
      </div>
    </Grid>
  );
};

export default AdaptBrickColumn;
