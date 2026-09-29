import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Circle, CircleCheckBig, CircleX, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

import type { Practice, ModelCapabilities } from "@/types/model";

/**
 * Block for selecting an answer from a list of options
 * @param capabilities - The capabilities of the selected model
 * @param domainId - The id of the domain
 * @param practice - The practice to display the options for
 * @returns A block for selecting an answer from a list of options
 */
export default function AnswerOptionsBlock({
  capabilities,
  domainId,
  practice,
  answer,
  onAnswerChange,
}: {
  capabilities: ModelCapabilities;
  practice: Practice;
  domainId: string;
  answer: number;
  onAnswerChange: (value: number) => void;
}): React.ReactElement {
  const { t } = useTranslation('common');

  const answerOptions = [
    {
      value: 1,
      color: "text-red-500",
      fillColor: "fill-red-50",
      bgColor: "bg-red-50",
      ringColor: "ring-red-200",
      icon: CircleX,
      title: t('answer_not_implemented'),
    },
    {
      value: 2,
      color: "text-orange-600",
      fillColor: "fill-orange-50",
      bgColor: "bg-orange-50",
      ringColor: "ring-orange-200",
      icon: CircleAlert,
      title: t('answer_partially_implemented'),
    },
    {
      value: 3,
      color: "text-[#1f9e93]",
      fillColor: "fill-[#f7fdfb]",
      bgColor: "bg-[#f7fdfb]",
      ringColor: "ring-[#cef3e7]",
      icon: CircleCheckBig,
      title: t('answer_mostly_implemented'),
    },
    {
      value: 4,
      color: "text-turkoosi",
      fillColor: "fill-[#1a847b0d]",
      bgColor: "bg-[#1a847b0d]",
      ringColor: "ring-[#bddbd5]",
      icon: CircleCheckBig,
      title: t('answer_fully_implemented'),
    },
  ];

  return (
    <RadioGroup
      onValueChange={(value: string) => onAnswerChange(parseInt(value))}
      value={answer?.toString()}
      aria-label={`${t('assess', { ns: 'forms' })} ${practice.title}`}
      className="@container"
    >
      <div
        className={cn(
          "mb-4 flex flex-col gap-2",
          capabilities.compactAnswerLayout
            ? "@[45rem]:mb-4 @[45rem]:flex-row"
            : "",
        )}
      >
        {answerOptions.map((choice) => (
          <div key={choice.value} className="flex items-center">
            <Label
              htmlFor={`${domainId}-${practice.id}-${choice.value}`}
              className={cn(
                `group relative flex min-w-full cursor-pointer items-center space-x-2 rounded-md p-2 text-sm font-normal transition-colors focus-within:ring-2 focus-within:ring-turkoosi focus-within:ring-offset-2 hover:bg-gray-50`,
                answer === choice.value &&
                  `${choice.bgColor} hover:${choice.bgColor} ring-2 ring-offset-2 focus-within:${choice.ringColor} ${choice.ringColor}`,
              )}
            >
              <RadioGroupItem
                value={choice.value.toString()}
                id={`${domainId}-${practice.id}-${choice.value}`}
                className="absolute left-2 opacity-0"
                aria-label={choice.title}
              />
              <div className="shrink-0">
                {answer === choice.value ? (
                  <choice.icon
                    className={`h-5 w-5 ${choice.color} ${choice.fillColor}`}
                    aria-hidden="true"
                  />
                ) : (
                  <Circle
                    className={`h-5 w-5 text-foreground/60 group-focus-within:${choice.color}`}
                    aria-hidden="true"
                  />
                )}
              </div>
              <span className="text-sm">{choice.title}</span>
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}
