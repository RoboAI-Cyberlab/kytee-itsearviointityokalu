import { FileText } from "lucide-react";

const ExampleDocument = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <details className="mb-8 mt-8 rounded-md bg-gray-50 p-4">
      <summary className="flex cursor-pointer items-center font-bold [&::-webkit-details-marker]:mr-4">
        <FileText className="mr-2 h-4 w-4" />
        {title}
      </summary>
      {children}
    </details>
  );
};

export default ExampleDocument;
