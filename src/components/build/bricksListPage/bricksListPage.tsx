import './bricksListPage.scss';
import React, { Component } from 'react';
import { Box, Grid, FormControlLabel, Radio, RadioGroup, Button } from '@material-ui/core';
import axios from 'axios';
// @ts-ignore
import { connect } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ClearIcon from '@material-ui/icons/Clear';
import Dialog from '@material-ui/core/Dialog';

import authActions from 'redux/actions/auth';
import { Brick, BrickStatus } from 'model/brick';
import { User, UserType } from 'model/user';


const mapState = (state: any) => {
  return {
    user: state.user.user,
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    logout: () => dispatch(authActions.logout()),
  }
}

const connector = connect(mapState, mapDispatch);

interface BricksListProps {
  user: User,
  history: any;
  logout(): void;
}

interface BricksListState {
  yourBricks: Array<Brick>;
  bricks: Array<Brick>;
  sortBy: SortBy;
  subjects: any[];
  yoursIndex: number;
  yoursReversed: boolean;
  sortedIndex: number;
  filterExpanded: boolean;
  logoutDialogOpen: boolean;

  deleteDialogOpen: boolean;
  deleteBrickId: number;
}

enum SortBy {
  None,
  Date,
  Popularity,
}

class BricksListPage extends Component<BricksListProps, BricksListState> {
  constructor(props: BricksListProps) {
    super(props)
    this.state = {
      yourBricks: [],
      bricks: [],
      sortBy: SortBy.None,
      subjects: [],
      yoursIndex: 0,
      yoursReversed: false,
      sortedIndex: 0,
      filterExpanded: false,
      logoutDialogOpen: false,
      deleteDialogOpen: false,
      deleteBrickId: -1
    };

    axios.get(process.env.REACT_APP_BACKEND_HOST + '/bricks/currentUser', {withCredentials: true})
      .then((res) => { 
        let bricks = res.data as Brick[];
        bricks = bricks.filter(brick => {
          return brick.status === BrickStatus.Publish;
        });
        this.setState({...this.state, yourBricks: bricks });
      })
      .catch(error => {
        alert('Can`t get bricks')
      });

    axios.get(process.env.REACT_APP_BACKEND_HOST + '/bricks/byStatus/' + BrickStatus.Publish, {withCredentials: true})
      .then(res => {  
        this.setState({...this.state, bricks: res.data });
      })
      .catch(error => {
        alert('Can`t get bricks');
      });

    axios.get(process.env.REACT_APP_BACKEND_HOST + '/subjects', {withCredentials: true})
    .then(res => {
      this.setState({...this.state, subjects: res.data });
    })
    .catch(error => {
      alert('Can`t get bricks');
    });
  }

  logout() {
    this.props.logout();
    this.props.history.push('/choose-user');
  }

  delete() {
    let brickId = this.state.deleteBrickId;
    axios.delete(process.env.REACT_APP_BACKEND_HOST + '/brick/' + brickId, {withCredentials: true})
      .then(res => {
        let {bricks, yourBricks} = this.state;
        let brick = bricks.find(brick => brick.id === brickId);
        if (brick) {
          let index = bricks.indexOf(brick);
          bricks.splice(index, 1);
        }

        brick = yourBricks.find(brick => brick.id === brickId);
        if (brick) {
          let index = yourBricks.indexOf(brick);
          yourBricks.splice(index, 1);
        }

        this.setState({...this.state, deleteDialogOpen: false});
      })
      .catch(error => {
        alert('Can`t delete bricks');
      });
  }

  move(brickId:number) {
    this.props.history.push(`/build/brick/${brickId}/build/investigation/question`)
  }

  formatTwoLastDigits(twoLastDigits: number) {
    var formatedTwoLastDigits = "";
    if (twoLastDigits < 10 ) {
      formatedTwoLastDigits = "0" + twoLastDigits;
    } else {
      formatedTwoLastDigits = "" + twoLastDigits;
    }
    return formatedTwoLastDigits;
  }

  getYear(date: Date) {
    var currentYear =  date.getFullYear();   
    var twoLastDigits = currentYear % 100;
    return this.formatTwoLastDigits(twoLastDigits);
  }

  getMonth(date: Date) {
    const month = date.getMonth() + 1;
    var twoLastDigits = month % 10;
    return this.formatTwoLastDigits(twoLastDigits);
  }

  getDate(date: Date) {
    const days = date.getDate();
    return this.formatTwoLastDigits(days);
  }
  
  handleSortChange = (e: any) => {
    const {state} = this;
    const sortBy = parseInt(e.target.value) as SortBy;
    let bricks = this.state.bricks;
    if (sortBy === SortBy.Date) {
      bricks = bricks.sort((a, b) => {
        const createdA = new Date(a.created).getTime();
        const createdB = new Date(b.created).getTime();
        return (createdA < createdB) ? 1 : -1;
      });
    } else if (sortBy === SortBy.Popularity) {
      bricks = bricks.sort((a, b) => ((a.attemptsCount > b.attemptsCount) ? 1 : -1)); 
    }
    this.setState({...state, bricks, sortBy})
  }

  filterBySubject = (i: number) => {
    const {state} = this;
    const {subjects} = state;
    subjects[i].checked = !subjects[i].checked
    this.setState({...state})
  }

  clearSubjects = () => {
    const { state } = this;
    const { subjects } = state;
    subjects.forEach((r: any)=> r.checked = false);
    this.setState({ ...state })
  }

  moveAllBack() {
    let index = this.state.sortedIndex;
    if (index >= 15) {
      this.setState({...this.state, sortedIndex: index - 15});
    }
  }

  moveAllNext() {
    let index = this.state.sortedIndex;
    if (index + 15 <= this.state.bricks.length) {
      this.setState({...this.state, sortedIndex: index + 15});
    }
  }

  getBrickContainer = (brick: Brick, key: number) => {
    let color = "";
    
    if (!brick.subject) {
      color = '#B0B0AD';
    }

    return (
      <Grid container key={key} item xs={4} justify="center">
        <div className="main-brick-container">
          <Box className="brick-container">
            <div
              className={`sorted-brick absolute-container brick-row-0 ${brick.expanded ? "bigger-hover" : ""}`}
              onMouseEnter={() => this.yourBricksMouseHover(key)}
              onMouseLeave={() => this.yourBricksMouseLeave(key)}
            >
              <Grid container direction="row" style={{padding: 0, position: 'relative'}}>
                <Grid item xs={brick.expanded ? 12 : 11}>
                  {
                    brick.expanded ?
                      <div className="expended-brick-info">
                        <div className="hover-text">
                          <div className="link-description">{brick.title}</div>
                          <div className="link-info">{brick.subTopic} | {brick.alternativeTopics}</div>
                          <div className="link-info">
                            {this.getAuthorRow(brick)}
                          </div>
                          <div className="hovered-open-question link-info">{brick.openQuestion}</div>
                          <div>SUBJECT Code | No. {brick.attemptsCount} of Plays</div>
                          <div>Editor: Name Surname</div>
                        </div>
                      <Grid container direction="row" className="hover-icons-row" alignContent="flex-end">
                        <Grid item xs={4} container justify="flex-start">
                          <div className="round-button" style={{background : `${color}`}}></div>
                        </Grid>
                        <Grid item xs={4} container justify="flex-start">
                          {
                            (this.props.user.type === UserType.Admin)
                              ? <img alt="bin" onClick={() => this.handleDeleteOpen(brick.id)} className="bin-button" src="/images/brick-list/bin.png" />
                              : ""
                          }
                        </Grid>
                        <Grid item xs={4} container justify="flex-end">
                          <img
                            alt="play"
                            className="play-button"
                            onClick={() => this.move(brick.id)}
                            src="/images/brick-list/play.png" />
                        </Grid>
                      </Grid>
                    </div>
                    :
                    <div>
                      <div className="left-brick-circle">
                        <div className="round-button" style={{background: `${color}`}}></div>
                      </div>
                      <div className="short-brick-info">
                        <div className="link-description">{brick.title}</div>
                        <div className="link-info">{brick.subTopic} | {brick.alternativeTopics}</div>
                        <div className="link-info">
                          {this.getAuthorRow(brick)}
                        </div>
                      </div>
                    </div>
                  }
                </Grid>
              </Grid>
            </div>
          </Box>
        </div>
      </Grid>
    );
  }

  handleMouseHover(index: number) {
    let {bricks} = this.state;
    bricks.forEach(brick => {
      brick.expanded = false;
    });
    this.setState({...this.state});
    setTimeout(() => {
      let {bricks} = this.state;
      bricks.forEach(brick => {
        brick.expanded = false;
      });
      if (!bricks[index].expandFinished) {
        bricks[index].expanded = true;
      }
      this.setState({...this.state});
    }, 400);
  }

  handleMouseLeave(key: number) {
    let {bricks, yourBricks} = this.state;
    yourBricks.forEach(brick => {
      brick.expanded = false;
    });
    bricks.forEach(brick => {
      brick.expanded = false;
    });
    bricks[key].expandFinished = true;
    this.setState({...this.state});
    setTimeout(() => {
      bricks[key].expandFinished = false;
      this.setState({...this.state});
    }, 400);
  }

  yourBricksMouseHover(index: number) {
    let {yourBricks, bricks} = this.state;
    bricks.forEach(brick => {
      brick.expanded = false;
    });
    yourBricks.forEach(brick => {
      brick.expanded = false;
    });
    this.setState({...this.state});
    setTimeout(() => {
      let {yourBricks} = this.state;
      yourBricks.forEach(brick => {
        brick.expanded = false;
      });
      if (!yourBricks[index].expandFinished) {
        yourBricks[index].expanded = true;
      }
      this.setState({...this.state});
    }, 400);
  }

  yourBricksMouseLeave(key: number) {
    let {yourBricks} = this.state;
    yourBricks.forEach(brick => {
      brick.expanded = false;
    });
    yourBricks[key].expandFinished = true;
    this.setState({...this.state});
    setTimeout(() => {
      yourBricks[key].expandFinished = false;
      this.setState({...this.state});
    }, 400);
  }

  getAuthorRow(brick: Brick) {
    let row = "";
    const created = new Date(brick.created);
    const year = this.getYear(created);
    const month = this.getMonth(created);
    const date = this.getDate(created);
    if (brick.author) {
      const {author} = brick;
      if (author.firstName || author.firstName) {
        row += `${author.firstName} ${author.firstName} | `
      }
      row += `${date}.${month}.${year} | ${brick.brickLength} mins`;
    }
    return row;
  }

  handleLogoutOpen() {
    this.setState({...this.state, logoutDialogOpen: true})
  }

  handleLogoutClose() {
    this.setState({...this.state, logoutDialogOpen: false})
  }

  handleDeleteOpen(deleteBrickId: number) {
    this.setState({...this.state, deleteDialogOpen: true, deleteBrickId })
  }

  handleDeleteClose() {
    this.setState({...this.state, deleteDialogOpen: false})
  }

  getSortedBrickContainer = (brick: Brick, key: number, row: any = 0) => {
    let color = "";
    
    if (!brick.subject) {
      color = '#B0B0AD';
    }

    return (
      <Grid container key={key} item xs={4} justify="center">
        <div className="main-brick-container">
          <Box className="brick-container">
            <div
              className={`sorted-brick absolute-container brick-row-${row + 1} ${brick.expanded ? 'brick-hover' : ''}`}
              onMouseEnter={() => this.handleMouseHover(key)}
              onMouseLeave={() => this.handleMouseLeave(key)}
            >
            <Grid container direction="row" style={{padding: 0, position: 'relative'}}>
              <Grid item xs={brick.expanded ? 12 : 11}>
                {
                  brick.expanded ?
                    <div className="expended-brick-info">
                      <div className="hover-text">
                        <div className="link-description">{brick.title}</div>
                        <div className="link-info">{brick.subTopic} | {brick.alternativeTopics}</div>
                        <div className="link-info">
                          {this.getAuthorRow(brick)}
                        </div>
                        <div className="hovered-open-question link-info">{brick.openQuestion}</div>
                        <div>SUBJECT Code | No. {brick.attemptsCount} of Plays</div>
                        <div>Editor: Name Surname</div>
                      </div>
                    <Grid container direction="row" className="hover-icons-row" alignContent="flex-end">
                      <Grid item xs={4} container justify="flex-start">
                        <div className="round-button" style={{background : `${color}`}}></div>
                      </Grid>
                      <Grid item xs={4} container justify="flex-start">
                        {
                          (this.props.user.type === UserType.Admin)
                            ? <img alt="bin" onClick={() => this.handleDeleteOpen(brick.id)} className="bin-button" src="/images/brick-list/bin.png" />
                            : ""
                        }
                      </Grid>
                      <Grid item xs={4} container justify="flex-end">
                        <img
                          alt="play"
                          className="play-button"
                          onClick={() => this.move(brick.id)}
                          src="/images/brick-list/play.png" />
                      </Grid>
                    </Grid>
                  </div>
                  :
                  <div>
                    <div className="left-brick-circle">
                      <div className="round-button" style={{background: `${color}`}}></div>
                    </div>
                    <div className="short-brick-info">
                      <div className="link-description">{brick.title}</div>
                      <div className="link-info">{brick.subTopic} | {brick.alternativeTopics}</div>
                      <div className="link-info">
                        {this.getAuthorRow(brick)}
                      </div>
                    </div>
                  </div>
                }
              </Grid>
            </Grid>
            </div>
          </Box>
        </div>
      </Grid>
    );
  }

  renderYourBrickRow = () => {
    let bricksList = []
    let index = 0;
    for (let i = index; i < index + 3; i++) {
      if (this.state.yourBricks[i]) {
        bricksList.push(this.getBrickContainer(this.state.yourBricks[i], i));
      }
    }
    return bricksList;
  }

  renderSortAndFilterBox = () => {
    return (
      <div className="sort-box">
        <div className="sort-header">Sort By</div>
        <RadioGroup
          className="sort-group"
          aria-label="SortBy"
          name="SortBy"
          value={this.state.sortBy}
          onChange={this.handleSortChange}
        >
          <FormControlLabel value={SortBy.Popularity} control={<Radio className="sortBy" />} label="Popularity" />
          <FormControlLabel value={SortBy.Date} control={<Radio className="sortBy" />} label="Date Added" />
        </RadioGroup>
        <div className="filter-header">
          <div style={{ display: 'inline' }}>
            <span className='filter-control'>Filter</span>
            {
              this.state.filterExpanded
                ? <ExpandLessIcon className='filter-control' style={{ fontSize: '3vw' }}
                    onClick={() => this.setState({ ...this.state, filterExpanded: false })} />
                : <ExpandMoreIcon className='filter-control' style={{ fontSize: '3vw' }}
                    onClick={() => this.setState({ ...this.state, filterExpanded: true })} />
            }
            {
              this.state.subjects.some((r: any) => r.checked)
              ? <ClearIcon className='filter-control' style={{ fontSize: '2vw' }} onClick={() => this.clearSubjects()} />
              : ''
            }
          </div>
        </div>
        {
          
          this.state.filterExpanded
              ? this.state.subjects.map((subject, i) =>
                <FormControlLabel
                  className="filter-container"
                  key={i}
                  checked={subject.checked}
                  onClick={() => this.filterBySubject(i)}
                  control={<Radio className={"filter-radio custom-color"} style={{['--color' as any] : subject.color}} />}
                  label={subject.name} />
              )
              : ''
        }

      </div>
    );
  }

  renderTitle = () => {
    return "ALL BRICKS";
  }

  renderSortedBricks = () => {
    let {sortedIndex} = this.state;
    let bricksList = [];
    for (let i = 0 + sortedIndex; i < 15 + sortedIndex; i++) {
      if (this.state.bricks[i]) {
        let row = Math.floor(i / 3);
        bricksList.push(this.getSortedBrickContainer(this.state.bricks[i], i, row));
      }
    }
    return bricksList
  }

  renderPagination() {
    return ("");   
  }

  render() {  
    return (
      <div className="bricks-list-page">
        <div className="bricks-upper-part">
          <Grid container direction="row" className="bricks-header">
            <Grid item style={{width: '7.65vw'}}>
              <Grid container direction="row">
                <Grid item className="home-button-container">
                  <div className="home-button" onClick={() => { this.props.history.push('/build') }}>
                    <div></div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid container className="logout-container" item direction="row" style={{width: '92.35vw'}}>
              <Grid container style={{width: '60vw', height: '7vh'}}>
              <Grid item>
                <div className="search-button"></div>
              </Grid>
              <Grid item>
                <input className="search-input" placeholder="Search Subjects, Topics, Titles & more" />
              </Grid>
              </Grid>
              <Grid item style={{width: '32.35vw'}}>
                <Grid container direction="row" justify="flex-end">
                  <div className="logout-button" onClick={() => this.handleLogoutOpen()}></div>
                  <div className="bell-button"><div></div></div>
                  <div className="user-button"></div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container direction="row" className="sorted-row">
            <Grid container item xs={3} className="sort-and-filter-container">
              {this.renderSortAndFilterBox()}
            </Grid>
            <Grid item xs={9} style={{position: 'relative'}}>
              <div className="brick-row-container">
                <div className="brick-row-title">
                  {this.renderTitle()}
                </div>
                <Grid container direction="row">
                  {this.renderYourBrickRow()}
                </Grid>
                <Grid container direction="row">
                  {this.renderSortedBricks()}
                </Grid>
                {
                  this.state.bricks.length > 15 ? (
                    <Grid container direction="row" className="left-pagination">
                      <Grid item xs={4}>
                        <div>
                          {this.state.sortedIndex + 1} - {
                            this.state.sortedIndex + 15 > this.state.bricks.length
                              ? this.state.bricks.length
                              : this.state.sortedIndex + 15
                          } | {this.state.bricks.length}
                        </div>
                        <div>
                          {(this.state.sortedIndex + 15) / 15} | {Math.ceil(this.state.bricks.length / 15)}
                        </div>
                      </Grid>
                      <Grid container item xs={4} justify="center" className="bottom-next-button">
                        <div>
                          <ExpandLessIcon
                            className={"prev-button " + ((this.state.sortedIndex >= 15) ? "active" : "")}
                            onClick={() => this.moveAllBack()}
                          />
                          <ExpandMoreIcon
                            className={"next-button " + ((this.state.sortedIndex + 15 <= this.state.bricks.length) ? "active" : "")}
                            onClick={() => this.moveAllNext()}
                          />
                        </div>
                      </Grid>
                    </Grid>
                  ) : ""
                }
              </div>
            </Grid>
          </Grid>
        </div>
        <Dialog
          open={this.state.logoutDialogOpen}
          onClose={() => this.handleLogoutClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="alert-dialog"
        >
          <div className="logout-dialog-header">
            <div>Are you sure you want</div>
            <div>to log out?</div>
          </div>
          <Grid container direction="row" className="logout-buttons" justify="center">
            <Button className="yes-button" onClick={() => this.logout()}>Yes</Button>
            <Button className="no-button" onClick={() => this.handleLogoutClose()}>No</Button>
          </Grid>
        </Dialog>
        <Dialog
          open={this.state.deleteDialogOpen}
          onClose={() => this.handleDeleteClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="delete-brick-dialog"
        >
          <div className="dialog-header">
            <div>Permanently delete</div>
            <div>this brick?</div>
          </div>
          <Grid container direction="row" className="row-buttons" justify="center">
            <Button className="yes-button" onClick={() => this.delete()}>Yes, delete</Button>
            <Button className="no-button" onClick={() => this.handleDeleteClose()}>No, keep</Button>
          </Grid>
        </Dialog>
      </div>
    )
  }
}

export default connector(BricksListPage);
