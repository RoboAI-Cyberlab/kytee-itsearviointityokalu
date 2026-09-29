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

export function buildBarOption(data: DataPoint[]): EChartsOption {
  const hasB = data.some((d) => d.B !== undefined);
  const series: EChartsOption["series"] = [
    {
      type: "bar",
      data: data.map((d) => d.A),
      itemStyle: { color: TURKOOSI, borderRadius: [4, 4, 0, 0] },
      barMaxWidth: 30,
      label: {
        show: true,
        position: "top",
        formatter: (p: any) => (typeof p.value === "number" ? p.value.toFixed(2) : ""),
        fontSize: 11,
      },
    },
  ];

  if (hasB) {
    series.push({
      type: "bar",
      data: data.map((d) => d.B ?? null),
      itemStyle: { color: PINK, borderRadius: [4, 4, 0, 0] },
      barMaxWidth: 30,
      label: { show: false },
    });
  }

  return {
    tooltip: { trigger: "axis" },
    grid: { bottom: 20, left: 60, right: 20, top: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((d) => d.subject),
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 10,
        width: 200,
        overflow: "break",
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 4,
      interval: 1,
      axisLabel: { formatter: (v: number) => v.toFixed(2) },
    },
    series,
  };
}

interface BarChartProps {
  data: DataPoint[];
  downloadFilename?: string;
}

export default function BarChart({ data, downloadFilename }: BarChartProps) {
  const { t } = useTranslation("report");
  const option = buildBarOption(data);

  if (option.legend !== undefined || Array.isArray(option.series)) {
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
  }

  return <EChart option={option} className="w-full" style={{ height: 460 }} downloadFilename={downloadFilename} />;
}
