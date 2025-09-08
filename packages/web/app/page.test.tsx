import { expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";

test("Can use Testing Library", () => {
  const MyComponent = () => {
    return <div data-testid="my-component">Hello World</div>;
  };

  render(<MyComponent />);
  const myComponent = screen.getByTestId("my-component");
  expect(myComponent).toBeInTheDocument();
});
