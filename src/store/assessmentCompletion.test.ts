import { describe, it, expect } from 'vitest';
import { isDomainComplete, isAssessmentComplete, getCompletionSummary } from './assessmentCompletion';
import type { FormValues } from '@/types/assessment';
import type { Domain } from '@/types/model';

const p = (answer: 0 | 1 | 2 | 3 | 4) => ({ answer, note: '', flagged: false });

const domain = (id: string, practiceIds: string[]): Domain => ({
  id,
  title: id,
  short: id,
  description: '',
  objectives: [{ id: 'OBJ', title: '', description: '', practices: practiceIds.map((pid) => ({ id: pid, title: pid })) }],
});

// ─── isDomainComplete ────────────────────────────────────────────────────────

describe('isDomainComplete()', () => {
  it('returns true when all practices are answered', () => {
    const fv: FormValues = { D1: { P1: p(1), P2: p(4) } };
    expect(isDomainComplete('D1', fv)).toBe(true);
  });

  it('returns false when any practice has answer 0', () => {
    const fv: FormValues = { D1: { P1: p(4), P2: p(0) } };
    expect(isDomainComplete('D1', fv)).toBe(false);
  });

  it('returns false when all practices have answer 0', () => {
    const fv: FormValues = { D1: { P1: p(0), P2: p(0) } };
    expect(isDomainComplete('D1', fv)).toBe(false);
  });

  it('returns true for empty domain (vacuous)', () => {
    expect(isDomainComplete('D1', { D1: {} })).toBe(true);
  });

  it('is not affected by other domains', () => {
    const fv: FormValues = { D1: { P1: p(3) }, D2: { P1: p(0) } };
    expect(isDomainComplete('D1', fv)).toBe(true);
    expect(isDomainComplete('D2', fv)).toBe(false);
  });
});

// ─── isAssessmentComplete ────────────────────────────────────────────────────

describe('isAssessmentComplete()', () => {
  it('returns true when all domains are complete', () => {
    const fv: FormValues = { D1: { P1: p(2) }, D2: { P1: p(3) } };
    const model = [domain('D1', ['P1']), domain('D2', ['P1'])];
    expect(isAssessmentComplete(fv, model)).toBe(true);
  });

  it('returns false when any domain is incomplete', () => {
    const fv: FormValues = { D1: { P1: p(2) }, D2: { P1: p(0) } };
    const model = [domain('D1', ['P1']), domain('D2', ['P1'])];
    expect(isAssessmentComplete(fv, model)).toBe(false);
  });

  it('returns true for empty model (vacuous)', () => {
    expect(isAssessmentComplete({}, [])).toBe(true);
  });

  it('returns false when a domain has no entries in formValues', () => {
    const fv: FormValues = { D1: { P1: p(2) } };
    const model = [domain('D1', ['P1']), domain('D2', ['P1'])];
    expect(isAssessmentComplete(fv, model)).toBe(false);
  });
});

// ─── getCompletionSummary ────────────────────────────────────────────────────

describe('getCompletionSummary()', () => {
  it('returns correct counts and ratio', () => {
    const fv: FormValues = { D1: { P1: p(3), P2: p(0) } };
    const model = [domain('D1', ['P1', 'P2'])];
    const summary = getCompletionSummary(fv, model);
    expect(summary.answered).toBe(1);
    expect(summary.total).toBe(2);
    expect(summary.ratio).toBeCloseTo(0.5);
  });

  it('returns ratio 0 (not NaN) for zero practices', () => {
    const summary = getCompletionSummary({}, []);
    expect(summary.total).toBe(0);
    expect(summary.ratio).toBe(0);
  });

  it('returns ratio 1 for fully complete assessment', () => {
    const fv: FormValues = { D1: { P1: p(2), P2: p(4) } };
    const model = [domain('D1', ['P1', 'P2'])];
    expect(getCompletionSummary(fv, model).ratio).toBe(1);
  });
});
