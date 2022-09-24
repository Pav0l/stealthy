import { ProviderRpcError } from "./rpc.errors";

export interface EthereumProvider {
  isMetaMask: boolean;

  isConnected(): boolean;
  request<T>(args: RequestArguments): Promise<T>;

  on(eventName: EthereumEvents, handler: (data: EthereumEventData) => void): void;
  off(eventName: EthereumEvents, handler: (data: EthereumEventData) => void): void;
}

export interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

export type EthereumEvents = "connect" | "disconnect" | "accountsChanged" | "chainChanged" | "message";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EthereumEventData = ChainId | string[] | ConnectInfo | ProviderRpcError | ProviderMessage | any;

export enum ChainId {
  MAIN = "0x1",
  ROPSTEN = "0x3",
  RINKEBY = "0x4",
  GOERLI = "0x5",
  KOVAN = "0x2a",
  HARDHAT = "31337",
}

export interface ProviderMessage {
  type: string;
  data: unknown;
}

export interface ConnectInfo {
  chainId: ChainId;
}
