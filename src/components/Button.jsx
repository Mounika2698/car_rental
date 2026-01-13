
import { Button as MuiButton } from "@mui/material";

const Button = ({
  text,
  onClick,
  type = "button",
  disabled = false,
  variant = "contained",
  color = "primary"
}) => {
  return (
    <MuiButton
      type={type}
      fullWidth
      variant={variant}
      color={color}
      disabled={disabled}
      onClick={onClick}
      sx={{ mt: 2 }}
    >
      {text}
    </MuiButton>
  );
};

export default Button;