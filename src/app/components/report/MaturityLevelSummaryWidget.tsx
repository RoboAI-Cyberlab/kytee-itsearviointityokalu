import React, { useRef, Suspense, lazy } from "react";
import { useShallow } from "zustand/react/shallow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ShieldCheck, ShieldX, Loader2 } from "lucide-react";
import DownloadBlock from "@/app/components/blocks/DownloadBlock";
import { useOrganizationStore } from "@/store/organizationStore";
import economic_areas from "@/data/economic_areas.json";
import SummaryTableWidget from "./SummaryTableWidget";
import { useTranslation } from "react-i18next";
import { useReportData } from "@/app/utils/useReportData";

type ReportT = ReturnType<typeof useTranslation<"report">>["t"];

const AnswerDistributionPieWidget = lazy(() => import("./AnswerDistributionPieWidget"));

const getMaturityLevel = (ratio: number, t: ReportT) => {
  if (ratio >= 0.9) return { level: 4, title: t('maturity_excellent'), icon: ShieldCheck, color: "text-turkoosi" };
  if (ratio >= 0.7) return { level: 3, title: t('maturity_good'), icon: ShieldCheck, color: "text-turkoosi-600" };
  if (ratio >= 0.5) return { level: 2, title: t('maturity_developing'), icon: ShieldAlert, color: "text-orange-600" };
  return { level: 1, title: t('maturity_weak'), icon: ShieldX, color: "text-red-500" };
};

const MaturityLevelSummaryWidget: React.FC = () => {
  const { t } = useTranslation('report');
  const { domains, overallTotal } = useReportData();
  const organization = useOrganizationStore(useShallow((state) => state.organization));
  const chartRef = useRef<HTMLDivElement>(null!);

  const sumOfPoints = domains.reduce((acc, d) => acc + d.practices.reduce((s, p) => s + p.answer, 0), 0);
  const averagePoints = overallTotal === 0 ? 0 : sumOfPoints / overallTotal;
  const averagePointsOfEconomicArea = economic_areas.codes.find((area) => area.value === organization.economic_area)?.score ?? 0;

  const implementedPractices = domains.reduce((acc, d) => acc + d.practices.filter((p) => p.answer > 2).length, 0);
  const maturityRatio = overallTotal === 0 ? 0 : implementedPractices / overallTotal;
  const maturity = getMaturityLevel(maturityRatio, t);
  const hasEconomicAreaData = !!averagePointsOfEconomicArea;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="text-xl font-semibold">{t('summary_title')}</h2>
        <DownloadBlock chartRef={chartRef} filename="itsearvioinnin-yhteenveto.png" />
      </div>
      <div className="grid gap-4 md:grid-cols-3" ref={chartRef}>
        <Card className="w-full border-none shadow-sm md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">{t('overall_assessment')}</CardTitle>
            <maturity.icon className={`h-8 w-8 flex-shrink-0 ${maturity.color}`} />
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center gap-3">
              <p className={`text-3xl font-extrabold uppercase ${maturity.color}`}>{maturity.title}</p>
            </div>
            <SummaryTableWidget
              implementedPractices={implementedPractices}
              maturityRatio={maturityRatio}
              averagePoints={averagePoints}
              averagePointsOfEconomicArea={averagePointsOfEconomicArea}
              hasEconomicAreaData={hasEconomicAreaData}
            />
          </CardContent>
        </Card>
        <Suspense fallback={<div className="flex h-[300px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-turkoosi" /></div>}>
          <AnswerDistributionPieWidget />
        </Suspense>
      </div>
    </div>
  );
};

export default MaturityLevelSummaryWidget;
