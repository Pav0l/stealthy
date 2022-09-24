import { makeAutoObservable } from "mobx";

export enum UiView {
  CONNECT_METAMASK = "CONNECT_METAMASK",
  SELECT_MODE = "SELECT_MODE",
  SENDER_MODE = "SENDER_MODE",
  RECEIVER_MODE = "RECEIVER_MODE",
  CONVERSATION_MESSAGES = "CONVERSATION_MESSAGES",
  MESSAGE_DETAIL = "MESSAGE_DETAIL",
}

export class UiModel {
  view: UiView = UiView.CONNECT_METAMASK;

  constructor() {
    makeAutoObservable(this);
  }

  viewConnectMetamask() {
    this.setView(UiView.CONNECT_METAMASK);
  }

  viewSelectMode() {
    this.setView(UiView.SELECT_MODE);
  }

  viewSenderMode() {
    this.setView(UiView.SENDER_MODE);
  }

  viewReceiverMode() {
    this.setView(UiView.RECEIVER_MODE);
  }

  viewConversationMessages() {
    this.setView(UiView.CONVERSATION_MESSAGES);
  }

  viewMessageDetail() {
    this.setView(UiView.MESSAGE_DETAIL);
  }

  private setView(v: UiView) {
    this.view = v;
  }
}
