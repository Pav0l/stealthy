import { TextField, Button } from "@mui/material";
import { Container } from "@mui/system";
import { observer } from "mobx-react-lite";
import { useInput } from "../../../lib/hooks/useInput";

interface Props {
  onSend: (ens: string, value: string) => Promise<void>;
}

export const SenderMode = observer(function SenderMode(props: Props) {
  const [ensOrAddress, ensHandler, clearEns] = useInput();
  const [value, valueHandler, clearValue] = useInput();

  const onSend = async () => {
    await props.onSend(ensOrAddress, value);
    clearEns();
    clearValue();
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <TextField
        id="enter_ens"
        label="Enter receivers ENS name:"
        value={ensOrAddress}
        onChange={(ev) => ensHandler(ev)}
      ></TextField>
      <TextField
        id="value_to_send"
        label="Enter value to send to receiver:"
        value={value}
        onChange={(ev) => valueHandler(ev)}
      />
      <Button onClick={onSend}>Send</Button>
    </Container>
  );
});
