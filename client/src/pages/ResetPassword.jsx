import { useState, useEffect } from 'react';
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
import { resetPassword as resetPasswordAPI, forgotPassword } from "../services/authService";
import { CATCH_ERR_MSG, EMAIL_NOT_FOUND_MSG } from "../components/constants/Constant";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!email) {
        setEmailError(true);
        setError("Invalid or missing email. Please request a password reset again.");
        setIsVerifyingEmail(false);
        return;
      }

      // Verify email exists in backend database
      try {
        const response = await forgotPassword(email);
        
        // If email exists, allow password reset
        if (response.success) {
          setEmailError(false);
          setIsVerifyingEmail(false);
        } else {
          // Email doesn't exist
          setEmailError(true);
          setError(EMAIL_NOT_FOUND_MSG);
          setIsVerifyingEmail(false);
        }
      } catch (err) {
        // Check if it's an email not found error
        if (err.response?.data?.code === "EMAIL_NOT_FOUND") {
          setEmailError(true);
          setError(EMAIL_NOT_FOUND_MSG);
        } else {
          setEmailError(true);
          setError(err.message || CATCH_ERR_MSG);
        }
        setIsVerifyingEmail(false);
      }
    };

    verifyEmail();
  }, [email]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError("Invalid email. Please request a password reset again.");
      return;
    }

    if (!isFormValid()) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API to update password using email
      const response = await resetPasswordAPI(email, formData.password);
      
      if (response.success) {
        setSuccess(response.message || "Password has been reset successfully!");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || "Failed to reset password");
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || CATCH_ERR_MSG);
    }
  };

  // Show loading while verifying email
  if (isVerifyingEmail) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
              Verifying Email...
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Please wait while we verify your email address.
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Show error if email doesn't exist or is invalid
  if (emailError) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
              Email Not Found
            </Typography>
            <Alert severity="error" text={error} />
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link to="/signup">
                Sign Up
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
              text={isLoading ? "Resetting Password..." : "Reset Password"}
              type="submit"
              disabled={!isFormValid() || isLoading}
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
