import { Popover, Box, Typography, IconButton, Link as MuiLink } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Tooltip = ({
  anchorEl,
  open,
  onClose,
  title = "",
  children
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Box sx={{ p: 2, width: 320 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ mt: 1 }}>
          {children}
        </Box>
      </Box>
    </Popover>
  );
};

export default Tooltip;
