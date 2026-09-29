import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper, ShieldX, ShieldCheck, ShieldAlert } from "lucide-react";
import DownloadBlock from "@/app/components/blocks/DownloadBlock";
import { useTranslation } from "react-i18next";
import { useReportData } from "@/app/utils/useReportData";

const MaturityStatusWidget: React.FC = () => {
  const { t } = useTranslation('report');
  const { answerDistribution } = useReportData();
  const chartRef = useRef<HTMLDivElement>(null!);

  const items = [
    { title: t('status_not_implemented'), value: answerDistribution[1], icon: ShieldX, color: "text-red-500", description: t('status_not_implemented_desc') },
    { title: t('status_partially'), value: answerDistribution[2], icon: ShieldAlert, color: "text-[#f25d0d]", description: t('status_partially_desc') },
    { title: t('status_mostly'), value: answerDistribution[3], icon: ShieldCheck, color: "text-[#1f9e93]", description: t('status_mostly_desc') },
    { title: t('status_implemented'), value: answerDistribution[4], icon: PartyPopper, color: "text-turkoosi", description: t('status_implemented_desc') },
  ];

  return (
    <div className="flex w-full flex-col gap-4 print:break-before-page">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="text-xl font-semibold">{t('practice_implementation')}</h2>
        <DownloadBlock chartRef={chartRef} filename="kaytantojen-toteutuminen.png" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" ref={chartRef}>
        {items.map((item) => (
          <Card key={item.title} className="w-full border-none shadow-sm print:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold">{item.title}</CardTitle>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`mb-2 text-4xl font-extrabold ${item.color}`}>{item.value}</div>
              <p className="text-sm">{t('practices_at_this_level')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaturityStatusWidget;
