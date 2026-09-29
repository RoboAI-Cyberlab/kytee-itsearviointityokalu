import { lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useReportData } from "@/app/utils/useReportData";
import { getChartData } from "@/app/components/report/MaturityLevelBarChartWidget";

const RadarChartComponent = lazy(() => import("../charts/RadarChart"));

export default function MaturityLevelRadarChartWidget(): React.ReactElement {
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
          <Suspense fallback={<div className="flex h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-turkoosi" /></div>}>
            <RadarChartComponent data={chartData} downloadFilename="kypsyystaso-tutkakaavio.png" />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
