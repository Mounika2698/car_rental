import { TextField as MuiTextField } from "@mui/material";
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

/**
 * Common TextField wrapper
 * - Default spacing: mt: 2 (so forms look good without adding Stack spacing everywhere)
 * - For tight layouts (Home search bar, Autocomplete renderInput), pass noMargin
 * - Still forwards InputProps + all other props (required for Autocomplete)
 */
const TextField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  error = false,
  helperText = "",
  disabled = false,

  // ✅ new controls
  noMargin = false,      // use this in Home filter bar / Autocomplete
  mt,                   // optional explicit mt override

  sx = {},
  InputProps: inputPropsFromCaller,
  ...props
}) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  // ✅ spacing rule:
  // - if mt provided → use it
  // - else if noMargin → mt: 0
  // - else default → mt: 2
  const computedMt =
    typeof mt === "number" ? mt : noMargin ? 0 : 2;

  return (
    <MuiTextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      error={error}
      helperText={helperText}
      disabled={disabled}
      type={isPassword && showPassword ? "text" : type}
      sx={{ mt: computedMt, ...sx }}   // ✅ keep default spacing
      InputProps={{
        ...(isPassword && {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((p) => !p)}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }),
        ...inputPropsFromCaller,       // ✅ allow caller icons etc
      }}
      {...props} // ✅ important: forwards Autocomplete params, etc.
    />
  );
};

export default TextField;
