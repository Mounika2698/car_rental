import { Container as MuiContainer } from "@mui/material";

const Container = ({ children, maxWidth = "xs", ...props }) => {
  return (
    <MuiContainer maxWidth={maxWidth} {...props}>
      {children}
    </MuiContainer>
  );
};

export default Container;