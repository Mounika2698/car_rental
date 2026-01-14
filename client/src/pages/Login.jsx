import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Typography, Container, Paper, Alert
} from '@mui/material';
import TextField from '../components/common/TextField'
import Button from "../components/common/Button";

const Login = () => {
  const navigate = useNavigate();

  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for error messages
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // DUMMY VALIDATION LOGIC
    const dummyUser = "admin@car.com";
    const dummyPass = "password123";

    if (email === dummyUser && password === dummyPass) {
      setError(false);
      alert("Success! You are logged in."); // Optional visual feedback
      navigate('/'); // Move to the car rental home
    } else {
      setError(true); // Show the "Incorrect Creds" message
    }
  };


  const buttonOnclick = (e) => {
    navigate('/'); // Move to the car rental dashboard
  }

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
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              text="SignIn"
              variant="contained"
              onClick={buttonOnclick}
            >
            </Button>
          </form>

          <Typography variant="body2" color="text.secondary" align="center">
            New User?{' '}
            <Link
              component={Link}
              to="/signup"
              sx={{ textDecoration: 'none', fontWeight: 'bold' }}
            >
              SignUp
            </Link>{' '}
            here
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;