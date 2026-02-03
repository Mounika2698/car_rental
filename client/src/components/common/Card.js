import { Card as MuiCard } from "@mui/material";

const Card = ({ children, sx = {}, ...props }) => {
  return (
    <MuiCard sx={sx} {...props}>
      {children}
    </MuiCard>
  );
};
export default Card;
