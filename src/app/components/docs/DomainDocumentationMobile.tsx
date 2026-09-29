import { useEffect } from "react";
import { getRouteApi } from '@tanstack/react-router';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { ErrorBoundary } from "@/app/components/docs/DomainDocumentation";

const routeApi = getRouteApi('/$domainId');

interface DomainDocumentationMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domainId: string;
  anchor: string;
}

export function DomainDocumentationMobile({
  open,
  onOpenChange,
  domainId: _domainId,
  anchor,
}: DomainDocumentationMobileProps) {
  const { mdxDocument: MdxDocument } = routeApi.useLoaderData();

  useEffect(() => {
    if (open && MdxDocument) {
      // Wait for content to render and find element with data-anchor
      setTimeout(() => {
        const dialogContent = document.querySelector('[role="dialog"]');
        if (dialogContent) {
          const element = dialogContent.querySelector(`#${anchor}`);
          if (element) {
            element.scrollIntoView({ block: "start" });
          }
        }
      }, 100);
    }
  }, [open, MdxDocument, anchor]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[100dvh] max-w-full flex-col pt-[10px]">
        <DialogHeader>
          <DialogTitle className="text-left text-lg">
            Ohjeet itsearvioinnin tekemiseen
          </DialogTitle>
          <DialogDescription className="sr-only">
            Itsearvioinnin ohjeet ja dokumentaatio
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-[1.25rem] prose-h2:text-[1.125rem] prose-h3:text-[1.0625rem] prose-h4:text-xl prose-p:mb-2 prose-p:text-sm prose-a:font-semibold prose-a:text-turkoosi prose-a:no-underline hover:prose-a:no-underline prose-ol:mb-2 prose-ol:text-sm prose-ul:mb-2 prose-ul:text-sm prose-li:text-sm prose-hr:mb-2 [&_a:hover]:underline [&_ol>li::marker]:font-bold [&_ol>li::marker]:text-foreground">
            <ErrorBoundary
              fallback={
                <div>
                  Ohjeiden lataaminen epäonnistui. Yritä uudelleen myöhemmin.
                </div>
              }
            >
              {!MdxDocument ? (
                <div>
                  Ohjeiden lataaminen epäonnistui. Yritä uudelleen myöhemmin.
                </div>
              ) : (
                <MdxDocument />
              )}
            </ErrorBoundary>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
