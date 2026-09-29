import PaginationBlock from "@/app/components/blocks/PaginationBlock";
import ProgressBlock from "@/app/components/blocks/ProgressBlock";
import ObjectiveBlock from "@/app/components/blocks/ObjectiveBlock";

import type { Domain } from "@/types/model";

const SelfAssesmentForm: React.FC<{ domain: Domain }> = ({ domain }) => {
  return (
    <>
      <div className="mb-4 rounded-md bg-white p-4 shadow-sm">
        <ProgressBlock />
      </div>

      <div className="mb-4 rounded-md bg-white shadow-sm">
        <div className="flex flex-col gap-4 px-6 py-4 md:px-8">
          <h2 className="text-2xl font-semibold">{domain.title}</h2>
          {domain.description && (
            <div className="text-sm">
              {domain.description.split("\n\n").map((paragraph, index) => (
                <p className="mb-4 last-of-type:mb-0" key={`desc-${index}`}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {domain.objectives.map((objective) => (
        <ObjectiveBlock
          key={objective.id}
          objective={objective}
          domain={domain}
        />
      ))}

      <PaginationBlock />
    </>
  );
};

export default SelfAssesmentForm;
