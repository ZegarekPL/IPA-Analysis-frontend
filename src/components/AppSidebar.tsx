"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Home, Settings, FileText } from "lucide-react";
import TemplateForm from "@/features/dashboard/templates/ui/TemplatesForm";

export function AppSidebar() {

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="px-4 py-2 font-bold">Dashboard</div>
      </SidebarHeader>

      <SidebarContent>
        {/* MAIN */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard">
                    <Home className="mr-2" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>


              {/* Tests + plus button */}
              <SidebarMenuItem>
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton asChild className="flex-1">
                    <a href="/dashboard/tests">
                      <FileText className="mr-2" />
                      <span>Tests</span>
                    </a>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>

              {/* Templates + plus button */}
              <SidebarMenuItem>
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton asChild className="flex-1">
                    <a href="/dashboard/templates">
                      <FileText className="mr-2" />
                      <span>Templates</span>
                    </a>
                  </SidebarMenuButton>

                  <TemplateForm/>
                </div>
              </SidebarMenuItem>


              {/* Grups + plus button */}
              <SidebarMenuItem>
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton asChild className="flex-1">
                    <a href="/dashboard/grups">
                      <FileText className="mr-2" />
                      <span>Grups</span>
                    </a>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>

              {/* Users + plus button */}
              <SidebarMenuItem>
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton asChild className="flex-1">
                    <a href="/dashboard/users">
                      <FileText className="mr-2" />
                      <span>Users</span>
                    </a>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SETTINGS */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard/settings">
                    <Settings className="mr-2" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-4 py-2 text-sm text-muted-foreground">
          Logged in as User
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
