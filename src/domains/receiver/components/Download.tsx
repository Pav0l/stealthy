import { Link, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface Props {
  data: string;
  filename: string;
}

export function DownloadFile(props: Props) {
  return (
    <Link
      href={`data:text/plain;charset=utf-8,${encodeURIComponent(props.data)}`}
      download={props.filename}
      sx={{
        textDecoration: "none",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        margin: "1rem 0",
      }}
    >
      <FileDownloadIcon />
      <Typography>Download keys</Typography>
    </Link>
  );
}
