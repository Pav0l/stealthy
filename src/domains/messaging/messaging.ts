import * as ethers from "ethers";
import { Client } from "@xmtp/xmtp-js";

import { AppMessage, MessagingModel } from "./messaging.model";
import { lengths } from "../../lib/constants";

export class Messaging {
  private client?: Client;

  constructor(private messagingModel: MessagingModel) {}

  async init(signer: ethers.ethers.Signer) {
    if (!this.client) {
      this.client = await Client.create(signer);
    }

    const conversations = await this.client.conversations.list();

    this.messagingModel.setConversations(conversations);
  }

  async sendMsg(to: address, msg: unknown) {
    try {
      const conv = await this.getOrCreateConversation(to);

      if (typeof msg !== "string") {
        try {
          msg = JSON.stringify(msg);
        } catch (error) {
          // we tried
        }
      }

      await conv?.send(msg);
    } catch (error) {
      // TODO address not registered with XMTP network
      console.error("Failed to send the message", error);
    }
  }

  async getMessages(from: address) {
    const conv = await this.getOrCreateConversation(from);
    if (!conv) {
      console.log("no conversation with:", from);
      return;
    }

    const opts = {
      // TODO add msg filtering, now just show messages from last 7 days
      startTime: new Date(new Date().setDate(new Date().getDate() - 7)),
      endTime: new Date(),
    };

    const messagesInConversation = await conv?.messages(opts);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const msgs: AppMessage[] = messagesInConversation
      .map((m) => {
        try {
          const parsed = JSON.parse(m.content);
          if (this.isValidMessageFormat(parsed)) {
            return { ...parsed, id: m.id, dateSent: m.sent };
          }
        } catch (error) {
          // skip msg if invalid content format
        }
      })
      .filter((m) => m !== undefined);

    this.messagingModel.addMessagesToConv(from, msgs);
  }

  private async getOrCreateConversation(peer: address) {
    let conv = this.messagingModel.conversations.find((conv) => conv.peerAddress === peer);

    if (!conv) {
      // conversation does not exist yet, so lets just create it and add store it in memory
      conv = await this.client?.conversations.newConversation(peer);

      if (conv) {
        this.messagingModel.appendConversation(conv);
      }
    }

    return conv;
  }

  private isValidMessageFormat(msg: unknown): msg is AppMessage {
    return (
      typeof (msg as AppMessage)?.r === "string" &&
      (msg as AppMessage).r.length === lengths.txHash && // r is 32 bytes long with 0x prefix, just like txHash
      typeof (msg as AppMessage)?.value === "string"
    );
  }
}
