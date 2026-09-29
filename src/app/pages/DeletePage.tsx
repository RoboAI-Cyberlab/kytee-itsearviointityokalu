import { PageLayout } from "../components/PageLayout";
import { Button } from "../../components/ui/button";
import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAssessmentStore } from "@/store/assessmentStore";
import { useOrganizationStore } from "@/store/organizationStore";
import { useAppStore } from "@/store/appStore";
import { getAnsweredPractices } from "@/store/utils";

export default function DeletePage() {
  const { t } = useTranslation('pages');
  const { clearAnswers, formValues } = useAssessmentStore();
  const { clearOrganization, organization } = useOrganizationStore();
  const { clearAppState } = useAppStore();

  const answeredPractices = getAnsweredPractices(formValues);

  const organizationDataPoints = Object.values(organization).filter(
    (value) => value !== "",
  ).length;

  const handleDelete = async () => {
    clearAppState();
    clearOrganization();
    clearAnswers();
  };

  return (
    <PageLayout showRightPanel={false}>
      <div className="flex max-w-5xl flex-col gap-4" id="main-content">
        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold">{t('delete_title')}</h1>
          <div>
            <p className="mb-6 text-sm">
              {t('delete_description')}
            </p>
            <h2 className="mb-2 text-lg font-semibold">{t('delete_data_to_remove')}</h2>
            {answeredPractices > 0 || organizationDataPoints > 0 ? (
              <ul className="mb-6 ml-4 list-inside list-disc text-sm">
                {answeredPractices > 0 && (
                  <li>{t('delete_answer_count', { count: answeredPractices })}</li>
                )}
                {organizationDataPoints > 0 && (
                  <li>
                    {t('delete_organization_data_count', { count: organizationDataPoints })}
                  </li>
                )}
              </ul>
            ) : (
              <p className="mb-6 text-sm">{t('delete_no_data')}</p>
            )}

            <Button
              onClick={handleDelete}
              className="flex-0 flex cursor-pointer items-center gap-2 self-start bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
            >
              <Trash className="h-4 w-4" />
              {t('delete_button')}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
