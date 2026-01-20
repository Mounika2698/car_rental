import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { validatePassword, validateConfirmPassword } from "../components/auth/Validators";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenError(true);
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  // Field validations
  const passwordRes = validatePassword(formData.password);
  const confirmRes = validateConfirmPassword(formData.password, formData.confirmPassword);

  const isFormValid = () => {
    return (
      formData.password &&
      formData.confirmPassword &&
      passwordRes.strong &&
      confirmRes.match
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid reset token. Please request a new password reset link.");
      return;
    }

    if (!isFormValid()) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    // Show success message (backend validation will be added later)
    setError('');
    setSuccess("Password has been reset successfully!");
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  if (tokenError) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
              Invalid Reset Link
            </Typography>
            <Alert severity="error" text={error} />
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link to="/forgot-password">
                Request New Reset Link
              </Link>
            </Box>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              <Link to="/login">Back to Login</Link>
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Reset Password
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Please enter your new password below.
          </Typography>

          {error && (
            <Alert severity="error" text={error} />
          )}

          {success && (
            <Alert severity="success" text={success} />
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              error={passwordRes.error}
              helperText={passwordRes.helperText}
            />
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={confirmRes.error}
              helperText={confirmRes.helperText}
            />
            <Button
              text="Reset Password"
              variant="contained"
              type="submit"
              disabled={!isFormValid()}
            />
          </form>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            <Link to="/login">Back to Login</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;
