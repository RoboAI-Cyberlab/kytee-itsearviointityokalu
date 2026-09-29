import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';
import { z } from 'zod';

const ModelsPage = lazy(() => import('@/app/pages/ModelsPage'));

// Strict schema: reject any search parameters to prevent injection
const modelsSearchSchema = z.object({}).strict();

export const Route = createFileRoute('/models')({
  validateSearch: (search) => modelsSearchSchema.parse(search),
  component: ModelsPage,
});
