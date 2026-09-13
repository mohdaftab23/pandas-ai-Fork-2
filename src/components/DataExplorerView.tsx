import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Download, RefreshCw } from 'lucide-react';
import { DatasetSummary } from '../types';

interface DataExplorerViewProps {
  dataset: DatasetSummary;
}

export const DataExplorerView: React.FC<DataExplorerViewProps> = ({ dataset }) => {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search,
        sortCol,
        sortDir,
      });
      const res = await fetch(`/api/datasets/${dataset.id}/rows?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRows(data.rows);
        setTotalRows(data.totalRows);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch dataset rows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [dataset.id, page, sortCol, sortDir]);

  // Handle search with debounce/trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRows();
  };

  const handleSort = (colName: string) => {
    if (sortCol === colName) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(colName);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleExportCSV = () => {
    if (!rows || rows.length === 0) return;
    const cols = dataset.columns.map((c) => c.name);
    const csvLines = [
      cols.join(','),
      ...rows.map((row) =>
        cols.map((col) => {
          const val = row[col];
          if (val === null || val === undefined) return '';
          if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
          return String(val);
        }).join(',')
      ),
    ];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${dataset.id}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Controls */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>{dataset.name}</span>
              <span className="text-xs font-normal text-stone-500 font-mono">
                ({totalRows.toLocaleString()} total rows)
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Interactive tabular data viewer with column sorting and text search
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search across columns..."
                className="bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-48 sm:w-64"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </form>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="h-64 flex items-center justify-center gap-2 text-stone-500 text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
              <span>Loading dataset rows...</span>
            </div>
          ) : rows.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-stone-400 text-xs italic">
              No matching records found
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-700 font-semibold sticky top-0">
                  <th className="py-2.5 px-3 w-12 text-stone-400 font-mono text-[10px]">#</th>
                  {dataset.columns.map((col) => (
                    <th
                      key={col.name}
                      onClick={() => handleSort(col.name)}
                      className="py-2.5 px-3 whitespace-nowrap cursor-pointer hover:bg-stone-200/60 transition-colors select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.name}</span>
                        <ArrowUpDown className="w-3 h-3 text-stone-400" />
                        {sortCol === col.name && (
                          <span className="text-[10px] text-amber-600 font-bold">
                            {sortDir === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-2 px-3 text-stone-400 font-mono text-[10px]">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    {dataset.columns.map((col) => {
                      const val = row[col.name];
                      const display =
                        val === null || val === undefined
                          ? '-'
                          : typeof val === 'object'
                          ? JSON.stringify(val)
                          : String(val);

                      return (
                        <td key={col.name} className="py-2 px-3 whitespace-nowrap font-normal">
                          {col.type === 'numeric' && val !== null ? (
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
          )}
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-t border-stone-200 text-xs">
          <div className="text-stone-500">
            Showing <span className="font-medium text-stone-800">{rows.length > 0 ? (page - 1) * limit + 1 : 0}</span> to{' '}
            <span className="font-medium text-stone-800">
              {Math.min(page * limit, totalRows)}
            </span>{' '}
            of <span className="font-medium text-stone-800">{totalRows.toLocaleString()}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-500">
              Page {page} of {Math.max(totalPages, 1)}
            </span>
            <div className="inline-flex gap-1">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded bg-white border border-stone-300 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-white text-stone-700 cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded bg-white border border-stone-300 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-white text-stone-700 cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
