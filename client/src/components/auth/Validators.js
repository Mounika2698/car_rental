// src/components/auth/validators.js

import {
  EMAIL_VALID,
  EMAIL_VALID_MSG,
  EMAIL_EXISTS_MSG,
  PASS_MIN_MSG,
  PASS_UPPER_MSG,
  PASS_LOWER_MSG,
  PASS_NUMBER_MSG,
  PASS_SPECIAL_MSG,
  FILL_ALL_FIELDS_MSG,
  INVALID_EMAIL_MSG,
  PASSWORD_WEAK_MSG,
  PASSWORDS_MISMATCH_MSG
} from "../constants/Constant";

/**
 * Email validation (format + duplicate)
 */
export function validateEmail(email, existingEmails = []) {
  const trimmed = (email || "").trim().toLowerCase();
  const valid = EMAIL_VALID.test(trimmed);
  const alreadyRegistered = valid && existingEmails.includes(trimmed);

  let helperText = "";
  let error = false;

  if (email) {
    if (!valid) {
      error = true;
      helperText = EMAIL_VALID_MSG;
    } else if (alreadyRegistered) {
      error = true;
      helperText = EMAIL_EXISTS_MSG;
    }
  }

  return { trimmed, valid, alreadyRegistered, error, helperText };
}

/**
 * Password strength validation + step-by-step helperText
 */
export function validatePassword(password) {
  const pwd = password || "";

  const hasMinLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  const strong = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  // step-by-step helper message
  let helperText = "";
  let error = false;

  if (pwd) {
    if (!hasMinLength) helperText = PASS_MIN_MSG;
    else if (!hasUpper) helperText = PASS_UPPER_MSG;
    else if (!hasLower) helperText = PASS_LOWER_MSG;
    else if (!hasNumber) helperText = PASS_NUMBER_MSG;
    else if (!hasSpecial) helperText = PASS_SPECIAL_MSG;

    error = !strong;
  }

  return {
    strong,
    error,
    helperText
  };
}

/**
 * Confirm password validation
 */
export function validateConfirmPassword(password, confirmPassword) {
  const match = (password || "") === (confirmPassword || "");
  const showError = !!confirmPassword && !match;

  return {
    match,
    error: showError,
    helperText: showError ? PASSWORDS_MISMATCH_MSG : ""
  };
}

/**
 * Full signup submit validation (blocking alerts)
 */
export function validateSignupSubmit(formData, existingEmails = []) {
  const hasName = (formData.name || "").trim().length > 0;
  const hasEmail = (formData.email || "").trim().length > 0;
  const hasPassword = Boolean(formData.password);
  const hasConfirmPassword = Boolean(formData.confirmPassword);

if (!hasName || !hasEmail || !hasPassword || !hasConfirmPassword) {
  return { ok: false, message: FILL_ALL_FIELDS_MSG };
}

  const emailRes = validateEmail(formData.email, existingEmails);
  if (!emailRes.valid) return { ok: false, message: INVALID_EMAIL_MSG };
  if (emailRes.alreadyRegistered) return { ok: false, message: EMAIL_EXISTS_MSG };

  const pwdRes = validatePassword(formData.password);
  if (!pwdRes.strong) return { ok: false, message: PASSWORD_WEAK_MSG };

  const confirmRes = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (!confirmRes.match) return { ok: false, message: PASSWORDS_MISMATCH_MSG };

  return { ok: true, message: "" };
}
