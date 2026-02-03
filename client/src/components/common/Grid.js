import { Grid as MuiGrid } from "@mui/material";

const Grid = ({ children, sx = {}, ...props }) => {
  return (
    <MuiGrid sx={sx} {...props}>
      {children}
    </MuiGrid>
  );
};

export default Grid;
