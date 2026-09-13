import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Clock, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { DatasetSummary, ChatMessage } from '../types';
import { ChartRenderer } from './ChartRenderer';
import { DataframeTable } from './DataframeTable';
import { CodeViewer } from './CodeViewer';

interface ChatQueryViewProps {
  dataset: DatasetSummary;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendQuery: (query: string) => void;
}

export const ChatQueryView: React.FC<ChatQueryViewProps> = ({
  dataset,
  messages,
  isLoading,
  onSendQuery,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    onSendQuery(inputQuery);
    setInputQuery('');
  };

  const handlePromptClick = (prompt: string) => {
    if (isLoading) return;
    onSendQuery(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto px-4 sm:px-6 py-4">
      {/* Header Info */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-4 mb-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>{dataset.name}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">{dataset.description}</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-stone-100 font-mono text-stone-700 font-medium">
              {dataset.rowCount.toLocaleString()} rows
            </span>
            <span className="px-2.5 py-1 rounded-md bg-stone-100 font-mono text-stone-700 font-medium">
              {dataset.columnCount} columns
            </span>
          </div>
        </div>

        {/* Suggested Prompts */}
        {dataset.suggestedPrompts && dataset.suggestedPrompts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Suggested questions for this dataset:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {dataset.suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  disabled={isLoading}
                  className="text-xs bg-stone-50 hover:bg-amber-50/80 hover:text-amber-900 hover:border-amber-300 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-all text-left cursor-pointer disabled:opacity-50"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-3xl mb-3">
              🐼
            </div>
            <h3 className="text-base font-bold text-stone-800 tracking-tight">
              Ask questions to your dataframe
            </h3>
            <p className="text-xs text-stone-500 max-w-md mt-1 mb-4 leading-relaxed">
              PandasAI converts your natural language queries into executable analytics,
              aggregating metrics, rendering charts, or filtering dataframes.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {dataset.suggestedPrompts.slice(0, 3).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs bg-white text-stone-800 px-3 py-1.5 rounded-lg border border-stone-300 shadow-xs hover:border-amber-500 hover:text-amber-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-2xl bg-stone-900 text-white px-4 py-2.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm font-medium shadow-xs">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-3xl w-full bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs space-y-3">
                    {/* Header badge & time */}
                    <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-100 pb-2">
                      <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-xs">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        PandasAI Engine
                      </div>
                      {msg.result?.executionTimeMs !== undefined && (
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>{msg.result.executionTimeMs}ms</span>
                        </div>
                      )}
                    </div>

                    {/* Security Alert Banner if Blocked */}
                    {msg.result?.securityCheck && !msg.result.securityCheck.isSafe && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-rose-900">
                            Issue #1895 Mitigation: Sandbox Blocked Untrusted Execution
                          </p>
                          <p className="text-rose-700 mt-0.5 text-[11px] leading-relaxed">
                            {msg.result.securityCheck.violations.join('; ')}
                          </p>
                          <p className="text-rose-600 text-[10px] mt-1 font-mono">
                            Policy: Default Sandbox (Restricted __builtins__, AST Allowlist, Fail-Closed)
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Text Answer */}
                    <p className="text-stone-800 text-xs sm:text-sm leading-relaxed font-normal">
                      {msg.content}
                    </p>

                    {/* Visual Chart if returned */}
                    {msg.result?.chart && (
                      <div className="pt-2">
                        <ChartRenderer config={msg.result.chart} />
                      </div>
                    )}

                    {/* Dataframe preview if returned */}
                    {msg.result?.dataframe && (
                      <div className="pt-2">
                        <DataframeTable
                          columns={msg.result.dataframe.columns}
                          rows={msg.result.dataframe.rows}
                          totalRows={msg.result.dataframe.totalRows}
                        />
                      </div>
                    )}

                    {/* Generated Code Viewer */}
                    {msg.result?.codeSnippet && (
                      <CodeViewer
                        code={msg.result.codeSnippet}
                        datasetId={dataset.id}
                        securityCheck={msg.result.securityCheck}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
              <div className="space-y-1">
                <span className="text-xs font-medium text-stone-800">
                  PandasAI is generating code & querying dataset...
                </span>
                <p className="text-[11px] text-stone-400">
                  Processing transformations and generating visualization
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="pt-2">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            id="query-input"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask a question about ${dataset.name}... (e.g. "Plot average cholesterol by chest pain", "Top 5 loans")`}
            className="w-full bg-white border border-stone-300 hover:border-stone-400 focus:border-amber-500 rounded-xl pl-4 pr-12 py-3 text-xs sm:text-sm text-stone-900 shadow-xs focus:outline-none focus:ring-3 focus:ring-amber-500/15 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            id="query-submit-btn"
            disabled={!inputQuery.trim() || isLoading}
            className="absolute right-2 p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-30 disabled:hover:bg-amber-500 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            title="Run Query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-stone-400 text-center mt-1.5">
          Ask questions in plain English. PandasAI formulates queries, aggregates data, and renders charts.
        </p>
      </div>
    </div>
  );
};
