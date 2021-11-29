import { RolePreference } from "model/user";
import React, { Component } from "react";
import { Grid, Radio, FormControlLabel } from "@material-ui/core";

import { setUserPreference, setUserPreferenceById } from 'services/axios/user';

import { UserRoleItem } from "./model";

interface BoxState {
  rolePreference?: RolePreference;
}

interface BoxProps {
  roles: any[];
  userRoles: any[];
  userId: number;
  isAdmin: boolean;
  rolePreference?: any;
  toggleRole(roleId: number, disabled: boolean): void;
}

class RolesBox extends Component<BoxProps, BoxState> {
  constructor(props: BoxProps) {
    super(props);

    this.state = {
      rolePreference: props.rolePreference,
    };
  }

  async onPreferenceChange(rolePreference: RolePreference) {
    if (this.props.isAdmin && this.props.userId) {
      const success = await setUserPreferenceById(rolePreference, this.props.userId);
      if (success) {
        this.setState({ rolePreference });
      }
    } else {
      const success = await setUserPreference(rolePreference);
      if (success) {
        this.setState({ rolePreference });
      }
    }
  }

  checkUserRole(roleId: number) {
    return this.props.userRoles.some((id) => id === roleId);
  }

  renderRole(role: UserRoleItem) {
    const checked = this.checkUserRole(role.roleId);

    return (
      <FormControlLabel
        className={`filter-container ${role.disabled ? "disabled" : ""}`}
        checked={checked}
        onClick={() => this.props.toggleRole(role.roleId, role.disabled)}
        control={<Radio className="filter-radio" />}
        label={role.name}
      />
    );
  }

  render() {
    const { rolePreference } = this.state;
    return (
      <div className="flex-center roles-box">
        <p className="fixed-label">User Type</p>
        <div className="first-column">
          <Grid item>
            <FormControlLabel
              className="filter-container"
              checked={rolePreference === RolePreference.Student}
              onClick={() => this.onPreferenceChange(RolePreference.Student)}
              control={<Radio className="filter-radio" />}
              label="Learner"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              className="filter-container"
              checked={rolePreference === RolePreference.Teacher}
              onClick={() => this.onPreferenceChange(RolePreference.Teacher)}
              control={<Radio className="filter-radio" />}
              label="Educator"
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              className="filter-container"
              checked={rolePreference === RolePreference.Builder}
              onClick={() => this.onPreferenceChange(RolePreference.Builder)}
              control={<Radio className="filter-radio" />}
              label="Builder"
            />
          </Grid>
        </div>
        <div>
          <Grid item>
            <FormControlLabel
              className="filter-container"
              checked={rolePreference === RolePreference.Institution}
              onClick={() => this.onPreferenceChange(RolePreference.Institution)}
              control={<Radio className="filter-radio" />}
              label="Institution"
            />
          </Grid>

          {/* Publisher and Admin roles */}
          <Grid item>{this.renderRole(this.props.roles[0])}</Grid>
          <Grid item>{this.renderRole(this.props.roles[1])}</Grid>
        </div>
      </div>
    );
  }
}

export default RolesBox;
