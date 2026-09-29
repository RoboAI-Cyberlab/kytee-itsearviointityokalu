import { lazy } from "react";
import ReactMarkdown from "react-markdown";

import { useVisiblePractice } from "@/hooks/use-visible-practice";
import { useModelCapabilities } from "@/app/utils/useModelCapabilities";

import PracticeBlock from "@/app/components/blocks/PracticeBlock";
import type { Objective, Domain } from "@/types/model";

const ObjectiveMappingBadge = lazy(
  () => import("@/app/components/badges/ObjectiveMappingBadge"),
);

const TraficomBadge = lazy(
  () => import("@/app/components/badges/TraficomBadge"),
);

/**
 * Local component for rendering description with Markdown support
 */
const DescriptionBlock = ({ description }: { description: string }) => {
  return (
    <div className="rounded-md text-sm text-foreground md:bg-gray-50 md:p-4">
      <div className="prose prose-sm max-w-none leading-5 text-foreground [&>*:not(:last-child)]:mb-4">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
    </div>
  );
};

/**
 * This component is used to display an objective block in the self-assessment form.
 */
export default function ObjectiveBlock({
  objective,
  domain,
}: {
  objective: Objective;
  domain: Domain;
}): React.ReactElement {
  const { createPracticeObserver } = useVisiblePractice();

  const capabilities = useModelCapabilities();

  return (
    <div
      key={`${domain.id}-${objective.id}`}
      className="mb-4 rounded-md bg-white p-6 shadow-sm md:p-8"
    >
      <div
        id={`${domain.id}-${objective.id}`}
        ref={(element) => {
          if (element) {
            const observer = createPracticeObserver(
              `${domain.id}-${objective.id}`,
            );
            observer(`${domain.id}-${objective.id}`, element);
          }
        }}
      >
        <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center">
          <span className="flex h-12 w-12 min-w-[3rem] items-center justify-center rounded-full bg-turkoosi text-lg font-bold text-white">
            {objective.id}
          </span>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">{objective.title}</h3>
            {capabilities.traficomBadge && (
              <TraficomBadge objective={`${domain.id}-${objective.id}`} />
            )}
            {capabilities.objectiveMappingBadge && (
              <ObjectiveMappingBadge
                objective={`${domain.id}-${objective.id}`}
              />
            )}
          </div>
        </div>

        {objective.description && (
          <DescriptionBlock description={objective.description} />
        )}
      </div>

      <div>
        {objective.practices.map((practice) => (
          <PracticeBlock
            key={practice.id}
            domainId={domain.id}
            practice={practice}
            capabilities={capabilities}
          />
        ))}
      </div>
    </div>
  );
}
