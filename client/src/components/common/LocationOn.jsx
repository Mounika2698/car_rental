import { LocationOn as MuiLocationOn } from "@mui/icons-material";

/**
 * Common LocationOn Icon
 * - Keeps icon imports consistent
 * - Allows sx / props passthrough
 */
const LocationOn = ({ sx = {}, ...props }) => {
  return <MuiLocationOn sx={sx} {...props} />;
};

export default LocationOn;
