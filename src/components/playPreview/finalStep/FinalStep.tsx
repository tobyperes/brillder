import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import { connect } from "react-redux";

import map from 'components/map';
import actions from 'redux/actions/requestFailed';
import "./FinalStep.scss";
import sprite from "assets/img/icons-sprite.svg";
import { User } from "model/user";
import { Brick, BrickStatus } from "model/brick";
import { PlayStatus } from "components/play/model";
import { checkAdmin } from "components/services/brickService";
import { publishBrick } from "components/services/axios/brick";

import Clock from "components/play/baseComponents/Clock";
import ShareDialog from 'components/play/finalStep/dialogs/ShareDialog';
import InviteDialog from 'components/play/finalStep/dialogs/InviteDialog';
import LinkDialog from 'components/play/finalStep/dialogs/LinkDialog';
import LinkCopiedDialog from 'components/play/finalStep/dialogs/LinkCopiedDialog';
import ExitButton from "components/play/finalStep/ExitButton";
import ShareColumn from "components/play/finalStep/ShareColumn";
import InviteColumn from "components/play/finalStep/InviteColumn";
import PublishColumn from './PublishColumn';
import SimpleDialog from "components/baseComponents/dialogs/SimpleDialog";
import InvitationSuccessDialog from "components/play/finalStep/dialogs/InvitationSuccessDialog";
import PublishSuccessDialog from "components/baseComponents/dialogs/PublishSuccessDialog";

enum PublishStatus {
  None,
  Popup,
  Published,
}

interface FinalStepProps {
  user: User;
  status: PlayStatus;
  brick: Brick;
  history: any;
  location: any;

  requestFailed(e: string): void;
}

const FinalStep: React.FC<FinalStepProps> = ({
  user, brick, location, history, requestFailed
}) => {
  const [shareOpen, setShare] = React.useState(false);
  const [inviteOpen, setInvite] = React.useState(false);
  const [linkOpen, setLink] = React.useState(false);
  const [linkCopiedOpen, setCopiedLink] = React.useState(false);
  const [publishSuccess, setPublishSuccess] = React.useState(PublishStatus.None);
  const [inviteSuccess, setInviteSuccess] = React.useState({
    isOpen: false,
    accessGranted: false,
    name: ''
  });

  let isAuthor = false;
  try {
    isAuthor = brick.author.id === user.id;
  } catch {}

  const isAdmin = checkAdmin(user.roles);

  const link = `/play/brick/${brick.id}/intro`;

  const publish = async (brickId: number) => {
    let success = await publishBrick(brickId);
    if (success) {
      setPublishSuccess(PublishStatus.Popup);
    } else {
      requestFailed("Can`t publish brick");
    }
  }

  const renderInviteColumn = (size: 5 | 3) => {
    return (
      <InviteColumn
        size={size}
        firstLabel="internal users to play"
        secondLabel="or edit this brick"
        onClick={()=> setInvite(true)}
      />
    );
  }

  const renderActionColumns = () => {
    let size: 5 | 3 = 5;

    let canPublish = isAdmin && brick.status !== BrickStatus.Publish && publishSuccess !== PublishStatus.Published;
    if (canPublish) {
      size = 3;
    }

    if (!brick.isCore) {
      return (
        <Grid className="share-row" container direction="row" justify="center">
          <ShareColumn size={size} onClick={() => setShare(true)} />
          {renderInviteColumn(size)}
          {canPublish ? <PublishColumn onClick={() => publish(brick.id)} /> : ""}
        </Grid>
      );
    }
    return (
      <Grid className="share-row" container direction="row" justify="center">
        {renderInviteColumn(size)}
        <ShareColumn size={size} onClick={() => setShare(true)} />
        {canPublish ? <PublishColumn onClick={() => publish(brick.id)} /> : ""}
      </Grid>
    );
  }

  return (
    <div>
      <Hidden only={['xs']}>
        <div className="brick-container final-step-page">
          <Grid container direction="row">
            <Grid item xs={8}>
              <div className="introduction-page">
                <div className="intro-header">
                  <div className="left-brick-circle">
                    <div className="round-button">
                      <svg className="svg active">
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#check-icon-thin"} />
                      </svg>
                    </div>
                  </div>
                  <h2>Final step?</h2>
                  <p>Well done for completing “{brick.title}”!</p>
                  {renderActionColumns()}
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="introduction-info">
                <div className="intro-header">
                  <Clock brickLength={brick.brickLength} />
                </div>
                <div className="intro-text-row">
                </div>
                <ExitButton onClick={() =>
                  history.push(`${map.BackToWorkBuildTab}?isCore=${brick.isCore}`)} />
              </div>
            </Grid>
          </Grid>
        </div>
      </Hidden>
      <Hidden only={['sm', 'md', 'lg', 'xl']}>
        <div className="brick-container mobile-final-step-page final-step-page">
          <div className="introduction-info">
            <div className="intro-text-row"></div>
          </div>
          <div className="introduction-page">
          </div>
          <ExitButton onClick={() => history.push(map.BackToWorkPage)} />
        </div>
      </Hidden>
      <LinkDialog
        isOpen={linkOpen} link={document.location.host + link}
        submit={() => setCopiedLink(true)} close={() => setLink(false)}
      />
      <LinkCopiedDialog isOpen={linkCopiedOpen} close={()=> setCopiedLink(false)} />
      <ShareDialog isOpen={shareOpen} link={() => { setShare(false); setLink(true) }} close={() => setShare(false)} />
      <InviteDialog
        canEdit={true} brick={brick} isOpen={inviteOpen} isAuthor={isAuthor}
        submit={(name, accessGranted) => { setInviteSuccess({ isOpen: true, name, accessGranted }); }}
        close={() => setInvite(false)} />
      <InvitationSuccessDialog
        isAuthor={isAuthor}
        isOpen={inviteSuccess.isOpen} name={inviteSuccess.name} accessGranted={inviteSuccess.accessGranted}
        close={() => setInviteSuccess({ isOpen: false, name: '', accessGranted: false })} />
      <PublishSuccessDialog
        isOpen={publishSuccess === PublishStatus.Popup}
        close={() => setPublishSuccess(PublishStatus.Published)}
      />
    </div>
  );
};

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(null, mapDispatch)(FinalStep);
