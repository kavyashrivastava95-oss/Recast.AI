"use client";

import React, { useState } from "react";
import { AuditStep } from "@/lib/types";
import { ShieldCheck, Hash, Link as LinkIcon, CheckCircle2, Clock, Copy } from "lucide-react";

interface AuditTrailViewProps {
  auditTrail: AuditStep[];
  totalTimeMs?: number;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  auditTrail,
}) => {
  const [copied, setCopied] = useState(false);

  const copyAuditJson = () => {
    navigator.clipboard.writeText(JSON.stringify(auditTrail, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col bg-white border border-stone-200/90 rounded-2xl p-6 shadow-[0_2px_16px_rgba(28,25,23,0.04)] font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#9a3412]" />
            <h3 className="text-lg font-bold text-stone-900 font-serif">
              Weapon 4: Cryptographic Lineage & Audit Trail
            </h3>
          </div>
          <p className="text-xs text-stone-500 font-sans mt-1">
            Immutably chained SHA-256 state transformations conforming to ISO 27001, SOC 2, and GDPR Article 32 records of processing activities.
          </p>
        </div>

        {/* Compliance Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-300">
            Chain Validated (SHA-256)
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
            GDPR / DPDP Guard
          </span>
          <button
            onClick={copyAuditJson}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#fcfaf6] hover:bg-stone-100 text-stone-800 text-xs transition-colors border border-stone-200 font-sans shadow-xs cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-stone-500" />
            <span>{copied ? "Copied" : "Export Audit JSON"}</span>
          </button>
        </div>
      </div>

      {/* Step by step Timeline */}
      <div className="space-y-3">
        {auditTrail.map((step) => (
          <div
            key={step.step_index}
            className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 rounded-xl bg-[#fcfaf6] border border-stone-200/80 hover:border-stone-300 transition-all gap-3 shadow-xs"
          >
            {/* Step Index & Name */}
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="flex-none flex items-center justify-center w-7 h-7 rounded-lg bg-stone-900 text-stone-50 border border-stone-800 text-xs font-bold font-mono">
                {step.step_index}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-stone-900 font-sans">
                    {step.stage}
                  </h4>
                  <span className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 font-mono">
                    {step.actor}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-800 font-mono font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    {step.status}
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-sans mt-1">
                  {step.details}
                </p>
              </div>
            </div>

            {/* Cryptographic Hashes & Latency */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-[11px] text-stone-700 bg-white p-2 rounded-lg border border-stone-200 shadow-xs flex-none">
              <div className="flex items-center gap-1.5 font-mono">
                <Hash className="w-3 h-3 text-stone-400" />
                <span className="text-stone-400">In:</span>
                <span className="text-stone-700 font-medium">{step.input_hash}</span>
              </div>

              <LinkIcon className="w-3 h-3 text-stone-300 hidden sm:block" />

              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-stone-400">Out:</span>
                <span className="text-[#9a3412] font-semibold">{step.output_hash}</span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-stone-500 sm:border-l sm:border-stone-200 sm:pl-2">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>{step.latency_ms}ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditTrailView;
