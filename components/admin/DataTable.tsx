import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowSelect?: (selectedIds: string[]) => void;
  selectable?: boolean;
  emptyMessage?: string;
  pageSize?: number;
}

export function DataTable<T extends { id: string }>({ 
  columns, 
  data, 
  isLoading, 
  selectable,
  emptyMessage = "No results found",
  pageSize = 10
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageData = data.slice(start, start + pageSize);

  const toggleAll = () => {
    if (selected.size === pageData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pageData.map(item => item.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="animate-pulse flex flex-col divide-y divide-gray-800">
          <div className="h-12 bg-gray-800/50 w-full" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-gray-900/60 px-6 py-4 flex gap-4">
              <div className="h-4 bg-gray-800 rounded w-1/4" />
              <div className="h-4 bg-gray-800 rounded w-1/3" />
              <div className="h-4 bg-gray-800 rounded w-1/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-gray-500 text-2xl">∅</span>
        </div>
        <p className="text-gray-400 font-medium">{emptyMessage}</p>
        <p className="text-gray-600 text-sm mt-1">Try adjusting your filters or add new items.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-800/70 border-b border-gray-800">
            <tr>
              {selectable && (
                <th scope="col" className="p-4 w-10">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                    checked={selected.size === pageData.length && pageData.length > 0}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((col, i) => (
                <th key={i} scope="col" className="px-6 py-3.5 font-semibold tracking-wider text-gray-400">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {pageData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-800/60 transition-colors duration-100">
                {selectable && (
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                      checked={selected.has(item.id)}
                      onChange={() => toggleOne(item.id)}
                    />
                  </td>
                )}
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-gray-300">
                    {typeof col.accessor === 'function' 
                      ? col.accessor(item) 
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-gray-800 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="text-gray-300 font-medium">{start + 1}</span>–<span className="text-gray-300 font-medium">{Math.min(start + pageSize, data.length)}</span> of <span className="text-gray-300 font-medium">{data.length}</span> entries
          {selected.size > 0 && <span className="ml-3 text-blue-400">{selected.size} selected</span>}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-1.5 border border-gray-700 rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = i + 1;
            if (totalPages > 5) {
              if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                  page === pageNum 
                    ? 'bg-blue-600 text-white border border-blue-500' 
                    : 'border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-1.5 border border-gray-700 rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
