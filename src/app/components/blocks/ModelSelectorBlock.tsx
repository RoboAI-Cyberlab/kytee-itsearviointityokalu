import { cn } from "@/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import models from "@/data/models.json";
import { useAppStore } from "@/store/appStore";
import { useAssessmentStore } from "@/store/assessmentStore";
import ReactMarkdown from "react-markdown";

import { Check, Info } from "lucide-react";
import { getAnsweredPractices } from "@/store/utils";
import type { SelectedModel } from "@/types/model";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Custom components for ReactMarkdown
const MarkdownComponents = {
  // Add target="_blank" and rel="noopener noreferrer" to links
  a: ({ node: _node, ...props }: any) => (
    <a target="_blank" rel="noopener noreferrer" {...props} />
  ),
};

const InfoAlert = () => {
  const { t } = useTranslation("pages");

  return (
    <div className="rounded-md border border-amber-200 bg-amber-100 p-4">
      <div className="flex">
        <div className="shrink-0">
          <Info className="h-9 w-9 text-amber-600" />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-amber-700">
            <p>
              {t("models_cannot_change")}{" "}
              <Link
                className="font-semibold text-amber-700 hover:text-amber-700 hover:underline"
                to="/delete"
                preload="intent"
              >
                {t("delete_title")}
              </Link>{" "}
              {t("models_delete_page")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ModelSelectorBlock is a component that displays a list of models and allows the user to select one.
 *
 * @returns {JSX.Element} - A JSX element containing the model selector block.
 */
export default function ModelSelectorBlock() {
  const { t } = useTranslation("pages");
  const { setSelectedModel } = useAppStore();
  const selectedModel = useAppStore(useShallow((state) => state.selectedModel));
  const language = useAppStore(useShallow((state) => state.language));

  const formValues = useAssessmentStore(
    useShallow((state) => state.formValues),
  );

  const answeredPractices = getAnsweredPractices(formValues);
  const isStarted = answeredPractices > 0;

  const handleModelClick = (selectedModel: SelectedModel) => {
    if (isStarted) return;

    setSelectedModel(selectedModel.id);
  };

  return (
    <div className="flex flex-col gap-4">
      {isStarted && <InfoAlert />}
      {models.map((model) => (
        <Card
          key={model.id}
          className={cn(
            "rounder-md relative border-2 bg-gray-50 transition-all",
            selectedModel === model.id
              ? "border-turkoosi bg-turkoosi/5"
              : "border-transparent",
            !isStarted && "cursor-pointer hover:shadow-md",
          )}
          onClick={() => handleModelClick(model)}
        >
          {selectedModel === model.id && (
            <div className="absolute right-4 top-4">
              <Check className="h-6 w-6 text-turkoosi" />
            </div>
          )}
          <CardHeader className="p-4">
            <CardTitle className="text-xl">{model.name}</CardTitle>
            <CardDescription className="flex flex-col gap-2">
              <span className="text-sm text-gray-800">
                {t("models_authors")} {model.author}
              </span>
              <span className="text-sm text-gray-800">
                {t("models_version")} {model.version}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-4">
            <div className="sm:max-w-auto prose mb-2 prose-p:mb-2 prose-p:text-sm prose-a:font-semibold prose-a:text-turkoosi prose-a:no-underline hover:prose-a:no-underline [&_a:hover]:underline">
              <ReactMarkdown components={MarkdownComponents}>
                {model.description[
                  language as keyof typeof model.description
                ] || model.description.fi}
              </ReactMarkdown>
            </div>
            <p className="text-sm">
              {t("models_practices_count", { count: model.practices })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
