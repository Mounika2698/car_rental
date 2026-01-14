import { Paper as MuiPaper } from "@mui/material";

const Paper = ({ children, elevation = 6, ...props }) => {
  return (
    <MuiPaper elevation={elevation} sx={{ p: 4, borderRadius: 3 }} {...props}>
      {children}
    </MuiPaper>
  );
};

export default Paper;