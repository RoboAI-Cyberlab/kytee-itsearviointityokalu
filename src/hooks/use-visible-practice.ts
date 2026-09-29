import { useRef, useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import debounce from "debounce";

/**
 * Hook to handle the visibility of practices during scrolling
 * Uses IntersectionObserver to track visible elements and updates the current practice
 * only when scrolling has stopped
 */
export const useVisiblePractice = () => {
  const { setCurrentPractice } = useAppStore();
  const visiblePractices = useRef<Set<string>>(new Set());
  const observers = useRef<{ [key: string]: IntersectionObserver }>({});
  const isScrolling = useRef(false);

  const debouncedUpdate = useRef(
    debounce(() => {
      if (!isScrolling.current) return;

      const practices = Array.from(visiblePractices.current);
      if (practices.length > 0) {
        const topPractice = practices.reduce((top, current) => {
          const topElement = document.getElementById(top);
          const currentElement = document.getElementById(current);

          if (!topElement || !currentElement) return top;

          const topRect = topElement.getBoundingClientRect();
          const currentRect = currentElement.getBoundingClientRect();

          return topRect.top > currentRect.top ? current : top;
        });

        setCurrentPractice(topPractice);
      }
      isScrolling.current = false;
    }, 300),
  ).current;

  useEffect(() => {
    const handleScroll = () => {
      isScrolling.current = true;
      debouncedUpdate();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Create an observer for a practice
   * @param practiceId - The id of the practice to observe
   * @returns The observer for the practice
   */
  const createPracticeObserver = (_practiceId: string) => {
    return (id: string, element: HTMLElement) => {
      // Only create one observer per element
      if (observers.current[id]) {
        observers.current[id].disconnect();
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visiblePractices.current.add(id);
            } else {
              visiblePractices.current.delete(id);
            }
            // Only update if we're actually scrolling
            if (isScrolling.current) {
              debouncedUpdate();
            }
          });
        },
        {
          // Simplified threshold - only care about when element is entering/leaving viewport
          threshold: 0.1,
          rootMargin: "0px",
        },
      );

      observer.observe(element);
      observers.current[id] = observer;
    };
  };

  /**
   * Cleanup the observers when the component unmounts
   */
  useEffect(() => {
    return () => {
      Object.values(observers.current).forEach((observer) =>
        observer.disconnect(),
      );
      visiblePractices.current.clear();
      setCurrentPractice("");
      debouncedUpdate.clear();
    };
  }, [setCurrentPractice]);

  return { createPracticeObserver };
};
