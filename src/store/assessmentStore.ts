import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { getInitialFormValues } from "./utils";
import { isDomainComplete } from "./assessmentCompletion";
import type { Domain, Objective, Practice } from "@/types/model";
import { useModelStore } from "./modelStore";

export type { FormValues } from "@/types/assessment";
import type { FormValues } from "@/types/assessment";

type Type = {
  formValues: FormValues;
  domainCompletionStatus: Record<string, boolean>;
};

type Actions = {
  setFormValues: (values: FormValues) => void;
  clearAnswers: () => void;
  updateDomainCompletionStatus: (domainId: string, isComplete: boolean) => void;
  setAnswer: (domainId: string, practiceId: string, answer: number) => void;
  setNote: (domainId: string, practiceId: string, note: string) => void;
  setFlagged: (domainId: string, practiceId: string, flagged: boolean) => void;
  toggleFlagged: (domainId: string, practiceId: string) => void;
};

const createInitialFormValues = () => {
  const model = useModelStore.getState().model ?? [];
  const formValues: FormValues = {};

  model.forEach((domain: Domain) => {
    formValues[domain.id] = {};
    domain.objectives.forEach((objective: Objective) => {
      objective.practices.forEach((practice: Practice) => {
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

export const useAssessmentStore = create<Type & Actions>()(
  persist(
    (set) => ({
      formValues: createInitialFormValues(),
      domainCompletionStatus: {},

      // Actions
      setFormValues: (values: FormValues) => {
        set({ formValues: values });
      },

      clearAnswers: () => {
        // Remove the assessment-storage item
        localStorage.removeItem("assessment-storage");

        // Then update the state with initial values
        set(() => {
          const initialValues = getInitialFormValues();
          const currentModel = useModelStore.getState().model ?? [];
          const resetDomainStatus = Object.fromEntries(
            currentModel.map((domain) => [domain.id, false]),
          );

          return {
            formValues: initialValues,
            domainCompletionStatus: resetDomainStatus,
          };
        });
      },

      updateDomainCompletionStatus: (domainId, isComplete) =>
        set((state) => ({
          domainCompletionStatus: {
            ...state.domainCompletionStatus,
            [domainId]: isComplete,
          },
        })),

      setAnswer: (domainId, practiceId, answer) =>
        set((state) => {
          const newFormValues = {
            ...state.formValues,
            [domainId]: {
              ...state.formValues[domainId],
              [practiceId]: {
                ...state.formValues[domainId]?.[practiceId],
                answer: answer as 0 | 1 | 2 | 3 | 4,
              },
            },
          };

          const isDomainNowComplete = isDomainComplete(
            domainId,
            newFormValues as FormValues,
          );

          return {
            formValues: newFormValues,
            domainCompletionStatus: {
              ...state.domainCompletionStatus,
              [domainId]: isDomainNowComplete,
            },
          };
        }),

      setNote: (domainId, practiceId, note) =>
        set((state) => ({
          formValues: {
            ...state.formValues,
            [domainId]: {
              ...state.formValues[domainId],
              [practiceId]: {
                ...state.formValues[domainId]?.[practiceId],
                note,
              },
            },
          },
        })),

      toggleFlagged: (domainId, practiceId) =>
        set((state) => ({
          formValues: {
            ...state.formValues,
            [domainId]: {
              ...state.formValues[domainId],
              [practiceId]: {
                ...state.formValues[domainId]?.[practiceId],
                flagged: !state.formValues[domainId]?.[practiceId]?.flagged,
              },
            },
          },
        })),

      setFlagged: (domainId, practiceId, flagged) =>
        set((state) => ({
          formValues: {
            ...state.formValues,
            [domainId]: {
              ...state.formValues[domainId],
              [practiceId]: {
                ...state.formValues[domainId]?.[practiceId],
                flagged,
              },
            },
          },
        })),
    }),
    {
      name: "assessment-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
