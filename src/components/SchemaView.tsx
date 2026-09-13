import React from 'react';
import { Hash, Type, HelpCircle, Activity } from 'lucide-react';
import { DatasetSummary } from '../types';

interface SchemaViewProps {
  dataset: DatasetSummary;
}

export const SchemaView: React.FC<SchemaViewProps> = ({ dataset }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>{dataset.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 font-mono">
                Schema & Metadata
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">{dataset.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 text-xs">
            <div className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-center sm:text-left">
              <span className="text-[10px] uppercase font-semibold text-stone-400 block">Total Rows</span>
              <span className="text-sm font-bold text-stone-800 font-mono">{dataset.rowCount.toLocaleString()}</span>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-center sm:text-left">
              <span className="text-[10px] uppercase font-semibold text-stone-400 block">Columns</span>
              <span className="text-sm font-bold text-stone-800 font-mono">{dataset.columnCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataset.columns.map((col) => (
          <div
            key={col.name}
            className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs hover:border-stone-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-semibold text-stone-900 text-sm tracking-tight break-all font-mono">
                  {col.name}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                    col.type === 'numeric'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-sky-50 text-sky-800 border-sky-200'
                  }`}
                >
                  {col.type === 'numeric' ? <Hash className="w-3 h-3" /> : <Type className="w-3 h-3" />}
                  <span>{col.type}</span>
                </span>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-stone-50/70 p-2.5 rounded-lg border border-stone-100">
                <div>
                  <span className="text-[10px] text-stone-400 block">Missing / Nulls</span>
                  <span className="font-medium text-stone-700 font-mono">
                    {col.nullCount} ({((col.nullCount / (dataset.rowCount || 1)) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Distinct Values</span>
                  <span className="font-medium text-stone-700 font-mono">{col.distinctCount}</span>
                </div>

                {col.type === 'numeric' && (
                  <>
                    <div>
                      <span className="text-[10px] text-stone-400 block">Min / Max</span>
                      <span className="font-medium text-stone-700 font-mono">
                        {col.min} / {col.max}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">Mean (Avg)</span>
                      <span className="font-medium text-stone-700 font-mono">{col.mean ?? '-'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sample Values */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-1">
                Sample Values
              </span>
              <div className="flex flex-wrap gap-1">
                {col.sampleValues.map((val, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded text-[11px] font-mono truncate max-w-[120px]"
                    title={String(val)}
                  >
                    {val === null || val === undefined ? 'null' : String(val)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
