"use client";

import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  Table2,
  ShieldCheck,
  Database,
  Wrench,
  Shield,
  Languages,
  FileCode,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAgentSpec: () => void;
  recordCount: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  onOpenAgentSpec,
  recordCount,
}) => {
  const mainNav = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, badge: null },
    { id: "studio", label: "Migration Studio", icon: Sparkles, badge: "Live" },
    { id: "table", label: "11-Col Schema Ledger", icon: Table2, badge: recordCount ? String(recordCount) : null },
    { id: "audit", label: "Cryptographic Audit", icon: ShieldCheck, badge: "SHA-256" },
    { id: "schema", label: "Reverse Schema DDL", icon: Database, badge: "SQL" },
  ];

  const weaponsNav = [
    { id: "healing", label: "Zero-Shot Self-Healing", icon: Wrench, tag: "Weapon 1" },
    { id: "privacy", label: "GDPR Privacy Guard", icon: Shield, tag: "Weapon 2" },
    { id: "vernacular", label: "Vernacular Hinglish", icon: Languages, tag: "Weapon 3" },
  ];

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-white border-r border-stone-200/90 shadow-[2px_0_12px_rgba(28,25,23,0.02)] transition-all duration-300 z-30",
        isCollapsed ? "w-18" : "w-64"
      )}
    >
      {/* Sidebar Header & Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-stone-200/80">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-stone-900 shadow-xs border border-stone-800 text-stone-100">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-base tracking-tight text-stone-900">
                  RECAST<span className="text-[#9a3412]">.AI</span>
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-stone-100 text-stone-700 border border-stone-300 uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-sans truncate">Data Migration Agent</p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto flex items-center justify-center w-8 h-8 rounded-lg bg-stone-900 shadow-xs border border-stone-800 text-stone-100">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className={cn(
            "p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer",
            isCollapsed && "mx-auto mt-2"
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Nav */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-mono font-semibold text-stone-600 uppercase tracking-widest mb-2">
              Migration Modules
            </p>
          )}
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer text-left",
                    isActive
                      ? "bg-stone-900 text-stone-50 font-semibold shadow-xs"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 flex-none",
                      isActive ? "text-amber-300" : "text-stone-500 group-hover:text-stone-900"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 truncate font-sans">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold",
                        isActive
                          ? "bg-stone-800 text-amber-200"
                          : "bg-stone-100 text-stone-600 border border-stone-200"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Enterprise Weapons */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-mono font-semibold text-stone-600 uppercase tracking-widest mb-2">
              Active Weapons
            </p>
          )}
          <nav className="space-y-1">
            {weaponsNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange("studio")}
                  title={isCollapsed ? item.label : undefined}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-all cursor-pointer text-left"
                >
                  <Icon className="w-4 h-4 flex-none text-[#9a3412]" />
                  {!isCollapsed && (
                    <span className="flex-1 truncate font-sans">{item.label}</span>
                  )}
                  {!isCollapsed && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-amber-50 text-amber-900 border border-amber-200">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System & Standards */}
        <div>
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-mono font-semibold text-stone-600 uppercase tracking-widest mb-2">
              Specifications
            </p>
          )}
          <nav className="space-y-1">
            <button
              onClick={onOpenAgentSpec}
              title={isCollapsed ? "agent.json Standard" : undefined}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-all cursor-pointer text-left"
            >
              <FileCode className="w-4 h-4 flex-none text-stone-500" />
              {!isCollapsed && (
                <span className="flex-1 truncate font-sans">agent.json Spec</span>
              )}
              {!isCollapsed && (
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-stone-100 text-stone-700 border border-stone-200">
                  v1.0
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange("schema")}
              title={isCollapsed ? "API Schema DDL" : undefined}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-all cursor-pointer text-left"
            >
              <BookOpen className="w-4 h-4 flex-none text-stone-500" />
              {!isCollapsed && (
                <span className="flex-1 truncate font-sans">Database DDL</span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Sidebar Footer: Agent SLA & Status */}
      <div className="p-3 border-t border-stone-200/80 bg-[#fcfaf6]">
        {!isCollapsed ? (
          <div className="p-2.5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-800 font-sans">
                <Activity className="w-3.5 h-3.5 text-[#9a3412] animate-pulse" />
                Autonomous Engine
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            </div>
            <p className="text-[10px] text-stone-500 font-sans leading-tight">
              Gemma 4 Multimodal · Docling · LangGraph DAG
            </p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-mono font-medium pt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>99.4% SLA Certified</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="99.4% SLA Certified">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
