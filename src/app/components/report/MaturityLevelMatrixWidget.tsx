import React from "react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useReportData } from "@/app/utils/useReportData";
import type { DomainReportData } from "@/app/utils/reportDerivation";

const getBackgroundColor = (answer: number | null) => {
  if (answer === null) return "bg-white";
  switch (answer) {
    case 1: return "bg-red-100";
    case 2: return "bg-orange-100";
    case 3: return "bg-turkoosi-50";
    case 4: return "bg-turkoosi-100";
    default: return "bg-white";
  }
};

const getUniquePracticeIds = (domains: DomainReportData[]) => {
  const ids = domains.flatMap((d) => d.practices.map((p) => p.id));
  return [...new Set(ids)].sort();
};

const MaturityLevelMatrixWidget: React.FC = () => {
  const { t } = useTranslation('report');
  const { domains } = useReportData();
  const uniquePracticeIds = getUniquePracticeIds(domains);

  const domainsWithAllPractices = domains.map((domain) => ({
    id: domain.id,
    title: domain.title,
    practices: uniquePracticeIds.map(
      (practiceId) => {
        const found = domain.practices.find((p) => p.id === practiceId);
        return found
          ? { id: practiceId, answer: found.answer, title: found.title }
          : { id: practiceId, answer: null as number | null, title: null };
      },
    ),
  }));

  return (
    <div className="flex w-full flex-col gap-4 print:break-before-page">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="text-xl font-semibold">{t('domain_matrix_title')}</h2>
      </div>
      <Card className="w-full max-w-[calc(100dvw-1rem)] overflow-x-auto border-none shadow-sm print:shadow-none">
        <CardContent className="p-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2 text-left font-semibold text-gray-800 print:text-xs">Osiot</TableHead>
                  {uniquePracticeIds.map((id, index) => (
                    <TableHead key={id || index + 1} className="p-2 text-center font-semibold text-gray-800 print:text-xs">
                      {id || index + 1}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {domainsWithAllPractices.map((domain, index) => (
                  <TableRow key={domain.id || index + 1}>
                    <TableCell className="whitespace-nowrap p-2">{domain.title}</TableCell>
                    {domain.practices.map((practice, pIndex) => (
                      <TableCell
                        key={practice.id || pIndex + 1}
                        className={`p-2 text-center print:text-xs ${getBackgroundColor(practice.answer)}`}
                      >
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <button className="w-full cursor-help">
                              {practice.answer !== null ? practice.answer : "-"}
                            </button>
                          </HoverCardTrigger>
                          {practice.title && (
                            <HoverCardContent side="top" align="center" className="w-[300px]">
                              <div className="flex flex-col gap-2">
                                <h4 className="text-left text-base font-semibold">{t('practice')}</h4>
                                <p className="text-left text-sm font-normal text-foreground">{practice.title}</p>
                                <p className="text-left text-sm font-normal text-foreground">
                                  <Link to="/$domainId" params={{ domainId: domain.id }} hash={`${domain.id}-${practice.id}`} className="inline-flex items-center gap-1 text-turkoosi" preload="intent">
                                    <ArrowRight className="h-4 w-4" />
                                    Siirry käytäntöön
                                  </Link>
                                </p>
                              </div>
                            </HoverCardContent>
                          )}
                        </HoverCard>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaturityLevelMatrixWidget;
