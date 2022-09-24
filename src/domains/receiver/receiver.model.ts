import { makeAutoObservable } from "mobx";
import type { KeyPair } from "../../lib/key-pair";

export class ReceiverModel {
  private rToStealthyKeyPairMap: Map<string, KeyPair> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  getStealthyKeyPair = (random: string) => {
    return this.rToStealthyKeyPairMap.get(random);
  };

  setStealthyKeyPair = (random: string, kp: KeyPair) => {
    this.rToStealthyKeyPairMap.set(random, kp);
  };
}
