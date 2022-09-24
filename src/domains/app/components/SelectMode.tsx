import { Container, Button, ButtonProps } from "@mui/material";

interface Props {
  onSenderMode: () => void;
  onReceiverMode: () => void;
}

export function SelectMode(props: Props) {
  return (
    <Container
      sx={{
        margin: "2rem 0",
      }}
    >
      <ModeButton onClick={props.onSenderMode}>Send ETH</ModeButton>

      <ModeButton onClick={props.onReceiverMode}>Receive ETH</ModeButton>
    </Container>
  );
}

function ModeButton(props: ButtonProps) {
  return (
    <Button
      onClick={props.onClick}
      sx={{
        padding: "3rem 5rem",
        border: "1px solid",
        margin: "1rem",
      }}
    >
      {props.children}
    </Button>
  );
}
