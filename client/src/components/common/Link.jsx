import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

const Link = ({ to, children, sx = {}, ...props }) => {
  return (
    <MuiLink
      component={RouterLink}
      to={to}
      sx={{ textDecoration: "none", fontWeight: "bold", ...sx }}
      {...props}
    >
      {children}
    </MuiLink>
  );
};

export default Link;
