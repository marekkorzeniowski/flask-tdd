import { it, expect, describe } from "vitest";
import { render, screen } from "../test-utils";
import "@testing-library/jest-dom/vitest";
import Users from "../../components/Users";

describe("Users", () => {
  it("Should render no registered users when there are no users passed to the component", () => {
    render(<Users users={[]} />);
    const message = screen.getByText(/no registered users/i);
    expect(message).toBeTruthy();
  });


  it("Should render user details when users are passed to the component", () => {
  const mockUsers = [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      created_date: "2024-08-19",
    },
    {
      id: 2,
      username: "jane_doe",
      email: "jane@example.com",
      created_date: "2024-08-18",
    },
  ];
  render(<Users users={mockUsers} />);

  // Assert that the user details are correctly rendered
  const userOne = screen.getByText("john_doe");
  const userTwo = screen.getByText("jane_doe");

  expect(userOne).toBeInTheDocument();
  expect(userTwo).toBeInTheDocument();

  const emailOne = screen.getByText("john@example.com");
  const emailTwo = screen.getByText("jane@example.com");

  expect(emailOne).toBeInTheDocument();
  expect(emailTwo).toBeInTheDocument();
});
});