import { Typography as MuiTypography } from "@mui/material";

const Typography = ({
  children,
  variant = "body1",
  align,
  sx = {},
  ...props
}) => {
  return (
    <MuiTypography variant={variant} align={align} sx={sx} {...props}>
      {children}
    </MuiTypography>
  );
};

export default Typography;
