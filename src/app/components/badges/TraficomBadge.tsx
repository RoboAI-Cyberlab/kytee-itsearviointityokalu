import React from "react";
import { GitCompareArrowsIcon } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import mappingObjectives from "@/data/mapping_objectives.json";
import traficom from "@/data/framework/traficom.json";

interface TraficomBadgeProps {
  objective: string;
}

export default function TraficomBadge({
  objective,
}: TraficomBadgeProps): React.ReactElement {
  const mapping =
    mappingObjectives[objective as keyof typeof mappingObjectives];

  if (!mapping) {
    return null as unknown as React.ReactElement;
  }

  const traficomMapping = mapping.mappings.find(
    (m: any) => m.framework === "Traficom",
  );

  if (!traficomMapping || !traficomMapping.controls.length) {
    return null as unknown as React.ReactElement;
  }

  const controlIds = traficomMapping.controls;
  const controls = traficom.controls as Record<
    string,
    { fi: string; en: string; sv: string }
  >;

  const displayControlIds = controlIds.slice(0, 5);
  const hasMoreControls = controlIds.length > 5;

  return (
    <HoverCard>
      <HoverCardTrigger className="inline-flex w-fit cursor-help items-center gap-x-1.5 rounded-full bg-[#f4f9f8] px-2 py-1 text-xs font-medium text-turkoosi-700">
        <GitCompareArrowsIcon className="h-4 w-4" />
        Traficom: {displayControlIds.join(", ")}
        {hasMoreControls && ", ..."}
      </HoverCardTrigger>
      <HoverCardContent className="w-2xl max-w-full">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Suositus
            </p>
            <h4 className="font-semibold">
              Suositus NIS-valvoville viranomaisille kyberturvallisuuden
              riskienhallinnan toimenpiteistä
            </h4>
          </div>
          <table className="w-full text-sm text-foreground">
            <thead>
              <tr className="border-b text-left">
                <th colSpan={2} className="px-2 pb-2 font-medium">
                  Suosituksen osio
                </th>
              </tr>
            </thead>
            <tbody>
              {controlIds.map((id: string) => {
                const control = controls[id];
                return (
                  <tr key={id} className="border-b last:border-0">
                    <td className="px-2 py-2 text-right font-semibold text-turkoosi-700">
                      {id}
                    </td>
                    <td className="px-2 py-2">
                      {control ? (
                        control.fi
                      ) : (
                        <span className="italic text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {controlIds.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-2 py-2 text-center">
                    Ei suosituksia löytynyt
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
