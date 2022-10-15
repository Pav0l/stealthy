import { Container } from "@mui/system";
import { Button, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";

import { useInput } from "../../../lib/hooks/useInput";
import type { AppMessage } from "../../messaging/messaging.model";
import type { Receiver } from "../receiver";
import { DownloadFile } from "./Download";

interface Props {
  msg?: AppMessage;
  receiver: Receiver;
}

export const MessageDetail = observer(function MessageDetail(props: Props) {
  const [privKey, setPrivKey, clearPrivKey] = useInput();

  const onKey = () => {
    props.receiver.generateStealthKeys(privKey, props.msg!.r);
    clearPrivKey();
  };

  if (!props.msg) {
    return <Container>Something went wrong. Please try again.</Container>;
  }

  const stealthyKeyPair = props.receiver.getStealthyKeyPair(props.msg.r);
  if (stealthyKeyPair) {
    const stealthAddress = stealthyKeyPair.address ?? "unknown";
    const stealthPrivKey = stealthyKeyPair.privateKeyHex ?? "unknown";
    const stealthPubKey = stealthyKeyPair.publicKeyHex ?? "unknown";
    return (
      <CenteredContainer>
        <DownloadFile
          filename={`${stealthAddress}.txt`}
          data={`Address: ${stealthAddress}\nPrivate Key: ${stealthPrivKey}\nPublic Key: ${stealthPubKey}\n`}
        />
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <TextField
        id="enter_pk"
        label="Enter your private key:"
        value={privKey}
        onChange={(ev) => setPrivKey(ev)}
        sx={{
          width: "600px",
          marginTop: "1rem",
        }}
      ></TextField>
      <Button
        onClick={onKey}
        sx={{
          width: "600px",
          marginTop: "1rem",
        }}
      >
        Generate stealth key
      </Button>
    </CenteredContainer>
  );
});

function CenteredContainer({ children }: { children: ReactNode }) {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Container>
  );
}
