import React from "react";
import { useTranslation } from "react-i18next";

interface SummaryTableWidgetProps {
  implementedPractices: number;
  maturityRatio: number;
  averagePoints: number;
  averagePointsOfEconomicArea: number;
  hasEconomicAreaData: boolean;
}

/**
 * SummaryTableWidget is a component that displays summary metrics in a compact table format.
 * It shows implementation rates, average scores, and comparison with industry averages.
 */
const SummaryTableWidget: React.FC<SummaryTableWidgetProps> = ({
  implementedPractices,
  maturityRatio,
  averagePoints,
  averagePointsOfEconomicArea: _averagePointsOfEconomicArea,
  hasEconomicAreaData: _hasEconomicAreaData,
}) => {
  const { t } = useTranslation('report');

  return (
    <div className="text-sm">
      <dl className="divide-y">
        <div className="grid items-start gap-4 p-2 pl-0 sm:grid-cols-3">
          <dt className="flex items-center gap-2 whitespace-nowrap font-medium">
            {t('practice_implementation_count')}
          </dt>
          <dd className="sm:col-span-2">
            {implementedPractices} ({Math.round(maturityRatio * 100)}%)
          </dd>
        </div>

        <div className="grid items-start gap-4 p-2 pl-0 sm:grid-cols-3">
          <dt className="flex items-center gap-2 whitespace-nowrap font-medium">
            {t('average_implementation')}
          </dt>
          <dd className="sm:col-span-2">{averagePoints.toFixed(2)} {t('points')}</dd>
        </div>

        {/* TODO: re-enable when economic area data is available
          <div className="grid items-start gap-4 p-2 pl-0 sm:grid-cols-3">
            <dt className="flex items-center gap-2 whitespace-nowrap font-medium">
              {t('economic_area_average')}
            </dt>
            <dd className="sm:col-span-2">
              <div className="flex items-center gap-1.5">
                {averagePointsOfEconomicArea} {t('points')} *
              </div>
            </dd>
          </div>
        */}
      </dl>

      <div className="mt-4">
        {/* TODO: re-enable when economic area data is available
          <p className="mb-4 italic">
            * {t('source_hvk')}{" "}
            <a
              href="https://www.huoltovarmuuskeskus.fi/julkaisu/toimialojen-kyberkypsyyden-selvitys-2022"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              {t('cyber_maturity_report_title')}
            </a>
          </p>
        */}
        <p className="text-sm">
          {t('improvement_recommendation')}
        </p>
      </div>
    </div>
  );
};

export default SummaryTableWidget;
