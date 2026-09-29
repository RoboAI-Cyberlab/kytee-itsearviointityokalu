import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useReportData } from "@/app/utils/useReportData";

interface MissingPractice {
  title: string;
  page: string;
  id: string;
}

interface MissingPracticesWidgetProps {
  title: string;
}

const MissingPracticesWidget: React.FC<MissingPracticesWidgetProps> = ({ title }) => {
  const { t } = useTranslation('report');
  const [showAll, setShowAll] = useState(false);
  const { domains } = useReportData();

  const missingPractices: MissingPractice[] = domains.flatMap((domain) =>
    domain.practices
      .filter((practice) => practice.answer === 0)
      .map((practice) => ({
        title: practice.title,
        page: domain.id,
        id: practice.id,
      })),
  );

  const handleClick = () => setShowAll(!showAll);

  if (missingPractices.length === 0) return null;

  return (
    <div className="mb-4 rounded-md bg-red-50 p-4 shadow-sm print:hidden">
      <div className="flex gap-2">
        <div className="flex flex-shrink-0 items-start">
          <AlertCircle className="h-10 w-10 text-red-700" />
        </div>
        <div className="text-sm text-red-700">
          <p className="mb-2 font-bold">{title}</p>
          <p className="mb-2 font-medium">{t('missing_practices_description')}</p>
          <ol className="mb-2 list-decimal space-y-2 pl-8 font-medium">
            {missingPractices.slice(0, showAll ? undefined : 3).map((practice, index) => (
              <li key={index} className="cursor-pointer hover:underline">
                <Link to="/$domainId" params={{ domainId: practice.page }} hash={`${practice.page}-${practice.id}`} preload="intent">
                  {practice.title}
                </Link>
              </li>
            ))}
          </ol>
          {!showAll && missingPractices.length > 3 && (
            <>
              <p className="mb-4 font-medium">
                {t('missing_practices_more', { count: missingPractices.length - 3 })}{" "}
              </p>
              <p className="cursor-pointer font-semibold text-red-700 hover:underline" onClick={handleClick}>
                {t('missing_practices_show_all', { count: missingPractices.length })}
              </p>
            </>
          )}
          {showAll && (
            <p className="font-medium">
              <span className="cursor-pointer font-semibold text-red-700 hover:underline" onClick={handleClick}>
                {t('missing_practices_close_list')}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissingPracticesWidget;
