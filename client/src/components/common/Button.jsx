import { Button as MuiButton } from "@mui/material";

export default function Button({ children, sx = {}, ...props }) {
  return (
    <MuiButton
      {...props}
      sx={{
        textTransform: "none",
        ...sx, // IMPORTANT: spread sx LAST so caller can override
      }}
    >
      {children}
    </MuiButton>
  );
}
