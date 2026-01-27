export const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isStrongPassword = (password) =>
  password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
