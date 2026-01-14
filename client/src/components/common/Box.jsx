import { Box as MuiBox } from "@mui/material";

const Box = ({ children, sx = {}, ...props }) => {
  return (
    <MuiBox sx={sx} {...props}>
      {children}
    </MuiBox>
  );
};

export default Box;
