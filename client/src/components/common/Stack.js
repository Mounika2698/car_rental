import { Stack as MuiStack } from "@mui/material";

const Stack = ({ children, sx = {}, ...props }) => {
  return (
    <MuiStack sx={sx} {...props}>
      {children}
    </MuiStack>
  );
};

export default Stack;
