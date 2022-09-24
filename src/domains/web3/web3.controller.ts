import { Web3Model } from "./web3.model";

export class Web3Controller {
  constructor(private model: Web3Model) {}

  connectWallet = async () => {
    try {
      const accounts = await this.model.provider?.send("eth_requestAccounts", []);
      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        this.model.setAddress(accounts[0]);
      }
    } catch (error) {
      console.warn("connectWallet error", error);
      // TODO notification?
    }
  };
}
