import type { FormValues } from "@/types/assessment";
import type { Domain } from "@/types/model";

interface PracticeReportData {
  id: string;
  title: string;
  answer: number;
  flagged: boolean;
  note: string;
}

export interface DomainReportData {
  id: string;
  title: string;
  short: string;
  maturityRatio: number;
  answered: number;
  total: number;
  practices: PracticeReportData[];
}

export interface AssessmentReportData {
  domains: DomainReportData[];
  bestDomain: DomainReportData | null;
  worstDomain: DomainReportData | null;
  answerDistribution: Record<1 | 2 | 3 | 4, number>;
  overallAnswered: number;
  overallTotal: number;
  overallRatio: number;
}

export function deriveAssessmentReport(
  formValues: FormValues,
  model: Domain[],
): AssessmentReportData {
  const distribution: Record<1 | 2 | 3 | 4, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  let overallScore = 0;
  let overallMax = 0;
  let overallAnswered = 0;

  const domains: DomainReportData[] = model.map((domain) => {
    let domainScore = 0;
    let domainMax = 0;
    let domainAnswered = 0;

    const practices: PracticeReportData[] = domain.objectives.flatMap((obj) =>
      obj.practices.map((practice) => {
        const state = formValues[domain.id]?.[practice.id];
        const answer = state?.answer ?? 0;

        domainMax += 4;
        overallMax += 4;
        if (answer > 0) {
          domainScore += answer;
          domainAnswered++;
          overallScore += answer;
          overallAnswered++;
          if (answer >= 1 && answer <= 4) {
            distribution[answer as 1 | 2 | 3 | 4]++;
          }
        }

        return {
          id: practice.id,
          title: practice.title,
          answer,
          flagged: state?.flagged ?? false,
          note: state?.note ?? "",
        };
      }),
    );

    return {
      id: domain.id,
      title: domain.title,
      short: domain.short,
      maturityRatio: domainMax === 0 ? 0 : domainScore / domainMax,
      answered: domainAnswered,
      total: practices.length,
      practices,
    };
  });

  const sorted = [...domains].sort((a, b) => b.maturityRatio - a.maturityRatio);

  return {
    domains,
    bestDomain: sorted.length > 0 ? sorted[0] : null,
    worstDomain: sorted.length > 0 ? sorted[sorted.length - 1] : null,
    answerDistribution: distribution,
    overallAnswered,
    overallTotal: domains.reduce((sum, d) => sum + d.total, 0),
    overallRatio: overallMax === 0 ? 0 : overallScore / overallMax,
  };
}
