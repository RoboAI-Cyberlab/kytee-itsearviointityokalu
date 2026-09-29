const ObjectiveTitle = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  const number = name.split("-").pop() || "0";

  return (
    <div
      id={name}
      className="mb-4 flex flex-col items-start gap-2 pt-8 md:flex-row md:items-center"
    >
      <span className="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-turkoosi text-lg font-bold text-white">
        {number}
      </span>
      <h2 className="my-0 text-xl font-semibold">{children}</h2>
    </div>
  );
};

export default ObjectiveTitle;
