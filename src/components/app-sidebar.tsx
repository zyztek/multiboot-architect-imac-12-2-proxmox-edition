import React from "react";
import { Home, BookOpen, PenTool, CheckSquare, Settings, Terminal } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  return (
    <Sidebar className="border-r border-white/10 bg-slate-950 text-slate-200">
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Terminal className="text-white size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white uppercase">iMac 12,2</span>
            <span className="text-[10px] text-slate-400 font-mono">MultiBoot Arch</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                <Link to="/"><Home className="size-4" /> <span>Mission Control</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/report"}>
                <Link to="/report"><BookOpen className="size-4" /> <span>Intelligence Report</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/tools"}>
                <Link to="/tools"><PenTool className="size-4" /> <span>Architect Tools</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/protocol"}>
                <Link to="/protocol"><CheckSquare className="size-4" /> <span>Deployment Protocol</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-white/5">
        <div className="text-[10px] text-slate-500 font-mono text-center">v1.0.0-PROXMOX-EDITION</div>
      </SidebarFooter>
    </Sidebar>
  );
}