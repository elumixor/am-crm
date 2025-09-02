import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

test("Can use Testing Library", () => {
  render(<MyComponent />);
  const myComponent = screen.getByTestId("my-component");
  expect(myComponent).toBeInTheDocument();
});
