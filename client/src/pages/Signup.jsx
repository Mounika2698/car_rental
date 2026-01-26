import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container, Box, Paper, Typography, Link, TextField, Button, Alert, PasswordRulesTooltip
} from "../components/index";

import {
  SIGNUP_TITLE, ALREADY_HAVE_ACCOUNT_TEXT, SIGNIN_LINK_TEXT, SIGNUP_BUTTON_TEXT, SIGNUP_LOADING_TEXT, SIGNUP_SUCCESS_MSG, 
  EMAIL_EXISTS_MSG, CATCH_ERR_MSG, SIGNUP_FAILED
} from "../components/constants/Constant";

import {
  validateEmail, validatePassword, validateConfirmPassword, validateSignupSubmit
} from "../components/auth/Validators";

import { useDispatch, useSelector } from "react-redux";
import { signupUser } from '../redux/slice/authSlice'

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignupChange = (e) => {
    setError("");
    setSuccess("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---- Field validations (reusable functions) ----
  const emailRes = validateEmail(formData.email);
  const passwordRes = validatePassword(formData.password);
  const confirmRes = validateConfirmPassword(formData.password, formData.confirmPassword);

  const allFilled = formData.name.trim() && formData.email.trim() && formData.password && formData.confirmPassword;

  const formValid = allFilled && emailRes.valid && passwordRes.strong && confirmRes.match;

   const handleSignup = async () => {
    setError("");
    setSuccess("");

    const submitCheck = validateSignupSubmit(formData);
    if (!submitCheck.ok) {
      setError(submitCheck.message);
      return;
    }

    setIsLoading(true);

    try {
      const action = await dispatch(signupUser(formData));

      if (signupUser.rejected.match(action)) {
        const code = action.payload?.code;
        const backendMsg =
          action.payload?.message || action.error?.message || SIGNUP_FAILED;

       if (code === "EMAIL_EXISTS") {
        setError(
          backendMsg + EMAIL_EXISTS_MSG
        );
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      setError(backendMsg);
      return;
      }

      setSuccess(SIGNUP_SUCCESS_MSG);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setIsLoading(false);
      setError(CATCH_ERR_MSG);
    }
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
            onChange={handleSignupChange}
            required
          />

          <TextField
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleSignupChange}
            required
            error={emailRes.error}
            helperText={emailRes.helperText}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleSignupChange}
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
            onChange={handleSignupChange}
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