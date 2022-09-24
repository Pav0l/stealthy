import { observer } from "mobx-react-lite";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Container } from "@mui/system";
import { IconButton, Typography } from "@mui/material";

import "./App.css";

import { AppInit } from "../../../init";
import { ConnectWallet } from "../../web3/components/ConnectWallet";
import { SelectMode } from "./SelectMode";
import { UiView } from "../models/ui.model";
import { SenderMode } from "../../sender/components/SenderMode";
import { ConversationsList } from "../../receiver/components/ConversationsList";
import { ConversationDetail } from "../../receiver/components/ConversationDetail";
import { MessageDetail } from "../../receiver/components/MessageDetail";

export const App = observer(function App(props: AppInit) {
  let content;
  let onBack;

  switch (props.models.uiModel.view) {
    case UiView.CONNECT_METAMASK:
      content = <ConnectWallet onConnect={props.uiController.onWalletConnected} />;
      break;

    case UiView.SELECT_MODE:
      content = (
        <SelectMode
          onSenderMode={props.uiController.openSenderMode}
          onReceiverMode={props.uiController.openReceiverMode}
        />
      );
      break;

    case UiView.SENDER_MODE:
      onBack = props.uiController.openSelectMode;
      content = <SenderMode onSend={props.sender.sendEthToStealthAddress} />;
      break;

    case UiView.RECEIVER_MODE:
      onBack = props.uiController.openSelectMode;
      content = (
        <ConversationsList
          conversations={props.models.messaging.conversations}
          onConversationClick={props.uiController.openConversation}
        />
      );
      break;

    case UiView.CONVERSATION_MESSAGES:
      onBack = props.uiController.openReceiverMode;

      content = (
        <ConversationDetail
          conversationWith={props.models.messaging.activeConversation}
          messages={props.models.messaging.getConversationMessages(props.models.messaging.activeConversation)}
          onMessageClick={props.uiController.openMessageDetail}
        />
      );
      break;

    case UiView.MESSAGE_DETAIL:
      onBack = () => props.uiController.openConversation(props.models.messaging.activeConversation);
      content = <MessageDetail msg={props.models.messaging.getActiveMessage()} receiver={props.receiver} />;
      break;

    default:
      onBack = props.uiController.openSelectMode;
      content = (
        <Container>
          <Typography>Whoops! How did I get here?</Typography>
        </Container>
      );
      break;
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        height: "100%",
        width: "1280px",
      }}
    >
      <AppHeader onClick={onBack} view={props.models.uiModel.view} />
      {content}
    </Container>
  );
});

function shouldDisplayBackArrow(view: UiView): boolean {
  // list of views which should not have AppHeader
  return ![UiView.CONNECT_METAMASK, UiView.SELECT_MODE].includes(view);
}

const addBackArrowStyles = (display: boolean) => {
  return display
    ? {
        display: "flex",
        flexDirection: "row",
      }
    : undefined;
};

function AppHeader({ onClick, view }: { view: UiView; onClick?: (() => void) | (() => Promise<void>) }) {
  const displayBackArrow = shouldDisplayBackArrow(view);

  return (
    <Container
      sx={{
        width: "100%",
        margin: "1.5rem 0",
        ...addBackArrowStyles(displayBackArrow),
      }}
    >
      {displayBackArrow ? (
        <IconButton onClick={onClick} color="primary" sx={{ marginRight: "1rem", display: "inline-block" }}>
          <ArrowBackIosNewIcon />
        </IconButton>
      ) : null}

      <Typography
        component={"h1"}
        sx={{
          fontSize: "2rem",
        }}
      >
        🐱‍👤 Stealthy
      </Typography>

      {!displayBackArrow ? (
        <Typography
          component={"h2"}
          sx={{
            fontSize: "1.5rem",
            marginTop: "2rem",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          Send stealth payments to Ethereum addresses
        </Typography>
      ) : null}
    </Container>
  );
}
