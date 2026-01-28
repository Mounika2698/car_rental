// src/components/constants/Constant.js

// Regex
export const EMAIL_VALID = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tooltip rules
export const PASSWORD_TOOLTIP = [
  "Be at least 8 characters",
  "Contain at least one uppercase letter (A-Z)",
  "Contain at least one lowercase letter (a-z)",
  "Contain at least one number (0-9)",
  "Contain at least one special character (!@#$...)"
];

// Field helper / error messages
export const EMAIL_VALID_MSG = "Email must contain @ and domain (example: name@email.com)";
export const EMAIL_EXISTS_MSG = "Redirecting you to the login page in 3 seconds...";
export const CATCH_ERR_MSG = "Something went wrong. Please try again.";
export const SIGNUP_FAILED = "Signup failed";

export const FILL_ALL_FIELDS_MSG = "Please fill all fields.";
export const INVALID_EMAIL_MSG = "Invalid email format. Please enter a valid email.";
export const PASSWORD_WEAK_MSG =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
export const PASSWORDS_MISMATCH_MSG = "Passwords do not match.";

export const SIGNUP_SUCCESS_MSG = "Signup successful! Please login.";

// Password step-by-step messages
export const PASS_MIN_MSG = "Minimum 8 characters";
export const PASS_UPPER_MSG = "Add at least 1 uppercase letter (A-Z)";
export const PASS_LOWER_MSG = "Add at least 1 lowercase letter (a-z)";
export const PASS_NUMBER_MSG = "Add at least 1 number (0-9)";
export const PASS_SPECIAL_MSG = "Add at least 1 special character (!@#$...)";

// UI labels
export const SIGNUP_TITLE = "Car Rental Signup";
export const PASSWORD_RULES_LINK = "Password rules";
export const SIGNIN_LINK_TEXT = "Sign in";
export const ALREADY_HAVE_ACCOUNT_TEXT = "Already have an account?";
export const SIGNUP_BUTTON_TEXT = "SignUp";
export const SIGNUP_LOADING_TEXT = "Creating account...";

// ---- Login UI text ----
export const LOGIN_TITLE = "Car Rental Login";
export const LOGIN_BUTTON_TEXT = "SignIn";
export const LOGIN_LOADING_TEXT = "Signing in...";
export const NEW_USER_TEXT = "New User?";
export const SIGNUP_LINK_TEXT = "SignUp";
export const SIGNUP_HERE_TEXT = "here";
export const FORGOT_PASSWORD_LINK_TEXT = "Forgot Password?";

// ---- Login errors ----
export const LOGIN_INVALID_MSG = "Incorrect credentials. Please try again!";
export const LOGIN_FILL_FIELDS_MSG = "Please enter email and password.";

// ---- Forgot Password UI text ----
export const FORGOT_PASSWORD_TITLE = "Forgot Password";
export const FORGOT_PASSWORD_DESCRIPTION = "Enter your registered email address to reset your password.";
export const FORGOT_PASSWORD_BUTTON_TEXT = "Continue";
export const FORGOT_PASSWORD_LOADING_TEXT = "Sending...";
export const FORGOT_PASSWORD_REMEMBER_TEXT = "Remember your password?";
export const FORGOT_PASSWORD_SIGNIN_LINK = "Sign In";
export const EMAIL_NOT_FOUND_MSG = "Email not found. Please sign up to create an account.";
