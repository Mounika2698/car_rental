import { Alert as MuiAlert } from "@mui/material";

const Alert = ({ severity = "error", text = "", sx = {}, ...props }) => {
  if (!text) return null;

  return (
    <MuiAlert severity={severity} sx={{ mb: 2, ...sx }} {...props}>
      {text}
    </MuiAlert>
  );
};

export default Alert;
