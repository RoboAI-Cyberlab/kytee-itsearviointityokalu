import { describe, it, expect } from "vitest";
import { buildBarOption } from "./BarChart";

const data = [
  { subject: "Hallinto", A: 2.5, B: 3.0, fullMark: 4 },
  { subject: "Toimitusketju", A: 1.75, B: 2.5, fullMark: 4 },
];

describe("buildBarOption()", () => {
  it("produces two series (actual and recommendation)", () => {
    const option = buildBarOption(data);
    const series = option.series as any[];
    expect(series).toHaveLength(2);
  });

  it("x-axis categories match subject names in order", () => {
    const option = buildBarOption(data);
    const xAxis = option.xAxis as any;
    expect(xAxis.data).toEqual(["Hallinto", "Toimitusketju"]);
  });

  it("first series values match A values", () => {
    const option = buildBarOption(data);
    const series = option.series as any[];
    expect(series[0].data).toEqual([2.5, 1.75]);
  });

  it("second series values match B values", () => {
    const option = buildBarOption(data);
    const series = option.series as any[];
    expect(series[1].data).toEqual([3.0, 2.5]);
  });

  it("y-axis max is 4", () => {
    const option = buildBarOption(data);
    const yAxis = option.yAxis as any;
    expect(yAxis.max).toBe(4);
  });

  it("omits recommendation series when no B values are present", () => {
    const noB = [{ subject: "Hallinto", A: 2.0, fullMark: 4 }];
    const option = buildBarOption(noB);
    const series = option.series as any[];
    expect(series).toHaveLength(1);
  });
});
