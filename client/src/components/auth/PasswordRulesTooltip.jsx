import React, { useState } from "react";
import { PASSWORD_TOOLTIP } from "../constants/Constant";
import { Tooltip, Typography } from "../index";

const PasswordRulesTooltip = ({
  linkText = "Password rules",
  title = "PASSWORD MUST"
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <span
          onClick={handleOpen}
          style={{ color: "#1976d2", cursor: "pointer", fontWeight: "bold" }}
        >
          {linkText}
        </span>
      </Typography>

      <Tooltip
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        title={title}
      >
        {PASSWORD_TOOLTIP.map((rule) => (
          <Typography key={rule} variant="body2" sx={{ mb: 0.5 }}>
            • {rule}
          </Typography>
        ))}
      </Tooltip>
    </>
  );
};

export default PasswordRulesTooltip;