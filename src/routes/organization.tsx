import { createFileRoute } from '@tanstack/react-router';
import { lazy } from 'react';
import { z } from 'zod';

const OrganizationPage = lazy(() => import('@/app/pages/OrganizationPage'));

// Strict schema: reject any search parameters to prevent injection
const organizationSearchSchema = z.object({}).strict();

export const Route = createFileRoute('/organization')({
  validateSearch: (search) => organizationSearchSchema.parse(search),
  component: OrganizationPage,
});
