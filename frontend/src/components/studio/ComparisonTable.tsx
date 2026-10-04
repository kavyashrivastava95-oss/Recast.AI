"use client";

import React, { useState } from "react";
import { CleanEnterpriseRecord11Col } from "@/lib/types";
import { CheckCircle2, Eye, EyeOff, Download, Sparkles } from "lucide-react";

interface ComparisonTableProps {
  records: CleanEnterpriseRecord11Col[];
  showPiiMasked: boolean;
  onTogglePiiMasked: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  records,
  showPiiMasked,
  onTogglePiiMasked,
  onExportCsv,
  onExportJson,
}) => {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredRecords = records.filter((r) => {
    const matchesType = filterType === "ALL" || r.entity_type === filterType;
    const matchesSearch =
      r.full_name_clean.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.record_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tax_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col bg-white border border-stone-200/90 rounded-2xl p-6 shadow-[0_2px_16px_rgba(28,25,23,0.04)]">
      {/* Controls & Metrics Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9a3412]" />
              Standardized 11-Column Schema Ledger
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-300 font-mono">
              {records.length} Records Ingested
            </span>
          </div>
          <p className="text-xs text-stone-500 font-sans mt-1">
            Legacy unstructured records converted to production-grade enterprise schema with field-level confidence ratings.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* PII Masking toggle button */}
          <button
            onClick={onTogglePiiMasked}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-xs ${
              showPiiMasked
                ? "bg-amber-50 text-amber-900 border-amber-300"
                : "bg-[#fcfaf6] text-stone-700 border-stone-200 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            {showPiiMasked ? <EyeOff className="w-3.5 h-3.5 text-[#9a3412]" /> : <Eye className="w-3.5 h-3.5 text-stone-600" />}
            <span>{showPiiMasked ? "PII Vault Masked" : "Reveal Decrypted"}</span>
          </button>

          {/* Export buttons */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fcfaf6] hover:bg-stone-100 border border-stone-200 text-xs font-medium text-stone-800 transition-all active:scale-[0.98] shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-mono">CSV</span>
          </button>
          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fcfaf6] hover:bg-stone-100 border border-stone-200 text-xs font-medium text-stone-800 transition-all active:scale-[0.98] shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-mono">JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "ENTERPRISE", "INDIVIDUAL", "VENDOR", "LOGISTICS_HUB"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono font-medium transition-all cursor-pointer ${
                filterType === cat
                  ? "bg-stone-900 text-stone-50 shadow-xs border border-stone-900 font-semibold"
                  : "bg-stone-100/80 text-stone-600 border border-stone-200/80 hover:bg-stone-200/70 hover:text-stone-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by name, city, ID, or Tax ID..."
          className="px-3 py-1.5 rounded-xl bg-[#fcfaf6] border border-stone-300 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-[#9a3412] focus:bg-white w-full sm:w-64 shadow-xs font-sans"
        />
      </div>

      {/* 11-Column Schema Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200/90 bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-[#f5f2eb] text-[11px] uppercase tracking-wider text-stone-700 font-mono font-semibold">
              <th className="py-3 px-3"># Record ID</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Clean Entity Name</th>
              <th className="py-3 px-3">Tax ID</th>
              <th className="py-3 px-3">Address Line 1</th>
              <th className="py-3 px-3">Address Line 2</th>
              <th className="py-3 px-3">City</th>
              <th className="py-3 px-3">State</th>
              <th className="py-3 px-3">Postal Code</th>
              <th className="py-3 px-3">Contact (E.164)</th>
              <th className="py-3 px-3 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/80 text-stone-800 font-mono text-[11px]">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-stone-500 font-sans">
                  No records matching the filter criteria.
                </td>
              </tr>
            ) : (
              filteredRecords.map((r) => {
                const isHealedPin = r.postal_code.includes("[HEALED]");
                const isHealedState = r.state_province.includes("[HEALED]");
                const isHealedContact = r.contact_normalized.includes("[HEALED]");

                return (
                  <tr
                    key={r.record_id}
                    className="even:bg-[#fdfbf7] hover:bg-amber-50/50 transition-colors group"
                  >
                    {/* 1. Record ID */}
                    <td className="py-3 px-3 font-semibold text-stone-900 whitespace-nowrap font-mono">
                      {r.record_id}
                    </td>

                    {/* 2. Entity Type */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border font-mono ${
                          r.entity_type === "ENTERPRISE"
                            ? "bg-stone-100 text-stone-800 border-stone-300"
                            : r.entity_type === "INDIVIDUAL"
                            ? "bg-amber-50 text-amber-900 border-amber-200"
                            : "bg-orange-50 text-orange-900 border-orange-200"
                        }`}
                      >
                        {r.entity_type}
                      </span>
                    </td>

                    {/* 3. Full Name Clean */}
                    <td className="py-3 px-3 font-semibold text-stone-900 whitespace-nowrap font-sans">
                      {showPiiMasked && r.pii_masked_map
                        ? Object.keys(r.pii_masked_map).find((k) => k.includes("NAME")) || r.full_name_clean
                        : r.full_name_clean}
                    </td>

                    {/* 4. Tax ID */}
                    <td className="py-3 px-3 text-stone-600 whitespace-nowrap font-mono">
                      {showPiiMasked && r.pii_masked_map
                        ? Object.keys(r.pii_masked_map).find((k) => k.includes("GSTIN") || k.includes("PAN")) || r.tax_id
                        : r.tax_id}
                    </td>

                    {/* 5. Address Line 1 */}
                    <td className="py-3 px-3 text-stone-700 max-w-[160px] truncate font-sans" title={r.address_line1}>
                      {r.address_line1}
                    </td>

                    {/* 6. Address Line 2 */}
                    <td className="py-3 px-3 text-stone-500 max-w-[160px] truncate font-sans" title={r.address_line2}>
                      {r.address_line2}
                    </td>

                    {/* 7. City */}
                    <td className="py-3 px-3 text-stone-800 whitespace-nowrap font-sans font-medium">
                      {r.city}
                    </td>

                    {/* 8. State / Province */}
                    <td className="py-3 px-3 whitespace-nowrap font-sans">
                      <span className={isHealedState ? "text-stone-900 flex items-center gap-1 font-semibold" : "text-stone-700"}>
                        {r.state_province.replace(" [HEALED]", "")}
                        {isHealedState && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                            Healed
                          </span>
                        )}
                      </span>
                    </td>

                    {/* 9. Postal Code */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono">
                      <span className={isHealedPin ? "text-stone-900 flex items-center gap-1 font-semibold" : "text-stone-700"}>
                        {r.postal_code.replace(" [HEALED]", "")}
                        {isHealedPin && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                            Healed
                          </span>
                        )}
                      </span>
                    </td>

                    {/* 10. Contact (E.164) */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono">
                      <span className="text-stone-700">
                        {showPiiMasked && r.pii_masked_map
                          ? Object.keys(r.pii_masked_map).find((k) => k.includes("PHONE") || k.includes("EMAIL")) || r.contact_normalized
                          : r.contact_normalized.replace(" [HEALED]", "")}
                      </span>
                    </td>

                    {/* 11. Multimodal Confidence Rating */}
                    <td className="py-3 px-3 text-right whitespace-nowrap font-mono">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${
                          r.confidence_score >= 0.95
                            ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                            : r.confidence_score >= 0.85
                            ? "bg-stone-100 text-stone-800 border-stone-300"
                            : "bg-amber-50 text-amber-900 border-amber-300"
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        {(r.confidence_score * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Side-by-Side Legacy Preview Accordion */}
      {records.length > 0 && (
        <div className="mt-5 p-4 rounded-xl bg-[#fbf9f4] border border-stone-200/90 text-xs shadow-xs">
          <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-widest block mb-2.5 font-mono">
            Lineage Proof: Before vs After Transformation
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
            <div className="p-3 rounded-lg bg-[#fff8f6] border border-red-200/80 text-stone-900">
              <span className="text-[10px] uppercase font-bold text-rose-900 block mb-1 font-mono tracking-wider">
                Raw Legacy Input (Messy Unstructured)
              </span>
              <p className="line-clamp-2 text-stone-700 leading-relaxed">
                {records[0].raw_source_snippet || "Legacy raw address stream"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white border border-stone-200/90 text-stone-900 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-[#9a3412] block mb-1 font-mono tracking-wider">
                Recast AI Standard 11-Column Entity
              </span>
              <p className="line-clamp-2 text-stone-900 font-medium leading-relaxed">
                {records[0].record_id} | {records[0].full_name_clean} | {records[0].city}, {records[0].state_province} | PIN: {records[0].postal_code}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonTable;
