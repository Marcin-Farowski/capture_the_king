import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("should have header", () => {
    render(<Home />);

    const header = screen.getByText("Schwytaj Króla");

    expect(header).toBeInTheDocument();
  });

  it("should have subheader", () => {
    render(<Home />);

    const header = screen.getByText(
      "Zdominuj Schwytaj Króla dzięki naszej aplikacji!"
    );

    expect(header).toBeInTheDocument();
  });
});
