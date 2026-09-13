import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';

interface DataframeTableProps {
  columns: string[];
  rows: Record<string, any>[];
  totalRows?: number;
  pageSize?: number;
}

export const DataframeTable: React.FC<DataframeTableProps> = ({
  columns,
  rows,
  totalRows,
  pageSize = 6,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!rows || rows.length === 0) {
    return (
      <div className="p-4 text-center text-stone-500 text-xs italic bg-stone-50 rounded-lg border border-stone-200">
        Empty dataframe result
      </div>
    );
  }

  const effectiveTotal = totalRows ?? rows.length;
  const totalPages = Math.ceil(rows.length / pageSize);
  const displayedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs">
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-stone-50/80 border-b border-stone-200 text-xs">
        <div className="flex items-center gap-2 text-stone-700 font-medium">
          <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
          <span>
            Dataframe Result ({effectiveTotal.toLocaleString()} {effectiveTotal === 1 ? 'row' : 'rows'})
          </span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="inline-flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-stone-700"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-stone-700"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto max-h-80">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100/70 border-b border-stone-200 text-stone-700 font-semibold sticky top-0">
              <th className="py-2 px-3 w-12 text-stone-400 font-mono text-[10px]">#</th>
              {columns.map((col) => (
                <th key={col} className="py-2 px-3 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {displayedRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-amber-50/40 transition-colors">
                <td className="py-2 px-3 text-stone-400 font-mono text-[10px]">
                  {(currentPage - 1) * pageSize + rIdx + 1}
                </td>
                {columns.map((col) => {
                  const val = row[col];
                  const display =
                    val === null || val === undefined
                      ? '-'
                      : typeof val === 'object'
                      ? JSON.stringify(val)
                      : String(val);
                  return (
                    <td key={col} className="py-2 px-3 whitespace-nowrap">
                      {typeof val === 'number' ? (
                        <span className="font-mono text-stone-900">{display}</span>
                      ) : (
                        display
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
