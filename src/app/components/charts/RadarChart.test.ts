import { describe, it, expect } from "vitest";
import { buildRadarOption } from "./RadarChart";

const data = [
  { subject: "Hallinto", A: 2.0, B: 3.0, fullMark: 4 },
  { subject: "Toimitusketju", A: 1.5, B: 2.0, fullMark: 4 },
  { subject: "Kyberturvallisuusarkkitehtuuri", A: 3.0, B: 4.0, fullMark: 4 },
];

describe("buildRadarOption()", () => {
  it("radar indicators match subject names", () => {
    const option = buildRadarOption(data);
    const radar = option.radar as any;
    expect(radar.indicator.map((i: any) => i.name)).toEqual([
      "Hallinto",
      "Toimitusketju",
      "Kyberturvallisuusarkkitehtuuri",
    ]);
  });

  it("produces two series (actual and recommendation)", () => {
    const option = buildRadarOption(data);
    const series = option.series as any[];
    expect(series).toHaveLength(2);
  });

  it("first series values match A values in order", () => {
    const option = buildRadarOption(data);
    const series = option.series as any[];
    expect(series[0].data[0].value).toEqual([2.0, 1.5, 3.0]);
  });

  it("second series values match B values in order", () => {
    const option = buildRadarOption(data);
    const series = option.series as any[];
    expect(series[1].data[0].value).toEqual([3.0, 2.0, 4.0]);
  });

  it("radar max is derived from fullMark", () => {
    const option = buildRadarOption(data);
    const radar = option.radar as any;
    expect(radar.indicator.every((i: any) => i.max === 4)).toBe(true);
  });

  it("omits recommendation series when no B values are present", () => {
    const noB = [{ subject: "Hallinto", A: 2.0, fullMark: 4 }];
    const option = buildRadarOption(noB);
    const series = option.series as any[];
    expect(series).toHaveLength(1);
  });
});
