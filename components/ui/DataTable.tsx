"use client";

interface Column {
  key: string;
  label: string;
}

interface Row {
  [key: string]: string | number;
}

interface DataTableProps {
  caption?: string;
  columns: Column[];
  rows: Row[];
}

export const DataTable = ({ caption, columns, rows }: DataTableProps) => {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        {caption && <caption className="data-table-caption">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .data-table-wrapper {
          margin: var(--space-6, 24px) 0;
          overflow-x: auto;
          border-radius: var(--radius-md, 8px);
          border: 1px solid var(--color-border, #e5e7eb);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--text-sm, 14px);
        }

        .data-table-caption {
          padding: var(--space-3, 12px) var(--space-4, 16px);
          text-align: left;
          font-weight: var(--weight-semibold, 600);
          color: var(--color-text, #111827);
          background-color: var(--color-bg-secondary, #f9fafb);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
        }

        .data-table thead {
          background-color: var(--color-bg-secondary, #f3f4f6);
        }

        .data-table th {
          padding: var(--space-3, 12px) var(--space-4, 16px);
          text-align: left;
          font-weight: var(--weight-semibold, 600);
          color: var(--color-text-secondary, #6b7280);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
        }

        .data-table td {
          padding: var(--space-3, 12px) var(--space-4, 16px);
          color: var(--color-text, #111827);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
        }

        .data-table tbody tr:last-child td {
          border-bottom: none;
        }

        .data-table tbody tr:hover {
          background-color: var(--color-bg-secondary, #f9fafb);
        }

        .data-table td:first-child {
          font-family: var(--font-mono, "Courier New", monospace);
          font-weight: var(--weight-medium, 500);
        }
      `}</style>
    </div>
  );
};

export default DataTable;
