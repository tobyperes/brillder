import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface UnauthorizedProps {
  isOpen: boolean;
  login(): void;
  again(): void;
  close(): void;
}

const UnauthorizedUserDialog: React.FC<UnauthorizedProps> = (props) => {
  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue">
      <div className="dialog-header">
        <div className="bold" >To review your answers, create an account.</div>
        <div className="bold">There are no obligations, and you can <br/> carry on playing for free.</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={props.login}>
          <span className="bold">Create Account</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={props.again}>
          <span className="bold">Try another brick</span>
        </button>
      </div>
    </Dialog>
  );
};

export default UnauthorizedUserDialog;
