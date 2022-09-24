import { BigNumber, utils } from "ethers";
import { utils as secpUtils } from "noble-secp256k1";

export class RandomNumber {
  readonly sizeInBytes = 32;
  readonly value: BigNumber;

  /**
   * @notice Generate 32 byte random number
   */
  constructor() {
    const randomNumberAsBytes = secpUtils.randomPrivateKey();
    this.value = BigNumber.from(randomNumberAsBytes);
  }

  /**
   * @notice Get random number as hex string
   */
  get toHex() {
    return utils.hexZeroPad(this.value.toHexString(), this.sizeInBytes);
  }

  /**
   * @notice Get random number as hex string without 0x prefix
   */
  get toHexNoPrefix() {
    return utils.hexZeroPad(this.toHex, this.sizeInBytes).slice(2);
  }
}
