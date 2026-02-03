import { CardMedia as MuiCardMedia } from "@mui/material";

const CardMedia = ({ sx = {}, ...props }) => {
  return <MuiCardMedia sx={sx} {...props} />;
};

export default CardMedia;
