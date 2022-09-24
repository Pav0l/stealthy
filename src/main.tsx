import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { App } from "./domains/app/components/App";
import { initWeb3, syncInit } from "./init";
import { AppError } from "./domains/app/components/AppError";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

async function runApp() {
  const init = syncInit();

  // render something
  root.render(
    <React.StrictMode>
      <App {...init} />
    </React.StrictMode>
  );

  try {
    // and keep initializing
    await initWeb3(init);

    if (!init.models.web3Model.address) {
      // if we don't have address here, user still needs to connect wallet, so let's just quit here
      return;
    }

    // if we got here, we got address so we can now select the app mode
    init.models.uiModel.viewSelectMode();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    root.render(
      <React.StrictMode>
        <AppError msg={error?.message} />
      </React.StrictMode>
    );
  }
}

runApp();
