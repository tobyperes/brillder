import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Subject } from 'model/brick';
import { InputBase, ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';
import { loadSubjects } from 'components/services/subject';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User, UserType } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';

interface AssignClassProps {
  isOpen: boolean;
  submit(value: string, subject: Subject): void;
  close(): void;

  user: User;
}

const CreateClassDialog: React.FC<AssignClassProps> = (props) => {
  const [value, setValue] = React.useState("");
  const [subjectIndex, setSubjectIndex] = React.useState<number>();

  const [subjects, setSubjects] = React.useState<Subject[]>();
  React.useEffect(() => {
    const initAllSubjects = async () => {
      const subs = await loadSubjects();
      if(subs) {
        setSubjects(subs);
      }
    }

    if(props.user.roles.some(role => role.roleId === UserType.Admin)) {
      initAllSubjects();
    } else {
      setSubjects(props.user.subjects);
    }
  }, []);

  React.useEffect(() => {
    if(subjects && subjects.length > 0) {
      setSubjectIndex(subjects.findIndex(s => s.name === "General") ?? 0);
    }
  }, [subjects])

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog"
    >
      <div className="dialog-header" style={{marginBottom: '2vh'}}>
        <div className="title">What is the name of class?</div>
        <input value={value} onChange={e => setValue(e.target.value)} />
      </div>
      <div className="dialog-header" style={{marginBottom: '2vh'}}>
        <div className="title">What subject is the class for?</div>
        <Select
          MenuProps={{ style: { zIndex: 1000000 } } /* Dialog box is always z-index 999999 */}
          value={subjectIndex}
          onChange={(evt) => setSubjectIndex(evt.target.value as number)}
          input={<InputBase />}
        >
          {subjects?.map((s, i) => (
            <MenuItem value={i} key={i}>
              <ListItemIcon>
                <SvgIcon>
                  <SpriteIcon
                    name="circle-filled"
                    className="w100 h100 active"
                    style={{ color: s.color }}
                  />
                </SvgIcon>
              </ListItemIcon>
              <ListItemText>{s.name}</ListItemText>
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={() => {
            if(value && subjects && subjectIndex !== undefined && subjects[subjectIndex]) {
              props.submit(value, subjects[subjectIndex]);
            }
          }}>
          <span>Create</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>Cancel</span>
        </button>
      </div>
    </Dialog>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(CreateClassDialog);