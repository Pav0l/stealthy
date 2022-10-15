import { lengths } from "../../lib/constants";
import { KeyPair } from "../../lib/key-pair";
import { Messaging } from "../messaging/messaging";
import { Web3Model } from "../web3/web3.model";
import { ReceiverModel } from "./receiver.model";

export class Receiver {
  constructor(private receiverModel: ReceiverModel, private web3Model: Web3Model, private messaging: Messaging) {
    this.generateStealthKeys = this.generateStealthKeys.bind(this);
  }

  signXmtpToLoadConversations = async () => {
    if (!this.web3Model.signer) {
      throw new Error("Missing signer when reading Receiver messages");
    }

    await this.messaging.init(this.web3Model.signer);
  };

  generateStealthKeys(pk: string, random: string) {
    if (pk.length !== lengths.privateKey) {
      if (pk.length === lengths.privateKey - 2) {
        throw new Error("Key should have '0x' prefix");
      }
      throw new Error("Invalid private key");
    }

    if (!random) {
      throw new Error("Missing shared random");
    }

    const keyPair = new KeyPair(pk);
    const stealthKeyPair = keyPair.mulPrivateKey(random);

    if (!stealthKeyPair.privateKeyHex) {
      throw new Error("Failed to generate stealth private key");
    }

    this.receiverModel.setStealthyKeyPair(random, keyPair);
  }

  getStealthyKeyPair = (random: string) => {
    return this.receiverModel.getStealthyKeyPair(random);
  };
}
