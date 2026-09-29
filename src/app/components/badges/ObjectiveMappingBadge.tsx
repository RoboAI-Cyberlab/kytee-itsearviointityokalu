import mappingObjectives from "@/data/mapping_objectives.json";
import IconBadge from "@/app/components/badges/IconBadge";
import TraficomBadge from "./TraficomBadge";

interface ObjectiveMappingProps {
  objective: string;
}

interface Mapping {
  framework: string;
  controls: string[];
}

export default function ObjectiveMappings({
  objective,
}: ObjectiveMappingProps) {
  const objectiveMappings =
    mappingObjectives[objective as keyof typeof mappingObjectives];

  if (!objectiveMappings) return null;

  const mappings = objectiveMappings.mappings;

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <TraficomBadge objective={objective} />
      {mappings?.map((mapping: Mapping) => (
        <IconBadge
          key={mapping.framework}
          text={`${mapping.framework}: ${mapping.controls.join(", ")}`}
          type="mapping"
        />
      ))}
    </div>
  );
}
