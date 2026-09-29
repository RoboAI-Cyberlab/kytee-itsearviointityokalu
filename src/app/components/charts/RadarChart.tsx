import { useTranslation } from "react-i18next";
import type { EChartsOption } from "echarts";
import EChart from "./EChart";

interface DataPoint {
  subject: string;
  A: number;
  B?: number;
  fullMark: number;
}

const TURKOOSI = "#25A79A";
const PINK = "#C93D8A";

export function buildRadarOption(data: DataPoint[]): EChartsOption {
  const hasB = data.some((d) => d.B !== undefined);

  const series: EChartsOption["series"] = [
    {
      type: "radar",
      data: [{ value: data.map((d) => d.A) }],
      lineStyle: { color: TURKOOSI, width: 2 },
      areaStyle: { color: TURKOOSI, opacity: 0.1 },
      symbol: "none",
    },
  ];

  if (hasB) {
    series.push({
      type: "radar",
      data: [{ value: data.map((d) => d.B ?? 0) }],
      lineStyle: { color: PINK, width: 2, type: "dashed" },
      areaStyle: { color: PINK, opacity: 0.05 },
      symbol: "none",
    });
  }

  return {
    tooltip: { trigger: "item" },
    radar: {
      indicator: data.map((d) => ({ name: d.subject, max: d.fullMark })),
      axisName: {
        formatter: (value?: string) => {
          if (!value) return "";
          const words = value.split(" ");
          const lines: string[] = [];
          let line = "";
          for (const word of words) {
            if (line.length + word.length > 12 && line) {
              lines.push(line.trimEnd());
              line = "";
            }
            line += word + " ";
          }
          if (line.trim()) lines.push(line.trimEnd());
          return lines.join("\n");
        },
        fontSize: 12,
        color: "#333",
      },
      splitLine: { lineStyle: { color: "#e5e7eb" } },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
    },
    series,
  };
}

interface RadarChartProps {
  data: DataPoint[];
  downloadFilename?: string;
}

export default function RadarChartComponent({ data, downloadFilename }: RadarChartProps) {
  const { t } = useTranslation("report");
  const option = buildRadarOption(data);

  (option as any).legend = {
    data: [
      { name: t("average"), itemStyle: { color: TURKOOSI } },
      ...(data.some((d) => d.B !== undefined)
        ? [{ name: t("recommendation"), itemStyle: { color: PINK } }]
        : []),
    ],
  };
  if (Array.isArray(option.series)) {
    (option.series[0] as any).name = t("average");
    if (option.series[1]) (option.series[1] as any).name = t("recommendation");
  }

  return <EChart option={option} className="mx-auto" style={{ height: 400, maxWidth: 600 }} downloadFilename={downloadFilename} />;
}
