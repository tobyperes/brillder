import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import "./InviteStudentEmailDialog.scss";
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { ClassroomApi } from 'components/teach/service';
import axios from 'axios';
import AutocompleteUsernameButEmail from 'components/play/baseComponents/AutocompleteUsernameButEmail';
import { User } from 'model/user';

interface InviteStudentEmailProps {
  classroom: ClassroomApi;
  isOpen: boolean;
  close(numInvited: number): void;
}

//eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const InviteStudentEmailDialog: React.FC<InviteStudentEmailProps> = (props) => {
  const [currentEmail, setCurrentEmail] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);

  const addUser = (email: string) => {
    if (!emailRegex.test(email)) {
      return;
    }
    setCurrentEmail('');
    setUsers(users => [ ...users, { email } as User]);
  }

  const onAddUser = React.useCallback(() => {
    if (!emailRegex.test(currentEmail)) {
      return;
    }
    setCurrentEmail('');
    setUsers(users => [ ...users, { email: currentEmail} as User]);
  }, [currentEmail]);

  const onSubmit = React.useCallback(async () => {
    const currentUsers = users;
    if (!emailRegex.test(currentEmail)) {
      if (users.length <= 0) {
        return;
      }
    } else {
      setUsers(users => [ ...users, { email: currentEmail } as User ]);
      currentUsers.push({ email: currentEmail} as User);
      setCurrentEmail("");
    }
    await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/classrooms/students/${props.classroom.id}/new`,
      { emails: currentUsers.map(u => u.email) },
      { withCredentials: true }
    );
    props.close(currentUsers.length);
  }, [users, props, currentEmail])

  const checkSpaces = (email: string) => {
    const emails = email.split(' ');
    if (emails.length >= 2) {
      for (let email of emails) {
        addUser(email);
      }
    } else {
      setCurrentEmail(email.trim());
    }
  }

  return (
    <Dialog open={props.isOpen} onClose={() => props.close(0)} className="dialog-box light-blue invite-email-dialog">
      <div className="close-button svgOnHover" onClick={() => props.close(0)}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="dialog-header">
        <div className="bold m-b-10">Invite students by email.</div>
        <div className="text-center f-s-2">You can invite between 1 and 50 students to a class</div>
        <AutocompleteUsernameButEmail
          editorError=""
          placeholder="hello"
          currentEmail={currentEmail}
          onBlur={() => {}}
          users={users}
          onAddEmail={onAddUser}
          onChange={email => checkSpaces(email.trim())}
          setUsers={users => {
            setCurrentEmail('');
            setUsers(users as User[]);
          }}
        />
        <div className="dialog-footer centered-important" style={{justifyContent: 'center'}}>
          <button className="btn btn-md bg-theme-orange yes-button icon-button" style={{width: 'auto'}} onClick={onSubmit}>
            <div className="centered">
              <span className="label">Send Invites</span>
              <SpriteIcon name="send" />
            </div>
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default InviteStudentEmailDialog;
