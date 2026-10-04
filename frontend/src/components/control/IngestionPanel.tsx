"use client";

import React, { useState, useRef } from "react";
import { Upload, Sparkles, Shield, Wrench, Languages, FileText, ArrowRight } from "lucide-react";
import { EnterpriseSample } from "@/lib/types";

interface IngestionPanelProps {
  samples: EnterpriseSample[];
  selectedContent: string;
  onContentChange: (content: string) => void;
  onSelectSample: (sample: EnterpriseSample) => void;
  privacyGuard: boolean;
  onPrivacyGuardChange: (val: boolean) => void;
  selfHealing: boolean;
  onSelfHealingChange: (val: boolean) => void;
  vernacularMode: boolean;
  onVernacularModeChange: (val: boolean) => void;
  isRunning: boolean;
  onRunMigration: () => void;
}

export const IngestionPanel: React.FC<IngestionPanelProps> = ({
  samples,
  selectedContent,
  onContentChange,
  onSelectSample,
  privacyGuard,
  onPrivacyGuardChange,
  selfHealing,
  onSelfHealingChange,
  vernacularMode,
  onVernacularModeChange,
  isRunning,
  onRunMigration,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        onContentChange(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-stone-200/90 rounded-2xl p-5 shadow-[0_2px_16px_rgba(28,25,23,0.04)] relative">
      {/* Title & Badge */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-[#9a3412]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-wide uppercase font-mono">
              1. Ingest Messy Legacy Data
            </h2>
            <p className="text-[11px] text-stone-500 font-sans">
              Migration Control Center & Ingestion Ledger
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 font-mono">
          Docling · PaddleOCR · Unstructured
        </span>
      </div>

      {/* Preset Quick Selectors */}
      <div className="mb-4">
        <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest block mb-2 font-mono">
          Enterprise Archival Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {samples.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="text-left p-2.5 rounded-xl bg-[#fcfaf6] hover:bg-[#f5f2eb] border border-stone-200/90 hover:border-amber-700/40 transition-all group flex flex-col justify-between shadow-xs"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold text-stone-900 group-hover:text-[#9a3412] truncate font-sans">
                  {sample.title.split("(")[0].trim()}
                </span>
                {sample.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-300 font-mono">
                    {sample.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-stone-500 line-clamp-1 mt-1 font-sans">
                {sample.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Drag & Drop File Zone or Direct Textarea */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        className={`relative flex-1 min-h-[160px] rounded-xl border border-dashed transition-all flex flex-col p-3.5 shadow-xs ${
          isDragging
            ? "border-[#9a3412] bg-amber-50/60"
            : "border-stone-300 bg-[#fcfaf6] hover:border-stone-400 focus-within:border-[#9a3412] focus-within:bg-white"
        }`}
      >
        <textarea
          value={selectedContent}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Paste unstructured legacy address strings, CSV rows, or OCR scan text here (e.g. 'M/s Rajesh & Sons, Gali No 4, opp Sharma sweets, near peeli kothi, Dilli')..."
          className="w-full flex-1 bg-transparent text-xs text-stone-900 placeholder-stone-400 resize-none outline-none font-mono leading-relaxed"
        />

        <div className="pt-2.5 border-t border-stone-200/80 flex items-center justify-between">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#9a3412] transition-colors font-medium"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV, PDF, or Scan</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept=".csv,.txt,.pdf,.png,.jpg,.jpeg"
            className="hidden"
          />
          <span className="text-[10px] text-stone-400 font-mono">
            {selectedContent.length} chars
          </span>
        </div>
      </div>

      {/* 5 Enterprise Weapons Toggles */}
      <div className="mt-4 pt-3.5 border-t border-stone-200/80 space-y-2">
        <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest block mb-1 font-mono">
          Active Enterprise Weapons
        </label>

        {/* Weapon 1: Zero-Shot Self-Healing */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fcfaf6] border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100/80 border border-amber-300/60 flex items-center justify-center text-amber-900">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900 flex items-center gap-1.5 font-sans">
                Zero-Shot Self-Healing
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300/80 font-mono">
                  Weapon 1
                </span>
              </p>
              <p className="text-[10px] text-stone-500 font-sans">
                Predicts & heals missing PIN codes and states
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelfHealingChange(!selfHealing)}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              selfHealing ? "bg-[#9a3412]" : "bg-stone-300"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                selfHealing ? "left-5.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Weapon 2: GDPR Privacy Guard */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fcfaf6] border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-800">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900 flex items-center gap-1.5 font-sans">
                GDPR Privacy Guard
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-800 border border-stone-300 font-mono">
                  Weapon 2
                </span>
              </p>
              <p className="text-[10px] text-stone-500 font-sans">
                Cryptographic tokenization before LLM reasoning
              </p>
            </div>
          </div>
          <button
            onClick={() => onPrivacyGuardChange(!privacyGuard)}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              privacyGuard ? "bg-stone-900" : "bg-stone-300"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                privacyGuard ? "left-5.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Weapon 3: Vernacular Parser */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#fcfaf6] border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-900">
              <Languages className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900 flex items-center gap-1.5 font-sans">
                Vernacular Parser
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-900 border border-orange-200 font-mono">
                  Weapon 3
                </span>
              </p>
              <p className="text-[10px] text-stone-500 font-sans">
                Translates Hinglish, colloquial landmarks & slangs
              </p>
            </div>
          </div>
          <button
            onClick={() => onVernacularModeChange(!vernacularMode)}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              vernacularMode ? "bg-[#b45309]" : "bg-stone-300"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                vernacularMode ? "left-5.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Migration Trigger Button */}
      <button
        onClick={onRunMigration}
        disabled={isRunning || !selectedContent.trim()}
        className={`mt-4 w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
          isRunning
            ? "bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300"
            : !selectedContent.trim()
            ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed"
            : "bg-stone-900 hover:bg-stone-800 text-stone-50 shadow-md shadow-stone-900/10 border border-stone-900 active:scale-[0.99]"
        }`}
      >
        {isRunning ? (
          <>
            <span className="w-4 h-4 border-2 border-stone-600 border-t-stone-900 rounded-full animate-spin" />
            <span>Agent Orchestrating Migration...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Run Autonomous Migration</span>
            <ArrowRight className="w-4 h-4 text-amber-300 ml-1" />
          </>
        )}
      </button>
    </div>
  );
};

export default IngestionPanel;
