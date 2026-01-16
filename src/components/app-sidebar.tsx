import React from "react";
import { Home, BookOpen, PenTool, CheckSquare, Terminal, LayoutDashboard, Layers, Monitor, Globe, Orbit, Activity, ShieldCheck } from "lucide-react";
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
import { motion } from "framer-motion";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const menuItems = [
    { path: "/", icon: Home, label: "Galaxy Core" },
    { path: "/proxmox", icon: LayoutDashboard, label: "Cluster View" },
    { path: "/singularity", icon: Orbit, label: "Singularity", elite: true },
    { path: "/visionary", icon: Monitor, label: "Visionary" },
    { path: "/orchestrator", icon: Layers, label: "Orchestrator" },
    { path: "/report", icon: BookOpen, label: "Intelligence" },
    { path: "/tools", icon: PenTool, label: "Script Forge" },
    { path: "/protocol", icon: CheckSquare, label: "Deployment" },
    { path: "/usb-forge", icon: Monitor, label: "USB Forge", elite: true },
    { path: "/usb-flash", icon: Monitor, label: "WebUSB Flash" },
    { path: "/universe", icon: Globe, label: "Universe" },
  ];
  return (
    <Sidebar className="border-r border-white/5 glass-dark backdrop-blur-2xl text-slate-300 relative">
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent pointer-events-none" />
      <SidebarHeader className="border-b border-white/5 p-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <Terminal className="text-white size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tighter text-white uppercase italic leading-none">Infinity</span>
            <span className="text-[9px] text-blue-400 font-mono tracking-widest uppercase mt-1">iMac 12,2 Core</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`
                      transition-all duration-300 h-10 px-4 rounded-lg group border
                      ${isActive
                        ? (item.elite ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-glow' : 'bg-blue-600/10 text-blue-400 border-blue-500/30 shadow-glow')
                        : 'border-transparent hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className={`size-4 ${isActive ? (item.elite ? 'text-rose-400' : 'text-blue-400') : 'text-slate-500 group-hover:text-white'}`} />
                      <span className="font-bold tracking-tight text-xs uppercase">{item.label}</span>
                      {item.elite && (
                        <motion.div
                          animate={{ 
                            scale: [1, 1.4, 1],
                            opacity: [0.6, 1, 0.6]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="ml-auto size-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)]"
                        />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t border-white/5 bg-black/40">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] text-blue-400 font-mono font-bold animate-pulse">
            <Activity className="size-3" />
            INTEGRITY: 99.4%
          </div>
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex items-center gap-2 text-[8px] text-slate-500 uppercase font-black tracking-[0.2em]">
            <ShieldCheck className="size-2 text-emerald-500" />
            Fortress Active
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}