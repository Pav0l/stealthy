import { action, makeObservable, observable } from "mobx";
import { providers } from "ethers";

export class Web3Model {
  address: string | null = null;
  signer: providers.JsonRpcSigner | null = null;
  provider: providers.JsonRpcProvider | null = null;

  constructor() {
    makeObservable(this, {
      address: observable,

      setAddress: action,
      setSigner: action,
      setProvider: action,
    });
  }

  setAddress(a: string) {
    this.address = a;
  }

  setSigner(s: providers.JsonRpcSigner) {
    this.signer = s;
  }

  setProvider(p: providers.JsonRpcProvider) {
    this.provider = p;
  }
}
