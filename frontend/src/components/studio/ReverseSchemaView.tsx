"use client";

import React, { useState } from "react";
import { ReverseSchemaOutput } from "@/lib/types";
import { Database, Copy, Download, Check, FileCode } from "lucide-react";

interface ReverseSchemaViewProps {
  reverseSchema: ReverseSchemaOutput;
}

export const ReverseSchemaView: React.FC<ReverseSchemaViewProps> = ({ reverseSchema }) => {
  const [activeTab, setActiveTab] = useState<"sql" | "prisma" | "pydantic" | "typescript" | "json">("sql");
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    switch (activeTab) {
      case "sql":
        return { code: reverseSchema.sql_ddl, filename: "recast_schema.sql", lang: "sql" };
      case "prisma":
        return { code: reverseSchema.prisma_schema, filename: "schema.prisma", lang: "prisma" };
      case "pydantic":
        return { code: reverseSchema.pydantic_model, filename: "recast_models.py", lang: "python" };
      case "typescript":
        return { code: reverseSchema.typescript_interface, filename: "recast_types.ts", lang: "typescript" };
      case "json":
        return { code: reverseSchema.json_schema, filename: "schema.json", lang: "json" };
    }
  };

  const { code, filename, lang } = getCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col bg-white border border-stone-200/90 rounded-2xl p-6 shadow-[0_2px_16px_rgba(28,25,23,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#9a3412]" />
            <h3 className="text-lg font-bold text-stone-900 font-serif">
              Weapon 5: Reverse-Schema Generator
            </h3>
          </div>
          <p className="text-xs text-stone-500 font-sans mt-1">
            Production-grade database DDL, Prisma ORM schema, Pydantic v2 models, and TypeScript interfaces auto-generated from parsed legacy data.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-stone-100 border border-stone-200 shadow-xs">
          {(
            [
              { key: "sql", label: "PostgreSQL DDL" },
              { key: "prisma", label: "Prisma ORM" },
              { key: "pydantic", label: "Pydantic v2" },
              { key: "typescript", label: "TypeScript" },
              { key: "json", label: "JSON Schema" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1 text-xs font-mono font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === t.key
                  ? "bg-white text-stone-950 font-semibold shadow-xs border border-stone-200/80"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="relative rounded-xl border border-stone-200 bg-[#fdfbf7] overflow-hidden font-mono text-xs shadow-xs">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#f5f2eb] border-b border-stone-200 text-stone-700">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#9a3412]" />
            <span className="font-semibold text-stone-900">{filename}</span>
            <span className="text-[10px] text-stone-500 uppercase font-mono">{lang}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-stone-50 text-stone-800 text-xs transition-colors border border-stone-200 shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-stone-50 text-stone-800 text-xs transition-colors border border-stone-200 shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <pre className="p-4 overflow-x-auto text-stone-900 bg-[#fdfbf7] leading-relaxed max-h-[460px] overflow-y-auto font-mono text-xs selection:bg-amber-200">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default ReverseSchemaView;
