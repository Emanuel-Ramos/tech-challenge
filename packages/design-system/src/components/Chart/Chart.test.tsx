import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chart } from "./Chart";

interface TestDataPoint {
  label: string;
  amount: number;
}

const mockData: TestDataPoint[] = [
  { label: "Jan", amount: 1000 },
  { label: "Feb", amount: 1500 },
  { label: "Mar", amount: 1200 },
];

const mapDataPoint = (d: TestDataPoint) => ({
  label: d.label,
  value: d.amount,
});

describe("Chart", () => {
  describe("loading state", () => {
    it("renders loading state correctly", () => {
      render(
        <Chart
          data={[]}
          state={{ loading: true }}
          mapDataPoint={mapDataPoint}
        />
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("shows loading spinner with aria-busy", () => {
      render(
        <Chart
          data={[]}
          state={{ loading: true }}
          mapDataPoint={mapDataPoint}
          aria-label="Test chart"
        />
      );

      const container = screen.getByRole("img");
      expect(container).toHaveAttribute("aria-busy", "true");
    });

    it("renders title during loading", () => {
      render(
        <Chart
          data={[]}
          state={{ loading: true }}
          mapDataPoint={mapDataPoint}
          title="Revenue Chart"
        />
      );

      expect(screen.getByText("Revenue Chart")).toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("renders error message for string error", () => {
      render(
        <Chart
          data={[]}
          state={{ error: "Failed to load data" }}
          mapDataPoint={mapDataPoint}
        />
      );

      expect(screen.getByText("Failed to load data")).toBeInTheDocument();
    });

    it("renders error message for Error object", () => {
      render(
        <Chart
          data={[]}
          state={{ error: new Error("Network error") }}
          mapDataPoint={mapDataPoint}
        />
      );

      expect(screen.getByText("Network error")).toBeInTheDocument();
    });

    it("includes error in aria-label", () => {
      render(
        <Chart
          data={[]}
          state={{ error: "API timeout" }}
          mapDataPoint={mapDataPoint}
        />
      );

      const container = screen.getByRole("img");
      expect(container).toHaveAttribute("aria-label", "Chart error: API timeout");
    });
  });

  describe("empty state", () => {
    it("renders default empty message", () => {
      render(<Chart data={[]} mapDataPoint={mapDataPoint} />);

      expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("renders custom empty message", () => {
      render(
        <Chart
          data={[]}
          state={{ empty: { message: "Start adding data" } }}
          mapDataPoint={mapDataPoint}
        />
      );

      expect(screen.getByText("Start adding data")).toBeInTheDocument();
    });

    it("handles null data", () => {
      render(<Chart data={null as unknown as []} mapDataPoint={mapDataPoint} />);

      expect(screen.getByText("No data available")).toBeInTheDocument();
    });
  });

  describe("data state", () => {
    it("renders bars for each data point", () => {
      render(<Chart data={mockData} mapDataPoint={mapDataPoint} />);

      expect(screen.getByText("Jan")).toBeInTheDocument();
      expect(screen.getByText("Feb")).toBeInTheDocument();
      expect(screen.getByText("Mar")).toBeInTheDocument();
    });

    it("displays formatted values", () => {
      render(
        <Chart
          data={mockData}
          mapDataPoint={mapDataPoint}
          formatValue={(v) => `R$ ${v}`}
        />
      );

      expect(screen.getByText("R$ 1000")).toBeInTheDocument();
      expect(screen.getByText("R$ 1500")).toBeInTheDocument();
    });

    it("uses default value formatting", () => {
      render(<Chart data={mockData} mapDataPoint={mapDataPoint} />);

      expect(screen.getByText("1000")).toBeInTheDocument();
    });

    it("renders title with data", () => {
      render(
        <Chart
          data={mockData}
          mapDataPoint={mapDataPoint}
          title="Monthly Sales"
        />
      );

      expect(screen.getByText("Monthly Sales")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has img role", () => {
      render(<Chart data={mockData} mapDataPoint={mapDataPoint} />);

      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("uses custom aria-label", () => {
      render(
        <Chart
          data={mockData}
          mapDataPoint={mapDataPoint}
          aria-label="Sales data visualization"
        />
      );

      expect(screen.getByRole("img")).toHaveAttribute(
        "aria-label",
        "Sales data visualization"
      );
    });

    it("generates descriptive aria-label with title", () => {
      render(
        <Chart
          data={mockData}
          mapDataPoint={mapDataPoint}
          title="Revenue"
        />
      );

      const container = screen.getByRole("img");
      expect(container).toHaveAttribute(
        "aria-label",
        "Bar chart showing Revenue with 3 data points"
      );
    });
  });

  describe("styling", () => {
    it("applies custom height", () => {
      render(
        <Chart
          data={mockData}
          mapDataPoint={mapDataPoint}
          height={400}
        />
      );

      const container = screen.getByRole("img");
      expect(container).toHaveStyle({ height: "400px" });
    });

    it("uses default height of 300", () => {
      render(<Chart data={mockData} mapDataPoint={mapDataPoint} />);

      const container = screen.getByRole("img");
      expect(container).toHaveStyle({ height: "300px" });
    });
  });
});
