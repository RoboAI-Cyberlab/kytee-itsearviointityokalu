import { describe, it, expect } from "vitest";
import { buildPieOption } from "./PieChart";

describe("buildPieOption()", () => {
  it("produces one segment per non-zero count", () => {
    const counts = { "0": 0, "1": 3, "2": 5, "3": 0, "4": 2 };
    const option = buildPieOption(counts, 10, "käytäntöä");
    const series = option.series as any[];
    expect(series[0].data).toHaveLength(3);
  });

  it("zero counts are excluded", () => {
    const counts = { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0 };
    const option = buildPieOption(counts, 0);
    const series = option.series as any[];
    expect(series[0].data).toHaveLength(0);
  });

  it("segment values match input counts", () => {
    const counts = { "1": 4, "4": 6 };
    const option = buildPieOption(counts, 10);
    const series = option.series as any[];
    const values = series[0].data.map((d: any) => d.value);
    expect(values).toContain(4);
    expect(values).toContain(6);
  });

  it("each segment carries the correct colour for its maturity level", () => {
    const counts = { "1": 1, "4": 1 };
    const option = buildPieOption(counts, 2);
    const series = option.series as any[];
    const byName = Object.fromEntries(series[0].data.map((d: any) => [d.name, d.itemStyle.color]));
    expect(byName["Toteutumaton"]).toBe("#EF4444");
    expect(byName["Toteutunut"]).toBe("#1B847B");
  });
});
