import { Gauge, GitCompareArrowsIcon } from "lucide-react";

type BadgeType = "mapping" | "mil";

interface BadgeProps {
  text: string;
  type: BadgeType;
}

const badges = [
  {
    match: "Traficom",
    color: "turkoosi-700",
    backgroundColor: "[#f4f9f8]",
  },
  {
    match: "TiHL",
    color: "indigo-700",
    backgroundColor: "indigo-50",
  },
  {
    match: "NIS2",
    color: "indigo-700",
    backgroundColor: "indigo-50",
  },
  {
    match: "EU",
    color: "pinkki",
    backgroundColor: "[#fdecf5]",
  },
  {
    match: "MIL",
    color: "gray-700",
    backgroundColor: "gray-100",
  },
  {
    match: "",
    color: "gray-700",
    backgroundColor: "gray-100",
  },
];

/**
 * Universal Badge component that displays text with an icon
 * @param text - Text to display in the badge
 * @param type - Type of badge ('standard' or 'mil')
 * @returns Badge component
 */
export default function IconBadge({ text, type }: BadgeProps) {
  const Icon = type === "mapping" ? GitCompareArrowsIcon : Gauge;
  const badge = badges.find((b) => text.includes(b.match));
  const isLaw = text.includes("TiHL") || text.includes("NIS2");

  if (text.includes("EU") || text.includes("Traficom")) return null;

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 text-nowrap rounded-full bg-${badge?.backgroundColor} px-2 py-1 text-xs font-medium text-${badge?.color}`}
    >
      <Icon className="h-4 w-4" />
      {isLaw ? `${text}  §` : text}
    </span>
  );
}
