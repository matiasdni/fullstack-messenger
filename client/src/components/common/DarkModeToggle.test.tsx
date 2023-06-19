import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../utils/test-utils";
import DarkModeToggle from "./DarkModeToggle";

describe("DarkModeToggle component", () => {
  test("renders toggle switch", () => {
    renderWithProviders(<DarkModeToggle />);

    const toggleSwitch = screen.getByRole("switch");
    expect(toggleSwitch).toBeInTheDocument();
  });

  test("toggles dark mode on click", () => {
    renderWithProviders(<DarkModeToggle />);
    describe("DarkModeToggle component", () => {
      it("should have light mode icon", () => {
        const lightModeIcon = screen.getByTestId("light-mode-icon");
        expect(lightModeIcon).toBeInTheDocument();
      });

      it("should have dark mode icon", () => {
        const darkModeIcon = screen.getByTestId("dark-mode-icon");
        expect(darkModeIcon).toBeInTheDocument();
      });

      it("should have dark mode icon hidden", () => {
        const darkModeIcon = screen.getByTestId("dark-mode-icon");
        expect(darkModeIcon).not.toBeVisible();
      });

      it("should have light mode icon visible", () => {
        const lightModeIcon = screen.getByTestId("light-mode-icon");
        expect(lightModeIcon).toBeVisible();
      });
    });

    describe("DarkModeToggle click", () => {
      it("should contain dark class", () => {
        const toggleSwitch = screen.getByRole("switch");
        expect(document.documentElement.classList.contains("dark")).toBe(false);
        fireEvent.click(toggleSwitch);
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });

      it("should have dark mode icon visible", () => {
        const darkModeIcon = screen.getByTestId("dark-mode-icon");
        expect(darkModeIcon).toBeVisible();
      });

      it("should have light mode icon hidden", () => {
        const lightModeIcon = screen.getByTestId("light-mode-icon");
        expect(lightModeIcon).not.toBeVisible();
      });
    });
  });
});
