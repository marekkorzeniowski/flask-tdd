import { render, screen } from "../test-utils";
import { it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import LoginForm from "../../components/LoginForm";

it("LoginForm renders without crashing", () => {
  render(<LoginForm onSubmit={() => {}} />);

  expect(screen.getByRole("heading", { name: /log in/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
});
