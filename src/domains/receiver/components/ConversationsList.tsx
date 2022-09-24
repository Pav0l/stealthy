import { Container } from "@mui/system";
import { observer } from "mobx-react-lite";
import type { Conversation } from "@xmtp/xmtp-js";

import { ConversationCard } from "./ConversationCard";

interface Props {
  conversations: Conversation[];
  onConversationClick: (a: address) => Promise<void>;
}

export const ConversationsList = observer(function ConversationsList(props: Props) {
  return (
    <Container>
      {props.conversations.map((c) => (
        <ConversationCard
          from={c.peerAddress}
          key={c.peerAddress}
          onClick={async () => await props.onConversationClick(c.peerAddress)}
        />
      ))}
    </Container>
  );
});
