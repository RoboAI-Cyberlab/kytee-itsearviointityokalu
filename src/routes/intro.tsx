import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';
import { z } from 'zod';

const IntroPage = lazy(() => import('@/app/pages/IntroPage'));

// Strict schema: reject any search parameters to prevent injection
const introSearchSchema = z.object({}).strict();

export const Route = createFileRoute('/intro')({
  validateSearch: (search) => introSearchSchema.parse(search),
  component: IntroPage,
});
