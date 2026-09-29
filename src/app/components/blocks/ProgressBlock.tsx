import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { Progress } from "@/components/ui/progress";
import { useAssessmentStore } from "@/store/assessmentStore";
import { useAppStore } from "@/store/appStore";
import { getCompletionSummary } from "@/store/assessmentCompletion";
import { useTranslation } from "react-i18next";

export const ProgressBarBlock = ({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) => {
  const { t } = useTranslation('common');
  return (
    <Progress
      value={progress}
      className={`${className} h-2 [&>*]:bg-turkoosi`}
      aria-label={t('progress_aria')}
    />
  );
};

export default function ProgressBlock() {
  const { t } = useTranslation('common');
  const formValues = useAssessmentStore(useShallow((state) => state.formValues));
  const model = useAppStore((state) => state.model);

  const { answered, total, ratio } = useMemo(
    () => getCompletionSummary(formValues, model ?? []),
    [formValues, model],
  );

  return (
    <div>
      <div
        className="mb-2 flex justify-between px-2 text-sm"
        aria-live="polite"
      >
        <span>{t('progress')}</span>
        <span
          aria-label={t('progress_aria_label', { answered, total })}
        >
          {answered} / {total} {t('practices_count')}
        </span>
      </div>
      <ProgressBarBlock progress={ratio * 100} />
    </div>
  );
}
