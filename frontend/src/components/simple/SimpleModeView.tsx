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
  FileSpreadsheet,
  User,
} from "lucide-react";
import { CleanEnterpriseRecord11Col, EnterpriseSample } from "@/lib/types";
import { exportToExcel, exportToCsv, exportToJson } from "@/lib/exportUtils";
import { decomposeName } from "@/lib/nameUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  selectedFileName,
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
  const [activeSheet, setActiveSheet] = useState<"11col" | "nameAnalysis">("11col");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getRecordNameInfo = (r: CleanEnterpriseRecord11Col) => {
    if (r.first_name || r.last_name) {
      return {
        firstName: r.first_name || "",
        middleName: r.middle_name || "",
        lastName: r.last_name || "",
        salutation: r.salutation || "",
        relationship: r.relationship || "",
      };
    }
    const decomp = decomposeName(r.full_name_clean, r.entity_type);
    return {
      firstName: decomp.first_name,
      middleName: decomp.middle_name,
      lastName: decomp.last_name,
      salutation: decomp.salutation,
      relationship: decomp.relationship,
    };
  };

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

  const handleExportExcelDirect = () => {
    exportToExcel(records, "recast_11col_clean_records.xls");
  };

  const filteredRecords = records.filter(
    (r) =>
      r.full_name_clean.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.record_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tax_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2 animate-fadeIn font-sans">
      {/* 1. Welcoming Hero Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#9a3412]" />
          <span className="text-xs font-semibold text-amber-900 font-sans">
            Simple Mode · 1-Click Excel Recasting
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
          Recast autonomously cleanses, fixes missing PIN codes, and outputs an Excel sheet ready for enterprise ERP.
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
                {selectedFileName && (
                  <span className="text-[11px] font-normal text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    {selectedFileName}
                  </span>
                )}
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

      {/* Success Status Banner with One-Click Excel Download */}
      {!isRunning && records.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 flex-none">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-emerald-950 text-sm font-sans">
                Successfully Cleansed {records.length} Records into 11 Columns!
              </p>
              <p className="text-xs text-emerald-800 font-sans mt-0.5">
                Formatted as a complete Excel spreadsheet with all 11 enterprise fields validated.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Primary Excel Download Button */}
            <Button
              onClick={handleExportExcelDirect}
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-800 shadow-sm font-semibold"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
              <span>Download Excel (.xls)</span>
            </Button>
            <Button
              onClick={onExportCsv}
              size="sm"
              variant="outline"
              className="bg-white hover:bg-stone-50 text-stone-800 border-stone-200"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>CSV</span>
            </Button>
            <Button
              onClick={onExportJson}
              size="sm"
              variant="outline"
              className="bg-white hover:bg-stone-50 text-stone-800 border-stone-200"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>JSON</span>
            </Button>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. EXCEL SPREADSHEET COMPONENT (Proper 11 Schema Data View)
          ========================================================================= */}
      {records.length > 0 && (
        <Card className="border-stone-200/90 shadow-[0_4px_24px_rgba(28,25,23,0.04)] bg-white overflow-hidden">
          {/* Excel Ribbon & Toolbar */}
          <div className="bg-[#f5f2eb] px-4 py-3 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded bg-[#107c41] text-white shadow-xs">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900 text-xs font-mono">
                    Recast_Clean_11_Columns.xlsx
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold">
                    11 Schema Fields
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 font-sans">
                  Interactive Excel Sheet Preview · {records.length} Rows × 11 Columns
                </span>
              </div>
            </div>

            {/* Toolbar Actions */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {/* Sheet Switcher */}
              <div className="flex items-center bg-stone-200/80 p-0.5 rounded-lg border border-stone-300">
                <button
                  type="button"
                  onClick={() => setActiveSheet("11col")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                    activeSheet === "11col"
                      ? "bg-white text-stone-900 shadow-xs border border-stone-200/80"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  11-Schema
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSheet("nameAnalysis")}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    activeSheet === "nameAnalysis"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>1st / Mid / Last</span>
                </button>
              </div>

              <div className="relative w-36 sm:w-48">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter cells..."
                  className="w-full h-7 pl-8 pr-2.5 rounded bg-white border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 outline-none focus:border-emerald-700 shadow-xs"
                />
              </div>

              <Button
                onClick={handleExportExcelDirect}
                size="sm"
                className="h-7 px-2.5 text-xs bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-800 shadow-xs gap-1 font-semibold"
                title="Download this exact Excel sheet with both sheets"
              >
                <Download className="w-3 h-3 text-emerald-200" />
                <span>Export</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onSwitchToAdvanced}
                className="h-7 px-2.5 text-xs text-stone-700 hover:text-stone-900 border-stone-300"
              >
                <Sliders className="w-3 h-3 text-[#9a3412]" />
                <span className="hidden sm:inline">Advanced</span>
              </Button>
            </div>
          </div>

          {/* Excel Formula Bar */}
          <div className="bg-[#fcfaf6] px-4 py-1.5 border-b border-stone-200/80 flex items-center gap-3 text-[11px] font-mono text-stone-600">
            <span className="font-bold text-stone-700 select-none">fx</span>
            <div className="h-3.5 w-[1px] bg-stone-300" />
            <span className="text-stone-500 truncate">
              {activeSheet === "11col"
                ? '=RECAST_CLEAN_SCHEMA(source: "legacy_data", columns: 11, status: "VALIDATED")'
                : '=ANALYZE_NAME_COMPONENTS(entity: "INDIVIDUAL", fields: ["1st_name", "middle_name", "last_name", "salutation", "relationship"])'}
            </span>
          </div>

          {/* Excel Sheet Grid */}
          <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
            {activeSheet === "11col" ? (
              /* SHEET 1: STANDARD 11-SCHEMA VIEW WITH NAME DECOMPOSITION BADGES */
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  {/* Excel Column Letters (A through K) */}
                  <tr className="bg-[#ece7de] text-[10px] text-stone-500 font-semibold border-b border-stone-200 select-none">
                    <th className="w-10 py-1 px-2 text-center border-r border-stone-200/80">◿</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[130px]">A</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[100px]">B</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[220px]">C</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[130px]">D</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[200px]">E</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[180px]">F</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[120px]">G</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[130px]">H</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[110px]">I</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[150px]">J</th>
                    <th className="py-1 px-3 text-center min-w-[110px]">K</th>
                  </tr>

                  {/* 11 Proper Schema Headers (Row 1) */}
                  <tr className="bg-[#f5f2eb] text-[11px] text-stone-800 font-bold border-b border-stone-300">
                    <td className="w-10 py-2 px-2 text-center bg-[#ece7de] text-stone-500 text-[10px] border-r border-stone-300 font-mono select-none">
                      1
                    </td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">record_id</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">entity_type</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">
                      full_name_clean
                      <span className="block text-[9px] font-normal text-stone-500 font-sans">
                        [1st · Mid · Last Breakdown]
                      </span>
                    </td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">tax_id</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">address_line1</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">address_line2</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">city</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">state_province</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">postal_code</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">contact_normalized</td>
                    <td className="py-2 px-3 font-mono whitespace-nowrap text-right">confidence_score</td>
                  </tr>
                </thead>

                {/* Data Rows (Rows 2..N) */}
                <tbody className="divide-y divide-stone-200/70 text-xs">
                  {filteredRecords.map((r, idx) => {
                    const rowNumber = idx + 2;
                    const isHealedPin = r.postal_code.includes("[HEALED]");
                    const isHealedState = r.state_province.includes("[HEALED]");
                    const nameInfo = getRecordNameInfo(r);

                    return (
                      <tr
                        key={r.record_id}
                        className="even:bg-[#fdfbf7] hover:bg-emerald-50/40 transition-colors group"
                      >
                        {/* Excel Row Coordinate Number */}
                        <td className="w-10 py-2.5 px-2 text-center bg-[#f7f4ed] text-stone-500 text-[10px] border-r border-stone-200/80 font-mono select-none">
                          {rowNumber}
                        </td>

                        {/* Col A: record_id */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 font-semibold text-stone-900 whitespace-nowrap">
                          {r.record_id}
                        </td>

                        {/* Col B: entity_type */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 whitespace-nowrap">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-stone-100 text-stone-800 border border-stone-300">
                            {r.entity_type}
                          </span>
                        </td>

                        {/* Col C: full_name_clean (With 1st, Mid, Last Name Analysis) */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 font-sans text-stone-900 min-w-[220px]">
                          <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                            {nameInfo.salutation && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 font-mono border border-amber-200 font-bold">
                                {nameInfo.salutation}
                              </span>
                            )}
                            <span className="text-stone-900">{r.full_name_clean}</span>
                          </div>

                          {/* Decomposed Name Sub-Pills */}
                          <div className="flex items-center gap-1 mt-1 text-[9px] font-mono flex-wrap">
                            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-900 border border-emerald-200" title="1st Name (Given / Forename)">
                              1st: <strong className="font-semibold">{nameInfo.firstName}</strong>
                            </span>
                            {nameInfo.middleName && (
                              <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 border border-stone-200" title="Middle Name">
                                Mid: <strong className="font-semibold">{nameInfo.middleName}</strong>
                              </span>
                            )}
                            {nameInfo.lastName && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200" title="Last Name (Surname)">
                                Last: <strong className="font-semibold">{nameInfo.lastName}</strong>
                              </span>
                            )}
                            {nameInfo.relationship && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[8px]" title="Relationship / Care-Of">
                                {nameInfo.relationship}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Col D: tax_id */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 text-stone-600 whitespace-nowrap">
                          {r.tax_id}
                        </td>

                        {/* Col E: address_line1 */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 font-sans text-stone-700 whitespace-nowrap max-w-[220px] truncate" title={r.address_line1}>
                          {r.address_line1}
                        </td>

                        {/* Col F: address_line2 */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 font-sans text-stone-500 whitespace-nowrap max-w-[180px] truncate" title={r.address_line2}>
                          {r.address_line2}
                        </td>

                        {/* Col G: city */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 font-sans text-stone-800 whitespace-nowrap">
                          {r.city}
                        </td>

                        {/* Col H: state_province */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 font-sans whitespace-nowrap">
                          <span className={isHealedState ? "text-stone-900 font-semibold" : "text-stone-700"}>
                            {r.state_province.replace(" [HEALED]", "")}
                          </span>
                          {isHealedState && (
                            <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              Healed
                            </span>
                          )}
                        </td>

                        {/* Col I: postal_code */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 whitespace-nowrap">
                          <span className={isHealedPin ? "text-stone-900 font-semibold" : "text-stone-700"}>
                            {r.postal_code.replace(" [HEALED]", "")}
                          </span>
                          {isHealedPin && (
                            <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                              Healed
                            </span>
                          )}
                        </td>

                        {/* Col J: contact_normalized */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 text-stone-700 whitespace-nowrap">
                          {r.contact_normalized.replace(" [HEALED]", "")}
                        </td>

                        {/* Col K: confidence_score */}
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                            <Check className="w-3 h-3 text-emerald-700" />
                            {(r.confidence_score * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              /* SHEET 2: EXPLICIT 1ST, MIDDLE, LAST NAME DECOMPOSITION SPREADSHEET */
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  {/* Excel Column Letters (A through I) */}
                  <tr className="bg-[#ece7de] text-[10px] text-stone-500 font-semibold border-b border-stone-200 select-none">
                    <th className="w-10 py-1 px-2 text-center border-r border-stone-200/80">◿</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[130px]">A</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[100px]">B</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[180px]">C</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[140px] bg-emerald-100/50">D</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[130px] bg-emerald-100/50">E</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[140px] bg-emerald-100/50">F</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[100px]">G</th>
                    <th className="py-1 px-3 border-r border-stone-200/80 text-center min-w-[170px]">H</th>
                    <th className="py-1 px-3 text-center min-w-[100px]">I</th>
                  </tr>

                  {/* Header Row */}
                  <tr className="bg-[#f5f2eb] text-[11px] text-stone-800 font-bold border-b border-stone-300">
                    <td className="w-10 py-2 px-2 text-center bg-[#ece7de] text-stone-500 text-[10px] border-r border-stone-300 font-mono select-none">
                      1
                    </td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">record_id</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">entity_type</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">full_name_clean</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap text-emerald-900 bg-emerald-50/70 font-bold">
                      1st_name (Given)
                    </td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap text-stone-900 bg-stone-100/70 font-bold">
                      middle_name
                    </td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap text-amber-900 bg-amber-50/70 font-bold">
                      last_name (Surname)
                    </td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">salutation</td>
                    <td className="py-2 px-3 border-r border-stone-200 font-mono whitespace-nowrap">relationship / care_of</td>
                    <td className="py-2 px-3 font-mono whitespace-nowrap text-right">confidence</td>
                  </tr>
                </thead>

                {/* Data Rows */}
                <tbody className="divide-y divide-stone-200/70 text-xs">
                  {filteredRecords.map((r, idx) => {
                    const rowNumber = idx + 2;
                    const nameInfo = getRecordNameInfo(r);

                    return (
                      <tr
                        key={r.record_id}
                        className="even:bg-[#fdfbf7] hover:bg-emerald-50/40 transition-colors group"
                      >
                        {/* Row number */}
                        <td className="w-10 py-2.5 px-2 text-center bg-[#f7f4ed] text-stone-500 text-[10px] border-r border-stone-200/80 font-mono select-none">
                          {rowNumber}
                        </td>

                        {/* Col A */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 font-semibold text-stone-900 whitespace-nowrap">
                          {r.record_id}
                        </td>

                        {/* Col B */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 whitespace-nowrap">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-stone-100 text-stone-800 border border-stone-300">
                            {r.entity_type}
                          </span>
                        </td>

                        {/* Col C */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 font-sans font-semibold text-stone-900 whitespace-nowrap">
                          {r.full_name_clean}
                        </td>

                        {/* Col D: 1st Name */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 font-sans font-bold text-emerald-900 bg-emerald-50/40 whitespace-nowrap">
                          {nameInfo.firstName || "—"}
                        </td>

                        {/* Col E: Middle Name */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 font-sans font-medium text-stone-700 bg-stone-50/40 whitespace-nowrap">
                          {nameInfo.middleName || "—"}
                        </td>

                        {/* Col F: Last Name */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 font-sans font-bold text-amber-900 bg-amber-50/40 whitespace-nowrap">
                          {nameInfo.lastName || "—"}
                        </td>

                        {/* Col G: Salutation */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 text-stone-600 whitespace-nowrap font-sans">
                          {nameInfo.salutation ? (
                            <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-800 border border-stone-200">
                              {nameInfo.salutation}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* Col H: Relationship */}
                        <td className="py-2.5 px-3 border-r border-stone-200/80 text-stone-700 whitespace-nowrap font-sans">
                          {nameInfo.relationship ? (
                            <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[10px]">
                              {nameInfo.relationship}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* Col I: Confidence */}
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                            <Check className="w-3 h-3 text-emerald-700" />
                            {(r.confidence_score * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Excel Sheet Footer Tab Bar */}
          <div className="bg-[#ece7de] px-4 py-2 border-t border-stone-300 flex items-center justify-between text-xs text-stone-600 select-none">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveSheet("11col")}
                className={`px-3 py-1 rounded-t flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer transition-all ${
                  activeSheet === "11col"
                    ? "bg-white border-t-2 border-t-emerald-700 border-x border-stone-300 text-stone-900 shadow-xs"
                    : "bg-[#e2ded5] hover:bg-stone-200 text-stone-600 border border-transparent"
                }`}
              >
                <FileSpreadsheet className={`w-3.5 h-3.5 ${activeSheet === "11col" ? "text-emerald-700" : "text-stone-500"}`} />
                <span>Sheet1: 11_Column_Enterprise_Schema</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSheet("nameAnalysis")}
                className={`px-3 py-1 rounded-t flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer transition-all ${
                  activeSheet === "nameAnalysis"
                    ? "bg-white border-t-2 border-t-emerald-700 border-x border-stone-300 text-stone-900 shadow-xs"
                    : "bg-[#e2ded5] hover:bg-stone-200 text-stone-600 border border-transparent"
                }`}
              >
                <User className={`w-3.5 h-3.5 ${activeSheet === "nameAnalysis" ? "text-emerald-700" : "text-stone-500"}`} />
                <span>Sheet2: Name_Analysis (1st, Mid, Last)</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-stone-500 hidden sm:block">
              {activeSheet === "11col" ? "11 Fields Standard Schema" : "1st, Middle, Last Names Breakdown"} · {records.length} records · UTF-8
            </div>
          </div>
        </Card>
      )}

      {/* 5b. Dedicated Entity Name Intelligence Breakdown Summary Card */}
      {records.length > 0 && (
        <Card className="border-stone-200/90 bg-white shadow-xs overflow-hidden">
          <div className="bg-[#fcfaf6] px-5 py-3 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-[#9a3412]">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-900 font-sans">
                  Entity Name Intelligence &amp; Decomposition Analysis
                </h3>
                <p className="text-[10px] text-stone-500 font-mono">
                  Autonomous extraction of 1st Name (Given), Middle Name, Last Name (Surname), Salutations &amp; Relations
                </p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-50 text-amber-900 border border-amber-200 font-semibold self-start sm:self-center">
              {records.length} Entities Analyzed
            </span>
          </div>

          <CardContent className="p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredRecords.slice(0, 6).map((r) => {
                const nameInfo = getRecordNameInfo(r);
                return (
                  <div
                    key={r.record_id}
                    className="p-3 rounded-xl bg-[#fdfbf7] border border-stone-200/80 space-y-2 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-stone-500">
                        {r.record_id}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold bg-stone-100 text-stone-700 border border-stone-300">
                        {r.entity_type}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-stone-900 font-sans flex items-center gap-1.5">
                        {nameInfo.salutation && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 font-mono font-semibold">
                            {nameInfo.salutation}
                          </span>
                        )}
                        <span>{r.full_name_clean}</span>
                      </div>
                      {nameInfo.relationship && (
                        <p className="text-[10px] text-stone-500 italic font-sans mt-0.5">
                          {nameInfo.relationship}
                        </p>
                      )}
                    </div>

                    <div className="pt-1.5 border-t border-stone-200/70 grid grid-cols-3 gap-1.5 text-center font-mono">
                      <div className="p-1 rounded bg-white border border-stone-200 shadow-2xs">
                        <span className="block text-[8px] text-stone-400 uppercase font-sans">1st Name</span>
                        <span className="text-[10px] font-bold text-emerald-900 truncate block">
                          {nameInfo.firstName || "—"}
                        </span>
                      </div>
                      <div className="p-1 rounded bg-white border border-stone-200 shadow-2xs">
                        <span className="block text-[8px] text-stone-400 uppercase font-sans">Middle</span>
                        <span className="text-[10px] font-bold text-stone-700 truncate block">
                          {nameInfo.middleName || "—"}
                        </span>
                      </div>
                      <div className="p-1 rounded bg-white border border-stone-200 shadow-2xs">
                        <span className="block text-[8px] text-stone-400 uppercase font-sans">Last Name</span>
                        <span className="text-[10px] font-bold text-amber-900 truncate block">
                          {nameInfo.lastName || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 6. Simple Before / After Story Card */}
      {records.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#fff8f6] border-red-200/80 shadow-xs">
            <CardContent className="p-4 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-rose-900 font-mono tracking-wider">
                Before: Unstructured Raw Input
              </span>
              <p className="text-xs text-stone-700 font-mono leading-relaxed line-clamp-3">
                {records[0].raw_source_snippet || "Legacy raw text stream..."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-stone-200 shadow-xs">
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
