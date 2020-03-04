import React from "react";
// @ts-ignore
import { connect } from 'react-redux';
import Grid from "@material-ui/core/Grid";

import actions from '../../../../../redux/actions/brickActions';
import { Brick } from "model/brick";
import './ProposalReview.scss';
import { NewBrickStep } from "../../model";
import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";


interface ProposalProps {
  brick: Brick
  history: any
  match: any
  fetchBrick(brickId: number): void
}

function ProposalReview(props: ProposalProps) {
  if (!props.brick) {
    let { brickId } = props.match.params;
    props.fetchBrick(brickId);
    return <div>...Loading brick...</div>
  }
  const { brick } = props;
  return (
    <div className="tutorial-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container item xs={6} justify="center">
          <Grid container item xs={8}>
            <div className="left-card proposal-card">
              <h1 className="only-tutorial-header">Y O U R &nbsp; P R O P O S A L</h1>
              <p>1. What is your brick about</p>
              <div className="proposal-titles">
                <div>{brick.title}</div>
                <div>{brick.subTopic}</div>
                <div>{brick.alternativeTopics}</div>
              </div>
              <p>2. Ideally, every brick should point to a bigger question.</p>
              <p className="grey-line">Alternatively, bricks can present a puzzle or a 	challenge 	which over-arches the topic</p>
              <p className="openQuestion">{brick.openQuestion}</p>
              <p>3. Outline the purpose of your brick.</p>
              <p className="openQuestion">{brick.preparationBrief}</p>
              <p>4. Create an engaging and relevant preparatory task.</p>
              <p>5. Brick Length: <span className="brickLength">{brick.brickLength}</span></p>
              <PreviousButton to="/build/new-brick/length" />
              <NextButton step={NewBrickStep.ProposalReview} canSubmit={true} brickId={brick.id} />
            </div>
          </Grid>
        </Grid>
        <PhonePreview link={window.location.origin + '/logo-page'} />
      </Grid>
    </div>
  );
}


const mapState = (state: any) => {
  return {
    brick: state.brick.brick,
  }
};

const mapDispatch = (dispatch: any) => {
  return {
    fetchBrick: (brickId: number) => dispatch(actions.fetchBrick(brickId)),
  }
};

const connector = connect(
  mapState,
  mapDispatch
);

export default connector(ProposalReview);
