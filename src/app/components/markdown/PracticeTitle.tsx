const PracticeTitle = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  const number = name.split("-").pop() || "0a";

  return (
    <div
      id={name}
      className="mb-4 flex flex-col items-start gap-2 pt-8 md:flex-row"
    >
      <span className="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-lg font-bold text-white">
        {number}
      </span>
      <h3 className="my-0 text-lg font-semibold">{children}</h3>
    </div>
  );
};

export default PracticeTitle;
