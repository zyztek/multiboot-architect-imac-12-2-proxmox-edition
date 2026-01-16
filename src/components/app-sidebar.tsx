import React from "react";
import { Home, BookOpen, PenTool, CheckSquare, Terminal, LayoutDashboard, Layers, Box, Monitor, ShieldCheck, Globe, Orbit } from "lucide-react";
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
  const menuItems = [
    { path: "/", icon: Home, label: "Mission Control" },
    { path: "/proxmox", icon: LayoutDashboard, label: "Cluster View" },
    { path: "/singularity", icon: Orbit, label: "Singularity", elite: true },
    { path: "/visionary", icon: Monitor, label: "Visionary" },
    { path: "/orchestrator", icon: Layers, label: "Orchestrator" },
    { path: "/report", icon: BookOpen, label: "Intelligence" },
    { path: "/tools", icon: PenTool, label: "Script Forge" },
    { path: "/protocol", icon: CheckSquare, label: "Deployment" },
    { path: "/universe", icon: Globe, label: "Universe Codex" },
  ];
  return (
    <Sidebar className="border-r border-white/10 glass-dark backdrop-blur-xl text-slate-200">
      <SidebarHeader className="border-b border-white/5 p-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/20">
            <Terminal className="text-white size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tighter text-white uppercase leading-none">iMac 12,2</span>
            <span className="text-[9px] text-purple-400 font-mono tracking-widest uppercase mt-1">Singularity Tier</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.path}
                  className={`
                    transition-all duration-300 h-11 px-4 rounded-lg group
                    ${location.pathname === item.path
                      ? (item.elite ? 'bg-purple-600/10 text-purple-400 border border-purple-500/40 shadow-glow' : 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]')
                      : (item.elite ? 'hover:bg-purple-600/5 hover:text-purple-300 border border-transparent' : 'hover:bg-white/5 hover:text-white border border-transparent')}
                  `}
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className={`size-4 ${location.pathname === item.path ? (item.elite ? 'text-purple-400' : 'text-blue-400') : 'text-slate-500 group-hover:text-white'}`} />
                    <span className="font-medium tracking-tight text-sm">{item.label}</span>
                    {item.elite && <span className="ml-auto size-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t border-white/5 bg-black/20">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] text-purple-400 font-mono font-bold animate-pulse">
            <ShieldCheck className="size-3" />
            SINGULARITY ACTIVE
          </div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="text-[8px] text-purple-500 uppercase font-black tracking-[0.2em]">Post-Human Epoch</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}