import { utils, BigNumber } from "ethers";
import { Point, CURVE, getPublicKey } from "noble-secp256k1";

import { RandomNumber } from "./random-number";
import { lengths, blockedKeys } from "./constants";
import { assertValidPoint } from "./elliptic-curve";

const { isHexString, computeAddress, hexZeroPad } = utils;

export class KeyPair {
  readonly publicKeyHex: string; // Public key as hex string with 0x04 prefix
  readonly privateKeyHex: string | null = null; // Private key as hex string with 0x prefix, or null if not provided

  /**
   * @notice Creates new instance from a public key or private key
   * @param key Can be either (1) hex public key with 0x04 prefix, or (2) hex private key with 0x prefix
   */
  constructor(key: string) {
    // Input checks
    if (typeof key !== "string" || !isHexString(key)) {
      throw new Error("Key must be a string in hex format with 0x prefix");
    }
    if (blockedKeys.includes(key)) {
      throw new Error("Cannot initialize KeyPair with the provided key");
    }

    // Handle input
    if (key.length === lengths.privateKey) {
      // Private key provided
      this.privateKeyHex = key;
      const publicKey = getPublicKey(this.privateKeyHexSlim as string); // hex without 0x prefix but with 04 prefix
      this.publicKeyHex = `0x${publicKey}`; // Save off version with 0x prefix, other forms computed as getters
    } else if (key.length === lengths.publicKey) {
      // Public key provided
      assertValidPoint(key); // throw if point is not on curve
      this.publicKeyHex = key; // Save off public key, other forms computed as getters
    } else {
      throw new Error("Key must be a 66 character hex private key or a 132 character hex public key");
    }
  }

  /**
   * @notice Returns the private key as a hex string without the 0x prefix
   */
  get privateKeyHexSlim() {
    return this.privateKeyHex ? this.privateKeyHex.slice(2) : null;
  }

  /**
   * @notice Returns the uncompressed public key as a hex string without the 0x prefix
   */
  get publicKeyHexSlim() {
    return this.publicKeyHex.slice(2);
  }

  /**
   * @notice Returns checksum address derived from this key
   */
  get address() {
    return computeAddress(this.publicKeyHex);
  }

  // =============================================== ELLIPTIC CURVE MATH ===============================================
  /**
   * @notice Returns new KeyPair instance after multiplying this public key by some value
   * @param value number to multiply by, as RandomNumber or hex string with 0x prefix
   */
  mulPublicKey(value: RandomNumber | string) {
    if (!(value instanceof RandomNumber) && typeof value !== "string") {
      throw new Error("Input must be instance of RandomNumber or string");
    }
    if (typeof value === "string" && !value.startsWith("0x")) {
      throw new Error("Strings must be in hex form with 0x prefix");
    }

    // Parse number based on input type
    const number = isHexString(value)
      ? BigInt(value as string) // provided a valid hex string
      : BigInt((value as RandomNumber).toHex); // provided RandomNumber

    // Perform the multiplication and return new KeyPair instance
    const publicKey = Point.fromHex(this.publicKeyHexSlim).multiply(number);
    return new KeyPair(`0x${publicKey.toHex()}`);
  }

  /**
   * @notice Returns new KeyPair instance after multiplying this private key by some value
   * @param value number to multiply by, as class RandomNumber or hex string with 0x prefix
   */
  mulPrivateKey(value: RandomNumber | string) {
    if (!(value instanceof RandomNumber) && typeof value !== "string") {
      throw new Error("Input must be instance of RandomNumber or string");
    }
    if (typeof value === "string" && !isHexString(value)) {
      throw new Error("Strings must be in hex form with 0x prefix");
    }
    if (!this.privateKeyHex) {
      throw new Error("KeyPair has no associated private key");
    }

    // Parse number based on input type
    const number = isHexString(value)
      ? BigInt(value as string) // provided a valid hex string
      : BigInt((value as RandomNumber).toHex); // provided RandomNumber

    // Get new private key. Multiplication gives us an arbitrarily large number that is not necessarily in the domain
    // of the secp256k1 curve, so then we use modulus operation to get in the correct range.
    const privateKeyBigInt = (BigInt(this.privateKeyHex) * number) % CURVE.n;
    const privateKey = hexZeroPad(BigNumber.from(privateKeyBigInt).toHexString(), 32); // convert to 32 byte hex
    return new KeyPair(privateKey); // return new KeyPair instance
  }
}
