import { useState } from "react";
import { TextField as MuiTextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const TextField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  error = false,
  helperText = "",
  disabled = false
}) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <MuiTextField
      fullWidth
      sx={{ mt: 2 }}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      error={error}
      helperText={helperText}
      disabled={disabled}
      type={isPassword && showPassword ? "text" : type}
      InputProps={{
        ...(isPassword && {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
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