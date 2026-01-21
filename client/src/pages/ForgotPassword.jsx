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
import { 
  EMAIL_VALID, 
  PASSWORD_TOOLTIP,
  FORGOT_PASSWORD_TITLE,
  FORGOT_PASSWORD_DESCRIPTION,
  FORGOT_PASSWORD_BUTTON_TEXT,
  FORGOT_PASSWORD_REMEMBER_TEXT,
  FORGOT_PASSWORD_SIGNIN_LINK
} from "../components/constants/Constant";
import { validateEmail } from "../components/auth/Validators";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState('');

  // Check if form is valid
  const isFormValid = () => {
    return email.trim() !== '' && EMAIL_VALID.test(email.trim());
  };

  // Handle forgot password change
  const handleForgotPasswordChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailValidation = validateEmail(value);
    setEmailError(emailValidation.error);
    setEmailHelperText(emailValidation.helperText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email before submission using validators
    const emailValidation = validateEmail(email);
    setEmailError(emailValidation.error);
    setEmailHelperText(emailValidation.helperText);
    
    if (!emailValidation.valid) {
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
            {FORGOT_PASSWORD_TITLE}
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {FORGOT_PASSWORD_DESCRIPTION}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              name="email"
              value={email}
              onChange={handleForgotPasswordChange}
              required
              error={emailError}
              helperText={emailHelperText}
            />
            <Button
              text={FORGOT_PASSWORD_BUTTON_TEXT}
              variant="contained"
              type="submit"
              disabled={!isFormValid()}
            />
          </form>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            {FORGOT_PASSWORD_REMEMBER_TEXT}{' '}
            <Link to="/login">
              {FORGOT_PASSWORD_SIGNIN_LINK}
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
