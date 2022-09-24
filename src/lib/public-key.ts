import { providers, utils, UnsignedTransaction } from "ethers";
import { Signature, recoverPublicKey } from "noble-secp256k1";
import { assertValidPoint } from "./elliptic-curve";

export async function getPublicKeyFromEns(ensOrAddress: string, provider: providers.JsonRpcProvider) {
  const address = await provider.resolveName(ensOrAddress);
  if (!address) {
    throw new Error("invalid ENS name");
  }

  const network = await provider.detectNetwork();

  const etherscan = new providers.EtherscanProvider(network.chainId);
  const history = await etherscan.getHistory(address);

  let txHash;
  // Use the first transaction found
  for (let i = 0; i < history.length; i += 1) {
    const tx = history[i];
    if (tx.from === address) {
      txHash = tx.hash;
      break;
    }
  }
  if (!txHash) {
    throw new Error("Provided ENS name does not have any transactions yet");
  }

  const formatted = provider.formatter.hash(txHash, true);

  const fullTx = await provider.perform("getTransaction", { transactionHash: formatted });
  const tx = provider.formatter.transactionResponse(fullTx);

  // Reconstruct transaction payload that was originally signed. Relevant EIPs:
  //   - https://eips.ethereum.org/EIPS/eip-155  (EIP-155: Simple replay attack protection)
  //   - https://eips.ethereum.org/EIPS/eip-2718 (EIP-2718: Typed Transaction Envelope)
  //   - https://eips.ethereum.org/EIPS/eip-2930 (EIP-2930: Optional access lists)
  //   - https://eips.ethereum.org/EIPS/eip-1559 (EIP-1559: Fee market change for ETH 1.0 chain)
  //
  // Properly defining the `txData` signed by the sender is essential to ensuring sent funds can be
  // accessed by the recipient. This only affects the "advanced mode" option of sending directly
  // to a recipient's standard public key, i.e. is does not affect users sending via the
  // recommended approach of the StealthKeyRegistry.
  //
  // Any time a new transaction type is added to Ethereum, the below will need to be updated to
  // support that transaction type
  const txData: UnsignedTransaction = {};

  // First we add fields that are always required
  txData.type = tx.type;
  txData.nonce = tx.nonce;
  txData.gasLimit = tx.gasLimit;
  txData.to = tx.to;
  txData.value = tx.value;
  txData.data = tx.data;
  if (tx.chainId) {
    txData.chainId = tx.chainId;
  }

  // Now we add fields specific to the transaction type
  if (tx.type === 0 || !tx.type) {
    // LegacyTransaction is rlp([nonce, gasPrice, gasLimit, to, value, data, v, r, s])
    txData.gasPrice = tx.gasPrice;
  } else if (tx.type === 1) {
    // 0x01 || rlp([chainId, nonce, gasPrice, gasLimit, to, value, data, accessList, v, r, s])
    txData.gasPrice = tx.gasPrice;
    txData.accessList = tx.accessList;
  } else if (tx.type === 2) {
    // 0x02 || rlp([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s])
    txData.accessList = tx.accessList;
    txData.maxPriorityFeePerGas = tx.maxPriorityFeePerGas;
    txData.maxFeePerGas = tx.maxFeePerGas;
  } else {
    throw new Error(`Unsupported transaction type: ${tx.type}`);
  }

  // Properly format transaction payload to get the correct message
  const resolvedTx = await utils.resolveProperties(txData);
  const rawTx = utils.serializeTransaction(resolvedTx);
  const msgHash = utils.keccak256(rawTx);

  if (!tx.r || !tx.s) {
    throw new Error("Missing ECDSA signature outputs");
  }

  // Recover sender's public key
  // Even though the type definitions say v,r,s are optional, they will always be defined: https://github.com/ethers-io/js/issues/1181
  const signature = new Signature(BigInt(tx.r), BigInt(tx.s));
  signature.assertValidity();
  const recoveryParam = utils.splitSignature({ r: tx.r as string, s: tx.s, v: tx.v }).recoveryParam;
  const publicKeyNo0xPrefix = recoverPublicKey(msgHash.slice(2), signature.toHex(), recoveryParam); // without 0x prefix
  if (!publicKeyNo0xPrefix) {
    throw new Error("Could not recover public key");
  }

  // Verify that recovered public key derives to the transaction from address
  const publicKey = `0x${publicKeyNo0xPrefix}`;
  if (utils.computeAddress(publicKey) !== tx.from) {
    throw new Error("Public key not recovered properly");
  }

  assertValidPoint(publicKey);

  return { publicKey, address };
}
