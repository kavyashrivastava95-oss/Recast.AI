"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Cpu,
  Terminal,
  ArrowUpRight,
  PanelLeft,
  CheckCircle2,
  Sparkles,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  currentTab: string;
  onToggleSidebar: () => void;
  activeDialect: string;
  onDialectChange: (dialect: string) => void;
  onOpenAgentSpec: () => void;
  isProcessing?: boolean;
  uiMode?: "simple" | "advanced";
  onUiModeChange?: (mode: "simple" | "advanced") => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentTab,
  onToggleSidebar,
  activeDialect,
  onDialectChange,
  onOpenAgentSpec,
  isProcessing = false,
  uiMode = "simple",
  onUiModeChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumb = () => {
    if (uiMode === "simple") {
      return "Simple Recaster";
    }
    switch (currentTab) {
      case "overview":
        return "Dashboard Overview";
      case "studio":
        return "Migration Studio (Ingestion & Terminal)";
      case "table":
        return "11-Column Schema Ledger";
      case "audit":
        return "Cryptographic Lineage & Audit Trail";
      case "schema":
        return "Reverse-Schema Generator (DDL / Prisma)";
      default:
        return "Autonomous Migration Studio";
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-stone-200/90 sticky top-0 z-20 shadow-xs">
      {/* Left: Sidebar Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        {uiMode === "advanced" && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Toggle Navigation Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="font-serif font-bold text-stone-900 text-sm">
            RECAST<span className="text-[#9a3412]">.AI</span>
          </span>
          <span className="text-stone-400">/</span>
          <span className="font-semibold text-stone-900 font-sans">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Center: Global Search Bar (shown in advanced mode or wide screens) */}
      {uiMode === "advanced" ? (
        <div className="hidden lg:flex items-center relative w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search records, pins, SHA-256..."
            className="w-full h-8 pl-9 pr-12 rounded-xl bg-[#fcfaf6] border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-[#9a3412] focus:bg-white shadow-xs font-sans transition-all"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 rounded text-[10px] font-mono text-stone-500 bg-stone-100 border border-stone-200 pointer-events-none">
            ⌘K
          </kbd>
        </div>
      ) : null}

      {/* Right: Mode Switcher, Engine Status, Dialect Switch, Notification & agent.json */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Simple vs Advanced Mode Toggle */}
        <div className="flex items-center rounded-xl bg-amber-50/80 border border-amber-200/90 p-0.5 shadow-xs">
          <button
            type="button"
            onClick={() => onUiModeChange?.("simple")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              uiMode === "simple"
                ? "bg-white text-stone-900 shadow-xs border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900"
            )}
            title="Switch to Simple Mode (Default for General Users)"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9a3412]" />
            <span>Simple</span>
          </button>
          <button
            type="button"
            onClick={() => onUiModeChange?.("advanced")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              uiMode === "advanced"
                ? "bg-stone-900 text-stone-50 shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            )}
            title="Switch to Advanced Mode (Full Technical Dashboard)"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-300" />
            <span>Advanced</span>
          </button>
        </div>

        {/* Live Engine Status (Advanced Mode) */}
        {uiMode === "advanced" && (
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#fcfaf6] border border-stone-200 text-xs text-stone-700 shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-[#9a3412]" />
            <span className="font-medium text-stone-800 text-[11px] font-sans">Gemma 4</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            {isProcessing ? (
              <span className="text-[10px] text-[#9a3412] font-mono font-semibold animate-pulse">Running</span>
            ) : (
              <span className="text-[10px] text-emerald-800 font-mono font-semibold">99.4% SLA</span>
            )}
          </div>
        )}

        {/* Dialect Selector */}
        <div className="flex items-center rounded-xl bg-stone-100 p-0.5 shadow-xs border border-stone-200">
          <button
            onClick={() => onDialectChange("IN_ENTERPRISE")}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
              activeDialect === "IN_ENTERPRISE"
                ? "bg-white text-stone-950 font-semibold shadow-xs border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Indic
          </button>
          <button
            onClick={() => onDialectChange("GLOBAL_ENTERPRISE")}
            className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
              activeDialect === "GLOBAL_ENTERPRISE"
                ? "bg-white text-stone-950 font-semibold shadow-xs border border-stone-200/80"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Global
          </button>
        </div>

        {/* Notification Bell (Advanced Mode) */}
        {uiMode === "advanced" && (
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors relative cursor-pointer"
              title="Migration Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#9a3412]" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-stone-200 rounded-xl shadow-xl p-3 z-50 text-xs animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-900 font-sans">Notifications</span>
                  <span className="text-[10px] text-stone-500 font-mono">2 unread</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/70 text-stone-800">
                    <p className="font-semibold text-emerald-900 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      Zero-Shot Healed Postal Codes
                    </p>
                    <p className="text-[10px] text-stone-600 mt-0.5">
                      Postal code 110006 inferred from landmark with 98.4% confidence.
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#fcfaf6] border border-stone-200 text-stone-800">
                    <p className="font-semibold text-stone-900 flex items-center gap-1 text-[11px]">
                      <Sparkles className="w-3 h-3 text-[#9a3412]" />
                      GDPR Privacy Vault Engaged
                    </p>
                    <p className="text-[10px] text-stone-600 mt-0.5">
                      All phone numbers and GSTINs masked into HMAC-SHA256 tokens.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* agent.json Open Standard button */}
        {uiMode === "advanced" && (
          <button
            onClick={onOpenAgentSpec}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs shadow-xs transition-all font-medium cursor-pointer active:scale-[0.98]"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-mono hidden sm:inline">agent.json</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
