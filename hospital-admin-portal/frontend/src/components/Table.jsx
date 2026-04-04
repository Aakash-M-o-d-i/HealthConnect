import React from 'react';
import { cn } from '../lib/utils';

const Table = ({ columns, data, className = '' }) => {
  return (
    <div className={cn("overflow-x-auto w-full", className)}>
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.map((row, rowIdx) => (
            <tr 
              key={rowIdx} 
              className="hover:bg-accent/40 transition-colors duration-200 group"
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-5 text-sm text-foreground">
                  {col.render ? col.render(row) : (
                    <span className="font-medium">{row[col.accessor]}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
