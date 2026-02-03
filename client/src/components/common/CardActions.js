import { CardActions as MuiCardActions } from "@mui/material";
const CardActions = ({ children, sx = {}, ...props }) => (
  <MuiCardActions sx={sx} {...props}>{children}</MuiCardActions>
);
export default CardActions;
