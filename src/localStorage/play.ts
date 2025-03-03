import {AttemptCash, YoutubeClicked, AuthBrickCoverId, PreviewAttemptCash} from './types';

export function SetYoutubeClick() {
  localStorage.setItem(YoutubeClicked, "true");
}

export function GetYoutubeClick() {
  return localStorage.getItem(YoutubeClicked);
}

export function UnsetYoutubeClick() {
  localStorage.removeItem(YoutubeClicked);
}


export function CashAttempt(attemptCash: any) {
  localStorage.setItem(AttemptCash, attemptCash);
}

export function GetCashedPlayAttempt() {
  return localStorage.getItem(AttemptCash);
}

export function PreviewCashAttempt(attemptCash: any) {
  localStorage.setItem(PreviewAttemptCash, attemptCash);
}

export function GetPreviewCashedPlayAttempt() {
  return localStorage.getItem(PreviewAttemptCash);
}

export function SetAuthBrickCoverId(brickId: number) {
  localStorage.setItem(AuthBrickCoverId, brickId.toString());
}

export function GetAuthBrickCoverId() {
  const stringId = localStorage.getItem(AuthBrickCoverId);
  if (stringId) {
    return parseInt(stringId);
  }
  return -1;
}