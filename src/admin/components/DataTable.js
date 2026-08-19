import React, { useMemo, useState } from 'react';
import Icon from '../../components/Icon';
import EmptyState from './EmptyState';

function DataTable({ columns, rows, getRowId, onEdit, onDelete, emptyTitle, emptyBody }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const sortedRows = useMemo(() => {
    if (!sortKey) {
      return rows;
    }
    const column = columns.find((item) => item.key === sortKey);
    const getValue = column?.sortValue || ((row) => row[sortKey]);
    const copy = [...rows];
    copy.sort((a, b) => {
      const valueA = getValue(a);
      const valueB = getValue(b);
      const comparison = String(valueA ?? '').localeCompare(String(valueB ?? ''), undefined, { numeric: true });
      return sortDir === 'asc' ? comparison : -comparison;
    });
    return copy;
  }, [rows, sortKey, sortDir, columns]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} body={emptyBody} />;
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.sortable === false ? (
                  column.label
                ) : (
                  <button className="sort-header" onClick={() => toggleSort(column.key)} type="button">
                    {column.label}
                    <Icon name={sortKey === column.key ? (sortDir === 'asc' ? 'chevronUp' : 'chevronDown') : 'sort'} />
                  </button>
                )}
              </th>
            ))}
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => {
            const rowId = getRowId(row);
            return (
              <tr key={rowId}>
                {columns.map((column) => (
                  <td data-label={column.label} key={column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                <td className="actions-col" data-label="Actions">
                  <div className="row-actions">
                    <button aria-label="Edit record" onClick={() => onEdit(row)} type="button">
                      <Icon name="edit" />
                    </button>
                    <button aria-label="Delete record" className="danger" onClick={() => onDelete(row)} type="button">
                      <Icon name="trash" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
