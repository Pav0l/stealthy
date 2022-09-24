import { TextField, Button, TextFieldProps } from "@mui/material";
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
        alignItems: "center",
      }}
    >
      <SenderInput
        id="enter_ens"
        label="Enter receivers ENS name:"
        value={ensOrAddress}
        onChange={(ev) => ensHandler(ev)}
      />
      <SenderInput
        id="value_to_send"
        label="Enter ETH value to send to receiver:"
        value={value}
        onChange={(ev) => valueHandler(ev)}
      />
      <Button
        onClick={onSend}
        sx={{
          width: "600px",
          marginTop: "1rem",
          border: "1px solid",
          padding: "0.5rem 0",
        }}
      >
        Send
      </Button>
    </Container>
  );
});

function SenderInput(props: TextFieldProps) {
  return (
    <TextField
      id={props.id}
      label={props.label}
      value={props.value}
      onChange={props.onChange}
      sx={{
        width: "600px",
        marginTop: "1rem",
      }}
      InputProps={{ inputProps: { style: { color: "white" } } }}
    >
      {props.children}
    </TextField>
  );
}
