import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';
import { z } from 'zod';

const DeletePage = lazy(() => import('@/app/pages/DeletePage'));

// Strict schema: reject any search parameters to prevent injection
const deleteSearchSchema = z.object({}).strict();

export const Route = createFileRoute('/delete')({
  validateSearch: (search) => deleteSearchSchema.parse(search),
  component: DeletePage,
});
