import { describe, it, expect } from 'vitest';
import { getModelCapabilities } from './modelCapabilities';
import type { SelectedModel } from '@/types/model';

const models: SelectedModel[] = [
  {
    id: 'plain',
    name: 'Plain',
    version: '1.0',
    author: 'test',
    practices: 66,
    capabilities: {
      objectiveMappingBadge: false,
      traficomBadge: false,
      compactAnswerLayout: false,
      practiceMeta: false,
    },
  },
  {
    id: 'full',
    name: 'Full',
    version: '1.0',
    author: 'test',
    practices: 383,
    capabilities: {
      objectiveMappingBadge: true,
      traficomBadge: true,
      compactAnswerLayout: true,
      practiceMeta: true,
    },
  },
];

describe('getModelCapabilities()', () => {
  it('returns all-false capabilities for unknown model id', () => {
    const caps = getModelCapabilities('unknown', models);
    expect(Object.values(caps).every((v) => v === false)).toBe(true);
  });

  it('returns the capabilities declared by the model', () => {
    const caps = getModelCapabilities('full', models);
    expect(Object.values(caps).every((v) => v === true)).toBe(true);
  });

  it('does not leak capabilities between models', () => {
    const caps = getModelCapabilities('plain', models);
    expect(Object.values(caps).every((v) => v === false)).toBe(true);
  });
});
