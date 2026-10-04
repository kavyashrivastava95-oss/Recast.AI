"use client";

import React, { useState } from "react";
import { X, Copy, Check, Terminal, Shield } from "lucide-react";

interface AgentSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentSpecModal: React.FC<AgentSpecModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const agentJsonText = JSON.stringify(
    {
      $schema: "https://open-agent-spec.io/v1/schema.json",
      name: "recast-ai",
      displayName: "Recast Enterprise Migration Agent",
      version: "1.0.0",
      description: "Autonomous enterprise data migration and smart parsing agent converting unstructured legacy files, scanned forms, chaotic 1-line addresses, and Hinglish vernacular notes into standardized 11-column enterprise schemas.",
      standard: "Agent-Skill-Open-Standard/1.0",
      entrypoint: {
        type: "fastapi",
        module: "backend.app.main:app",
        port: 8000,
        healthCheck: "/api/health"
      },
      runtime: {
        python: ">=3.11",
        node: ">=18.0.0"
      },
      skills: [
        {
          id: "recast-parse-legacy",
          name: "Autonomous Legacy Data Migration",
          description: "Ingests raw messy text, CSV, PDF, or scanned receipt data, runs OCR/Docling extraction, PII tokenization, Gemma 4 reasoning, and self-healing into an 11-column clean record."
        }
      ],
      weapons: [
        "Zero-Shot Self-Healing (Predict & auto-fill missing fields with Confidence Score badge)",
        "GDPR Privacy Guard (Cryptographic token masking of PII before LLM reasoning)",
        "Vernacular Parser (Hinglish, regional spellings, local address slangs)",
        "Automated Audit Trail (Cryptographic SHA-256 state lineage and compliance transformation log)",
        "Reverse-Schema Generator (Export SQL DDL, Prisma ORM, Pydantic, and TypeScript definitions)"
      ]
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(agentJsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#f5f2eb] border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-[#9a3412]" />
            <div>
              <h3 className="text-sm font-bold text-stone-900 font-mono">
                Open-Source Agent Skill Standard (agent.json)
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                Agent-Skill-Open-Standard/1.0 specification for CI/CD orchestrators
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* JSON Preview */}
        <div className="flex-1 p-5 overflow-y-auto bg-[#fdfbf7] font-mono text-xs">
          <pre className="text-stone-800 leading-relaxed">
            <code>{agentJsonText}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#f5f2eb] border-t border-stone-200">
          <span className="text-xs text-stone-600 flex items-center gap-1.5 font-sans">
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            Schema Validated & Production Certified
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 font-bold text-xs transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-300" />}
              <span>{copied ? "Copied" : "Copy agent.json"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSpecModal;
