import { useEffect } from "react";
import { useRouterState } from '@tanstack/react-router';

/**
 * This component is used to scroll to the top of the page when the user navigates to a new page.
 * It also handles the smooth scrolling behavior for Chrome browsers.
 *
 * Firefox and Safari do not support smooth scrolling with Sticky ProgressBar, so we need to handle that.
 */
const isChrome = () => {
  return navigator.userAgent.indexOf("Chrome") !== -1;
};

export const ScrollToTop = () => {
  const { pathname, hash } = useRouterState().location;

  useEffect(() => {
    const handleScroll = (targetPosition: number) => {
      if (isChrome()) {
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      } else {
        // For non-Chrome browsers, temporarily disable smooth scrolling
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, targetPosition);
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = "smooth";
        }, 100);
      }
    };

    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          if (isChrome()) {
            element.scrollIntoView({ behavior: "smooth" });
          } else {
            document.documentElement.style.scrollBehavior = "auto";
            element.scrollIntoView();
            setTimeout(() => {
              document.documentElement.style.scrollBehavior = "smooth";
            }, 100);
          }
        }
      }, 100);
    } else if (hash === "#main-content") {
      const mainContent = document.querySelector("#main-content");
      if (mainContent) {
        if (isChrome()) {
          mainContent.scrollIntoView({ behavior: "smooth" });
        } else {
          document.documentElement.style.scrollBehavior = "auto";
          mainContent.scrollIntoView();
          setTimeout(() => {
            document.documentElement.style.scrollBehavior = "smooth";
          }, 100);
        }
      }
    } else {
      handleScroll(0);
    }
  }, [pathname, hash]);

  return null;
};
