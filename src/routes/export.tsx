import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';
import { z } from 'zod';

const ExportPage = lazy(() => import('@/app/pages/ExportPage'));

// Strict schema: reject any search parameters to prevent injection
const exportSearchSchema = z.object({}).strict();

export const Route = createFileRoute('/export')({
  validateSearch: (search) => exportSearchSchema.parse(search),
  component: ExportPage,
});
