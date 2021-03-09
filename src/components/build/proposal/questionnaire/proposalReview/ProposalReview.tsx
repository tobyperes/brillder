import React from "react";
import * as Y from "yjs";
import Grid from "@material-ui/core/Grid";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import queryString from 'query-string';
import { History } from 'history';

import './ProposalReview.scss';
import { AcademicLevel, BrickStatus } from "model/brick";
import { User } from "model/user";
import { setBrillderTitle } from "components/services/titleService";

import MathInHtml from 'components/play/baseComponents/MathInHtml';
import YoutubeAndMathInHtml from "components/play/baseComponents/YoutubeAndMath";
import { BrickFieldNames, PlayButtonStatus, PrepRoutePart } from '../../model';
import PlayButton from "components/build/baseComponents/PlayButton";
import { CommentLocation } from "model/comments";
import CommentPanel from "components/baseComponents/comments/CommentPanel";
import { Transition } from "react-transition-group";
import NextButton from "./NextButton";
import { leftKeyPressed, rightKeyPressed } from "components/services/key";
import CopiedDialog from "./CopiedDialog";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import { toRenderJSON } from "services/SharedTypeService";
import DifficultySelect from "../brickTitle/DifficultySelect";
import KeyWordsComponent from "../brickTitle/KeyWords";

export enum BookState {
  TitlesPage,
  PrepPage
}

interface ProposalProps {
  brick: Y.Map<any>;
  user: User;
  canEdit: boolean;
  history: History;
  playStatus: PlayButtonStatus;
  baseUrl: string;
  saveBrick(): void;
  setBrickField(name: BrickFieldNames, value: string): void;
  setAcademicLevel(a: AcademicLevel): void;
  saveAndPreview(): void;
}

interface ProposalState {
  bookState: BookState;
  isCopyOpen: boolean;
  bookHovered: boolean;
  closeTimeout: number;
  briefCommentPanelExpanded: boolean;
  mode: boolean; // true - edit mode, false - view mode
  uploading: boolean;
  handleKey(e: any): void;
}

class ProposalReview extends React.Component<ProposalProps, ProposalState> {
  constructor(props: ProposalProps) {
    super(props);

    const values = queryString.parse(props.history.location.search);
    let isCopyOpen = false;
    if (values.copied) {
      isCopyOpen = true;
    }

    let briefCommentExpanded = false;
    const brick = props.brick.toJSON();
    
    let isAuthor = false;
    try {
      isAuthor = props.brick.get("authorId") === props.user.id;
    } catch { }

    // expend suggestions for returned author
    if (brick.status === BrickStatus.Draft && brick.editors && brick.editors.length > 0 && isAuthor) {
      briefCommentExpanded = true;
    }

    // expend suggestions for editor
    if (brick.status === BrickStatus.Build && brick.editors && brick.editors.findIndex((e:any) => e.id === props.user.id) >= 0) {
      briefCommentExpanded = true;
    }

    // expend for publisher
    if (brick.status === BrickStatus.Review && brick.publisher && brick.publisher.id === props.user.id) {
      briefCommentExpanded = true;
    }

    this.state = {
      mode: true,
      bookHovered: true,
      isCopyOpen,
      bookState: BookState.TitlesPage,
      briefCommentPanelExpanded: briefCommentExpanded,
      closeTimeout: -1,
      uploading: false,
      handleKey: this.handleKey.bind(this)
    }
  }

  componentWillMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
    clearInterval(this.state.closeTimeout);
  }

  handleKey(e: any) {
    if (e.target.tagName === "INPUT") { return; }
    if (e.target.tagName === "TEXTAREA") { return; }
    if (e.target.classList.contains("ck-content")) { return; }

    if (this.state.bookHovered) {
      if (rightKeyPressed(e)) {
        if (this.state.bookState === BookState.TitlesPage) {
          this.toSecondPage();
        } else if (this.state.bookState === BookState.PrepPage) {
          this.props.saveBrick();
        }
      } else if (leftKeyPressed(e)) {
        if (this.state.bookState === BookState.PrepPage) {
          this.toFirstPage();
        } else if (this.state.bookState === BookState.TitlesPage) {
          this.moveToPrep();
        }
      }
    } else {
      if (leftKeyPressed(e)) {
        this.moveToPrep();
      }
    }
  }

  onBookHover() {
    clearTimeout(this.state.closeTimeout);
    this.setState({ bookHovered: true });
  }

  onBookClose() {
    let wirisPopups = document.getElementsByClassName("wrs_modal_dialogContainer wrs_modal_desktop wrs_stack");
    if (wirisPopups.length === 0) { 
      const closeTimeout = setTimeout(() => {
        let wirisPopups = document.getElementsByClassName("wrs_modal_dialogContainer wrs_modal_desktop wrs_stack");
        if (wirisPopups.length === 0) {
          if (!this.state.uploading) {
          }
        }
      }, 400);
      this.setState({ closeTimeout });
    }
  }

  toFirstPage() {
    if (this.state.bookState === BookState.PrepPage) {
      this.setState({ bookState: BookState.TitlesPage });
    }
  }

  toSecondPage() {
    if (this.state.bookState === BookState.TitlesPage) {
      this.setState({ bookState: BookState.PrepPage });
    }
  }

  moveToPrep() {
    this.props.history.push(this.props.baseUrl + PrepRoutePart);
  }

  renderEditableTextarea(name: BrickFieldNames, placeholder: string = "Please fill in..", color?: string) {
    const brick = this.props.brick.toJSON();
    if (this.state.mode) {
      return (
        <textarea
          disabled={!this.props.canEdit}
          onChange={e => {
            e.stopPropagation();
            const title = e.target.value.substr(0, 49);
            this.props.brick.set(name, title);
          }}
          placeholder={placeholder}
          value={brick[name]}
        />
      );
    }
    const value = brick[name];
    if (value) {
      return value;
    }
    if (color) {
      return <span className={color}>{placeholder}</span>;
    }
    return <span style={{ color: "#757575" }}>{placeholder}</span>;
  }

  renderEditableField(name: BrickFieldNames, placeholder: string = "Please fill in..", color?: string) {
    const brick = this.props.brick.toJSON();
    if (this.state.mode) {
      return (
        <input
          disabled={!this.props.canEdit}
          onChange={e => {
            e.stopPropagation();
            this.props.brick.set(name, e.target.value);
          }}
          placeholder={placeholder}
          value={brick[name]}
        />
      );
    }
    const value = brick[name];
    if (value) {
      return value;
    }
    if (color) {
      return <span className={color}>{placeholder}</span>;
    }
    return <span style={{ color: "#757575" }}>{placeholder}</span>;
  }

  renderOpenQuestionField() {
    const name = BrickFieldNames.openQuestion;
    const placeholder = "Please fill in this field if you'd like to publish your brick";
    const { brick } = this.props;
    if (this.state.mode) {
      return (
        <QuillEditor
          disabled={!this.props.canEdit}
          sharedData={brick.get(name)}
          showToolbar={true}
          toolbar={[
            'bold', 'italic', 'latex'
          ]}
        />
      );
    }
    const value = toRenderJSON(brick.get(name));
    if (value) {
      return  <MathInHtml value={value} />;
    }
    return <span className="text-theme-orange">{placeholder}</span>;
  }

  renderMathField(name: BrickFieldNames) {
    const { brick } = this.props;
    if (this.state.mode) {
      return (
        <QuillEditor
          disabled={!this.props.canEdit}
          sharedData={brick.get(name)}
          showToolbar={true}
          allowLinks={true}
          toolbar={[
            'bold', 'italic', 'fontColor', 'latex', 'bulletedList', 'numberedList'
          ]}
        />
      );
    }
    const value = toRenderJSON(brick.get(name));
    if (value) {
      return <MathInHtml value={value} />;
    }
    return <span style={{ color: "#757575" }}>Please fill in..</span>;
  }

  renderPrepField() {
    const { brick } = this.props;
    if (this.state.mode) {
      return (
        <QuillEditor
          disabled={!this.props.canEdit}
          sharedData={brick.get("prep")}
          showToolbar={true}
          allowMediaEmbed={true}
          allowLinks={true}
          toolbar={[
            'bold', 'italic', 'fontColor', 'latex', 'bulletedList', 'numberedList'
          ]}
        />
      );
    }
    const value = toRenderJSON(brick.get("prep"));
    if (value) {
      return <YoutubeAndMathInHtml value={value} />;
    }
    return <span style={{ color: "#757575" }}>Please fill in..</span>;
  }

  render() {
    const { brick } = this.props;

    if (brick.get("title")) {
      setBrillderTitle(brick.get("title"));
    }

    const renderAuthorRow = () => {
      const author = brick.get("author");
      if (!author) { return ''; }

      const firstName = author.get("firstName").toString();
      const lastName = author.get("lastName").toString();

      return (
        <div className="names-row">
          {firstName ? firstName + ' ' : ''}
          {lastName ? lastName : ''}
        </div>
      );
    }

    const renderPlayButton = () => {
      const { playStatus } = this.props;
      if (playStatus === PlayButtonStatus.Hidden) {
        return "";
      }
      return (
        <div className="play-preview-button-container">
          <PlayButton
            isValid={playStatus === PlayButtonStatus.Valid}
            tutorialStep={-1}
            isTutorialSkipped={true}
            onClick={this.props.saveAndPreview}
          />
        </div>
      );
    }

    const renderFirstPage = () => {
      return (
        <div className="page5">
          <div className="flipped-page">
            <Grid container justify="center">
              <FiberManualRecordIcon className="circle-icon" />
            </Grid>
            <div className="proposal-titles">
              <div className="title">
                {this.renderEditableTextarea(BrickFieldNames.title)}
                {/* TODO: Add adaptedFrom field */}
                {brick.get("adaptedFrom") && '(ADAPTED)'}
              </div>
              <div><KeyWordsComponent isHashtags={true} disabled={!this.props.canEdit} keyWords={this.props.brick.get("keywords")} /></div>
              <div><DifficultySelect disabled={!this.props.canEdit} level={this.props.brick.get("academicLevel")} onChange={this.props.setAcademicLevel} /></div>
              <p className="text-title m-t-3 bold">Open Question:</p>
              {this.renderOpenQuestionField()}
              <p className="text-title brick-length m-t-3">
                <span className="bold">Brick Length:</span> <span className="brickLength">{brick.get("brickLength")} mins.</span>
              </p>
            </div>
          </div>
        </div>
      );
    }

    const renderSecondPage = () => {
      const defaultStyle = {
        transition: "transform 300ms ease-in-out",
        transform: "translateY(30%)"
      };

      const transitionStyles = {
        entering: { transform: "translateY(0)" },
        entered: { transform: "translateY(0)" },
        exiting: { transform: "translateY(0)" },
        exited: { transform: "translateY(calc(100% - 6.5vh))" },
      } as any;

      return (
        <div className="page6" onClick={this.toSecondPage.bind(this)}>
          <div className="normal-page">
            <div className="normal-page-container">
              <p className="text-title">Outline the purpose of your brick.</p>
              <div className={`proposal-text ${this.state.mode ? 'edit-mode' : ''}`} onClick={e => e.stopPropagation()}>
                {this.renderMathField(BrickFieldNames.brief)}
              </div>
              <Transition in={this.state.briefCommentPanelExpanded} timeout={300}>
                {state => (
                  <div className="proposal-comments-panel brief" onClick={e => e.stopPropagation()} style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                  }}>
                    <CommentPanel
                      isPlanBrief={true}
                      mode={!this.state.briefCommentPanelExpanded}
                      currentLocation={CommentLocation.Brief}
                      currentBrick={this.props.brick.toJSON()}
                      onHeaderClick={() => this.setState({ briefCommentPanelExpanded: !this.state.briefCommentPanelExpanded })}
                    />
                  </div>
                )}
              </Transition>
            </div>
          </div>
        </div>
      );
    }

    const renderBook = () => {
      return (
        <div className={`book ${this.state.mode === true ? 'flat' : ''}`} onMouseOver={this.onBookHover.bind(this)}>
          <div className="back"></div>
          <div className="page6-cover" onClick={this.toFirstPage.bind(this)}>
            <div className="flipped-page">
              <div className="proposal-comments-panel prep" onClick={e => e.stopPropagation()}>
                <CommentPanel
                  currentLocation={CommentLocation.Prep}
                  currentBrick={this.props.brick.toJSON()}
                />
              </div>
            </div>
          </div>
          {renderSecondPage()}
          {renderFirstPage()}
          <div className="page4">
            <div className="normal-page">
              <div className="normal-page-container">
                <p className="text-title text-theme-dark-blue bold">Create an engaging and relevant preparatory task.</p>
                <div className={`proposal-text prep-editor text-theme-dark-blue ${this.state.mode ? 'edit-mode' : ''}`} onClick={e => e.stopPropagation()}>
                  {this.state.bookHovered && this.state.bookState === BookState.PrepPage && this.renderPrepField()}
                </div>
              </div>
            </div>
          </div>
          <div className="page3"></div>
          <div className="page2"></div>
          <div className="front">
            <div className="page-stitch">
              <div className="vertical-line"></div>
              <div className="horizontal-line top-line-1"></div>
              <div className="horizontal-line top-line-2"></div>
              <div className="horizontal-line bottom-line-1"></div>
              <div className="horizontal-line bottom-line-2"></div>
            </div>
            <Grid container justify="center" alignContent="center" style={{ height: '100%' }}>
              <div>
                <img alt="" src="/images/choose-login/logo.png" />
                <div className="white-text">PLAN</div>
                {renderAuthorRow()}
              </div>
            </Grid>
          </div>
        </div>
      );
    }

    let bookClass = 'book-main-container';
    if (this.state.bookHovered) {
      if (this.state.bookState === BookState.TitlesPage) {
        bookClass += ' hovered';
      } else {
        bookClass += ' prep-page';
      }
    }

    return (
      <div className="proposal-page">
        {renderPlayButton()}
        <Grid container direction="row" style={{ height: '100% !important' }} justify="center">
          <Grid className="back-button-container" container alignContent="center">
            {this.state.bookHovered && this.state.bookState === BookState.PrepPage
              ? <div
                className="back-button hover-area"
                onClick={this.toFirstPage.bind(this)}
                onMouseOver={this.onBookHover.bind(this)}
                onMouseOut={this.onBookClose.bind(this)}
              >
                <div className="back-button arrow-button" />
              </div>
              : <div
                className="back-button arrow-button"
                onClick={() => this.moveToPrep()}
                onMouseOut={this.onBookClose.bind(this)}
              />
            }
          </Grid>
          <div className={bookClass}>
            <div className="book-container" onMouseOut={this.onBookClose.bind(this)}>
              {renderBook()}
            </div>
            <Grid className="next-button-container" container onMouseOver={this.onBookHover.bind(this)} alignContent="center">
              {
                this.state.bookHovered && <NextButton
                  bookState={this.state.bookState}
                  next={this.toSecondPage.bind(this)} save={this.props.saveBrick} />
              }
            </Grid>
          </div>
          <div className="red-right-block"></div>
        </Grid>
        <CopiedDialog
          isOpen={this.state.isCopyOpen}
          title={this.props.brick.get("title")}
          close={() => this.setState({isCopyOpen: false})}
        />
      </div>
    );
  }
}

export default ProposalReview;
