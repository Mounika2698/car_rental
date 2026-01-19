import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { EMAIL_VALID, EMAIL_VALID_MSG } from "../components/constants/Constant";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState('');

  // Validate email format
  const validateEmail = (emailValue) => {
    const trimmed = (emailValue || "").trim();
    if (!trimmed) {
      setEmailError(false);
      setEmailHelperText('');
      return false;
    }
    const isValid = EMAIL_VALID.test(trimmed);
    if (!isValid) {
      setEmailError(true);
      setEmailHelperText(EMAIL_VALID_MSG);
      return false;
    } else {
      setEmailError(false);
      setEmailHelperText('');
      return true;
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return email.trim() !== '' && EMAIL_VALID.test(email.trim());
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email before submission
    const emailValid = validateEmail(email);
    if (!emailValid) {
      return;
    }

    // Generate a dummy token for now (backend integration will be added later)
    const dummyToken = 'dummy-reset-token-' + Date.now();
    
    // Redirect to reset password page with token
    navigate(`/reset-password?token=${dummyToken}`);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Forgot Password
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your registered email address to reset your password.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
              error={emailError}
              helperText={emailHelperText}
            />
            <Button
              text="Continue"
              variant="contained"
              type="submit"
              disabled={!isFormValid()}
            />
          </form>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Remember your password?{' '}
            <Link to="/login">
              Sign In
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
