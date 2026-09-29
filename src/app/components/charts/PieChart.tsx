import type { EChartsOption } from "echarts";
import EChart from "./EChart";

const COLOR_MAP: Record<string, string> = {
  "0": "#f6f7f9",
  "1": "#EF4444",
  "2": "#F97315",
  "3": "#25A79A",
  "4": "#1B847B",
};

const NAME_MAP: Record<string, string> = {
  "0": "Vastaamaton",
  "1": "Toteutumaton",
  "2": "Osittain",
  "3": "Enimmäkseen",
  "4": "Toteutunut",
};

export function buildPieOption(
  counts: Record<string, number>,
  total: number,
  subtitle?: string,
): EChartsOption {
  const data = Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: NAME_MAP[key],
      value,
      itemStyle: { color: COLOR_MAP[key] },
    }));

  return {
    tooltip: { trigger: "item" },
    graphic: [
      {
        type: "text",
        left: "center",
        top: "middle",
        style: {
          text: subtitle ? `{num|${total}}\n{sub|${subtitle}}` : `{num|${total}}`,
          textAlign: "center",
          textVerticalAlign: "middle",
          rich: {
            num: { fontSize: 34, fontWeight: "bold", fill: "#111827", lineHeight: 38 },
            sub: { fontSize: 13, fontWeight: "bold", fill: "#111827", lineHeight: 18 },
          },
        } as any,
      },
    ],
    series: [
      {
        type: "pie",
        radius: ["49%", "78%"],
        padAngle: 3,
        itemStyle: { borderRadius: 2 },
        emphasis: { scale: true, scaleSize: 4 },
        label: {
          show: true,
          position: "inside",
          formatter: "{c}",
          fontSize: 13,
          fontWeight: "bold",
          color: "#fff",
        },
        labelLine: { show: false },
        data,
      },
    ],
  };
}

interface PieChartProps {
  counts: Record<string, number>;
  totalPractices: number;
  subtitle?: string;
}

export default function PieChart({ counts, totalPractices, subtitle }: PieChartProps) {
  const option = buildPieOption(counts, totalPractices, subtitle);
  return (
    <EChart
      option={option}
      className="aspect-square w-full"
      style={{ width: "100%", aspectRatio: "1" }}
    />
  );
}
