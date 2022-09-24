import { Button, Typography } from "@mui/material";
import { Container } from "@mui/system";

interface Props {
  msg?: string;
  onConnect: () => Promise<void>;
}

export function ConnectWallet(props: Props) {
  const msg = props.msg ?? "Please connect your MetaMask wallet";
  return (
    <Container>
      <Typography>{msg}</Typography>

      <Button onClick={props.onConnect}>Connect</Button>
    </Container>
  );
}
