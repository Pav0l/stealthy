import { Point } from "noble-secp256k1";
import { lengths } from "./constants";

/**
 * @notice Throws if provided public key is not on the secp256k1 curve
 * @param point Uncompressed public key as hex string
 */
export function assertValidPoint(point: string) {
  if (typeof point !== "string" || (point.length !== 130 && point.length !== 132)) {
    throw new Error("Must provide uncompressed public key as hex string");
  }
  if (point.length === lengths.publicKey - 2) Point.fromHex(point);
  if (point.length === lengths.publicKey) Point.fromHex(point.slice(2)); // trim 0x prefix
}
