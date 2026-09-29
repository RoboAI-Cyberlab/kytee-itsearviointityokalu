import { Link, useLocation } from '@tanstack/react-router';
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface NavItemProps {
  name: string;
  icon: React.ElementType;
  to: string;
  external?: boolean;
}

export function NavItem({ item }: { item: NavItemProps }) {
  const location = useLocation();
  const isActive = location.pathname === item.to;

  if (item.external) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={item.name}>
          <a href={item.to} target="_blank" rel="noopener noreferrer">
            {item.icon && <item.icon className="size-4" />}
            <span>{item.name}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.name} isActive={isActive}>
        <Link
          to={item.to}
          preload="intent"
        >
          {item.icon && <item.icon className="size-4" />}
          <span>{item.name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
