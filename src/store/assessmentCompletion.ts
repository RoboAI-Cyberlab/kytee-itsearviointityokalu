import type { FormValues } from "@/types/assessment";
import type { Domain } from "@/types/model";

export interface CompletionSummary {
  answered: number;
  total: number;
  ratio: number;
}

export function isDomainComplete(domainId: string, formValues: FormValues): boolean {
  const practices = formValues[domainId];
  if (!practices) return false;
  return Object.values(practices).every((p) => p.answer > 0);
}

export function isAssessmentComplete(formValues: FormValues, model: Domain[]): boolean {
  return model.every((domain) => isDomainComplete(domain.id, formValues));
}

export function getCompletionSummary(formValues: FormValues, model: Domain[]): CompletionSummary {
  let answered = 0;
  let total = 0;

  for (const domain of model) {
    for (const objective of domain.objectives) {
      for (const practice of objective.practices) {
        total++;
        if ((formValues[domain.id]?.[practice.id]?.answer ?? 0) > 0) answered++;
      }
    }
  }

  return { answered, total, ratio: total === 0 ? 0 : answered / total };
}
