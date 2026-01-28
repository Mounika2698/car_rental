import { useState } from 'react';
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
  FORGOT_PASSWORD_TITLE,
  FORGOT_PASSWORD_DESCRIPTION,
  FORGOT_PASSWORD_BUTTON_TEXT,
  FORGOT_PASSWORD_LOADING_TEXT,
  FORGOT_PASSWORD_REMEMBER_TEXT,
  FORGOT_PASSWORD_SIGNIN_LINK,
  INVALID_EMAIL_MSG,
  EMAIL_NOT_FOUND_MSG,
  CATCH_ERR_MSG
} from "../components/constants/Constant";
import { validateEmail } from "../components/auth/Validators";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle forgot password change
  const handleForgotPasswordChange = (e) => {
    setError('');
    setEmail(e.target.value);
  };

  // ✅ Real-time validation results (like Signup)
  const emailRes = validateEmail(email);

  // ✅ Form valid logic (controls button)
  const formValid = email.trim() && emailRes.valid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Validate email before submission (like Signup)
    if (!email.trim()) {
      setError(INVALID_EMAIL_MSG);
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(INVALID_EMAIL_MSG);
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API to check if email exists
      const response = await forgotPassword(email);
      
      // If email exists, navigate to reset password page with email
      if (response.success) {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        // Email doesn't exist
        setIsLoading(false);
        if (response.code === "EMAIL_NOT_FOUND") {
          setError(EMAIL_NOT_FOUND_MSG);
        } else {
          setError(response.message || CATCH_ERR_MSG);
        }
      }
    } catch (err) {
      setIsLoading(false);
      // Check if it's an email not found error
      if (err.response?.data?.code === "EMAIL_NOT_FOUND") {
        setError(EMAIL_NOT_FOUND_MSG);
      } else {
        setError(err.message || CATCH_ERR_MSG);
      }
    }
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

          <Alert severity="error" text={error} />

          <form onSubmit={handleSubmit}>
            {/* ✅ Email real-time validation (like Signup) */}
            <TextField
              label="Email Address"
              name="email"
              value={email}
              onChange={handleForgotPasswordChange}
              required
              error={emailRes.error}
              helperText={emailRes.helperText}
            />
            <Button
              text={isLoading ? FORGOT_PASSWORD_LOADING_TEXT : FORGOT_PASSWORD_BUTTON_TEXT}
              type="submit"
              disabled={!formValid || isLoading}
            />
          </form>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
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
