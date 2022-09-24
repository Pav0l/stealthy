import { Conversation } from "@xmtp/xmtp-js";
import { makeAutoObservable } from "mobx";

export interface AppMessage {
  r: string;
  value: string;
  id: string;
  dateSent: Date;
}

export class MessagingModel {
  conversations: Conversation[] = [];
  activeConversation: address = "";

  messages: Map<address, AppMessage[]> = new Map();
  activeMessageId = "";

  constructor() {
    makeAutoObservable(this);
  }

  setConversations(c: Conversation[]) {
    this.conversations = c;
  }

  appendConversation(c: Conversation) {
    this.conversations?.push(c);
  }

  getConversationMessages(from: address): AppMessage[] {
    return this.messages.get(from) ?? [];
  }

  addMessagesToConv(from: address, messages: AppMessage[]) {
    this.messages.set(from, messages);
  }

  setActiveConversation(from: address) {
    this.activeConversation = from;
  }

  getActiveMessage() {
    if (!this.activeConversation || !this.activeMessageId) {
      // this should not happen
      return undefined;
    }

    const messages = this.getConversationMessages(this.activeConversation);
    return messages.find((m) => m.id === this.activeMessageId);
  }

  setActiveMessage(id: string) {
    this.activeMessageId = id;
  }
}
