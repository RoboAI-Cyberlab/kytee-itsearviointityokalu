import { useIsMobile } from "@/hooks/use-mobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface PageLayoutProps {
  children: React.ReactNode;
  showRightPanel?: boolean;
  rightPanel?: React.ReactNode;
}

export function PageLayout({
  children,
  showRightPanel = false,
  rightPanel,
}: PageLayoutProps) {
  const isMobile = useIsMobile();

  // If mobile or showRightPanel is false, return single panel layout
  if (isMobile || !showRightPanel) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-4 lg:p-4">{children}</div>
      </div>
    );
  }

  // On desktop with showRightPanel true, return split panel layout
  return (
    <div className="flex flex-1 flex-col">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={65} minSize={30}>
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </ResizablePanel>
        <ResizableHandle
          className="sticky top-0 z-[1] h-dvh self-start !overflow-visible"
          withHandle
        />
        <ResizablePanel
          defaultSize={35}
          minSize={30}
          className="!overflow-visible bg-white"
        >
          <div className="sticky top-0 max-h-dvh bg-white">{rightPanel}</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
