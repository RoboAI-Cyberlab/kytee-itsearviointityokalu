import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import ExcelJS from "exceljs";
import { AlertCircle, CheckCircle, Upload } from "lucide-react";

import { useAppStore } from "@/store/appStore";
import { useAssessmentStore, type FormValues } from "@/store/assessmentStore";
import {
  useOrganizationStore,
  type Organization,
  initialState as organizationInitialState,
} from "@/store/organizationStore";
import type { OrganizationInfoFormRef } from "./OrganizationInfoForm";
import type { OrganizationAssessmentFormRef } from "./OrganizationAssessmentForm";

import models from "@/data/models.json";
import { isDomainComplete } from "@/store/utils";

type ImportedModel = {
  id: string;
  version: string;
};

interface ImportFormProps {
  organizationInfoFormRef: React.RefObject<OrganizationInfoFormRef | null>;
  organizationAssessmentFormRef: React.RefObject<OrganizationAssessmentFormRef | null>;
}

export default function ImportForm({
  organizationInfoFormRef,
  organizationAssessmentFormRef
}: ImportFormProps) {
  const { t } = useTranslation('forms');
  const { updateDomainCompletionStatus, setFormValues } = useAssessmentStore();
  const { setSelectedModel, model } = useAppStore();
  const setOrganization = useOrganizationStore(
    useShallow((state) => state.setOrganization),
  );

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  /**
   * Import model data from Excel file
   * @param workbook - The Excel workbook
   */
  const importModel = async (workbook: ExcelJS.Workbook): Promise<string> => {
    const modelSheet = workbook.getWorksheet("Import Model");
    const modelData: ImportedModel = { id: "", version: "" };

    modelSheet?.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const key = row.getCell(1).text;
        const value = row.getCell(2).text;
        if (key === "id" || key === "version") {
          modelData[key] = value;
        }
      }
    });

    const importedModel = models.find((m) => m.id === modelData.id);
    if (!importedModel) {
      throw new Error(
        t('import_model_not_found', {
          modelId: modelData.id || t('import_not_defined'),
          version: modelData.version || t('import_not_defined')
        }),
      );
    }

    setSelectedModel(importedModel.id);
    return importedModel.id;
  };

  /**
   * Import organization data from Excel file
   * @param workbook - The Excel workbook
   */
  const importOrganization = async (workbook: ExcelJS.Workbook) => {
    const orgSheet = workbook.getWorksheet("Import Organization");
    const importedOrg: Partial<Organization> = {};

    orgSheet?.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const key = row.getCell(1).text;
        const value = row.getCell(2).text;
        if (Object.keys(organizationInitialState).includes(key)) {
          importedOrg[key as keyof Organization] = value;
        }
      }
    });

    setOrganization(importedOrg);
    
    // Directly update forms to prevent circular dependency
    organizationInfoFormRef.current?.resetForm(importedOrg);
    organizationAssessmentFormRef.current?.resetForm(importedOrg);
  };

  /**
   * Import assessment data from Excel file
   * @param workbook - The Excel workbook
   */
  const importAssessment = async (workbook: ExcelJS.Workbook) => {
    const assessmentSheet = workbook.getWorksheet("Import Assessment");
    const importedAssessment: FormValues = {};

    assessmentSheet?.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const key = row.getCell(1).text;
        const answer = row.getCell(2).text;
        const flagged = row.getCell(3).text;
        const note = row.getCell(4).text;

        const lastDashIndex = key.lastIndexOf("-");
        const domainId = key.slice(0, lastDashIndex);
        const practiceId = key.slice(lastDashIndex + 1);

        importedAssessment[domainId] = {
          ...importedAssessment[domainId],
          [practiceId]: {
            answer: (Number(answer) || 0) as 0 | 1 | 2 | 3 | 4,
            flagged: flagged === "1" ? true : false,
            note: note || "",
          },
        };
      }
    });

    setFormValues(importedAssessment);

    model?.forEach((domain) => {
      updateDomainCompletionStatus(
        domain.id,
        isDomainComplete(domain.id, importedAssessment),
      );
    });
  };

  /**
   * Process uploaded file
   * @param file - The file to process
   */
  const processFile = async (file: File) => {
    setError(null);
    setSuccess(null);

    // Validate file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "xlsx") {
      setError(t('import_only_xlsx'));
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());

      // Check if required sheets exist
      const requiredSheets = [
        "Import Organization",
        "Import Assessment",
        "Import Model",
      ];
      const missingSheets = requiredSheets.filter(
        (sheet) => !workbook.getWorksheet(sheet),
      );

      if (missingSheets.length > 0) {
        setError(
          t('import_missing_sheets', { sheets: missingSheets.join(", ") }),
        );
        return;
      }

      // Import data
      await importModel(workbook);
      await importOrganization(workbook);
      await importAssessment(workbook);

      setSuccess(t('import_success'));
    } catch (error) {
      console.error("Import error:", error);
      setError(
        error instanceof Error
          ? error.message
          : t('import_error_generic'),
      );
    }
  };

  /**
   * Handle file drag over event
   * @param e - The drag event
   */
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * Handle file drag leave event
   * @param e - The drag event
   */
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * Handle file drop event
   * @param e - The drop event
   */
  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      await processFile(file);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <p className="text-sm">
          {t('import_description')}
        </p>

        <div className="grid w-full max-w-2xl gap-4">
          <div className="space-y-2">
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="file-import"
                className={`group flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-input ${
                  isDragging
                    ? "border-2 border-turkoosi bg-turkoosi/5"
                    : "bg-background bg-gray-20"
                } px-3 py-2 text-sm ring-offset-background transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-turkoosi focus-within:ring-offset-2 hover:bg-gray-50`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    document.getElementById("file-import")?.click();
                  }
                }}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                tabIndex={0}
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <Upload className="mb-4 h-8 w-8 text-gray-700 transition-colors group-hover:text-gray-800" />
                  <p className="mb-2 text-sm text-gray-700">
                    <span className="font-semibold">{t('import_select_file')}</span> {t('import_or_drag_drop')}
                  </p>
                  <p className="text-xs text-gray-600">
                    {t('import_allowed_format')}
                  </p>
                </div>
                <input
                  id="file-import"
                  type="file"
                  className="hidden"
                  accept=".xlsx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      processFile(e.target.files[0]);
                      e.target.value = ""; // Reset input
                    }
                  }}
                  aria-label="Valitse Excel-tiedosto"
                />
              </label>
            </div>
          </div>

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
    </div>
  );
}
