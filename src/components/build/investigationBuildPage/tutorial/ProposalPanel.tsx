import React from 'react'
import { Grid } from '@material-ui/core';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './TutorialPanelWorkArea.scss';


export interface TutorialProps {}

const ProposalPanel: React.FC<TutorialProps> = () => {
  return (
      <div>
        <div className="tutorial-step-1">
          <h1>There are 4 steps to the build process.</h1>
          <Grid container justify="center">
            <div className="edit-border">
              <div className="edit-icon"/>
            </div>
          </Grid>
          <p className="center">
            You can <span className="bold">Edit Your Proposal</span> at anytime by clicking the text to the left of this window.
          </p>
          <div className="proposal-box">
            <h2>1. The Proposal</h2>
            <p>If you’ve made it here, then you’ve at least made a start on your proposal. If you are working with an editor, they will receive a notification at this point and be able to view the draft proposal of your brick.</p>
            <p className="last-text bold">The Proposal can also be accessed via your ‘Back to Work’ page.</p>
          </div>
        </div>
        <Grid container direction="row" className="button-row">
          <Grid item xs={4} />
          <Grid container justify="center" item xs={4}>
            <button>SKIP</button>
          </Grid>
          <Grid container justify="flex-end" item xs={4}>
            <span className="bold">2. The Investigation</span>
            <div className="right-arrow" />
          </Grid>
        </Grid>
      </div>
  );
}

export default ProposalPanel;

