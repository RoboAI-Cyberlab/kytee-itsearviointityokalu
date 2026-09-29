import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PageLayout } from "../components/PageLayout";
import PaginationBlock from "../components/blocks/PaginationBlock";
import BestAndWorstWidget from "../components/report/BestAndWorstWidget";
import MaturityStatusWidget from "../components/report/MaturityStatusWidget";
import StrengthAndWeaknessWidget from "../components/report/StrengthAndWeakness";
import MaturityLevelSummaryWidget from "../components/report/MaturityLevelSummaryWidget";
import MissingPracticesWidget from "../components/report/MissingPracticesWidget";

import OrganizationInfoWidget from "../components/report/OrganizationInfoWidget";
import DomainAnswerDistributionGridWidget from "../components/report/DomainAnswerDistributionGridWidget";
import MaturityLevelStandingsTableWidget from "../components/report/MaturityLevelStandingsTableWidget";
import MaturityLevelBarChartWidget from "../components/report/MaturityLevelBarChartWidget";
import MaturityLevelRadarChartWidget from "../components/report/MaturityLevelRadarChartWidget";
import MaturityLevelMatrixWidget from "../components/report/MaturityLevelMatrixWidget";
import PracticeTableWidget from "../components/report/PracticeTableWidget";

const isProduction = import.meta.env.PROD;

function MyTabList(): React.ReactElement {
  const { t } = useTranslation('pages');
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="my-4">
      <TabsList className="h-auto w-full flex-col items-stretch gap-2 text-foreground sm:h-9 sm:w-auto sm:flex-row sm:justify-start [&>button]:min-w-32 [&>button]:bg-[#edeef0]">
        <TabsTrigger
          value="summary"
          onClick={() => setActiveTab("summary")}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          {t('report_tab_summary')}
        </TabsTrigger>
        <TabsTrigger
          value="domains"
          onClick={() => setActiveTab("domains")}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          {t('report_tab_domains')}
        </TabsTrigger>
        <TabsTrigger
          value="practices"
          onClick={() => setActiveTab("practices")}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          {t('report_tab_practices')}
        </TabsTrigger>
        <TabsTrigger
          value="benchmark"
          onClick={() => setActiveTab("benchmark")}
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          {t('report_tab_benchmark')}
        </TabsTrigger>
      </TabsList>
      {/* {activeTab === "benchmark" && (
              <div className="flex flex-col gap-4">
                <p className="ml-1 mt-4 text-sm">
                  * Tavoite on lisätä tulevaisuudessa vertailuarvot kuvaajiin,
                  jolloin vertailu oman organisaation ja toimialan tai yleisen
                  kyberturvallisuustason kanssa helpottuu.
                </p>
              </div>
            )} */}
    </div>
  );
}

export default function ReportPage() {
  const { t } = useTranslation('pages');

  return (
    <PageLayout showRightPanel={false}>
      <div className="flex max-w-5xl flex-col px-2 md:px-0" id="main-content">
        <MissingPracticesWidget title={t('report_complete_results_message')} />
        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold">{t('report_title')}</h1>
        </div>
        <Tabs defaultValue="summary" className="mb-4">
          <MyTabList />
          <TabsContent
            value="summary"
            className="mt-0 flex flex-col gap-4 [&:empty]:hidden"
          >
            <MaturityLevelSummaryWidget />
            <OrganizationInfoWidget />
          </TabsContent>
          <TabsContent
            value="domains"
            className="mt-0 flex flex-col gap-4 [&:empty]:hidden"
          >
            {!isProduction && <BestAndWorstWidget />}
            <StrengthAndWeaknessWidget />
            <MaturityLevelMatrixWidget />
            <MaturityLevelStandingsTableWidget />
            <DomainAnswerDistributionGridWidget />
          </TabsContent>
          <TabsContent
            value="practices"
            className="mt-0 flex flex-col gap-4 [&:empty]:hidden"
          >
            <MaturityStatusWidget />
            <PracticeTableWidget />
          </TabsContent>
          <TabsContent
            value="benchmark"
            className="mt-0 flex flex-col gap-4 [&:empty]:hidden"
          >
            <MaturityLevelRadarChartWidget />
            <MaturityLevelBarChartWidget />
          </TabsContent>
        </Tabs>
        <PaginationBlock />
      </div>
    </PageLayout>
  );
}
