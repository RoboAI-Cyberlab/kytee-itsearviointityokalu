import { create } from 'zustand';
import type { Model } from '@/types/model';
import defaultModel from '@/data/assessment/roboai/i18n/fi.json';
import { loadModel } from './modelLoader';

type LoaderFn = (modelId: string, language: string) => Promise<Model>;

interface ModelStoreState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  model: Model | null;
  error: string | null;
  load: (modelId: string, language: string) => Promise<void>;
}

export const createModelStore = (loader: LoaderFn = loadModel) =>
  create<ModelStoreState>()((set, get) => ({
    status: 'ready',
    model: defaultModel as Model,
    error: null,

    load: async (modelId: string, language: string) => {
      set({ status: 'loading', error: null });
      try {
        const model = await loader(modelId, language);
        set({ status: 'ready', model });
      } catch (err) {
        set({ status: 'error', error: String(err), model: get().model });
      }
    },
  }));

export const useModelStore = createModelStore();
