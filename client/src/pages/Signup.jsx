import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  Container, Box, Paper, Typography, Link, TextField, Button, Alert, PasswordRulesTooltip
} from "../components/index";

import {
  SIGNUP_TITLE, ALREADY_HAVE_ACCOUNT_TEXT, SIGNIN_LINK_TEXT, SIGNUP_BUTTON_TEXT, SIGNUP_LOADING_TEXT, SIGNUP_SUCCESS_MSG
} from "../components/constants/Constant";

import {
  validateEmail, validatePassword, validateConfirmPassword, validateSignupSubmit
} from "../components/auth/Validators";

import { signup } from "../redux/slice/authSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // TEMP: Demo "existing emails" list (replace with backend later)
  const existingEmails = ["admin@car.com", "test@car.com"];

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

  // ---- Field validations (reusable functions) ----
  const emailRes = validateEmail(formData.email, existingEmails);
  const passwordRes = validatePassword(formData.password);
  const confirmRes = validateConfirmPassword(formData.password, formData.confirmPassword);

  const allFilled =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password &&
    formData.confirmPassword;

  const formValid =
    allFilled &&
    emailRes.valid &&
    !emailRes.alreadyRegistered &&
    passwordRes.strong &&
    confirmRes.match;

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    const submitCheck = validateSignupSubmit(formData, existingEmails);
    if (!submitCheck.ok) {
      setError(submitCheck.message);
      return;
    }

    setIsLoading(true);

    // Dispatch first (so redux updates)
    dispatch(signup(formData));

    setIsLoading(false);

    setSuccess(SIGNUP_SUCCESS_MSG);
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <Container>
      <Box sx={{ mt: 8 }}>
        <Paper>
          <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3 }}>
            {SIGNUP_TITLE}
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
            error={emailRes.error}
            helperText={emailRes.helperText}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={passwordRes.error}
            helperText={passwordRes.helperText}
          />

          <PasswordRulesTooltip />

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={confirmRes.error}
            helperText={confirmRes.helperText}
          />

          <Button
            text={isLoading ? SIGNUP_LOADING_TEXT : SIGNUP_BUTTON_TEXT}
            onClick={handleSignup}
            disabled={!formValid || isLoading}
          />

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            {ALREADY_HAVE_ACCOUNT_TEXT} <Link to="/login">{SIGNIN_LINK_TEXT}</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
