import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  describe("rendering", () => {
    it("renders children correctly", () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(<Card>Content</Card>);
      expect(container.firstChild?.nodeName).toBe("DIV");
    });
  });

  describe("title", () => {
    it("renders title when provided", () => {
      render(<Card title="Card Title">Content</Card>);
      expect(
        screen.getByRole("heading", { name: "Card Title" })
      ).toBeInTheDocument();
    });

    it("renders title as h3 element", () => {
      render(<Card title="Card Title">Content</Card>);
      const heading = screen.getByRole("heading", { name: "Card Title" });
      expect(heading.tagName).toBe("H3");
    });

    it("does not render title when not provided", () => {
      render(<Card>Content</Card>);
      expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies card class", () => {
      const { container } = render(<Card>Content</Card>);
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain("card");
    });

    it("applies custom className when provided", () => {
      const { container } = render(
        <Card className="custom-class">Content</Card>
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("merges custom className with card class", () => {
      const { container } = render(
        <Card className="custom-class">Content</Card>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.className).toContain("card");
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("applies title class to heading", () => {
      render(<Card title="Title">Content</Card>);
      const heading = screen.getByRole("heading");
      expect(heading.className).toContain("card__title");
    });

    it("applies content class to content wrapper", () => {
      const { container } = render(<Card>Content</Card>);
      const contentDiv = container.querySelector('[class*="card__content"]');
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe("content structure", () => {
    it("wraps children in content div", () => {
      const { container } = render(<Card>Child content</Card>);
      const contentDiv = container.querySelector('[class*="card__content"]');
      expect(contentDiv).toHaveTextContent("Child content");
    });

    it("renders complex children correctly", () => {
      render(
        <Card title="Complex">
          <span data-testid="child-1">First</span>
          <span data-testid="child-2">Second</span>
        </Card>
      );
      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
    });
  });
});
