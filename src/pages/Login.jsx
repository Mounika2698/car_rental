// const Login = () => {
// return <>Im login </>
// }

// export default Login

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, TextField, Typography, Container, Paper, Alert 
} from '@mui/material';

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
      navigate('/dashboard'); // Move to the car rental dashboard
    } else {
      setError(true); // Show the "Incorrect Creds" message
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate('/signup'); // Move to the car rental dashboard
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Car Rental Login
          </Typography>

          {/* Show error alert if credentials fail */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Incorrect credentials. Please try again!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              fullWidth
              label="Email Address (admin@car.com)"
              name="email"
              autoComplete=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password (password123)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, textTransform: 'none' }}
            >
              Sign In
            </Button>
          </form>
          
          <Typography variant="body2" color="text.secondary" align="center">
            Hint: Use <b>admin@car.com</b> / <b>password123</b>
          </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
            New User? <Button onClick={handleSignUp}>SignUp</Button> here
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;