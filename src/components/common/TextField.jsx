import { useState } from "react";
import { TextField as MuiTextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

/**
 * Reusable TextField wrapper
 * - fullWidth by default
 * - consistent spacing
 * - supports helperText, error, disabled, InputProps, etc.
 * - password fields automatically get show/hide toggle
 */
const TextField = ({
  type = "text",
  sx = {},
  ...props
}) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <MuiTextField
      fullWidth
      type={isPassword && showPassword ? "text" : type}
      sx={{ mt: 2, ...sx }}
      {...props}
      InputProps={{
        ...(props.InputProps || {}),
        ...(isPassword && {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        })
      }}
    />
  );
};

export default TextField;