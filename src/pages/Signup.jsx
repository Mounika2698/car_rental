import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Avatar, TextField, Grid, Box, Typography, Container, Link } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import Button from "../components/Button";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = () => {
    console.log("Signup clicked:", formData);
  };

  return (
    <Container component="main" maxWidth="xs">
      <h1 style={{ color: "red" }}>SIGNUP PAGE WORKING</h1>

      <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <DirectionsCarIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Car Rental Signup
        </Typography>

        <Box sx={{ mt: 3, width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth required label="Full Name" name="name" value={formData.name} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth required label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button text="Signup" onClick={handleSignup} />
          </Box>

          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;