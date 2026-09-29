import { ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExternalLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export const ExternalLink = ({
  href,
  children,
  className,
}: ExternalLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "inline-flex cursor-pointer items-center gap-1 font-semibold text-turkoosi hover:underline",
      className,
    )}
  >
    {children}
    <ExternalLinkIcon className="h-3 w-3 -translate-y-1" />
  </a>
);
