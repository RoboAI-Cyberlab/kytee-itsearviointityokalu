import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoveVertical } from "lucide-react";

interface ScrollButtonProps {
  targetId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function ScrollButton({ targetId, containerRef }: ScrollButtonProps) {
  const [isTargetVisible, setIsTargetVisible] = useState(true);

  useEffect(() => {
    if (!targetId || !containerRef.current) return;

    let scrollTimeout: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            setIsTargetVisible(entry.isIntersecting);
          }, 300);
        });
      },
      {
        threshold: [0, 0.1, 1],
        rootMargin: "20px 0px",
      },
    );

    const setupObserver = () => {
      const element = containerRef.current?.querySelector(`#${targetId}`);
      if (element) {
        observer.observe(element);
      }
    };

    setupObserver();

    const contentNode = containerRef.current;
    const mutationObserver = new MutationObserver(setupObserver);

    if (contentNode) {
      mutationObserver.observe(contentNode, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(scrollTimeout);
    };
  }, [targetId, containerRef]);

  const scrollToTarget = () => {
    if (targetId && containerRef.current) {
      const element = containerRef.current.querySelector(`#${targetId}`);
      if (element) {
        element.scrollIntoView();
      }
    }
  };

  if (!targetId || isTargetVisible) return null;

  return (
    <Button
      onClick={scrollToTarget}
      className="absolute bottom-6 right-6 h-12 w-12 rounded-full bg-gray-700 shadow-lg transition-all duration-200 animate-in fade-in zoom-in"
      size="icon"
      aria-label="Siirry nykyiseen käytäntöön"
    >
      <MoveVertical className="h-6 w-6" />
    </Button>
  );
}
