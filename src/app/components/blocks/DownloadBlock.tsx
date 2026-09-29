import React from "react";
import { useTranslation } from "react-i18next";
import { DownloadIcon } from "lucide-react";
import { toPng } from "html-to-image";

interface DownloadBlockProps {
  chartRef: React.RefObject<HTMLDivElement>;
  filename: string;
}

export default function DownloadBlock({
  chartRef,
  filename,
}: DownloadBlockProps) {
  const { t } = useTranslation('common');
  const handleDownload = async () => {
    if (!chartRef.current) return;

    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: "#FFFFFF",
        pixelRatio: 2,
        quality: 1.0,
        skipAutoScale: true,
        style: {
          margin: "0",
          padding: "0",
        },
        fontEmbedCSS: "", // Skip font embedding to avoid issues in Firefox
      });

      const link = document.createElement("a");
      link.download = `${filename}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating chart image:", err);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex w-fit items-center gap-2 text-left text-sm text-turkoosi-700 hover:underline"
    >
      <DownloadIcon className="h-4 w-4" />
      {t('download_as_image')}
    </button>
  );
}
