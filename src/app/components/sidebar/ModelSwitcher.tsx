import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { ChevronsUpDown, Check, GalleryVerticalEnd } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import models from "@/data/models.json";

import { useAppStore } from "@/store/appStore";
import { useAssessmentStore } from "@/store/assessmentStore";
import { getCompletionSummary } from "@/store/assessmentCompletion";

import type { SelectedModel } from "@/types/model";

export function ModelSwitcher(): React.ReactElement {
  const { t } = useTranslation('navigation');
  const formValues = useAssessmentStore(useShallow((state) => state.formValues));
  const model = useAppStore(useShallow((state) => state.model));

  const { answered } = getCompletionSummary(formValues, model ?? []);

  const { setSelectedModel } = useAppStore();
  const selectedModel = useAppStore(useShallow((state) => state.selectedModel));
  const isStarted = answered > 0;
  const canSwitch = !isStarted && models.length > 1;

  const versionString = models.find((m) => m.id === selectedModel)?.name || "";

  const handleModelChange = (selectedModel: SelectedModel) => {
    setSelectedModel(selectedModel.id);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {!canSwitch ? (
          <div
            title={isStarted ? "Arviointimallia ei voi vaihtaa kesken arvioinnin suorittamista. Poista vastaukset, jos haluat vaihtaa arviointimallia." : undefined}
            className={`flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sm group-data-[collapsible=icon]:!p-0`}
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
              <span className="font-semibold">{t('assessment_model_label')}</span>
              <span>{versionString}</span>
            </div>
            <div className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-fit"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{t('assessment_model_label')}</span>
                  <span>{versionString}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-fit"
              align="start"
            >
              {models.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onSelect={() => handleModelChange(model)}
                >
                  {`${model.name}`}
                  {model.id === selectedModel && <Check className="ml-auto" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
