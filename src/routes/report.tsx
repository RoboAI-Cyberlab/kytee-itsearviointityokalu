import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';
import { z } from 'zod';

const ReportPage = lazy(() => import('@/app/pages/ReportPage'));

const reportSearchSchema = z.object({
  filter: z.enum(['all', 'weak', 'strong']).optional().catch('all'),
  sort: z.enum(['name', 'score', 'implementation']).optional().catch('name'),
});

export const Route = createFileRoute('/report')({
  validateSearch: (search) => reportSearchSchema.parse(search),
  component: ReportPage,
});
