import { utils } from "ethers";
import { KeyPair } from "../../lib/key-pair";
import { getPublicKeyFromEns } from "../../lib/public-key";
import { RandomNumber } from "../../lib/random-number";
import { Messaging } from "../messaging/messaging";
import { Web3Model } from "../web3/web3.model";

export class Sender {
  constructor(private web3Model: Web3Model, private messaging: Messaging) {}

  sendEthToStealthAddress = async (ensOrAddress: string, value: string) => {
    if (!this.web3Model.provider || !this.web3Model.signer) {
      throw new Error("Missing provider when transfering to stealth address?");
    }

    // get pub key for ENS/address
    const { publicKey, address } = await getPublicKeyFromEns(ensOrAddress, this.web3Model.provider);

    // generate random number
    const random = new RandomNumber();

    // generate stealth address from random number and pub key
    const keyPair = new KeyPair(publicKey);
    const stealthKp = keyPair.mulPublicKey(random);
    const stealthAddress = stealthKp.address;

    console.log("sending funds to stealth address:", stealthAddress);

    // initialize XMTP client
    await this.messaging.init(this.web3Model.signer);

    // make a transaction sending funds to the stealth address
    await this.sendTx(stealthAddress, value);

    // send msg to receiver via XMTP about the tx
    await this.messaging.sendMsg(address, { r: random.toHex, value });
  };

  private sendTx = async (to: address, value: string) => {
    const etherAmount = utils.parseEther(value);
    const transactionParameters = {
      to: to,
      from: this.web3Model.address,
      value: etherAmount.toHexString(),
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await window.ethereum!.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
    } catch (error) {
      // TODO notification?
      console.log("failed to send the funds", error);
      throw error;
    }
  };
}
