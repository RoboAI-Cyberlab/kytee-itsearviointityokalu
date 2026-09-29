import { CircleCheckBig, CircleX, CircleAlert } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import type { FormValues } from "@/types/assessment";
import i18n from "@/i18n";

/**
 * Answer options for the self assessment (with translations)
 */
export const getAnswerOptions = () => [
  {
    value: 1,
    color: "text-red-500",
    fillColor: "fill-red-50",
    bgColor: "bg-red-50",
    ringColor: "ring-red-200",
    icon: CircleX,
    title: i18n.t('answer_not_implemented', { ns: 'common' }),
  },
  {
    value: 2,
    color: "text-orange-600",
    fillColor: "fill-orange-50",
    bgColor: "bg-orange-50",
    ringColor: "ring-orange-200",
    icon: CircleAlert,
    title: i18n.t('answer_partially_implemented', { ns: 'common' }),
  },
  {
    value: 3,
    color: "text-[#1f9e93]",
    fillColor: "fill-[#f7fdfb]",
    bgColor: "bg-[#f7fdfb]",
    ringColor: "ring-[#cef3e7]",
    icon: CircleCheckBig,
    title: i18n.t('answer_mostly_implemented', { ns: 'common' }),
  },
  {
    value: 4,
    color: "text-turkoosi",
    fillColor: "fill-[#1a847b0d]",
    bgColor: "bg-[#1a847b0d]",
    ringColor: "ring-[#bddbd5]",
    icon: CircleCheckBig,
    title: i18n.t('answer_fully_implemented', { ns: 'common' }),
  },
];

/**
 * Counts answered practices (answer > 0) from form values
 */
export const getAnsweredPractices = (formValues: FormValues) => {
  return Object.values(formValues).reduce((total, domain) => {
    return (
      total +
      Object.values(domain).filter((practice) => practice.answer > 0).length
    );
  }, 0);
};

/**
 * Counts all practices in a specific domain
 * @param domainId - The id of the domain
 * @returns The number of practices in the domain
 */
export const getDomainPractices = (domainId: string) => {
  const { model } = useAppStore.getState();
  if (!model || !domainId) return 0;

  const domain = model.find((d) => d.id === domainId);
  if (!domain) return 0;

  return domain.objectives.reduce((total, objective) => {
    return total + (objective?.practices?.length ?? 0);
  }, 0);
};

/**
 * Counts answered practices (answer > 0) in a specific domain
 * @param formValues - The form values to count from
 * @param domainId - The id of the domain
 * @returns The number of answered practices in the domain
 */
export const getAnsweredDomainPractices = (
  formValues: FormValues,
  domainId: string,
) => {
  if (!formValues[domainId]) return 0;

  return Object.values(formValues[domainId]).filter(
    (practice) => practice.answer > 0,
  ).length;
};

/**
 * Creates initial form values for a specific model
 */
const createEmptyFormValuesForModel = (): FormValues => {
  const { model } = useAppStore.getState();
  if (!model) return {};

  const formValues: FormValues = {};

  model.forEach((domain) => {
    formValues[domain.id] = {};
    domain.objectives.forEach((objective) => {
      objective.practices.forEach((practice) => {
        formValues[domain.id][practice.id] = {
          answer: 0,
          note: "",
          flagged: false,
        };
      });
    });
  });

  return formValues;
};

/**
 * Returns initial form values for store
 */
export const getInitialFormValues = (): FormValues => {
  const formValues = createEmptyFormValuesForModel();
  return formValues;
};

/**
 * Checks if a domain is complete
 */
export const isDomainComplete = (
  domainId: string,
  formValues: FormValues,
): boolean => {
  const practices = formValues[domainId];
  return Object.values(practices).every((practice) => practice.answer > 0);
};
