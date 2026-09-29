import React from "react";
import { Link, useRouterState } from '@tanstack/react-router';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import { useNavigation, type NavigationItem } from "@/hooks/use-navigation";

export default function PaginationBlock() {
  const navigation = useNavigation();
  const flatNavigation = Object.values(navigation).flat();

  const PreviousNavigationItem: React.FC = () => {
    const currentPath = useRouterState().location.pathname;
    const currentIndex = flatNavigation.findIndex(
      (item) => item.to === currentPath,
    );

    const previousPage: NavigationItem | null =
      flatNavigation[currentIndex - 1] ?? null;

    if (!previousPage) return null;

    const previousLabel = previousPage?.button_label || previousPage?.name;
    const previousTo = previousPage?.to;

    return (
      <PaginationItem className="ml-0 mr-auto">
        <Button
          asChild
          variant="ghost"
          className="flex items-center gap-2 text-sm"
        >
          <Link to={previousTo} preload="intent">
            <ChevronRight className="h-4 w-4 rotate-180" />
            {previousLabel}
          </Link>
        </Button>
      </PaginationItem>
    );
  };

  const NextNavigationItem: React.FC = () => {
    const currentPath = useRouterState().location.pathname;
    const currentIndex = flatNavigation.findIndex(
      (item) => item.to === currentPath,
    );

    const nextPage: NavigationItem | null =
      flatNavigation[currentIndex + 1] ?? null;

    if (!nextPage) return null;

    const nextLabel = nextPage?.button_label || nextPage?.name;
    const nextTo = nextPage?.to;

    return (
      <PaginationItem className="ml-auto mr-0">
        <Button asChild className="flex items-center gap-2 text-sm text-white">
          <Link to={nextTo} preload="intent">
            {nextLabel}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </PaginationItem>
    );
  };

  return (
    <div className="mb-4 rounded-md bg-white p-4 shadow-sm print:hidden">
      <div className="flex justify-end">
        <Pagination>
          <PaginationContent className="flex flex-wrap gap-4">
            <PreviousNavigationItem />
            <NextNavigationItem />
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
