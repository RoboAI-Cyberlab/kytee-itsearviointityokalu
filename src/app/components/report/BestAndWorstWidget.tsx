import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import DownloadBlock from "@/app/components/blocks/DownloadBlock";
import { useTranslation } from "react-i18next";
import { useReportData } from "@/app/utils/useReportData";
import type { DomainReportData } from "@/app/utils/reportDerivation";

const toScore = (domain: DomainReportData) => ({
  id: domain.id,
  title: domain.title,
  implemented: domain.practices.filter((p) => p.answer > 2).length,
  total: domain.total,
  ratio: domain.total === 0 ? 0 : domain.practices.filter((p) => p.answer > 2).length / domain.total,
});

const BestAndWorstWidget: React.FC = () => {
  const { t } = useTranslation('report');
  const { domains } = useReportData();
  const chartRef = useRef<HTMLDivElement>(null!);

  const scores = domains.map(toScore);
  const bestDomain = [...scores].sort((a, b) => b.ratio - a.ratio)[0];
  const worstDomain = [...scores].sort((a, b) => a.ratio - b.ratio)[0];

  const renderDomainCard = (domain: typeof worstDomain, isWorst: boolean) => (
    <Card className="w-full border-none shadow-sm print:break-before-page print:shadow-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-semibold">
          {isWorst ? t('worst_domain_title') : t('best_domain_title')}
        </CardTitle>
        {isWorst ? (
          <TrendingDown className="h-8 w-8 text-red-500" />
        ) : (
          <TrendingUp className="h-8 w-8 text-turkoosi" />
        )}
      </CardHeader>
      <CardContent>
        <h3 className="mb-2 text-xl font-semibold">{domain?.title}</h3>
        <p className={`text-4xl font-extrabold ${isWorst ? "text-red-500" : "text-turkoosi"}`}>
          {domain?.implemented}/{domain?.total}
        </p>
        <p className="mt-2 text-sm">{t('practices_implemented')}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="text-xl font-semibold">{t('best_worst_title')}</h2>
        <DownloadBlock chartRef={chartRef} filename="vahvin-ja-heikoin-osio.png" />
      </div>
      <div className="grid gap-4 md:grid-cols-2" ref={chartRef}>
        {renderDomainCard(bestDomain, false)}
        {renderDomainCard(worstDomain, true)}
      </div>
    </div>
  );
};

export default BestAndWorstWidget;
