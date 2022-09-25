import { lengths } from "../../lib/constants";
import { KeyPair } from "../../lib/key-pair";
import { Messaging } from "../messaging/messaging";
import { Web3Model } from "../web3/web3.model";
import { ReceiverModel } from "./receiver.model";

const PK_LS_KEY = "pk_key";

export class Receiver {
  constructor(private receiverModel: ReceiverModel, private web3Model: Web3Model, private messaging: Messaging) {
    this.generateStealthKeys = this.generateStealthKeys.bind(this);
    this.keyExists = this.keyExists.bind(this);
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
    this.storeEnsPk(pk);
  }

  getStealthyKeyPair = (random: string) => {
    let kp = this.receiverModel.getStealthyKeyPair(random);
    if (!kp && this.keyExists()) {
      // keyPair is not yet in memory, but private key exist in LS
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.receiverModel.setStealthyKeyPair(random, new KeyPair(this.getPkFromLs()!).mulPrivateKey(random));
      kp = this.receiverModel.getStealthyKeyPair(random);
    }
    return kp;
  };

  clearKeyFromStorage = () => {
    this.removePkFromLs();
  };

  keyExists() {
    return Boolean(this.getPkFromLs());
  }

  private removePkFromLs = () => {
    let key;
    try {
      key = window.localStorage.removeItem(PK_LS_KEY);
    } catch (error) {
      console.log("failed to delete key", error);
    }
    return key;
  };

  private getPkFromLs = () => {
    let key;
    try {
      key = window.localStorage.getItem(PK_LS_KEY);
    } catch (error) {
      console.log("failed to get key", error);
    }
    return key ?? undefined;
  };

  private storeEnsPk = (pk: string) => {
    try {
      window.localStorage.setItem(PK_LS_KEY, pk);
    } catch (error) {
      console.log("failed to store key", error);
    }
  };
}
