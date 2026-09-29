import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/store/appStore';
import { getModelCapabilities } from '@/store/modelCapabilities';
import type { ModelCapabilities } from '@/types/model';
import modelsData from '@/data/models.json';

export function useModelCapabilities(): ModelCapabilities {
  const selectedModel = useAppStore(useShallow((state) => state.selectedModel));
  return getModelCapabilities(selectedModel, modelsData);
}
