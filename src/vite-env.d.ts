/// <reference types="vite" />
import { EthereumProvider } from "./lib/ethereum.types";

export {};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }

  type address = string;
}
