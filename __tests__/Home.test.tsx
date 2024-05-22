import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

it("should have Header", () => {
  render(<Home />);

  const header = screen.getByText("Schwytaj Króla");

  expect(header).toBeInTheDocument();
});
