import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

import { useNavigation } from "@/hooks/use-navigation";
import ProgressFooterBlock from "@/app/components/blocks/ProgressFooterBlock";

import { NavMain } from "./sidebar/NavMain";
import { NavIntro } from "./sidebar/NavIntro";
import { NavInfo } from "./sidebar/NavInfo";
import { NavResults } from "./sidebar/NavResults";
import { ModelSwitcher } from "./sidebar/ModelSwitcher";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = useNavigation();
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ModelSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavIntro projects={data.introPages} />
        <NavMain projects={data.domainPages} />
        <NavResults projects={data.resultPages} />
        <NavInfo items={data.infoPages} />
      </SidebarContent>
      {!isMobile && (
        <SidebarFooter>
          <ProgressFooterBlock />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
