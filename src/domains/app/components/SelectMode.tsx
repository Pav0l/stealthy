import { Container, Button } from "@mui/material";

interface Props {
  onSenderMode: () => void;
  onReceiverMode: () => void;
}

export function SelectMode(props: Props) {
  return (
    <Container>
      <Button onClick={props.onSenderMode}>Send funds</Button>

      <Button onClick={props.onReceiverMode}>Receive funds</Button>
    </Container>
  );
}
