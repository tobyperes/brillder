import React, { useState } from "react";
import { connect } from "react-redux";
import { History } from "history";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";

import 'components/loginPage/desktop/LoginDesktopPage.scss';
import actions from "redux/actions/auth";
import LoginLogo from 'components/loginPage/components/LoginLogo';
import GoogleDesktopButton from "components/loginPage/desktop/GoogleDesktopButton";
import RegisterDesktopButton from "components/loginPage/desktop/RegisterDesktopButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TermsLink from "components/baseComponents/TermsLink"
import TeachIcon from "components/mainPage/components/TeachIcon";
import PhoneIcon from "components/loginPage/desktop/PhoneIcon";
import TypingLabel from "components/baseComponents/TypingLabel";
import EmailRegisterDesktopPage from "components/loginPage/desktop/EmailRegisterDesktopPage";
import Delayed from "components/services/Delayed";
import { ActivateAccount, ActivateAccountEmail, JoinPage, RegisterPage } from "components/loginPage/desktop/routes";
import PolicyDialog from "components/baseComponents/policyDialog/PolicyDialog"; // TODO: Reuse this for the cookie Popup

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(null, mapDispatch);

export enum LoginPage {
  Default,
  Join,
  Register
}

interface LoginProps {
  loginSuccess(): void;
  history: History;
  token: string | null;
  match: any;
}

const DesktopActivateAccountPage: React.FC<LoginProps> = (props) => {
  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }
  const [isPolicyOpen, setPolicyDialog] = useState(initPolicyOpen);
  const { history } = props;
  let page = LoginPage.Default;
  const { pathname } = history.location;
  if (pathname === JoinPage) {
    page = LoginPage.Join;
  } else if (pathname === RegisterPage) {
    page = LoginPage.Register;
  }

  const moveToFirstPage = () => history.push(ActivateAccount)
  const moveToEmailLogin = () => {
    history.push(ActivateAccountEmail + '?token=' + props.token);
  };
  const moveToJoin = () => history.push(JoinPage);
  const moveToRegister = () => history.push(RegisterPage);

  return (
    <div className="login-desktop-page">
      {(page === LoginPage.Join || page === LoginPage.Register) &&
        <div className="left-part-join">
          <h1>
            <TypingLabel className="" onEnd={() => { }} label="Join the revolution" />
          </h1>
          <div className="image-container spinning">
            <img alt="" src="/images/login/PhoneWheellogin.svg" />
          </div>
        </div>}
      <Switch>
        <Route exact path={ActivateAccountEmail}>
          <EmailRegisterDesktopPage history={history} />
        </Route>
        <Route exact path={JoinPage}>
          <div className="left-part right">
            <div className="logo">
              <LoginLogo />
            </div>
            <div className="button-box">
              <GoogleDesktopButton label="Register with Google" />
            </div>
            <div className="button-box">
              <RegisterDesktopButton label="Register with email" onClick={moveToRegister} />
            </div>
            <Delayed waitBeforeShow={500}>
            <div className="button-box">
              <div className="text-box">
                <div className="signin-button" onClick={moveToFirstPage}>
                  <SpriteIcon name="arrow-left" />
                  Sign In 
                </div>
                <span>Already a member?</span>
              </div>
            </div>
            </Delayed>
          </div>
        </Route>
        <Route exact path={ActivateAccount}>
          <div className="left-part">
            <div className="logo">
              <LoginLogo />
            </div>
            <div className="button-box">
              <GoogleDesktopButton label="Sign in with Google" />
            </div>
            <div className="button-box">
              <RegisterDesktopButton label="Sign in with email" onClick={moveToEmailLogin} />
            </div>
            <div className="button-box">
              <div className="text-box">
                <span>New to Brillder?</span>
                <div className="join-button" onClick={moveToJoin}>
                   Join Now
                  <SpriteIcon name="arrow-right" />
                </div>
              </div>
            </div>
          </div>
        </Route>
      </Switch>
      <div className="right-part">
        <div className="container">
          <PhoneIcon />
        </div>
        <div className="bricks-container">
          <div className="inner">
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
            </div>
          </div>
        </div>
        <div className="icons-container">
          <img alt="" className="glasses floating1" src="/images/login/rotatedGlasses.svg" />
          <TeachIcon className="floating3" />
          <SpriteIcon name="trowel-home" className="trowel-login text-theme-orange floating2" />
        </div>
      </div>
      <TermsLink history={props.history}/>
      <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
    </div>
  );
};

export default connector(DesktopActivateAccountPage);
