import React from "react";
import { TextField as MuiTextField } from "@mui/material";

const TextField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete = ""
}) => {
  return (
    <MuiTextField
      fullWidth
      label={label}
      name={name}
      type={type}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      required={required}
      sx={{ mt: 2 }}   // 👈 THIS creates the gap
    />
  );
};

export default TextField;