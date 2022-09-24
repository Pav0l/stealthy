import { providers } from "ethers";
import { UiModel } from "./domains/app/models/ui.model";
import { UiController } from "./domains/app/ui.controller";
import { Messaging } from "./domains/messaging/messaging";
import { MessagingModel } from "./domains/messaging/messaging.model";
import { Receiver } from "./domains/receiver/receiver";
import { ReceiverModel } from "./domains/receiver/receiver.model";
import { Sender } from "./domains/sender/sender";
import { Web3Controller } from "./domains/web3/web3.controller";
import { Web3Model } from "./domains/web3/web3.model";

export interface AppInit {
  models: {
    uiModel: UiModel;
    web3Model: Web3Model;
    messaging: MessagingModel;
  };
  messaging: Messaging;
  web3Controller: Web3Controller;
  uiController: UiController;
  sender: Sender;
  receiver: Receiver;
}

export function syncInit(): AppInit {
  const uiModel = new UiModel();
  const web3Model = new Web3Model();
  const messagingModel = new MessagingModel();

  const messaging = new Messaging(messagingModel);
  const web3Controller = new Web3Controller(web3Model);

  const receiver = new Receiver(new ReceiverModel(), web3Model, messaging);
  const sender = new Sender(web3Model, messaging);

  const uiController = new UiController(uiModel, messagingModel, web3Controller, receiver, messaging);

  return {
    models: {
      uiModel,
      web3Model,
      messaging: messagingModel,
    },
    messaging,
    web3Controller,
    uiController,
    sender,
    receiver,
  };
}

export async function initWeb3(initSync: AppInit) {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask extension and reload the page");
  }

  const provider = new providers.Web3Provider(window.ethereum);

  if (!window.ethereum.isConnected()) {
    try {
      await provider.send("eth_requestAccounts", []);
    } catch (error) {
      // no need to throw, just quit
      initSync.models.uiModel.viewConnectMetamask();
      return;
    }
  }

  const signer = provider.getSigner();

  let address;
  try {
    address = await signer.getAddress();
  } catch (error) {
    // wallet connected, but user needs to log in into it
    throw new Error("Please login to your Wallet and refresh the page");
  }

  console.log("initialized for:", address);

  initSync.models.web3Model.setAddress(address);
  initSync.models.web3Model.setProvider(provider);
  initSync.models.web3Model.setSigner(signer);

  return { signer, provider, address };
}
