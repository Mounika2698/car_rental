import React from "react";
import { Box, Container, Grid, Typography, Link as MuiLink } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "#0B1020",
        color: "white",
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand + tagline */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              DRIVE<span style={{ color: "#2E7D32" }}>FLOW</span>
            </Typography>
            <Typography variant="body2" color="grey.400">
              Premium, hassle-free car rentals designed for modern travelers.
            </Typography>
          </Grid>

          {/* Quick links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <MuiLink href="/" color="inherit" underline="hover" variant="body2">
                Home
              </MuiLink>
              <MuiLink href="/Dashboard" color="inherit" underline="hover" variant="body2">
                My Bookings
              </MuiLink>
              <MuiLink href="/login" color="inherit" underline="hover" variant="body2">
                Sign In
              </MuiLink>
              <MuiLink href="/signup" color="inherit" underline="hover" variant="body2">
                Create Account
              </MuiLink>
            </Box>
          </Grid>

          {/* Contact / support */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Contact & Support
            </Typography>
            <Typography variant="body2" color="grey.400">
              24/7 customer support for changes, cancellations and roadside assistance.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Email:{" "}
              <MuiLink href="mailto:support@driveflow.com" color="inherit" underline="hover">
                support@driveflow.com
              </MuiLink>
            </Typography>
          </Grid>
        </Grid>

        {/* Bottom line */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            mt: 4,
            pt: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="caption" color="grey.500">
            © {new Date().getFullYear()} DRIVEFLOW. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <MuiLink href="#" color="grey.500" underline="hover" variant="caption">
              Terms
            </MuiLink>
            <MuiLink href="#" color="grey.500" underline="hover" variant="caption">
              Privacy
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

