import { GitCompareArrowsIcon } from "lucide-react";
import practicesMappings from "@/data/mapping_practices.json";

interface PracticeMappingProps {
  practice: string;
}

interface Mapping {
  framework: string;
  controls: string[];
}

export default function PracticeMappings({ practice }: PracticeMappingProps) {
  const practiceMappings =
    practicesMappings[practice as keyof typeof practicesMappings];

  if (!practiceMappings) return null;

  const mappings = practiceMappings.mappings;

  return (
    <div className="flex flex-row gap-2">
      {mappings?.map((mapping: Mapping) => (
        <Badge
          key={mapping.framework}
          framework={mapping.framework}
          controls={mapping.controls}
        />
      ))}
    </div>
  );
}

function Badge({ framework, controls }: Mapping) {
  const text = `${framework}: ${controls.join(", ")}`;

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 text-nowrap rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700`}
    >
      <GitCompareArrowsIcon className="h-4 w-4" />
      <span className="whitespace-pre-wrap">{text}</span>
    </span>
  );
}
