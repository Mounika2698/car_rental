import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack,
  Box,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const [loginAnchorEl, setLoginAnchorEl] = useState(null);
  const isLoginMenuOpen = Boolean(loginAnchorEl);

  const isAuthPage = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ].includes(location.pathname.toLowerCase());

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleLoginClick = (event) => {
    setLoginAnchorEl(event.currentTarget);
  };

  const handleLoginMenuClose = () => {
    setLoginAnchorEl(null);
  };

  const goToLogin = () => {
    handleLoginMenuClose();
    navigate("/login");
  };

  const goToSignup = () => {
    handleLoginMenuClose();
    navigate("/signup");
  };

  const navigationItems = [
    { label: "Book", path: "/", show: !isAuthPage },
    { label: "Manage Bookings", path: "/manage-bookings", show: !isAuthPage },
    { label: "Location", path: "/location", show: !isAuthPage },
    { label: "Support", path: "/", show: !isAuthPage },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "black",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 1 }}>
          {/* Brand */}
          <Box
            onClick={handleLogoClick}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1A237E" }}>
              DRIVE<span style={{ color: "#2E7D32" }}>FLOW</span>
            </Typography>
          </Box>

          {/* Navigation Items */}
          {!isAuthPage && (
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{ flexGrow: 1, justifyContent: "center", display: { xs: "none", md: "flex" } }}
            >
              {navigationItems.map((item) => {
                if (!item.show) return null;
                return (
                  <Button
                    key={item.label}
                    color="inherit"
                    onClick={() => navigate(item.path)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      color: location.pathname === item.path ? "#1A237E" : "inherit",
                      "&:hover": {
                        color: "#1A237E",
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>
          )}

          {/* Right side - Login dropdown / Logout */}
          <Stack direction="row" spacing={2} alignItems="center">
            {isAuthPage ? (
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#1A237E",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#121858" },
                }}
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            ) : token ? (
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#1A237E",
                  color: "#1A237E",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#121858",
                    bgcolor: "rgba(26, 35, 126, 0.04)",
                  },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={handleLoginClick}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign in or Join
                </Button>
                <Menu
                  anchorEl={loginAnchorEl}
                  open={isLoginMenuOpen}
                  onClose={handleLoginMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      px: 3,
                      py: 2.5,
                      borderRadius: 3,
                      minWidth: 280,
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    Sign in to get your best rates
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mb: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                      bgcolor: "#1A237E",
                      "&:hover": { bgcolor: "#121858" },
                    }}
                    onClick={goToLogin}
                  >
                    Sign in
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "black",
                      color: "black",
                      "&:hover": {
                        borderColor: "black",
                        bgcolor: "rgba(0,0,0,0.02)",
                      },
                    }}
                    onClick={goToSignup}
                  >
                    Create account
                  </Button>
                </Menu>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

