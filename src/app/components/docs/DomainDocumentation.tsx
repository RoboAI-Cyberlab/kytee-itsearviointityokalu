import React, { useState, useEffect } from "react";
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/$domainId');

interface DomainDocumentationProps {
  domainId: string;
}

// A simple error boundary component
export function ErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}): React.ReactElement {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => {
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  return hasError ? <>{fallback}</> : <>{children}</>;
}

export function DomainDocumentation({
  domainId: _domainId,
}: DomainDocumentationProps): React.ReactElement {
  const { mdxDocument: MdxDocument } = routeApi.useLoaderData();

  return (
    <div className="px-4 py-6">
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
  );
}
