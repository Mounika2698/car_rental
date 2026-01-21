import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../redux/slice/authSlice'

import {
  Container, Box, Paper, Typography, Link, TextField, Button, Alert, PasswordRulesTooltip
} from "../components";

import {
  LOGIN_TITLE, LOGIN_BUTTON_TEXT, LOGIN_LOADING_TEXT, NEW_USER_TEXT, SIGNUP_LINK_TEXT, SIGNUP_HERE_TEXT,
  LOGIN_INVALID_MSG, FORGOT_PASSWORD_LINK_TEXT
} from "../components/constants/Constant";

import { validateEmail, validatePassword, validateLoginSubmit } from "../components/auth/Validators";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const handleLoginChange = (e) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Real-time validation results (like Signup)
  const emailRes = validateEmail(formData.email);         // no existingEmails needed in login
  const passwordRes = validatePassword(formData.password);

  // ✅ Form valid logic (controls button)
  const formValid =
    formData.email.trim() &&
    formData.password &&
    emailRes.valid &&
    passwordRes.strong;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));

    setError("");

    // ✅ submit-level checks (dummy creds for now)
    const result = validateLoginSubmit(formData.email, formData.password);
    if (!result.ok) {
      setError(result.message || LOGIN_INVALID_MSG);
      return;
    }

    setIsLoading(true);

    // TEMP success (backend later)
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 400);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3 }}>
            {LOGIN_TITLE}
          </Typography>

          <Alert severity="error" text={error} />

          <form onSubmit={handleSubmit}>
            {/* ✅ Email real-time validation */}
            <TextField
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleLoginChange}
              required
              error={emailRes.error}
              helperText={emailRes.helperText}
            />

            {/* ✅ Password real-time validation */}
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleLoginChange}
              required
              error={passwordRes.error}
              helperText={passwordRes.helperText}
            />

            {/* Optional password rules help */}
            <PasswordRulesTooltip />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Link to="/forgot-password" sx={{ fontSize: '0.875rem' }}>
                {FORGOT_PASSWORD_LINK_TEXT}
              </Link>
            </Box>

            <Button
              text={isLoading ? LOGIN_LOADING_TEXT : LOGIN_BUTTON_TEXT}
              type="submit"
              disabled={!formValid || isLoading}
            />
          </form>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            {NEW_USER_TEXT} <Link to="/signup">{SIGNUP_LINK_TEXT}</Link> {SIGNUP_HERE_TEXT}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;