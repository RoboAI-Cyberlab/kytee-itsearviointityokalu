import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PieChart from "@/app/components/charts/PieChart";
import { useTranslation } from "react-i18next";
import { useReportData } from "@/app/utils/useReportData";
import { getAnswerCounts } from "./answerCountUtils";

const AnswerDistributionPieWidget: React.FC = () => {
  const { t } = useTranslation('report');
  const { domains, overallTotal } = useReportData();
  const counts = getAnswerCounts(domains as unknown as Parameters<typeof getAnswerCounts>[0]);

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
    <Card className="w-full border-none shadow-sm print:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{t('answer_distribution_title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <PieChart counts={counts} totalPractices={overallTotal} subtitle={t('practices')} />
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
      </CardContent>
    </Card>
  );
};

export default AnswerDistributionPieWidget;
