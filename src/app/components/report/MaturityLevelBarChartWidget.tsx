import { lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import benchmarkData from "@/data/domain_benchmarks.json";
import { useReportData } from "@/app/utils/useReportData";
import type { DomainReportData } from "@/app/utils/reportDerivation";

const BarChartComponent = lazy(() => import("../charts/BarChart"));

export const getChartData = (domains: DomainReportData[]) => {
  return domains.map((domain) => {
    const average =
      domain.practices.length === 0
        ? 0
        : domain.practices.reduce((sum, p) => sum + p.answer, 0) / domain.practices.length;

    const benchmarkValue = benchmarkData[domain.id as keyof typeof benchmarkData] || 3.0;

    return {
      subject: domain.title,
      A: Number(average.toFixed(2)),
      B: benchmarkValue,
      fullMark: 4,
    };
  });
};

const MaturityLevelBarChartWidget: React.FC = () => {
  const { t } = useTranslation('report');
  const { domains } = useReportData();
  const chartData = getChartData(domains);

  return (
    <div className="flex w-full flex-col gap-4 print:break-before-page">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="text-xl font-semibold">{t('practice_implementation_by_domain')}</h2>
      </div>
      <Card className="w-full max-w-[calc(100dvw-1rem)] overflow-x-auto border-none shadow-sm print:shadow-none">
        <CardContent className="min-w-[700px] px-0 pt-8">
          <Suspense fallback={<div className="flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-turkoosi" /></div>}>
            <BarChartComponent data={chartData} downloadFilename="kypsyystaso-pylvaskaavio.png" />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaturityLevelBarChartWidget;
