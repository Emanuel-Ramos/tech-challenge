/**
 * Example test file following project patterns.
 * This demonstrates the expected structure and conventions.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  describe("rendering", () => {
    it("renders children correctly", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("renders as button element by default", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("applies primary variant by default", () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("primary");
    });

    it("applies secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("secondary");
    });
  });

  describe("sizes", () => {
    it("applies medium size by default", () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("md");
    });

    it("applies small size", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("sm");
    });
  });

  describe("states", () => {
    it("disables button when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("disables button when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("shows loading spinner when loading", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-busy", "true");
    });
  });

  describe("interactions", () => {
    it("calls onClick when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      );

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("accessibility", () => {
    it("applies aria-label when provided", () => {
      render(<Button aria-label="Submit form">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Submit form");
    });

    it("can be focused", () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole("button");
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });
});
