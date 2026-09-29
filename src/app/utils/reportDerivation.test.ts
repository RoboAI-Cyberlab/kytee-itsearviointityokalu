import { describe, it, expect } from 'vitest';
import { deriveAssessmentReport } from './reportDerivation';
import type { FormValues } from '@/types/assessment';
import type { Domain } from '@/types/model';

const p = (answer: 0 | 1 | 2 | 3 | 4) => ({ answer, note: '', flagged: false });

const domain = (id: string, practiceIds: string[]): Domain => ({
  id,
  title: `Title ${id}`,
  short: `S${id}`,
  description: '',
  objectives: [{
    id: 'OBJ',
    title: '',
    description: '',
    practices: practiceIds.map((pid) => ({ id: pid, title: `Practice ${pid}` })),
  }],
});

describe('deriveAssessmentReport()', () => {
  describe('domain data', () => {
    it('includes one entry per domain', () => {
      const model = [domain('D1', ['P1']), domain('D2', ['P1'])];
      const fv: FormValues = { D1: { P1: p(4) }, D2: { P1: p(2) } };
      const report = deriveAssessmentReport(fv, model);
      expect(report.domains).toHaveLength(2);
    });

    it('carries domain id, title, and short from model', () => {
      const model = [domain('D1', ['P1'])];
      const fv: FormValues = { D1: { P1: p(2) } };
      const [dom] = deriveAssessmentReport(fv, model).domains;
      expect(dom.id).toBe('D1');
      expect(dom.title).toBe('Title D1');
      expect(dom.short).toBe('SD1');
    });

    it('computes answered and total counts correctly', () => {
      const model = [domain('D1', ['P1', 'P2', 'P3'])];
      const fv: FormValues = { D1: { P1: p(2), P2: p(0), P3: p(4) } };
      const [dom] = deriveAssessmentReport(fv, model).domains;
      expect(dom.answered).toBe(2);
      expect(dom.total).toBe(3);
    });
  });

  describe('maturity ratio (score-based: sum / count×4)', () => {
    it('ratio is 1 when all practices answered at max (4)', () => {
      const model = [domain('D1', ['P1', 'P2'])];
      const fv: FormValues = { D1: { P1: p(4), P2: p(4) } };
      const [dom] = deriveAssessmentReport(fv, model).domains;
      expect(dom.maturityRatio).toBe(1);
    });

    it('ratio is 0 when all practices unanswered', () => {
      const model = [domain('D1', ['P1', 'P2'])];
      const fv: FormValues = { D1: { P1: p(0), P2: p(0) } };
      const [dom] = deriveAssessmentReport(fv, model).domains;
      expect(dom.maturityRatio).toBe(0);
    });

    it('ratio is sum(answers) / (count × 4)', () => {
      const model = [domain('D1', ['P1', 'P2'])];
      // answers: 2 + 4 = 6; max = 2 × 4 = 8; ratio = 0.75
      const fv: FormValues = { D1: { P1: p(2), P2: p(4) } };
      const [dom] = deriveAssessmentReport(fv, model).domains;
      expect(dom.maturityRatio).toBeCloseTo(0.75);
    });

    it('ratio is 0 (not NaN) for domain with no practices', () => {
      const emptyDomain: Domain = { id: 'D1', title: 'T', short: 'S', description: '', objectives: [] };
      const report = deriveAssessmentReport({}, [emptyDomain]);
      expect(report.domains[0].maturityRatio).toBe(0);
    });
  });

  describe('best and worst domain', () => {
    it('bestDomain has highest maturity ratio', () => {
      const model = [domain('D1', ['P1']), domain('D2', ['P1'])];
      const fv: FormValues = { D1: { P1: p(4) }, D2: { P1: p(1) } };
      expect(deriveAssessmentReport(fv, model).bestDomain?.id).toBe('D1');
    });

    it('worstDomain has lowest maturity ratio', () => {
      const model = [domain('D1', ['P1']), domain('D2', ['P1'])];
      const fv: FormValues = { D1: { P1: p(4) }, D2: { P1: p(1) } };
      expect(deriveAssessmentReport(fv, model).worstDomain?.id).toBe('D2');
    });

    it('returns null for both when model is empty', () => {
      const report = deriveAssessmentReport({}, []);
      expect(report.bestDomain).toBeNull();
      expect(report.worstDomain).toBeNull();
    });
  });

  describe('answer distribution', () => {
    it('counts practices by answer level 1–4', () => {
      const model = [domain('D1', ['P1', 'P2', 'P3', 'P4'])];
      const fv: FormValues = { D1: { P1: p(1), P2: p(2), P3: p(4), P4: p(4) } };
      const dist = deriveAssessmentReport(fv, model).answerDistribution;
      expect(dist[1]).toBe(1);
      expect(dist[2]).toBe(1);
      expect(dist[3]).toBe(0);
      expect(dist[4]).toBe(2);
    });

    it('unanswered practices (0) are not counted in distribution', () => {
      const model = [domain('D1', ['P1'])];
      const fv: FormValues = { D1: { P1: p(0) } };
      const dist = deriveAssessmentReport(fv, model).answerDistribution;
      expect(Object.values(dist).reduce((a, b) => a + b, 0)).toBe(0);
    });
  });

  describe('overall ratio', () => {
    it('overall ratio is score-based across all domains', () => {
      // D1: P1=4 (max), D2: P1=0 (min) → sum=4, max=8 → ratio=0.5
      const model = [domain('D1', ['P1']), domain('D2', ['P1'])];
      const fv: FormValues = { D1: { P1: p(4) }, D2: { P1: p(0) } };
      expect(deriveAssessmentReport(fv, model).overallRatio).toBeCloseTo(0.5);
    });

    it('overall ratio is 0 (not NaN) for empty model', () => {
      expect(deriveAssessmentReport({}, []).overallRatio).toBe(0);
    });
  });
});
