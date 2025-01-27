import { it, expect, describe, afterEach } from "vitest";
import { render, cleanup, screen } from "../test-utils";
import "@testing-library/jest-dom/vitest";

import AddUser from "../../components/AddUser";

afterEach(cleanup);

describe("AddUser", () => {
  it("renders with default props", () => {
    render(<AddUser />);

    // Assert that the username input is present
    const usernameInput = screen.getByLabelText(/username/i);
    expect(usernameInput).toHaveAttribute("type", "text");
    expect(usernameInput).toHaveAttribute("required");

    // Assert that the email input is present
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("required");

    // Assert that the submit button is present and has the correct text
    const buttonInput = screen.getByRole("button", { name: /submit/i });
    expect(buttonInput).toBeInTheDocument();
  });
});