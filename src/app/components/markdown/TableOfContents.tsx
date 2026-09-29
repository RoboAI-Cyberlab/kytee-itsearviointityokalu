import { List } from "lucide-react";

const TableOfContents = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <details className="mt-8 rounded-md bg-gray-50 p-4">
    <summary className="flex cursor-pointer items-center font-bold [&::-webkit-details-marker]:mr-4">
      <List className="mr-2 h-4 w-4" />
      {title}
    </summary>
    <nav className="mt-2 [&_a]:text-muted-foreground [&_a]:no-underline hover:[&_a]:text-foreground hover:[&_a]:underline [&_li]:leading-[1.4]">
      {children}
    </nav>
  </details>
);

export default TableOfContents;
