import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useModelStore } from "./modelStore";
import type { Model } from "../types/model";

// Whitelist of allowed models and languages for security
const ALLOWED_MODELS = ["roboai"] as const;
const ALLOWED_LANGUAGES = ["fi", "en", "sv"] as const;

// Type guards for validation
const isValidModel = (model: string): model is typeof ALLOWED_MODELS[number] => {
  return ALLOWED_MODELS.includes(model as typeof ALLOWED_MODELS[number]);
};

const isValidLanguage = (language: string): language is typeof ALLOWED_LANGUAGES[number] => {
  return ALLOWED_LANGUAGES.includes(language as typeof ALLOWED_LANGUAGES[number]);
};

interface AppState {
  sidebarOpen: boolean;
  language: string;
  selectedModel: string;
  currentPractice: string;
  model: Model | null;
  textSize: number;
  setLanguage: (language: string) => void;
  setSelectedModel: (model: string) => void;
  setCurrentPractice: (practice: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setTextSize: (size: number) => void;
  clearAppState: () => void;
}

const initialState = {
  sidebarOpen: true,
  currentPractice: "",
  language: "fi",
  selectedModel: "roboai",
  textSize: 1,
  model: useModelStore.getState().model,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setLanguage: async (language: string) => {
        if (!isValidLanguage(language)) {
          console.warn(`Invalid language "${language}". Falling back to default "fi".`);
          language = "fi";
        }

        const { selectedModel } = get();
        await useModelStore.getState().load(selectedModel, language);

        set({
          language,
          model: useModelStore.getState().model,
        });
      },
      setSelectedModel: async (model: string) => {
        if (!isValidModel(model)) {
          console.warn(`Invalid model "${model}". Falling back to default "roboai".`);
          model = "roboai";
        }

        const { language } = get();
        await useModelStore.getState().load(model, language);

        set({
          selectedModel: model,
          model: useModelStore.getState().model,
        });
      },
      setCurrentPractice: (practice: string) =>
        set({ currentPractice: practice }),
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      setTextSize: (size: number) => set({ textSize: size }),
      clearAppState: () => {
        localStorage.removeItem("app-storage");
        set(initialState);
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return async (state) => {
          if (state) {
            if (!isValidLanguage(state.language)) {
              console.warn(`Invalid persisted language "${state.language}". Resetting to "fi".`);
              state.language = "fi";
            }

            if (!isValidModel(state.selectedModel)) {
              console.warn(`Invalid persisted model "${state.selectedModel}". Resetting to "roboai".`);
              state.selectedModel = "roboai";
            }

            await useModelStore.getState().load(state.selectedModel, state.language);
            state.model = useModelStore.getState().model;
          }
        };
      },
    },
  ),
);
