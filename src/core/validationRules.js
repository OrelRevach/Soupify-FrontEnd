// This file contains common rules for validation throughout the app

export const userNameRules = [
  v => !!v || "Username is required",
  v =>
    (v && v.length >= 3 && v.length <= 8) ||
    "Username must be between 3 and 8 characters",
  v => /^[a-zA-Z]+$/.test(v) || "Username can only contain english letters"
];

export const passwordRules = [
  v => !!v || "Password is required",
  v =>
    (v && v.length >= 5 && v.length <= 10) ||
    "Password must be between 5 and 10 characters",
  v => /\d/.test(v) || "Password must contain at least one number",
  v => /[a-zA-Z]/.test(v) || "Password must contain at least one english letter"
];
