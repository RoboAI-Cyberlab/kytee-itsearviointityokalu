import { createFileRoute, Navigate } from '@tanstack/react-router';
import { z } from 'zod';

// Strict schema: reject any search parameters to prevent injection
const indexSearchSchema = z.object({}).strict();

export const Route = createFileRoute('/')({
  validateSearch: (search) => indexSearchSchema.parse(search),
  component: () => <Navigate to="/intro" replace />,
});
