import React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { DomainDocumentationMobile } from "@/app/components/docs/DomainDocumentationMobile";

const DocumentationButtonBlock: React.FC<{
  domainId: string;
  anchor: string;
}> = ({ domainId, anchor }) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <>
      <Button
        className="h-12 w-12 rounded-full bg-turkoosi ring-2 ring-turkoosi hover:bg-[#1c8d83] focus:bg-[#1c8d83] active:bg-[#1c8d83] [&_svg]:size-6"
        variant="ghost"
        size="icon"
        aria-label="Avaa ohjeet"
        onClick={() => setOpen(true)}
      >
        <Info className="text-white" />
        <span className="sr-only">Avaa ohjeet</span>
      </Button>

      <DomainDocumentationMobile
        open={open}
        onOpenChange={setOpen}
        domainId={domainId}
        anchor={anchor}
      />
    </>
  );
};

export default DocumentationButtonBlock;
