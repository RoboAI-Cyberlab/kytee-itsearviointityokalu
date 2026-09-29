import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { Link, useRouterState } from '@tanstack/react-router';
import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import TextSizeAdjusterBlock from "@/app/components/blocks/TextSizeAdjusterBlock";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import models from "@/data/models.json";
import { useNavigation, type NavigationItem } from "@/hooks/use-navigation";
import { useAppStore } from "@/store/appStore";

const excludedPages = [
  "/intro",
  "/organization",
  "/models",
  "/delete",
  "/export",
  "/report",
];

export function AppHeader() {
  const location = useRouterState().location;
  const navigation = useNavigation();
  const selectedModel = useAppStore(useShallow((state) => state.selectedModel));

  const modelName = useMemo(
    () => models.find((m: any) => m.id === selectedModel)?.name || "",
    [selectedModel],
  );

  const breadcrumb = useMemo(
    () =>
      Object.values(navigation)
        .flat()
        .find((page: NavigationItem) => location.pathname.includes(page.to)) ||
      {},
    [navigation, location.pathname],
  );

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 print:hidden">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 bg-transparent text-foreground hover:bg-transparent [&_svg]:size-5" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs
          breadcrumb={breadcrumb as NavigationItem}
          modelName={modelName as string}
        />
      </div>

      <div className="flex items-center gap-2">
        <TextSizeAdjusterBlock />
        <LanguageSwitcher />
      </div>
    </header>
  );
}

const Breadcrumbs = ({
  breadcrumb,
  modelName,
}: {
  breadcrumb: NavigationItem;
  modelName: string;
}) => {
  const { t } = useTranslation('navigation');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block [&>span]:flex">
          <BreadcrumbPage>
            <Link
              to="/intro"
              aria-label={t('to_home')}
              title={t('to_home')}
            >
              <Home className="h-5 w-5" />
            </Link>
          </BreadcrumbPage>
        </BreadcrumbItem>
        {breadcrumb && !excludedPages.includes(breadcrumb?.to) && (
          <>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage>{modelName}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>{breadcrumb?.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
