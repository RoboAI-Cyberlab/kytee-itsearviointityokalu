import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAssessmentStore } from "@/store/assessmentStore";
import { useAppStore } from "@/store/appStore";
import { deriveAssessmentReport, type AssessmentReportData } from "./reportDerivation";

export function useReportData(): AssessmentReportData {
  const formValues = useAssessmentStore(useShallow((state) => state.formValues));
  const model = useAppStore((state) => state.model);

  return useMemo(
    () => deriveAssessmentReport(formValues, model ?? []),
    [formValues, model],
  );
}
