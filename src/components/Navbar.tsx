import React, { useState } from 'react';
import { Database, Sparkles, Plus, Table2, MessageSquare, BarChart3, ShieldCheck, X, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import { DatasetSummary } from '../types';

interface NavbarProps {
  datasets: { id: string; name: string; rowCount: number; columnCount: number }[];
  currentDatasetId: string;
  onSelectDataset: (id: string) => void;
  onOpenUpload: () => void;
  activeTab: 'chat' | 'table' | 'schema';
  onChangeTab: (tab: 'chat' | 'table' | 'schema') => void;
  hasGeminiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  datasets,
  currentDatasetId,
  onSelectDataset,
  onOpenUpload,
  activeTab,
  onChangeTab,
  hasGeminiKey,
}) => {
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 font-bold text-lg shadow-xs">
                🐼
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 tracking-tight text-lg">PandasAI</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                    Studio
                  </span>
                </div>
                <p className="text-xs text-stone-500 hidden sm:block">Conversational Data Analysis & Visualization</p>
              </div>
            </div>

            {/* Dataset Selector */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  id="dataset-selector"
                  value={currentDatasetId}
                  onChange={(e) => onSelectDataset(e.target.value)}
                  className="appearance-none bg-stone-50 border border-stone-300 hover:border-stone-400 text-stone-800 text-xs sm:text-sm font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors cursor-pointer"
                >
                  {datasets.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.rowCount} rows)
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-500">
                  <Database className="w-3.5 h-3.5" />
                </div>
              </div>

              <button
                id="btn-upload-dataset"
                onClick={onOpenUpload}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors cursor-pointer"
                title="Upload custom CSV dataset"
              >
                <Plus className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden md:inline">Upload CSV</span>
              </button>
            </div>

            {/* Navigation Tabs & Engine Status */}
            <div className="flex items-center gap-3">
              <nav className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200/80">
                <button
                  id="tab-btn-chat"
                  onClick={() => onChangeTab('chat')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>AI Chat</span>
                </button>

                <button
                  id="tab-btn-table"
                  onClick={() => onChangeTab('table')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'table'
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  <span>Explorer</span>
                </button>

                <button
                  id="tab-btn-schema"
                  onClick={() => onChangeTab('schema')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'schema'
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Schema</span>
                </button>
              </nav>

              {/* Security Sandbox Status Badge */}
              <button
                onClick={() => setShowSecurityModal(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                title="View Sandbox Security Architecture (Issue #1895 Resolution)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Sandbox Active</span>
              </button>

              <div
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Engine Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Security Architecture & Issue #1895 Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold tracking-tight">
                  PandasAI Secure-by-Default Sandbox
                </h3>
              </div>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <div className="font-semibold text-emerald-800 flex items-center gap-1.5 mb-1">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Issue #1895 Resolution: Sandbox Active by Default</span>
                </div>
                <p className="text-emerald-700 text-xs">
                  All LLM-generated and user-submitted code is isolated in a restricted execution sandbox with zero host OS access.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  Enforced Security Controls
                </h4>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900">Restricted __builtins__ Allowlist:</span>
                      <p className="text-stone-500 mt-0.5">
                        Dynamic injection like <code className="bg-stone-100 px-1 py-0.5 rounded text-rose-700 font-mono">__import__('os').system(...)</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-rose-700 font-mono">eval()</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-rose-700 font-mono">exec()</code>, and <code className="bg-stone-100 px-1 py-0.5 rounded text-rose-700 font-mono">open()</code> are completely removed from the runtime namespace.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900">AST-Level Syntax Validation:</span>
                      <p className="text-stone-500 mt-0.5">
                        Abstract syntax tree inspection blocks all unauthorized library imports (<code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-mono">os</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-mono">sys</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-mono">subprocess</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-mono">socket</code>) and object traversal dunder methods (<code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-mono">__subclasses__</code>, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-mono">__class__</code>).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-stone-900">Indirect Prompt Injection Mitigation:</span>
                      <p className="text-stone-500 mt-0.5">
                        Untrusted data in ingested CSV columns or records cannot steer code execution toward malicious system commands; generated snippets are validated before execution and fail closed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setShowSecurityModal(false)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Close Security Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
