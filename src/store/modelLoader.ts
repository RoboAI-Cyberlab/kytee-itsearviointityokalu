import type { Model } from "@/types/model";

export async function loadModel(modelId: string, language: string = "fi"): Promise<Model> {
  try {
    // Use Vite's dynamic import with glob pattern for all languages
    const modules = import.meta.glob("/src/data/assessment/*/i18n/*.json", {
      eager: true,
    });
    const modelPath = `/src/data/assessment/${modelId}/i18n/${language}.json`;

    if (modelPath in modules) {
      return (modules[modelPath] as { default: Model }).default;
    }

    // Fallback to Finnish if the specified language is not found
    const fallbackPath = `/src/data/assessment/${modelId}/i18n/fi.json`;
    if (fallbackPath in modules) {
      console.warn(`Model ${modelId} in language ${language} not found, falling back to Finnish`);
      return (modules[fallbackPath] as { default: Model }).default;
    }

    // Final fallback to default model in Finnish
    const defaultPath = "/src/data/assessment/roboai/i18n/fi.json";
    if (defaultPath in modules) {
      console.warn(`Model ${modelId} not found, falling back to default`);
      return (modules[defaultPath] as { default: Model }).default;
    }

    throw new Error("Default model not found");
  } catch (error) {
    console.error(`Failed to load model ${modelId}:`, error);
    throw error;
  }
}
