import { CardContent as MuiCardContent } from "@mui/material";
const CardContent = ({ children, sx = {}, ...props }) => (
  <MuiCardContent sx={sx} {...props}>{children}</MuiCardContent>
);
export default CardContent;
