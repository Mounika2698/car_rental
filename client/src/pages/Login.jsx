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
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { EMAIL_VALID, EMAIL_VALID_MSG, PASSWORD_TOOLTIP } from "../components/constants/Constant";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  const validateField = (name, value) => {
    const trimmed = value.trim();
    if (name === 'email') {
      if (!trimmed) return '';
      return EMAIL_VALID.test(trimmed) ? '' : EMAIL_VALID_MSG;
    }
    return trimmed ? '' : 'Password is required';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else setPassword(value);
    setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    if (error) setError(false);
  };

  const passwordReqs = password ? {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password)
  } : {};

  const isFormValid = () => {
    return email.trim() && EMAIL_VALID.test(email.trim()) && password.trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailErr = validateField('email', email);
    const pwdErr = validateField('password', password);
    setFieldErrors({ email: emailErr, password: pwdErr });
    
    if (emailErr || pwdErr) return;
    
    setError(false);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate('/');
    }, 2000);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Car Rental Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Incorrect credentials. Please try again!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              name="email"
              value={email}
              onChange={handleChange}
              required
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
              required
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
            />
            
            {password && (
              <Box sx={{ mt: 1, mb: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                  Password Requirements:
                </Typography>
                {PASSWORD_TOOLTIP.map((rule, i) => {
                  const checks = [passwordReqs.minLength, passwordReqs.hasUpper, passwordReqs.hasLower, passwordReqs.hasNumber, passwordReqs.hasSpecial];
                  const isMet = checks[i];
                  return (
                    <Typography key={i} variant="caption" sx={{ display: 'flex', alignItems: 'center', color: isMet ? '#2e7d32' : '#666', fontSize: '0.75rem', mb: 0.3 }}>
                      <span style={{ marginRight: '6px', fontSize: '0.875rem' }}>{isMet ? '✓' : '○'}</span>
                      {rule}
                    </Typography>
                  );
                })}
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Link to="/forgot-password" sx={{ fontSize: '0.875rem' }}>
                Forgot Password?
              </Link>
            </Box>
            <Button
              text="SignIn"
              variant="contained"
              type="submit"
              disabled={!isFormValid()}
            >
            </Button>
          </form>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            New User? <Link to="/signup" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>SignUp</Link> here
          </Typography>
        </Paper>
      </Box>

      {/* Success Popup Dialog */}
      <Dialog
        open={showSuccessPopup}
        onClose={() => { setShowSuccessPopup(false); navigate('/'); }}
        sx={{ '& .MuiDialog-container': { alignItems: 'flex-start', justifyContent: 'center', paddingTop: '20px' } }}
        PaperProps={{ sx: { borderRadius: 2, padding: 1, minWidth: '300px', margin: '20px auto 0' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>Successfully Logged In!</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pt: 1 }}>
          <Typography variant="body1" color="text.secondary">Welcome back! Redirecting to home page...</Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Login;