import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Box,
  Paper,
  Typography,
  Link,
  TextField,
  Button,
  Alert,
  Tooltip
} from "../components/index";

const Signup = () => {
  const navigate = useNavigate();

  // ✅ TEMP: Demo "existing emails" list (replace with backend later)
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

  // ✅ Password rules popup state
  const [pwdAnchor, setPwdAnchor] = useState(null);
  const openPwdTooltip = (event) => setPwdAnchor(event.currentTarget);
  const closePwdTooltip = () => setPwdAnchor(null);
  const pwdTooltipOpen = Boolean(pwdAnchor);

  const passwordRulesList = [
    "Be at least 8 characters",
    "Contain at least one uppercase letter (A-Z)",
    "Contain at least one lowercase letter (a-z)",
    "Contain at least one number (0-9)",
    "Contain at least one special character (!@#$...)"
  ];

  const handleChange = (e) => {
    setError("");
    setSuccess("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---- Email checks ----
  const emailTrimmed = formData.email.trim().toLowerCase();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed);
  const emailAlreadyRegistered = emailValid && existingEmails.includes(emailTrimmed);

  // ---- Password strength checks ----
  const password = formData.password;

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passwordStrong = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;
  const passwordsMatch = formData.password === formData.confirmPassword;

  const allFilled =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.password &&
    formData.confirmPassword;

  // ✅ button enable/disable
  const formValid =
    allFilled && emailValid && !emailAlreadyRegistered && passwordStrong && passwordsMatch;

  // ---- helper texts (real-time field messages) ----
  const emailHelper =
    !formData.email
      ? ""
      : !emailValid
      ? "Email must contain @ and domain (example: name@email.com)"
      : emailAlreadyRegistered
      ? "Email already registered — please login."
      : "";

  // ✅ step-by-step password message stays
  const passwordHelper =
    !password
      ? ""
      : !hasMinLength
      ? "Minimum 8 characters"
      : !hasUpper
      ? "Add at least 1 uppercase letter (A-Z)"
      : !hasLower
      ? "Add at least 1 lowercase letter (a-z)"
      : !hasNumber
      ? "Add at least 1 number (0-9)"
      : !hasSpecial
      ? "Add at least 1 special character (!@#$...)"
      : "";

  const confirmHelper =
    !formData.confirmPassword
      ? ""
      : !passwordsMatch
      ? "Passwords do not match."
      : "";

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    // ---- blocking alerts on submit ----
    if (!allFilled) {
      setError("Please fill all fields.");
      return;
    }
    if (!emailValid) {
      setError("Invalid email format. Please enter a valid email.");
      return;
    }
    if (emailAlreadyRegistered) {
      setError("This email is already registered. Please login instead.");
      return;
    }
    if (!passwordStrong) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setSuccess("Signup successful! Please login.");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <Container>
      <Box sx={{ mt: 8 }}>
        <Paper>
          <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3 }}>
            Car Rental Signup
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
            error={!!formData.email && !!emailHelper}
            helperText={emailHelper}
          />

          {/* Password Field */}
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={!!formData.password && !!passwordHelper}
            helperText={passwordHelper}
          />

          {/* ✅ Password Rules link (opens tooltip) */}
          <Typography variant="body2" sx={{ mt: 1 }}>
            <span
              onClick={openPwdTooltip}
              style={{ color: "#1976d2", cursor: "pointer", fontWeight: "bold" }}
            >
              Password rules
            </span>
          </Typography>

          {/* ✅ Tooltip popup with close button */}
          <Tooltip
            anchorEl={pwdAnchor}
            open={pwdTooltipOpen}
            onClose={closePwdTooltip}
            title="PASSWORD MUST"
          >
            {passwordRulesList.map((rule) => (
              <Typography key={rule} variant="body2" sx={{ mb: 0.5 }}>
                • {rule}
              </Typography>
            ))}
          </Tooltip>

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={!!formData.confirmPassword && !passwordsMatch}
            helperText={confirmHelper}
          />

          <Button
            text={isLoading ? "Creating account..." : "SignUp"}
            onClick={handleSignup}
            disabled={!formValid || isLoading}
          />

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;
