import { render, screen } from "../test-utils";
import { it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";

import NavBar from "../../components/NavBar";

it("NavBar renders without crashing", () => {
  render(
      <NavBar title="Hello, World!" />
  );

  const titleElement = screen.getByText("Hello, World!");
  expect(titleElement).toBeInTheDocument();
  expect(titleElement.closest("h1")).toHaveClass("navbar-item");
  expect(titleElement.closest("h1")).toHaveClass("nav-title");
});

//   const links = [
// //     { text: "User Status", href: "/status" },
//     { text: "About", href: "/about" },
//     { text: "Register", href: "/register" },
//     { text: "Log In", href: "/login" },
//     { text: "Log Out", href: "/logout" },
//   ];
//
//   links.forEach((link) => {
//     const linkElements = screen.getAllByRole("link", { name: link.text });
//     expect(linkElements.length).toBeGreaterThan(0);
//     expect(linkElements[0]).toHaveAttribute("href", link.href);
//   });


// it("NavBar renders properly", () => {
//   const { asFragment } = render(
//     <NavBar title="Test Title" />
//   );
//   expect(asFragment()).toMatchSnapshot();
// });