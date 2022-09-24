import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import { observer } from "mobx-react-lite";

import type { AppMessage } from "../../messaging/messaging.model";

interface Props {
  messages: AppMessage[];
  conversationWith: address;
  onMessageClick: (id: string) => Promise<void>;
}

function MessageCard({ msg, onClick, id }: { msg: string; id: string; onClick?: (id: string) => Promise<void> }) {
  const clickHandler = async () => {
    onClick && (await onClick(id));
  };

  return (
    <Typography
      sx={{
        padding: "1rem",
        border: "1px solid white",
        borderRadius: "8px",
        cursor: onClick ? "pointer" : "auto",
        marginBottom: "0.5rem",
      }}
      onClick={clickHandler}
    >
      {msg}
    </Typography>
  );
}

export const ConversationDetail = observer(function ConversationDetail(props: Props) {
  return (
    <Container>
      <Typography
        sx={{
          marginBottom: "1rem",
        }}
      >
        Payments from: {props.conversationWith}
      </Typography>

      <Container>
        {props.messages.length === 0 ? (
          <MessageCard id="" msg={`No payments from ${props.conversationWith}`} />
        ) : (
          props.messages.map((msg) => (
            <MessageCard
              key={msg.id}
              id={msg.id}
              msg={`${msg.dateSent.toLocaleString()}: ${msg.value} ETH`}
              onClick={props.onMessageClick}
            />
          ))
        )}
      </Container>
    </Container>
  );
});
