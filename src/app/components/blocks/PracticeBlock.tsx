import { lazy } from "react";
import { useShallow } from "zustand/react/shallow";

import type { Practice, ModelCapabilities } from "@/types/model";
import { useVisiblePractice } from "@/hooks/use-visible-practice";

import DocumentationButtonBlock from "@/app/components/blocks/DocumentationButtonBlock";
import PracticeTitleBlock from "@/app/components/blocks/PracticeTitleBlock";
import NotesBlock from "@/app/components/blocks/NotesBlock";
import AnswerOptionsBlock from "@/app/components/blocks/AnswerOptionsBlock";
import { useAssessmentStore } from "@/store/assessmentStore";

const PracticeMetaBlock = lazy(
  () => import("@/app/components/blocks/PracticeMetaBlock"),
);

export default function PracticeBlock({
  practice,
  capabilities,
  domainId,
}: {
  practice: Practice;
  capabilities: ModelCapabilities;
  domainId: string;
}): React.ReactElement {
  const { createPracticeObserver } = useVisiblePractice();
  const { setAnswer } = useAssessmentStore();

  const answer = useAssessmentStore(
    useShallow((state) => state.formValues[domainId]?.[practice.id]?.answer),
  );

  const handleAnswerChange = (value: number) => {
    setAnswer(domainId, practice.id, value);
  };

  return (
    <div
      className="flex flex-col items-start gap-4 pt-8 md:flex-row"
      key={`${domainId}-${practice.id}`}
      id={`${domainId}-${practice.id}`}
      ref={(element) => {
        if (element) {
          const observer = createPracticeObserver(`${domainId}-${practice.id}`);
          observer(`${domainId}-${practice.id}`, element);
        }
      }}
    >
      <div className="flex items-center justify-center gap-4 md:flex-col">
        <span className="flex h-12 w-12 min-w-[3rem] items-center justify-center rounded-full bg-gray-700 text-lg font-bold text-white">
          {practice.id}
        </span>
        <DocumentationButtonBlock
          domainId={domainId}
          anchor={`${domainId}-${practice.id}`}
        />
      </div>

      <div className="flex w-full grow flex-col">
        <PracticeTitleBlock title={practice.title} />
        {capabilities.practiceMeta && (
          <PracticeMetaBlock practice={practice} domainId={domainId} />
        )}
        <AnswerOptionsBlock
          capabilities={capabilities}
          domainId={domainId}
          practice={practice}
          answer={answer}
          onAnswerChange={handleAnswerChange}
        />
        <NotesBlock
          domainId={domainId}
          practiceId={practice.id}
        />
      </div>
    </div>
  );
}
