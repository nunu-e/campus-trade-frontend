export const isEmpty = (value) =>
  value === null || value === undefined || value === "";

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
