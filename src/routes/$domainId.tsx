import { createFileRoute, notFound } from '@tanstack/react-router';
import { lazy, type ComponentType } from 'react';
import { z } from 'zod';
import { useAppStore } from '@/store/appStore';
import { loadModel } from '@/store/modelLoader';
import type { Domain } from '@/types/model';

const DomainPage = lazy(() => import('@/app/pages/DomainPage'));

// Strict schema: reject any search parameters to prevent injection
const domainSearchSchema = z.object({}).strict();

// MDX document modules
const docModules = import.meta.glob<{ default: ComponentType<any> }>(
  "/src/docs/**/*.mdx",
);

export const Route = createFileRoute('/$domainId')({
  validateSearch: (search) => domainSearchSchema.parse(search),
  loader: async ({ params }) => {
    // Validate domainId format (alphanumeric, hyphens, and underscores only)
    if (params.domainId && !/^[a-z0-9_-]+$/i.test(params.domainId)) {
      console.warn(`Invalid domainId format: ${params.domainId}`);
      throw notFound();
    }

    const { selectedModel, language } = useAppStore.getState();

    const model = await loadModel(selectedModel, language);

    if (!model) {
      throw notFound();
    }

    const domain = model.find((d: Domain) => d.id.toLowerCase() === params.domainId?.toLowerCase());

    if (!domain) {
      throw notFound();
    }

    // Load MDX document in parallel
    const i18nPath = `/src/docs/${selectedModel}/${language}/${params.domainId}.mdx`;
    const flatPath = `/src/docs/${selectedModel}/${params.domainId}.mdx`;

    let mdxDocument: ComponentType<any> | null = null;

    try {
      const modulePath = docModules[i18nPath] ? i18nPath : flatPath;

      if (docModules[modulePath]) {
        const module = await docModules[modulePath]();
        mdxDocument = module.default;
      }
    } catch (err) {
      console.warn(`Failed to load MDX for ${params.domainId}:`, err);
      // MDX loading failure is non-fatal, page can still render without docs
    }

    return { domain, mdxDocument };
  },

  staleTime: 60000, // Cache for 1 minute (model can change)

  component: DomainPage,
});
