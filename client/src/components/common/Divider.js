import { Divider as MuiDivider } from "@mui/material";

const Divider = ({ sx = {}, ...props }) => {
  return <MuiDivider sx={sx} {...props} />;
};

export default Divider;
