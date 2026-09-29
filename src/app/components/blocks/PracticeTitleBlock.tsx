import { useMemo } from "react";
import glossary from "@/data/glossary.json";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Add TypeScript interface for glossary data
interface GlossaryTerm {
  term: string;
  match: string[];
  definition: string;
}
export default function PracticeTitleBlock({ title }: { title: string }) {
  // Memoize the processed title to avoid unnecessary re-rendering
  const processedTitle = useMemo(
    () => highlightTermsWithTooltip(title),
    [title],
  );

  function highlightTermsWithTooltip(text: string) {
    const words = text.split(/\s+/);

    return words.map((word, index) => {
      const punctuationBefore = word.match(/^[.,;?!()]+/)?.[0] || "";
      const punctuationAfter = word.match(/[.,;?!()]+$/)?.[0] || "";
      const cleanWord = word.replace(/^[.,;?!()]+|[.,;?!()]+$/g, "");
      const lowerWord = cleanWord.toLowerCase();
      const matchedTerm = (glossary as GlossaryTerm[]).find((term) =>
        term.match.some((match) => lowerWord === match.toLowerCase()),
      );

      if (matchedTerm) {
        return (
          <span key={index}>
            {punctuationBefore}
            <HoverCard>
              <HoverCardTrigger asChild>
                <button
                  className="cursor-help font-bold italic underline decoration-turkoosi-400 underline-offset-4"
                  aria-label={`${matchedTerm.term}`}
                >
                  {cleanWord}
                </button>
              </HoverCardTrigger>
              <HoverCardContent side="top" align="center" className="w-80">
                <div className="flex flex-col gap-2">
                  <h4 className="text-left text-base font-semibold">
                    {matchedTerm.term}
                  </h4>
                  <p className="text-left text-[15px] font-normal text-foreground">
                    {matchedTerm.definition}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
            {punctuationAfter}
            {index < words.length - 1 && " "}
          </span>
        );
      }

      // Fix spacing issue by conditionally adding space only between words
      return (
        <span key={index}>
          {word}
          {index < words.length - 1 && " "}
        </span>
      );
    });
  }

  return (
    <h4 className="mb-4 inline text-lg font-semibold">{processedTitle}</h4>
  );
}
