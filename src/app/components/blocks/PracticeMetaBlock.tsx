import IconBadge from "@/app/components/badges/IconBadge";
import PracticeMappings from "@/app/components/badges/PracticeMappingBadge";

import type { Practice } from "@/types/model";

/**
 * This component is used to display the meta information of a practice.
 */
const PracticeMetaBlock = ({
  practice,
  domainId,
}: {
  practice: Practice;
  domainId: string;
}): React.ReactElement => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {practice.level && (
        <div className="flex items-center gap-2">
          <IconBadge text={`MIL-${practice.level}`} type="mil" />
        </div>
      )}

      <PracticeMappings practice={`${domainId}-${practice.id}`} />
    </div>
  );
};

export default PracticeMetaBlock;
