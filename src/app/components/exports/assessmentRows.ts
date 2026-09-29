import type { FormValues } from "@/types/assessment";
import type { Domain } from "@/types/model";

export interface AssessmentRow {
  domainId: string;
  domainTitle: string;
  practiceId: string;
  practiceTitle: string;
  answer: number;
  flagged: boolean;
  note: string;
}

export function deriveAssessmentRows(formValues: FormValues, model: Domain[]): AssessmentRow[] {
  const rows: AssessmentRow[] = [];

  for (const domain of model) {
    for (const objective of domain.objectives) {
      for (const practice of objective.practices) {
        const state = formValues[domain.id]?.[practice.id];
        rows.push({
          domainId: domain.id,
          domainTitle: domain.title,
          practiceId: practice.id,
          practiceTitle: practice.title,
          answer: state?.answer ?? 0,
          flagged: state?.flagged ?? false,
          note: state?.note ?? '',
        });
      }
    }
  }

  return rows;
}
