import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { getRouteApi } from '@tanstack/react-router';
import { useAppStore } from "@/store/appStore";
import { PageLayout } from "../components/PageLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DomainDocumentation } from "../components/docs/DomainDocumentation";
import SelfAssesmentForm from "@/app/forms/SelfAssesmentForm";
import { ScrollButton } from "../components/scroll/ScrollButton";

const routeApi = getRouteApi('/$domainId');

export default function DomainPage() {
  const { domain } = routeApi.useLoaderData();
  const contentRef = useRef<HTMLDivElement>(null);

  const currentPractice = useAppStore(
    useShallow((state) => state.currentPractice),
  );

  return (
    <PageLayout
      showRightPanel={true}
      rightPanel={
        <div
          ref={contentRef}
          className="relative transform-gpu will-change-transform"
        >
          <ScrollArea className="h-dvh">
            <DomainDocumentation domainId={domain.id} />
          </ScrollArea>
          <ScrollButton targetId={currentPractice} containerRef={contentRef!} />
        </div>
      }
    >
      <div id="main-content">
        <SelfAssesmentForm domain={domain} />
      </div>
    </PageLayout>
  );
}
