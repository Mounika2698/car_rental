import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Box,
  Paper,
  Typography,
  Link,
  TextField,
  Button,
  Alert
} from "../components/index";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Simple validations
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const passwordValid = formData.password.length >= 8;
  const passwordsMatch = formData.password === formData.confirmPassword;

  const formValid =
    formData.name.trim() &&
    formData.email.trim() &&
    emailValid &&
    passwordValid &&
    passwordsMatch;

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (!emailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!passwordValid) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700)); // fake API delay

    setIsLoading(false);
    setSuccess("Signup successful! Please login.");
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <Container>
      <Box sx={{ mt: 8 }}>
        <Paper>
          <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3 }}>
            Car Rental Signup
          </Typography>

          <Alert severity="error" text={error} />
          <Alert severity="success" text={success} />

          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            helperText={formData.email && !emailValid ? "Example: name@email.com" : ""}
          />

          {/* Password toggle handled INSIDE TextField */}
          <TextField
            label="Password (min 8 chars)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            helperText={formData.password && !passwordValid ? "Minimum 8 characters." : ""}
          />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={formData.confirmPassword && !passwordsMatch}
            helperText={formData.confirmPassword && !passwordsMatch ? "Passwords must match." : ""}
          />

          <Button
            text={isLoading ? "Creating account..." : "SignUp"}
            onClick={handleSignup}
            disabled={!formValid || isLoading}
          />

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;