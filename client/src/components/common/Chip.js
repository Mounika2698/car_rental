import { Chip as MuiChip } from "@mui/material";

const Chip = ({ sx = {}, ...props }) => {
  return <MuiChip sx={sx} {...props} />;
};

export default Chip;

