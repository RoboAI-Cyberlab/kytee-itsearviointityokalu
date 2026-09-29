import { describe, it, expect, vi } from 'vitest';
import { createModelStore } from './modelStore';
import type { Model } from '@/types/model';

const mockModel: Model = [
  {
    id: 'DOM1',
    title: 'Domain 1',
    short: 'D1',
    description: '',
    objectives: [],
  },
];

const mockLoader = vi.fn().mockResolvedValue(mockModel);

describe('createModelStore()', () => {
  describe('initial state', () => {
    it('starts with status ready', () => {
      const store = createModelStore(mockLoader);
      expect(store.getState().status).toBe('ready');
    });

    it('starts with a non-null model', () => {
      const store = createModelStore(mockLoader);
      expect(store.getState().model).not.toBeNull();
    });

    it('starts with no error', () => {
      const store = createModelStore(mockLoader);
      expect(store.getState().error).toBeNull();
    });
  });

  describe('successful load', () => {
    it('transitions to ready with the loaded model', async () => {
      const store = createModelStore(mockLoader);
      await store.getState().load('roboai', 'fi');
      expect(store.getState().status).toBe('ready');
      expect(store.getState().model).toBe(mockModel);
    });

    it('calls loader with given modelId and language', async () => {
      const loader = vi.fn().mockResolvedValue(mockModel);
      const store = createModelStore(loader);
      await store.getState().load('roboai', 'en');
      expect(loader).toHaveBeenCalledWith('roboai', 'en');
    });

    it('clears any previous error on successful load', async () => {
      const failLoader = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue(mockModel);
      const store = createModelStore(failLoader);
      await store.getState().load('x', 'fi').catch(() => {});
      expect(store.getState().status).toBe('error');
      await store.getState().load('x', 'fi');
      expect(store.getState().error).toBeNull();
    });
  });

  describe('failed load', () => {
    it('transitions to error status', async () => {
      const failLoader = vi.fn().mockRejectedValue(new Error('not found'));
      const store = createModelStore(failLoader);
      await store.getState().load('bad', 'fi').catch(() => {});
      expect(store.getState().status).toBe('error');
    });

    it('sets error message', async () => {
      const failLoader = vi.fn().mockRejectedValue(new Error('not found'));
      const store = createModelStore(failLoader);
      await store.getState().load('bad', 'fi').catch(() => {});
      expect(store.getState().error).toBe('Error: not found');
    });

    it('preserves the previous model on failure', async () => {
      const loader = vi.fn()
        .mockResolvedValueOnce(mockModel)
        .mockRejectedValue(new Error('fail'));
      const store = createModelStore(loader);
      await store.getState().load('roboai', 'fi');
      const modelBeforeFailure = store.getState().model;
      await store.getState().load('bad', 'fi').catch(() => {});
      expect(store.getState().model).toBe(modelBeforeFailure);
    });
  });
});
