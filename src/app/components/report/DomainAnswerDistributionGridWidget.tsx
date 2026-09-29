import PieChart from "../charts/PieChart";
import { getAnswerCounts } from "./answerCountUtils";
import { useTranslation } from "react-i18next";
import { useReportData } from "@/app/utils/useReportData";
import type { DomainReportData } from "@/app/utils/reportDerivation";

const PieCard = ({ domain }: { domain: DomainReportData }) => {
  const { t } = useTranslation('report');
  const totalPractices = domain.total;
  const counts = getAnswerCounts([domain] as unknown as Parameters<typeof getAnswerCounts>[0]);
  const domainTitle = domain.title;

  const legendConfig: { [key: string]: { label: string; bgColor: string } } = {
    "0": { label: t('status_not_answered'), bgColor: "bg-gray-200" },
    "1": { label: t('status_not_implemented'), bgColor: "bg-red-500" },
    "2": { label: t('status_partially'), bgColor: "bg-orange-500" },
    "3": { label: t('status_mostly'), bgColor: "bg-teal-500" },
    "4": { label: t('status_implemented'), bgColor: "bg-teal-700" },
  };

  const legendItems = Object.entries(legendConfig).map(([key, config]) => ({
    label: config.label,
    count: counts[parseInt(key) as keyof typeof counts] || 0,
    color: config.bgColor,
  }));

  return (
    <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
      <h3 className="flex-grow text-base font-semibold text-gray-900" lang="fi" style={{ hyphens: "auto" }}>{domainTitle}</h3>
      <div className="flex flex-col gap-3">
        <div className="w-full">
          <PieChart counts={counts} totalPractices={totalPractices} />
        </div>
        <div className="space-y-1">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="text-gray-700">{item.label}</span>
              </div>
              <span className="font-medium text-gray-900">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function DomainAnswerDistributionGridWidget() {
  const { t } = useTranslation('report');
  const { domains } = useReportData();

  return (
    <div className="flex w-full flex-col gap-4 print:break-before-page">
      <div className="flex flex-col gap-4">
        <div className="items-between flex flex-col gap-2 px-2">
          <h2 className="text-xl font-semibold">{t('domain_answer_distribution_title')}</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {domains.map((domain, index) => (
            <PieCard key={index} domain={domain} />
          ))}
        </div>
      </div>
    </div>
  );
}
