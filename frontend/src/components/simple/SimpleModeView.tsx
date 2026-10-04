"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Download,
  Search,
  FileText,
  Sliders,
  Check,
  Zap,
} from "lucide-react";
import { CleanEnterpriseRecord11Col, EnterpriseSample } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SimpleModeViewProps {
  selectedContent: string;
  onContentChange: (val: string) => void;
  selectedFileName: string;
  samples: EnterpriseSample[];
  onSelectSample: (sample: EnterpriseSample) => void;
  isRunning: boolean;
  onRunMigration: () => void;
  records: CleanEnterpriseRecord11Col[];
  onExportCsv: () => void;
  onExportJson: () => void;
  onSwitchToAdvanced: () => void;
}

export const SimpleModeView: React.FC<SimpleModeViewProps> = ({
  selectedContent,
  onContentChange,
  samples,
  onSelectSample,
  isRunning,
  onRunMigration,
  records,
  onExportCsv,
  onExportJson,
  onSwitchToAdvanced,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredRecords = records.filter(
    (r) =>
      r.full_name_clean.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.record_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2 animate-fadeIn">
      {/* 1. Welcoming Hero Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#9a3412]" />
          <span className="text-xs font-semibold text-amber-900 font-sans">
            Simple Mode · Easy Data Recasting
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-stone-900 tracking-tight leading-tight">
          Turn Messy Data into{" "}
          <span className="italic text-[#9a3412] underline decoration-amber-300 decoration-wavy underline-offset-8">
            Pristine 11 Columns.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-stone-600 font-sans leading-relaxed">
          Upload any unstructured address file, messy spreadsheet, or scanned receipt notes.
          Recast autonomously cleanses, fixes missing PIN codes, and structures your records.
        </p>
      </div>

      {/* 2. Prominent Drop Zone & Input Card */}
      <Card className="border-stone-200/90 shadow-[0_4px_24px_rgba(28,25,23,0.04)] bg-white overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Quick Preset Selector Chips */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider font-mono">
              Quick Test Samples:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#fcfaf6] hover:bg-stone-100 border border-stone-200 text-stone-800 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <span className="font-semibold text-stone-900">{sample.title.split("(")[0].trim()}</span>
                  {sample.badge && (
                    <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-mono">
                      {sample.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 transition-all flex flex-col items-center justify-center text-center space-y-4 ${
              isDragging
                ? "border-[#9a3412] bg-amber-50/50"
                : "border-stone-300 bg-[#fdfbf7] hover:border-stone-400"
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-center text-[#9a3412]">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-stone-900 font-sans">
                Drag and drop your legacy file here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[#9a3412] hover:underline font-bold cursor-pointer"
                >
                  browse files
                </button>
              </p>
              <p className="text-xs text-stone-500 font-sans">
                Supports CSV, TXT, PDF, OCR scan images, or paste directly below
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept=".csv,.txt,.pdf,.png,.jpg,.jpeg"
              className="hidden"
            />
          </div>

          {/* Paste or Edit Direct Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
              <span className="flex items-center gap-1.5 font-semibold text-stone-700">
                <FileText className="w-3.5 h-3.5 text-[#9a3412]" />
                Input Data Preview / Direct Paste:
              </span>
              <span>{selectedContent.length} characters</span>
            </div>

            <textarea
              value={selectedContent}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Paste raw addresses or CSV lines here..."
              rows={4}
              className="w-full rounded-xl border border-stone-300 bg-[#fcfaf6] p-3 text-xs text-stone-900 placeholder:text-stone-400 font-mono outline-none focus:border-[#9a3412] focus:bg-white shadow-xs resize-y"
            />
          </div>

          {/* 3. Single Primary 'Run / Recast' Action Button */}
          <div className="pt-2">
            <button
              onClick={onRunMigration}
              disabled={isRunning || !selectedContent.trim()}
              className={`w-full py-4 px-6 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                isRunning
                  ? "bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300"
                  : !selectedContent.trim()
                  ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed"
                  : "bg-stone-900 hover:bg-stone-800 text-stone-50 shadow-stone-900/10 active:scale-[0.99] border border-stone-900"
              }`}
            >
              {isRunning ? (
                <>
                  <span className="w-4 h-4 border-2 border-stone-500 border-t-stone-900 rounded-full animate-spin" />
                  <span>Cleansing & Recasting Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Recast My Data</span>
                  <ArrowRight className="w-5 h-5 text-amber-300" />
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 4. Straightforward Progress & Success Status Indicator */}
      {isRunning && (
        <Card className="border-amber-200 bg-amber-50/60 shadow-xs animate-fadeIn">
          <CardContent className="p-4 sm:p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-950 font-sans">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9a3412] animate-ping" />
                  Recasting Pipeline in Progress...
                </span>
                <span className="font-mono text-[11px] text-[#9a3412]">Active</span>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-amber-200/80 shadow-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                    1
                  </span>
                  <span className="font-medium text-stone-800">Reading layout & OCR</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-amber-200/80 shadow-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">
                    2
                  </span>
                  <span className="font-medium text-stone-800">AI entity cleansing</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-amber-200/80 shadow-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-[10px]">
                    3
                  </span>
                  <span className="font-medium text-stone-800">Self-healing missing PINs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Status Banner when completed */}
      {!isRunning && records.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 flex-none">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-emerald-950 text-sm font-sans">
                Successfully Cleansed {records.length} Records!
              </p>
              <p className="text-xs text-emerald-800 font-sans mt-0.5">
                All records structured into clean 11-column pure schemas with missing fields healed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={onExportCsv}
              size="sm"
              className="bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Download CSV</span>
            </Button>
            <Button
              onClick={onExportJson}
              size="sm"
              className="bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Download JSON</span>
            </Button>
          </div>
        </div>
      )}

      {/* 5. Clean Results Data Preview (Simple Mode Table) */}
      {records.length > 0 && (
        <Card className="border-stone-200/90 shadow-[0_2px_16px_rgba(28,25,23,0.04)] bg-white overflow-hidden">
          <div className="p-5 pb-3 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Cleaned Data Results ({records.length})
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                Standardized 11-column pure entities ready for export
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-56">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter results..."
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#fcfaf6] border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-[#9a3412]"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onSwitchToAdvanced}
                className="gap-1.5 text-stone-700 hover:text-stone-900"
              >
                <Sliders className="w-3.5 h-3.5 text-[#9a3412]" />
                <span className="hidden sm:inline">Advanced View</span>
              </Button>
            </div>
          </div>

          {/* Simple Clean Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-[#f5f2eb] text-[11px] uppercase tracking-wider text-stone-700 font-mono font-semibold">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Address</th>
                  <th className="py-2.5 px-3">City & State</th>
                  <th className="py-2.5 px-3">PIN Code</th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80 text-stone-800 text-xs font-sans">
                {filteredRecords.map((r) => {
                  const isHealed = r.postal_code.includes("[HEALED]");
                  return (
                    <tr key={r.record_id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3 px-3 font-semibold text-stone-900 whitespace-nowrap">
                        {r.full_name_clean}
                        <span className="block text-[10px] text-stone-500 font-mono">{r.record_id}</span>
                      </td>
                      <td className="py-3 px-3 max-w-[200px] truncate text-stone-700">
                        {r.address_line1}, {r.address_line2}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-stone-800">
                        {r.city}, {r.state_province.replace(" [HEALED]", "")}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono">
                        <span className="font-semibold text-stone-900">
                          {r.postal_code.replace(" [HEALED]", "")}
                        </span>
                        {isHealed && (
                          <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                            Healed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-stone-700">
                        {r.contact_normalized.replace(" [HEALED]", "")}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                          <Check className="w-3 h-3 text-emerald-700" />
                          Clean
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 6. Simple Before / After Story Card */}
      {records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#fff8f6] border-red-200/80">
            <CardContent className="p-4 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-rose-900 font-mono tracking-wider">
                Before: Unstructured Raw Input
              </span>
              <p className="text-xs text-stone-700 font-mono leading-relaxed line-clamp-3">
                {records[0].raw_source_snippet || "Legacy raw text stream..."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-stone-200">
            <CardContent className="p-4 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-[#9a3412] font-mono tracking-wider">
                After: Standardized 11-Column Record
              </span>
              <p className="text-xs text-stone-900 font-mono font-medium leading-relaxed line-clamp-3">
                {records[0].record_id} | {records[0].full_name_clean} | {records[0].city}, {records[0].state_province} | PIN: {records[0].postal_code}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SimpleModeView;
