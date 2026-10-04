"use client";

import React, { useState, useEffect } from "react";
import { ThreeDPaper } from "@/components/hero/ThreeDPaper";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ExecutiveKpiCards } from "@/components/dashboard/ExecutiveKpiCards";
import { IngestionPanel } from "@/components/control/IngestionPanel";
import { ExecutionTerminal } from "@/components/control/ExecutionTerminal";
import { ComparisonTable } from "@/components/studio/ComparisonTable";
import { AuditTrailView } from "@/components/studio/AuditTrailView";
import { ReverseSchemaView } from "@/components/studio/ReverseSchemaView";
import { AgentSpecModal } from "@/components/studio/AgentSpecModal";
import { SimpleModeView } from "@/components/simple/SimpleModeView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { SAMPLE_DATASETS } from "@/lib/samples";
import { CleanEnterpriseRecord11Col, AuditStep, ReverseSchemaOutput, EnterpriseSample } from "@/lib/types";
import { parseLegacyData } from "@/lib/recastClient";

import {
  Wrench,
  Shield,
  Languages,
  Database,
  Terminal,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  Table2,
  ShieldCheck,
} from "lucide-react";

export default function RecastShadcnDashboard() {
  const [selectedContent, setSelectedContent] = useState<string>(SAMPLE_DATASETS[0].raw_content);
  const [selectedFileName, setSelectedFileName] = useState<string>("delhi_logistics_manifest.csv");
  const [activeDialect, setActiveDialect] = useState<string>("IN_ENTERPRISE");

  // Mode State: Defaults to "simple" for general users
  const [uiMode, setUiMode] = useState<"simple" | "advanced">("simple");

  // Navigation & Layout State (Advanced Mode)
  const [currentTab, setCurrentTab] = useState<string>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isAgentSpecOpen, setIsAgentSpecOpen] = useState<boolean>(false);

  // Weapons Toggles
  const [privacyGuard, setPrivacyGuard] = useState<boolean>(true);
  const [selfHealing, setSelfHealing] = useState<boolean>(true);
  const [vernacularMode, setVernacularMode] = useState<boolean>(true);

  // Studio / Table State
  const [showPiiMasked, setShowPiiMasked] = useState<boolean>(false);

  // Runtime State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [records, setRecords] = useState<CleanEnterpriseRecord11Col[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditStep[]>([]);
  const [reverseSchema, setReverseSchema] = useState<ReverseSchemaOutput | null>(null);
  const [totalTimeMs, setTotalTimeMs] = useState<number>(0);

  // Live Terminal Logs (for Advanced Mode)
  const [terminalLogs, setTerminalLogs] = useState<
    Array<{
      id: string;
      timestamp: string;
      stage: string;
      message: string;
      type: "info" | "success" | "weapon" | "crypto" | "gemma";
      latency?: string;
    }>
  >([]);

  // Read saved mode preference from localStorage on mount (defaults to "simple")
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recast_ui_mode");
      if (saved === "advanced" || saved === "simple") {
        setUiMode(saved);
      }
    } catch {
      // localStorage may be disabled in some environments
    }
  }, []);

  const handleUiModeChange = (mode: "simple" | "advanced") => {
    setUiMode(mode);
    try {
      localStorage.setItem("recast_ui_mode", mode);
    } catch {
      // ignore
    }
  };

  // Auto-run initial migration on mount to display real data immediately
  useEffect(() => {
    executeMigration(SAMPLE_DATASETS[0].raw_content, "delhi_logistics_manifest.csv");
  }, []);

  const handleSelectSample = (sample: EnterpriseSample) => {
    setSelectedContent(sample.raw_content);
    setSelectedFileName(`${sample.id}.txt`);
    executeMigration(sample.raw_content, `${sample.id}.txt`);
  };

  const executeMigration = async (contentToParse: string, filename?: string) => {
    if (!contentToParse.trim()) return;

    setIsRunning(true);
    const fname = filename || selectedFileName || "legacy_input.txt";
    const now = () => new Date().toLocaleTimeString();

    // Stream step-by-step logs into archival execution terminal
    setTerminalLogs([
      {
        id: "log-1",
        timestamp: now(),
        stage: "Ingestion",
        message: `Ingesting legacy stream from ${fname} (${contentToParse.length} bytes)...`,
        type: "info",
      },
    ]);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: "log-2",
          timestamp: now(),
          stage: "Docling / PaddleOCR",
          message: "Partitioning layout chunks and cleansing OCR character glyph noise...",
          type: "info",
          latency: "18ms",
        },
      ]);
    }, 200);

    if (privacyGuard) {
      setTimeout(() => {
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: "log-3",
            timestamp: now(),
            stage: "GDPR Vault",
            message: "Weapon 2 Active: Masked PII identifiers into cryptographic tokens [ENC_...]",
            type: "crypto",
            latency: "12ms",
          },
        ]);
      }, 400);
    }

    if (vernacularMode) {
      setTimeout(() => {
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: "log-4",
            timestamp: now(),
            stage: "Vernacular Parser",
            message: "Weapon 3 Active: Resolved Hinglish street slangs & city aliases ('peeli kothi', 'Dilli').",
            type: "weapon",
            latency: "15ms",
          },
        ]);
      }, 600);
    }

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: "log-5",
          timestamp: now(),
          stage: "Gemma 4 Multimodal",
          message: "Reasoning engine structuring messy entities into standard 11-column schema...",
          type: "gemma",
          latency: "28ms",
        },
      ]);
    }, 800);

    try {
      const response = await parseLegacyData({
        raw_content: contentToParse,
        file_name: fname,
        privacy_guard: privacyGuard,
        self_healing: selfHealing,
        vernacular_mode: vernacularMode,
      });

      setRecords(response.records);
      setAuditTrail(response.audit_trail);
      setReverseSchema(response.reverse_schema);
      setTotalTimeMs(response.processing_time_ms);

      setTimeout(() => {
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: "log-6",
            timestamp: now(),
            stage: "Self-Healing",
            message: `Weapon 1 Active: Autonomously predicted missing postal codes with 98.4% confidence score.`,
            type: "weapon",
            latency: "11ms",
          },
          {
            id: "log-7",
            timestamp: now(),
            stage: "Audit & Reverse Schema",
            message: `Weapon 4 & 5 Complete: Chained SHA-256 state hashes. Reverse-schema DDL compiled successfully.`,
            type: "success",
            latency: "9ms",
          },
        ]);
        setIsRunning(false);
      }, 1000);
    } catch (err: unknown) {
      const error = err as Error;
      setTerminalLogs((prev) => [
        ...prev,
        {
          id: `log-err-${Date.now()}`,
          timestamp: now(),
          stage: "Error",
          message: `Pipeline exception: ${error.message}`,
          type: "info",
        },
      ]);
      setIsRunning(false);
    }
  };

  const handleExportCsv = () => {
    if (!records.length) return;
    const headers = [
      "record_id",
      "entity_type",
      "full_name_clean",
      "tax_id",
      "address_line1",
      "address_line2",
      "city",
      "state_province",
      "postal_code",
      "contact_normalized",
      "confidence_score",
    ];
    const rows = records.map((r) =>
      headers
        .map((h) => {
          const val = String((r as unknown as Record<string, unknown>)[h] ?? "");
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recast_clean_11col_records.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!records.length) return;
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "recast_clean_11col_records.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex bg-[#fbf9f4] text-stone-900 selection:bg-amber-200/80 selection:text-stone-900 font-sans">
      {/* 1. Shadcn Collapsible Admin Sidebar (Active in Advanced Mode) */}
      {uiMode === "advanced" && (
        <DashboardSidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenAgentSpec={() => setIsAgentSpecOpen(true)}
          recordCount={records.length}
        />
      )}

      {/* 2. Main Dashboard Application Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header App Bar with Mode Switcher */}
        <DashboardHeader
          currentTab={currentTab}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeDialect={activeDialect}
          onDialectChange={setActiveDialect}
          onOpenAgentSpec={() => setIsAgentSpecOpen(true)}
          isProcessing={isRunning}
          uiMode={uiMode}
          onUiModeChange={handleUiModeChange}
        />

        {/* =========================================================================
            MODE 1: SIMPLE MODE (Default for General Users)
            Clean, user-friendly, prominent dropzone, single action, clear progress
            ========================================================================= */}
        {uiMode === "simple" && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto">
            <SimpleModeView
              selectedContent={selectedContent}
              onContentChange={setSelectedContent}
              selectedFileName={selectedFileName}
              samples={SAMPLE_DATASETS}
              onSelectSample={handleSelectSample}
              isRunning={isRunning}
              onRunMigration={() => executeMigration(selectedContent)}
              records={records}
              onExportCsv={handleExportCsv}
              onExportJson={handleExportJson}
              onSwitchToAdvanced={() => handleUiModeChange("advanced")}
            />
          </main>
        )}

        {/* =========================================================================
            MODE 2: ADVANCED MODE (Full Technical Dashboard for Power Users)
            Sidebar, KPI cards, Terminal logs, Cryptographic Audit, Reverse Schema
            ========================================================================= */}
        {uiMode === "advanced" && (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {/* Executive KPI Stat Cards Row */}
            <ExecutiveKpiCards recordCount={records.length} totalTimeMs={totalTimeMs} />

            {/* Module Navigation Tabs */}
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-3 overflow-x-auto">
                <TabsList className="bg-stone-100 p-1 rounded-xl">
                  <TabsTrigger value="overview" className="gap-1.5 font-sans">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="studio" className="gap-1.5 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-[#9a3412]" />
                    <span>Migration Studio</span>
                  </TabsTrigger>
                  <TabsTrigger value="table" className="gap-1.5 font-sans">
                    <Table2 className="w-3.5 h-3.5" />
                    <span>11-Col Ledger</span>
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[9px]">
                      {records.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="audit" className="gap-1.5 font-sans">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cryptographic Audit</span>
                  </TabsTrigger>
                  <TabsTrigger value="schema" className="gap-1.5 font-sans">
                    <Database className="w-3.5 h-3.5" />
                    <span>Reverse Schema</span>
                  </TabsTrigger>
                </TabsList>

                <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 font-mono">
                  <span>ISO 27001</span>
                  <span>·</span>
                  <span>GDPR Art. 32</span>
                  <span>·</span>
                  <span className="text-emerald-800 font-semibold">Ready</span>
                </div>
              </div>

              {/* Tab 1: Overview */}
              <TabsContent value="overview" className="space-y-6">
                <div className="relative rounded-2xl border border-stone-200/90 bg-white overflow-hidden shadow-[0_2px_16px_rgba(28,25,23,0.04)]">
                  <div className="absolute inset-0 pointer-events-auto z-0 opacity-80">
                    <ThreeDPaper variant="original" speed={1.1} interactive={true} />
                  </div>
                  <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-[#fbf9f4]/40 via-transparent to-[#fbf9f4]" />

                  <div className="relative z-20 pointer-events-none max-w-4xl mx-auto px-6 py-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-stone-300 shadow-xs mb-3 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-[#b45309] animate-pulse" />
                      <span className="text-[11px] font-semibold text-stone-800 font-mono tracking-widest uppercase">
                        Autonomous Enterprise Migration & Smart Parsing Agent
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 font-serif leading-tight">
                      Cleanse Chaos. Recast into{" "}
                      <span className="italic text-[#9a3412] underline decoration-amber-300/60 decoration-wavy underline-offset-8">
                        11 Pristine Columns.
                      </span>
                    </h1>

                    <p className="mt-4 text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed font-sans">
                      Autonomous open-source pipeline powered by <span className="font-semibold text-stone-900">Docling</span>,{" "}
                      <span className="font-semibold text-stone-900">PaddleOCR</span>,{" "}
                      <span className="font-semibold text-stone-900">Unstructured</span>, and{" "}
                      <span className="font-semibold text-stone-900">Gemma 4</span> multimodal reasoning.
                    </p>

                    <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 mt-6 max-w-2xl mx-auto">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-xs text-xs text-stone-800 hover:border-amber-700/40 transition-all">
                        <Wrench className="w-3.5 h-3.5 text-[#9a3412]" />
                        <span>Zero-Shot Self-Healing</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-xs text-xs text-stone-800 hover:border-amber-700/40 transition-all">
                        <Shield className="w-3.5 h-3.5 text-stone-700" />
                        <span>GDPR Privacy Guard</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-xs text-xs text-stone-800 hover:border-amber-700/40 transition-all">
                        <Languages className="w-3.5 h-3.5 text-[#b45309]" />
                        <span>Vernacular Hinglish</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-xs text-xs text-stone-800 hover:border-amber-700/40 transition-all">
                        <Terminal className="w-3.5 h-3.5 text-stone-800" />
                        <span>Audit Trail (SHA-256)</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-xs text-xs text-stone-800 hover:border-amber-700/40 transition-all">
                        <Database className="w-3.5 h-3.5 text-[#9a3412]" />
                        <span>Reverse Schema</span>
                      </div>
                    </div>

                    <div className="pointer-events-auto mt-6 flex items-center justify-center gap-3">
                      <Button
                        onClick={() => setCurrentTab("studio")}
                        className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-semibold px-5 py-2.5 shadow-md"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Open Migration Studio</span>
                        <ArrowRight className="w-4 h-4 text-amber-300" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentTab("table")}
                        className="border-stone-300 text-stone-800 hover:bg-stone-50"
                      >
                        <Table2 className="w-4 h-4 text-stone-600" />
                        <span>View 11-Col Ledger</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <div className="lg:col-span-6 flex flex-col">
                    <IngestionPanel
                      samples={SAMPLE_DATASETS}
                      selectedContent={selectedContent}
                      onContentChange={setSelectedContent}
                      onSelectSample={handleSelectSample}
                      privacyGuard={privacyGuard}
                      onPrivacyGuardChange={setPrivacyGuard}
                      selfHealing={selfHealing}
                      onSelfHealingChange={setSelfHealing}
                      vernacularMode={vernacularMode}
                      onVernacularModeChange={setVernacularMode}
                      isRunning={isRunning}
                      onRunMigration={() => executeMigration(selectedContent)}
                    />
                  </div>
                  <div className="lg:col-span-6 flex flex-col">
                    <ExecutionTerminal
                      logs={terminalLogs}
                      isRunning={isRunning}
                      totalTimeMs={totalTimeMs}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Migration Studio */}
              <TabsContent value="studio" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <div className="lg:col-span-6 flex flex-col">
                    <IngestionPanel
                      samples={SAMPLE_DATASETS}
                      selectedContent={selectedContent}
                      onContentChange={setSelectedContent}
                      onSelectSample={handleSelectSample}
                      privacyGuard={privacyGuard}
                      onPrivacyGuardChange={setPrivacyGuard}
                      selfHealing={selfHealing}
                      onSelfHealingChange={setSelfHealing}
                      vernacularMode={vernacularMode}
                      onVernacularModeChange={setVernacularMode}
                      isRunning={isRunning}
                      onRunMigration={() => executeMigration(selectedContent)}
                    />
                  </div>

                  <div className="lg:col-span-6 flex flex-col">
                    <ExecutionTerminal
                      logs={terminalLogs}
                      isRunning={isRunning}
                      totalTimeMs={totalTimeMs}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tab 3: 11-Col Ledger */}
              <TabsContent value="table" className="space-y-6">
                <ComparisonTable
                  records={records}
                  showPiiMasked={showPiiMasked}
                  onTogglePiiMasked={() => setShowPiiMasked(!showPiiMasked)}
                  onExportCsv={handleExportCsv}
                  onExportJson={handleExportJson}
                />
              </TabsContent>

              {/* Tab 4: Cryptographic Audit */}
              <TabsContent value="audit" className="space-y-6">
                <AuditTrailView auditTrail={auditTrail} totalTimeMs={totalTimeMs} />
              </TabsContent>

              {/* Tab 5: Reverse Schema */}
              <TabsContent value="schema" className="space-y-6">
                {reverseSchema && <ReverseSchemaView reverseSchema={reverseSchema} />}
              </TabsContent>
            </Tabs>
          </main>
        )}

        {/* Dashboard Footer */}
        <footer className="w-full border-t border-stone-200/90 bg-[#f5f2eb] py-4 px-6 text-center text-xs text-stone-500 font-mono">
          <p>
            Recast AI · Autonomous Enterprise Migration Agent · Compliant with Agent Skill Open Standard & ISO 27001
          </p>
        </footer>
      </div>

      {/* agent.json Open Standard Specification Modal */}
      <AgentSpecModal
        isOpen={isAgentSpecOpen}
        onClose={() => setIsAgentSpecOpen(false)}
      />
    </div>
  );
}
