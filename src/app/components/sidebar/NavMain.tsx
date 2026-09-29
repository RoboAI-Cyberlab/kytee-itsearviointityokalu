import { type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";

import { NavItem } from "./NavItem";

export function NavMain({
  projects,
}: {
  projects: {
    name: string;
    to: string;
    icon: LucideIcon;
  }[];
}) {
  const { t } = useTranslation('navigation');

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('assessment_sections')}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
