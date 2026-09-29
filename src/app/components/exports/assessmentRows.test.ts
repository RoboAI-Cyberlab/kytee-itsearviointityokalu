import { describe, it, expect } from 'vitest';
import { deriveAssessmentRows } from './assessmentRows';
import type { FormValues } from '@/types/assessment';
import type { Domain } from '@/types/model';

const p = (answer: 0 | 1 | 2 | 3 | 4, note = '', flagged = false) => ({ answer, note, flagged });

const domain = (id: string, practiceIds: string[]): Domain => ({
  id,
  title: `Title ${id}`,
  short: id,
  description: '',
  objectives: [{
    id: 'OBJ',
    title: '',
    description: '',
    practices: practiceIds.map((pid) => ({ id: pid, title: `Practice ${pid}` })),
  }],
});

describe('deriveAssessmentRows()', () => {
  it('produces one row per practice', () => {
    const fv: FormValues = { D1: { P1: p(2), P2: p(3) } };
    const model = [domain('D1', ['P1', 'P2'])];
    expect(deriveAssessmentRows(fv, model)).toHaveLength(2);
  });

  it('row contains correct domain and practice ids', () => {
    const fv: FormValues = { D1: { P1: p(1) } };
    const model = [domain('D1', ['P1'])];
    const [row] = deriveAssessmentRows(fv, model);
    expect(row.domainId).toBe('D1');
    expect(row.practiceId).toBe('P1');
  });

  it('domain and practice titles come from model, not formValues', () => {
    const fv: FormValues = { D1: { P1: p(2) } };
    const model = [domain('D1', ['P1'])];
    const [row] = deriveAssessmentRows(fv, model);
    expect(row.domainTitle).toBe('Title D1');
    expect(row.practiceTitle).toBe('Practice P1');
  });

  it('unanswered practice (answer 0) is included with answer 0', () => {
    const fv: FormValues = { D1: { P1: p(0) } };
    const model = [domain('D1', ['P1'])];
    const [row] = deriveAssessmentRows(fv, model);
    expect(row.answer).toBe(0);
  });

  it('preserves note and flagged values', () => {
    const fv: FormValues = { D1: { P1: p(3, 'my note', true) } };
    const model = [domain('D1', ['P1'])];
    const [row] = deriveAssessmentRows(fv, model);
    expect(row.note).toBe('my note');
    expect(row.flagged).toBe(true);
  });

  it('produces rows across multiple domains in model order', () => {
    const fv: FormValues = { D1: { P1: p(1) }, D2: { P1: p(2) } };
    const model = [domain('D1', ['P1']), domain('D2', ['P1'])];
    const rows = deriveAssessmentRows(fv, model);
    expect(rows.map((r) => r.domainId)).toEqual(['D1', 'D2']);
  });

  it('falls back to answer 0 for practices missing from formValues', () => {
    const fv: FormValues = {};
    const model = [domain('D1', ['P1'])];
    const [row] = deriveAssessmentRows(fv, model);
    expect(row.answer).toBe(0);
    expect(row.note).toBe('');
    expect(row.flagged).toBe(false);
  });

  it('returns empty array for empty model', () => {
    expect(deriveAssessmentRows({}, [])).toHaveLength(0);
  });
});
