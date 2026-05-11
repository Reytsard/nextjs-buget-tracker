"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconRefresh,
  IconReportAnalytics,
  IconSearch,
  IconSettings,
  IconTarget,
  IconUpload,
  IconWallet,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    // name: "shadcn",
    email: "m@example.com",
    // avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Reports", url: "/reports", icon: IconReportAnalytics },
    { title: "Budget", url: "/budget", icon: IconTarget },
    { title: "Recurring", url: "/recurring", icon: IconRefresh },
    { title: "Import", url: "/import", icon: IconUpload },
    { title: "Settings", url: "/settings", icon: IconWallet },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userdata?: { name: string; email: string; avatar: string };
}) {
  const userdata = props.userdata ?? { name: "", email: "", avatar: "" };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">BudTrack</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userdata} />
      </SidebarFooter>
    </Sidebar>
  );
}
