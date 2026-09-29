import { useMemo, useRef, useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { CircleCheckBig, LoaderCircle, CircleDashed } from "lucide-react";
import { ProgressBarBlock } from "./ProgressBlock";

import {
  getDomainPractices,
  getAnsweredDomainPractices,
} from "@/store/utils";
import { useAssessmentStore } from "@/store/assessmentStore";
import { useAppStore } from "@/store/appStore";

// Whitelist of valid domain IDs
const allowedDomains = [
  "access",
  "architecture",
  "asset",
  "critical",
  "program",
  "response",
  "risk",
  "situation",
  "third-parties",
  "threat",
  "workforce",
];

/**
 * Progress footer block component
 * @returns Progress footer block component
 */
export default function ProgressFooterBlock() {
  const location = useRouterState().location;
  const { formValues } = useAssessmentStore();
  // Subscribe to model changes for language updates
  const model = useAppStore((state) => state.model);

  // Extract domain from path and check if it's allowed
  const domain = location.pathname.split("/")[1];
  const isAllowedDomain =
    domain && allowedDomains.includes(domain.toLowerCase());

  // Get domain title - recalculates when model changes (language switch)
  const domainShortTitle = !domain || !model
    ? ""
    : model.find((d) => d.id === domain)?.short || domain;

  const totalPractices = domain ? getDomainPractices(domain) : 0;
  const answeredPractices = domain
    ? getAnsweredDomainPractices(formValues, domain)
    : 0;

  const progress = useMemo(() => {
    return totalPractices > 0 ? (answeredPractices / totalPractices) * 100 : 0;
  }, [answeredPractices, totalPractices]);

  const isComplete = useMemo(() => {
    return answeredPractices === totalPractices && totalPractices > 0;
  }, [answeredPractices, totalPractices]);

  const prevAnsweredRef = useRef(answeredPractices);

  // Simple spin trigger when ratio changes
  useEffect(() => {
    if (answeredPractices > prevAnsweredRef.current) {
      prevAnsweredRef.current = answeredPractices;
    }
  }, [answeredPractices]);

  // Return null after all hooks have been called
  if (!isAllowedDomain) return null;

  return (
    <div className="sticky bottom-2 mt-auto h-16 w-full rounded-md bg-gray-100 p-4">
      <div
        className="mb-2 flex justify-between gap-2 whitespace-nowrap text-xs text-foreground"
        aria-live="polite"
      >
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CircleCheckBig className="h-4 w-4" />
          ) : answeredPractices === 0 ? (
            <CircleDashed className="h-4 w-4" />
          ) : (
            <LoaderCircle
              className="h-4 w-4 transition-transform duration-500"
              style={{
                transform: `rotate(${answeredPractices * 45}deg)`,
              }}
            />
          )}
          <span className="max-w-36 overflow-hidden text-ellipsis">
            {domainShortTitle}
          </span>
        </div>
        <span
          aria-label={`${answeredPractices} käytäntöä vastattu ${totalPractices} käytännöstä`}
        >
          {answeredPractices} / {totalPractices}
        </span>
      </div>
      <ProgressBarBlock progress={progress} className="bg-white" />
    </div>
  );
}
