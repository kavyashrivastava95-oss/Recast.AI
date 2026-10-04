"use client";

import React, { useEffect, useRef } from "react";
import { Terminal, Clock, Copy, BookOpen } from "lucide-react";

interface ExecutionTerminalProps {
  logs: Array<{
    id: string;
    timestamp: string;
    stage: string;
    message: string;
    type: "info" | "success" | "weapon" | "crypto" | "gemma";
    latency?: string;
  }>;
  isRunning: boolean;
  totalTimeMs?: number;
}

export const ExecutionTerminal: React.FC<ExecutionTerminalProps> = ({
  logs,
  isRunning,
  totalTimeMs,
}) => {
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const copyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] [${l.stage}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7] border border-stone-200/90 rounded-2xl shadow-[0_2px_16px_rgba(28,25,23,0.04)] overflow-hidden font-mono">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f5f2eb] border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300 inline-block border border-stone-400/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block border border-amber-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400 inline-block border border-stone-500/40" />
          </div>
          <span className="ml-2 text-xs font-semibold text-stone-800 flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5 text-[#9a3412]" />
            recast-orchestrator :: langgraph-dag
          </span>
        </div>

        <div className="flex items-center gap-3">
          {totalTimeMs ? (
            <span className="flex items-center gap-1 text-[11px] text-stone-800 bg-white border border-stone-200 px-2 py-0.5 rounded shadow-xs font-mono">
              <Clock className="w-3 h-3 text-[#9a3412]" />
              {totalTimeMs}ms
            </span>
          ) : null}

          {isRunning && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#9a3412] font-semibold font-mono">
              <span className="w-2 h-2 rounded-full bg-[#b45309] animate-ping" />
              Processing
            </span>
          )}

          <button
            onClick={copyLogs}
            title="Copy execution trace"
            className="text-stone-500 hover:text-stone-900 transition-colors p-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Step Indicator Ribbon */}
      <div className="px-4 py-2 bg-stone-100/70 border-b border-stone-200/70 flex items-center justify-between text-[10px] text-stone-600 overflow-x-auto gap-2">
        <span className="font-semibold text-stone-700 whitespace-nowrap">Pipeline Chain:</span>
        <div className="flex items-center gap-1.5 font-mono whitespace-nowrap">
          <span className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-800">Docling + OCR</span>
          <span className="text-stone-400">→</span>
          <span className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-800">Unstructured</span>
          <span className="text-stone-400">→</span>
          <span className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-800">LangGraph</span>
          <span className="text-stone-400">→</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 font-semibold">Gemma 4</span>
        </div>
      </div>

      {/* Terminal Log Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2.5 text-xs select-text">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-500 text-center py-12">
            <BookOpen className="w-8 h-8 mb-2 text-stone-400 opacity-60" />
            <p className="font-semibold text-stone-700 font-serif text-sm">Archival Execution Log Standing By</p>
            <p className="text-[11px] text-stone-500 max-w-xs mt-1 font-sans">
              Select an enterprise sample or paste legacy data and click Run Autonomous Migration to view live pipeline logs.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors border shadow-xs ${
                log.type === "weapon"
                  ? "bg-amber-50/70 border-amber-200/80 text-stone-900"
                  : log.type === "crypto"
                  ? "bg-stone-100/70 border-stone-200 text-stone-900"
                  : log.type === "gemma"
                  ? "bg-orange-50/70 border-orange-200 text-stone-900"
                  : log.type === "success"
                  ? "bg-emerald-50/70 border-emerald-200 text-stone-900"
                  : "bg-white border-stone-200 text-stone-800"
              }`}
            >
              <span className="text-[10px] text-stone-400 whitespace-nowrap mt-0.5 font-mono">
                {log.timestamp}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider font-mono ${
                      log.type === "weapon"
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : log.type === "crypto"
                        ? "bg-stone-200 text-stone-800 border border-stone-300"
                        : log.type === "gemma"
                        ? "bg-orange-100 text-orange-900 border border-orange-300"
                        : log.type === "success"
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-stone-100 text-stone-700 border border-stone-200"
                    }`}
                  >
                    {log.stage}
                  </span>
                  {log.latency && (
                    <span className="text-[10px] text-stone-400 font-mono">
                      +{log.latency}
                    </span>
                  )}
                </div>
                <p className="text-xs leading-relaxed font-sans text-stone-800">{log.message}</p>
              </div>
            </div>
          ))
        )}

        {isRunning && (
          <div className="flex items-center gap-2 text-[#9a3412] p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs font-mono">
            <span className="w-3.5 h-3.5 border-2 border-[#9a3412] border-t-transparent rounded-full animate-spin" />
            <span className="font-semibold animate-pulse">Multimodal Agent Reasoning & Synthesizing 11 Columns...</span>
          </div>
        )}
        <div ref={terminalBottomRef} />
      </div>
    </div>
  );
};

export default ExecutionTerminal;
