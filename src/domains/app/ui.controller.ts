import { Messaging } from "../messaging/messaging";
import { MessagingModel } from "../messaging/messaging.model";
import { Receiver } from "../receiver/receiver";
import { Web3Controller } from "../web3/web3.controller";
import { UiModel } from "./models/ui.model";

export class UiController {
  constructor(
    private uiModel: UiModel,
    private messagingModel: MessagingModel,
    private web3Ctrl: Web3Controller,
    private receiver: Receiver,
    private messaging: Messaging
  ) {}

  onWalletConnected = async () => {
    await this.web3Ctrl.connectWallet();
    this.uiModel.viewSelectMode();
  };

  openSelectMode = () => {
    this.uiModel.viewSelectMode();
  };

  openSenderMode = async () => {
    this.uiModel.viewSenderMode();
  };

  openReceiverMode = async () => {
    await this.receiver.signXmtpToLoadConversations();
    this.uiModel.viewReceiverMode();
  };

  openConversation = async (from: address) => {
    await this.messaging.getMessages(from);
    this.messagingModel.setActiveConversation(from);
    this.uiModel.viewConversationMessages();
  };

  openMessageDetail = async (id: string) => {
    this.messagingModel.setActiveMessage(id);
    this.uiModel.viewMessageDetail();
  };
}
