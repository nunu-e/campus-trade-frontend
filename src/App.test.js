import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders CampusTrade header", () => {
  render(<App />);
  const headerElement = screen.getByText(/CampusTrade/i);
  expect(headerElement).toBeInTheDocument();
});

test("renders login link when not authenticated", () => {
  localStorage.removeItem("user");
  render(<App />);
  const loginLink = screen.getByText(/Login/i);
  expect(loginLink).toBeInTheDocument();
});
