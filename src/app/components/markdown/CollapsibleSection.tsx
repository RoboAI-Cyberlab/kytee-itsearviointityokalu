/**
 *
 * @param param0
 * @returns
 */
const CollapsibleSection = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <details className="mt-8 rounded-md bg-gray-50 p-4">
      <summary className="cursor-pointer font-bold [&::-webkit-details-marker]:mr-4">
        {title}
      </summary>
      {children}
    </details>
  );
};

export default CollapsibleSection;
