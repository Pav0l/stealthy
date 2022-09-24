import { Container, Typography } from "@mui/material";

interface Props {
  msg?: string;
}

export function AppError(props: Props) {
  return (
    <Container>
      <Typography>{props.msg ?? "Something went wrong, please try again."}</Typography>
    </Container>
  );
}
