import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "../components/PageLayout";
import PaginationBlock from "../components/blocks/PaginationBlock";

import { useAppStore } from "@/store/appStore";
import { useAssessmentStore } from "@/store/assessmentStore";
import { useOrganizationStore } from "@/store/organizationStore";
import { downloadAssessmentAsXLSX } from "../components/exports/Excel";

export default function ExportPage() {
  const { t } = useTranslation('pages');
  const { formValues } = useAssessmentStore();
  const { organization } = useOrganizationStore();
  const { selectedModel, model } = useAppStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const downloadAsXLSX = async () => {
    setError(null);
    setSuccess(null);

    try {
      const result = await downloadAssessmentAsXLSX(
        formValues,
        organization,
        selectedModel,
        model ?? [],
      );
      if (!result.success) {
        setError(result.error || t('export_error'));
      } else {
        setSuccess(t('export_success'));
      }
    } catch (err) {
      console.error("Virhe Excel-viennissä:", err);
      setError(t('export_error_unexpected'));
    }
  };

  return (
    <PageLayout showRightPanel={false}>
      <div className="flex max-w-5xl flex-col gap-4" id="main-content">
        <div className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
          <h1 className="text-2xl font-semibold">{t('export_title')}</h1>
          <p className="mb-2 text-sm">
            {t('export_description')}
          </p>
          <div className="space-y-4">
            <Button
              onClick={downloadAsXLSX}
              className="flex max-w-fit items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('export_download_button')}
            </Button>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-100 p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}
            {success && (
              <div className="rounded-md border border-turkoosi/20 bg-turkoosi/10 p-4">
                <div className="flex">
                  <div className="shrink-0">
                    <CheckCircle className="h-5 w-5 text-[#375e5a]" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-[#375e5a]">{success}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <PaginationBlock />
      </div>
    </PageLayout>
  );
}
