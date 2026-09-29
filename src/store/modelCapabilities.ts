import type { ModelCapabilities, SelectedModel } from '@/types/model';

const DEFAULT_CAPABILITIES: ModelCapabilities = {
  objectiveMappingBadge: false,
  traficomBadge: false,
  compactAnswerLayout: false,
  practiceMeta: false,
};

export function getModelCapabilities(
  modelId: string,
  models: SelectedModel[],
): ModelCapabilities {
  return models.find((m) => m.id === modelId)?.capabilities ?? DEFAULT_CAPABILITIES;
}
