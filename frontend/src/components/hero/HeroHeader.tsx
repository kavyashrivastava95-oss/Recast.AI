"use client";

import React from "react";
import { Sparkles, Terminal, ArrowUpRight, Cpu } from "lucide-react";

interface HeroHeaderProps {
  onOpenAgentSpec?: () => void;
  activeDialect?: string;
  onDialectChange?: (dialect: string) => void;
  isBackendHealthy?: boolean;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onOpenAgentSpec,
  activeDialect = "IN_ENTERPRISE",
  onDialectChange,
}) => {
  return (
    <header className="pointer-events-none relative z-20 w-full px-4 sm:px-8 pt-5 pb-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-stone-200/80 pb-4">
        {/* Brand & Identity */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-stone-900 shadow-sm border border-stone-800 text-stone-100">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-stone-900 font-serif">
                RECAST<span className="text-[#9a3412]">.AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-300/80 uppercase tracking-widest font-mono">
                Ledger Edition
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium hidden sm:block">
              Autonomous Enterprise Data Migration & Smart Parsing Agent
            </p>
          </div>
        </div>

        {/* Live Engine Status & Dialect Selector */}
        <div className="pointer-events-auto flex items-center gap-3">
          {/* Engine Status pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-stone-200 text-xs text-stone-700 shadow-xs backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5 text-[#9a3412]" />
            <span className="font-medium text-stone-800">Gemma 4 Multimodal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span className="text-[11px] text-emerald-800 font-mono font-semibold">99.4% SLA</span>
          </div>

          {/* Dialect Selector */}
          <div className="flex items-center rounded-xl bg-stone-100/90 border border-stone-200 p-0.5 shadow-xs">
            <button
              onClick={() => onDialectChange?.("IN_ENTERPRISE")}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                activeDialect === "IN_ENTERPRISE"
                  ? "bg-white text-stone-950 font-semibold shadow-xs border border-stone-200/80"
                  : "text-stone-600 hover:text-stone-900 font-medium"
              }`}
            >
              Indic / Hinglish
            </button>
            <button
              onClick={() => onDialectChange?.("GLOBAL_ENTERPRISE")}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                activeDialect === "GLOBAL_ENTERPRISE"
                  ? "bg-white text-stone-950 font-semibold shadow-xs border border-stone-200/80"
                  : "text-stone-600 hover:text-stone-900 font-medium"
              }`}
            >
              Global Schema
            </button>
          </div>

          {/* agent.json spec button */}
          <button
            onClick={onOpenAgentSpec}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs text-stone-800 shadow-xs transition-all font-medium hover:border-stone-300 active:scale-[0.98]"
          >
            <Terminal className="w-3.5 h-3.5 text-[#9a3412]" />
            <span className="hidden sm:inline font-mono">agent.json</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeroHeader;
