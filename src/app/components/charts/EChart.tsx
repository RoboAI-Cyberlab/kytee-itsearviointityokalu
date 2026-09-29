import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { RadarChart, BarChart, PieChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PolarComponent,
  GraphicComponent,
} from "echarts/components";
import type { EChartsOption } from "echarts";
import { DownloadIcon } from "lucide-react";

echarts.use([
  CanvasRenderer,
  RadarChart,
  BarChart,
  PieChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PolarComponent,
  GraphicComponent,
]);

interface EChartProps {
  option: EChartsOption;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  downloadFilename?: string;
}

export default function EChart({ option, loading, className, style, downloadFilename }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const instance = echarts.init(containerRef.current);
    instanceRef.current = instance;
    return () => {
      instance.dispose();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!instanceRef.current) return;
    instanceRef.current.setOption(option, { notMerge: true });
  }, [option]);

  useEffect(() => {
    if (!instanceRef.current) return;
    if (loading) {
      instanceRef.current.showLoading();
    } else {
      instanceRef.current.hideLoading();
    }
  }, [loading]);

  const handleDownload = () => {
    if (!instanceRef.current || !downloadFilename) return;
    const url = instanceRef.current.getDataURL({ type: "png", pixelRatio: 2, backgroundColor: "#fff" });
    const link = document.createElement("a");
    link.download = downloadFilename;
    link.href = url;
    link.click();
  };

  return (
    <>
      {downloadFilename && (
        <button
          onClick={handleDownload}
          className="mb-2 flex w-fit items-center gap-2 px-6 text-left text-sm text-turkoosi-700 hover:underline"
        >
          <DownloadIcon className="h-4 w-4" />
          Lataa kuvana
        </button>
      )}
      <div ref={containerRef} className={className} style={style} />
    </>
  );
}
