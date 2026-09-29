import { useRef } from "react";
import { PageLayout } from "../components/PageLayout";
import PaginationBlock from "@/app/components/blocks/PaginationBlock";
import { ErrorBoundaryBlock } from "../components/blocks/ErrorBoundaryBlock";
import { useTranslation } from "react-i18next";

import OrganizationInfoForm, { type OrganizationInfoFormRef } from "@/app/forms/OrganizationInfoForm";
import OrganizationAssessmentForm, { type OrganizationAssessmentFormRef } from "@/app/forms/OrganizationAssessmentForm";
import ImportForm from "@/app/forms/ImportForm";

export default function OrganizationPage() {
  const { t } = useTranslation('pages');
  const organizationInfoFormRef = useRef<OrganizationInfoFormRef>(null);
  const organizationAssessmentFormRef = useRef<OrganizationAssessmentFormRef>(null);

  return (
    <PageLayout showRightPanel={false}>
      <div className="flex max-w-5xl flex-col gap-4" id="main-content">
        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold">{t('organization_title')}</h1>
          <p className="text-sm">
            {t('organization_description')}
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">
            {t('organization_import_title')}
          </h2>

          <ErrorBoundaryBlock>
            <ImportForm 
              organizationInfoFormRef={organizationInfoFormRef}
              organizationAssessmentFormRef={organizationAssessmentFormRef}
            />
          </ErrorBoundaryBlock>
        </div>

        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">{t('organization_info_section_title')}</h2>

          <OrganizationInfoForm ref={organizationInfoFormRef} />
        </div>

        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold">{t('organization_assessment_section_title')}</h2>
          <OrganizationAssessmentForm ref={organizationAssessmentFormRef} />
        </div>

        <PaginationBlock />
      </div>
    </PageLayout>
  );
}
