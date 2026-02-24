import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "./ThemeProvider";
import type { TenantTheme } from "@shipay/types";

const mockTheme: TenantTheme = {
  primaryColor: "#3b82f6",
  secondaryColor: "#6b7280",
  backgroundColor: "#ffffff",
  textColor: "#171717",
  borderRadius: "0.5rem",
};

const customTheme: TenantTheme = {
  primaryColor: "#ff0000",
  secondaryColor: "#00ff00",
  backgroundColor: "#000000",
  textColor: "#ffffff",
  borderRadius: "1rem",
};

describe("ThemeProvider", () => {
  describe("rendering", () => {
    it("renders children correctly", () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <span>Child content</span>
        </ThemeProvider>
      );
      expect(screen.getByText("Child content")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(
        <ThemeProvider theme={mockTheme}>
          <span>Content</span>
        </ThemeProvider>
      );
      expect(container.firstChild?.nodeName).toBe("DIV");
    });

    it("renders multiple children", () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <span data-testid="child-1">First</span>
          <span data-testid="child-2">Second</span>
        </ThemeProvider>
      );
      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
    });
  });

  describe("CSS variables", () => {
    it("applies --color-primary CSS variable", () => {
      const { container } = render(
        <ThemeProvider theme={mockTheme}>
          <span>Content</span>
        </ThemeProvider>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--color-primary")).toBe(
        "#3b82f6"
      );
    });

    it("applies --color-secondary CSS variable", () => {
      const { container } = render(
        <ThemeProvider theme={mockTheme}>
          <span>Content</span>
        </ThemeProvider>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--color-secondary")).toBe(
        "#6b7280"
      );
    });

    it("applies --color-background CSS variable", () => {
      const { container } = render(
        <ThemeProvider theme={mockTheme}>
          <span>Content</span>
        </ThemeProvider>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--color-background")).toBe(
        "#ffffff"
      );
    });

    it("applies --color-text CSS variable", () => {
      const { container } = render(
        <ThemeProvider theme={mockTheme}>
          <span>Content</span>
        </ThemeProvider>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--color-text")).toBe("#171717");
    });

    it("applies --border-radius CSS variable", () => {
      const { container } = render(
        <ThemeProvider theme={mockTheme}>
          <span>Content</span>
        </ThemeProvider>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--border-radius")).toBe("0.5rem");
    });

    it("applies derived --color-text-inverse variable", () => {
      const { container } = render(
        <ThemeProvider theme={mockTheme}>
          <span>Content</span>
        </ThemeProvider>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--color-text-inverse")).toBe(
        "#ffffff"
      );
    });

    it("applies --transition-fast variable", () => {
      const { container } = render(
        <ThemeProvider theme={mockTheme}>
          <span>Content</span>
        </ThemeProvider>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--transition-fast")).toBe(
        "150ms ease"
      );
    });
  });

  describe("theme customization", () => {
    it("applies custom primary color", () => {
      const { container } = render(
        <ThemeProvider theme={customTheme}>
          <span>Content</span>
        </ThemeProvider>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--color-primary")).toBe("#ff0000");
    });

    it("applies custom background color", () => {
      const { container } = render(
        <ThemeProvider theme={customTheme}>
          <span>Content</span>
        </ThemeProvider>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--color-background")).toBe(
        "#000000"
      );
    });

    it("applies custom border radius", () => {
      const { container } = render(
        <ThemeProvider theme={customTheme}>
          <span>Content</span>
        </ThemeProvider>
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue("--border-radius")).toBe("1rem");
    });
  });

  describe("nesting", () => {
    it("allows nested ThemeProviders", () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <ThemeProvider theme={customTheme}>
            <span>Nested content</span>
          </ThemeProvider>
        </ThemeProvider>
      );
      expect(screen.getByText("Nested content")).toBeInTheDocument();
    });

    it("inner ThemeProvider applies its own theme variables", () => {
      render(
        <ThemeProvider theme={mockTheme}>
          <div data-testid="outer-content">Outer</div>
          <ThemeProvider theme={customTheme}>
            <div data-testid="inner-content">Inner</div>
          </ThemeProvider>
        </ThemeProvider>
      );
      // Inner content should be rendered inside the custom theme wrapper
      const innerContent = screen.getByTestId("inner-content");
      const innerWrapper = innerContent.parentElement as HTMLElement;
      expect(innerWrapper.style.getPropertyValue("--color-primary")).toBe(
        "#ff0000"
      );
    });
  });
});
