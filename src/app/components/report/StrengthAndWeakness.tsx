import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import DownloadBlock from "@/app/components/blocks/DownloadBlock";
import { useReportData } from "@/app/utils/useReportData";
import type { DomainReportData } from "@/app/utils/reportDerivation";

const toScore = (domain: DomainReportData) => {
  const implemented = domain.practices.filter((p) => p.answer > 2).length;
  return {
    id: domain.id,
    title: domain.title,
    implemented,
    total: domain.total,
    ratio: domain.total === 0 ? 0 : implemented / domain.total,
  };
};

const StrengthAndWeaknessWidget: React.FC = () => {
  const { t } = useTranslation('report');
  const { domains } = useReportData();
  const topDomainsRef = useRef<HTMLDivElement>(null!);
  const bottomDomainsRef = useRef<HTMLDivElement>(null!);

  const scores = domains.map(toScore);
  const topDomains = [...scores].sort((a, b) => b.ratio - a.ratio).slice(0, 3);
  const bottomDomains = [...scores].sort((a, b) => a.ratio - b.ratio).slice(0, 3);

  const renderDomainCard = (domain: (typeof topDomains)[0], isWeak: boolean) => (
    <Card key={domain.id} className="w-full border-none shadow-sm print:shadow-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{domain.title}</CardTitle>
        {isWeak ? (
          <TrendingDown className="h-8 w-8 flex-shrink-0 text-red-500" />
        ) : (
          <TrendingUp className="h-8 w-8 flex-shrink-0 text-turkoosi" />
        )}
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-extrabold ${isWeak ? "text-red-500" : "text-turkoosi"}`}>
          {domain.implemented}/{domain.total}
        </p>
        <p className="mt-2 text-sm">{t('practices_implemented')}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex w-full flex-col gap-4 print:break-before-page">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 px-2">
          <h2 className="text-xl font-semibold">{t('strongest_sections_title')}</h2>
          <DownloadBlock chartRef={topDomainsRef} filename="vahvimmat-osiot.png" />
        </div>
        <div className="grid gap-4 md:grid-cols-3" ref={topDomainsRef}>
          {topDomains.map((domain) => renderDomainCard(domain, false))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 px-2">
          <h2 className="text-xl font-semibold">{t('weakest_sections_title')}</h2>
          <DownloadBlock chartRef={bottomDomainsRef} filename="heikoimmat-osiot.png" />
        </div>
        <div className="grid gap-4 md:grid-cols-3" ref={bottomDomainsRef}>
          {bottomDomains.map((domain) => renderDomainCard(domain, true))}
        </div>
      </div>
    </div>
  );
};

export default StrengthAndWeaknessWidget;
