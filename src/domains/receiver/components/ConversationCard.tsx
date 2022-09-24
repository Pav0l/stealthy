import { Typography } from "@mui/material";
import { Container } from "@mui/system";

interface Props {
  from: string;
  onClick: () => Promise<void>;
}

export function ConversationCard(props: Props) {
  return (
    <Container
      onClick={props.onClick}
      sx={{
        padding: "1rem",
        border: "1px solid white",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "0.5rem",
      }}
    >
      <Typography>From: {props.from}</Typography>
    </Container>
  );
}
